<?php

namespace App\Jobs;

use App\Models\Exercise;
use App\Models\Solution;
use App\Models\SolutionTestResult;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;

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
            $ext = pathinfo($this->solution->file_path, PATHINFO_EXTENSION);
            Log::info("Detected extension: $ext");

            $binary = match ($ext) {
                'php' => '/usr/local/bin/php',
                'js' => '/usr/local/bin/node',
                default => throw new Exception("Unsupported extension: $ext"),
            };


            Log::info("Running test with nsjail");
            $process = new Process([
                'nsjail',
                '--quiet',
                '--mode', 'o',
                '--chroot', '/sandbox',
                '--time_limit', '5',
                '--rlimit_as', '128',
                '--disable_clone_newnet',
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
                $results = [
                    'passed' => [],
                    'failed' => [],
                ];
                foreach ($lines as $line) {
                    if (preg_match('/^\[PASS\] (\w+)/', $line, $matches)) {
                        $results['passed'][] = $matches[1];
                    } elseif (preg_match('/^\[FAIL\] (\w+)/', $line, $matches)) {
                        $results['failed'][] = $matches[1];
                    }
                }
                $solutionId = $this->solution->id;
                $this->createTestResult($results, 'passed', $solutionId);
                $this->createTestResult($results, 'failed', $solutionId);
                $numOfSuccessful = count($results['passed']);
                $numOfFailed = count($results['failed']);
                $total = $numOfSuccessful + $numOfFailed;

                Log::info('Test results', $results);


                Log::info("Test succeeded. Output: $output");
                $this->solution->test_status = Solution::STATUS_FINISHED;
                $this->solution->test_output = "$numOfSuccessful/$total";
                $this->solution->save();
            }

        } catch (Exception $e) {
            Log::error("Test execution failed: " . $e->getMessage());
            $this->solution->test_status = Solution::STATUS_FAILED;

            $this->solution->save();

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

    protected function copyFile(string $newName, string $filePath): string {
        $sourcePath = storage_path("app/private/{$filePath}");
        $destinationPath = "/sandbox/test/{$newName}";

        if (file_exists($sourcePath)) {
            // Copy the file manually
            copy($sourcePath, $destinationPath);
            Log::info("Copied {$sourcePath} to {$destinationPath}");
        } else {
            Log::warning("Source file does not exist: {$sourcePath}");
        }

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
