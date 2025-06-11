<?php

namespace App\Jobs;

use App\Models\Exercise;
use App\Models\Solution;
use App\Models\SolutionTestResult;
use App\Models\TestResultOutput;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;
use Illuminate\Support\Facades\DB;

class RunSolutionTests implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public Solution $solution;

    public function __construct(Solution $solution)
    {
        $this->solution = $solution;
    }

    /**
     * Execute the job.
     * @throws Exception
     */
    public function handle(): void
    {
        if (!$this->solution->is_active || $this->solution->test_status !== Solution::STATUS_PENDING) {
            Log::warning("Aborting test: Solution is inactive or already processed (ID: {$this->solution->id})");
            return;
        }

        Log::info("Starting test job for Solution ID: {$this->solution->id}");
        $this->solution->test_status = Solution::STATUS_RUNNING;
        $this->solution->save();

        $exerciseID = $this->solution->courseExercise->exercise_id;
        Log::info("Fetching Exercise with ID: $exerciseID");

        $exercise = Exercise::with(['test', 'files'])->findOrFail($exerciseID);
        $solutionPath = $this->solution->file_path;
        $solutionName = $this->solution->file_name;
        $test = $exercise->test;
        $test_path = $test->file_path;
        $test_name = $test->file_name;

        //  if exercises had other files then solution skeleton like json for example
        foreach ($exercise->files as $file) {
            if ($file->file_name != $solutionName){
                $this->copyFile($file->file_name, $file->file_path);
            }
        }

        Log::info("Copying solution file: $solutionPath as $solutionName");
        $this->copyFile($solutionName, $solutionPath);

        Log::info("Copying test file: $test_path as $test_name");
        $test_file_path = $this->copyFile($test_name, $test_path);

        try {
            $solutionExt = pathinfo($this->solution->file_path, PATHINFO_EXTENSION);
            $testExt = pathinfo($test->file_path, PATHINFO_EXTENSION);

            Log::info("Detected solution extension: $solutionExt, test extension: $testExt");

            if ($solutionExt !== $testExt) {
                throw new Exception("Mismatched extensions: Solution is .$solutionExt but test is .$testExt");
            }

            $binary = match ($solutionExt) {
                'php' => '/usr/local/bin/php',
                'js' => '/usr/bin/node',
                default => throw new Exception("Unsupported extension: $solutionExt"),
            };


            Log::info("Running test with nsjail");
            $process = new Process([
                'nsjail',
                '--quiet',
                '--mode', 'o',
                '--chroot', '/sandbox',
                '--time_limit', '10',
                '--rlimit_as', 'max',
                '--disable_clone_newuser',
                '--disable_clone_newnet',
                '--disable_clone_newpid',
                '--disable_clone_newcgroup',
                '--disable_clone_newns',
                '--disable_clone_newuts',
                '--disable_clone_newipc',
                '--disable_proc',
                '--', $binary, "/test/{$test_name}"
            ]);

            $process->setTimeout(10);
            $process->run();


            if (!$process->isSuccessful()) {
                $erroutput = $process->getErrorOutput();
                $output = $process->getOutput();
                Log::error("Test failed with error: $erroutput, out: $output");

                $this->solution->test_status = Solution::STATUS_FAILED;
                $this->solution->save();
            } else {
                $output = $process->getOutput();
                $lines = explode("\n", trim($output));
                $parsedResults = []; // bude: test_name => ['status' => ..., 'outputs' => [...]]

                foreach ($lines as $line) {
                    // [PASS|FAIL] ... | input: ... | expected: ... | got: ...
                    if (preg_match('/^\[(PASS|FAIL)\] ([^\|]+) \| input: \'?(.*?)\'? \| expected: \'?(.*?)\'? \| got: \'?(.*?)\'?$/', $line, $matches)) {
                        $parsedResults[$matches[2]]['outputs'][] = [
                            'status' => strtolower($matches[1]) === 'pass' ? TestResultOutput::STATUS_PASS : TestResultOutput::STATUS_FAIL,
                            'input' => $matches[3],
                            'expected_output' => $matches[4],
                            'actual_output' => $matches[5],
                        ];
                    }
                    // [PASS|FAIL] ... | loaded: ... records
                    elseif (preg_match('/^\[(PASS|FAIL)\] ([^\|]+) \| loaded: \'?\d+\'? records$/', $line, $matches)) {
                        $parsedResults[$matches[2]]['status'] = strtolower($matches[1]) === 'pass'
                            ? SolutionTestResult::STATUS_PASSED
                            : SolutionTestResult::STATUS_FAILED;
                    }
                    // [PASS|FAIL] testName (bez detailov)
                    elseif (preg_match('/^\[(PASS|FAIL)\] (\w+)$/', $line, $matches)) {
                        $parsedResults[$matches[2]]['status'] = strtolower($matches[1]) === 'pass'
                            ? SolutionTestResult::STATUS_PASSED
                            : SolutionTestResult::STATUS_FAILED;
                    }
                    else {
                        Log::debug("Nepodarilo sa naparsovat riadok: '$line'");
                    }
                }



                $solutionId = $this->solution->id;

                DB::transaction(function () use ($parsedResults, $solutionId) {
                    $totalTests = count($parsedResults);
                    $passed = count(array_filter($parsedResults, fn($r) => $r['status'] === SolutionTestResult::STATUS_PASSED));

                    $this->solution->test_status = Solution::STATUS_FINISHED;
                    $this->solution->test_output = "$passed/$totalTests";
                    $this->solution->save();

                    Log::info("solution status update");

                    foreach ($lines as $line) {
                        // [PASS|FAIL] ... | input: ... | expected: ... | got: ...
                        if (preg_match('/^\[(PASS|FAIL)\] ([^\|]+) \| input: \'?(.*?)\'? \| expected: \'?(.*?)\'? \| got: \'?(.*?)\'?$/', $line, $matches)) {
                            $parsedResults[$matches[2]]['outputs'][] = [
                                'status' => strtolower($matches[1]) === 'pass' ? TestResultOutput::STATUS_PASS : TestResultOutput::STATUS_FAIL,
                                'input' => $matches[3],
                                'expected_output' => $matches[4],
                                'actual_output' => $matches[5],
                            ];
                        }

                        // [PASS|FAIL] ... | doVelkych: ... | reverse: ... | reverseWords: ... | expected: ... cena: ...| got: ... cena: ...
                        elseif (preg_match('/^\[(PASS|FAIL)\] ([^\|]+) \| doVelkych: \'(.*?)\' \| reverse: \'(.*?)\' \| reverseWords: \'(.*?)\' \| expected: \'(.*?)\' cena: \'(.*?)\'\| got: \'(.*?)\' cena: \'(.*?)\'$/', $line, $matches)) {
                            $parsedResults[$matches[2]]['outputs'][] = [
                                'status' => strtolower($matches[1]) === 'pass' ? TestResultOutput::STATUS_PASS : TestResultOutput::STATUS_FAIL,
                                'input' => "doVelkych={$matches[3]}, reverse={$matches[4]}, reverseWords={$matches[5]}",
                                'expected_output' => "{$matches[6]} cena: {$matches[7]}",
                                'actual_output' => "{$matches[8]} cena: {$matches[9]}",
                            ];
                        }

                        // [PASS|FAIL] ... | loaded: ... records
                        elseif (preg_match('/^\[(PASS|FAIL)\] ([^\|]+) \| loaded: \'?\d+\'? records$/', $line, $matches)) {
                            $parsedResults[$matches[2]]['status'] = strtolower($matches[1]) === 'pass'
                                ? SolutionTestResult::STATUS_PASSED
                                : SolutionTestResult::STATUS_FAILED;
                        }

                        // [PASS|FAIL] ... | file: ...
                        elseif (preg_match('/^\[(PASS|FAIL)\] ([^\|]+) \| file: .+$/', $line, $matches)) {
                            $parsedResults[$matches[2]]['status'] = strtolower($matches[1]) === 'pass'
                                ? SolutionTestResult::STATUS_PASSED
                                : SolutionTestResult::STATUS_FAILED;
                        }

                        // [PASS|FAIL] testName (no details)
                        elseif (preg_match('/^\[(PASS|FAIL)\] (\w+)$/', $line, $matches)) {
                            $parsedResults[$matches[2]]['status'] = strtolower($matches[1]) === 'pass'
                                ? SolutionTestResult::STATUS_PASSED
                                : SolutionTestResult::STATUS_FAILED;
                        }

                        // Unknown/unparseable line
                        else {
                            Log::debug("Nepodarilo sa naparsovat riadok: '$line'");
                        }
                    }

                });
            }

        } catch (Exception $e) {
            Log::error("Test execution failed: " . $e->getMessage());
            DB::transaction(function () {
                $this->solution->test_status = Solution::STATUS_FAILED;
                $this->solution->save();
            });


        } finally {
            $solutionFile = "/sandbox/test/{$solutionName}";
            $testFile = "/sandbox/test/{$test_name}";

            if (file_exists($solutionFile)) {
                unlink($solutionFile);
                Log::info("Deleted solution file: {$solutionFile}");
            } else {
                Log::warning("Solution file not found for deletion: {$solutionFile}");
            }

            if (file_exists($testFile)) {
                unlink($testFile);
                Log::info("Deleted test file: {$testFile}");
            } else {
                Log::warning("Test file not found for deletion: {$testFile}");
            }

            Log::info("Cleanup completed for test files: {$solutionName}, {$test_name}");
        }

    }

    /**
     * @throws Exception
     */
    protected function copyFile(string $newName, string $filePath): string {
        $sourcePath = storage_path("app/private/{$filePath}");
        $destinationPath = "/sandbox/test/{$newName}";

        if (!file_exists($sourcePath)) {
            Log::error("Required file missing: {$sourcePath}");
            throw new Exception("Required file missing: {$sourcePath}");
        }

        copy($sourcePath, $destinationPath);
        Log::info("Copied {$sourcePath} to {$destinationPath}");

        return $destinationPath;
    }
    protected function createTestResult(array $parsedResults, string $key, int $solutionId): void
    {
        foreach ($parsedResults[$key] as $testName) {
            SolutionTestResult::query()->create([
                'solution_id' => $solutionId,
                'test_name' => $testName,
                'status' => $key
            ]);
        }
    }
}
