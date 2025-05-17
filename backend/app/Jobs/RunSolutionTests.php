<?php

namespace App\Jobs;

use App\Models\Exercise;
use App\Models\Solutions;
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

    public Solutions $solution;

    public function __construct(Solutions $solution)
    {
        $this->solution = $solution;
    }

    /**
     * Execute the job.
     * @throws Exception
     */
    public function handle(): void
    {
        $this->solution->update(['test_status' => 'running']);
        $exerciseID = $this->solution->courseExercise->exercise_id;
        $exercise = Exercise::with(['tests'])->findOrFail($exerciseID);

        $solutionPath = $this->solution->file_path;
        $solutionName = $this->solution->file_name;
        $test = $exercise->test;
        $test_path = $test->file_path;
        $test_name = $test->file_name;

        $this->copyFile($solutionName, $solutionPath);
        $copiedTestPath = $this->copyFile($test_name, $test_path);

        try {
            $ext = pathinfo($this->solution->file_path, PATHINFO_EXTENSION);
            $cmd = match ($ext) {
                'php' => 'php',
                'js' => 'node',
                default => throw new Exception("Unsupported extension: $ext"),
            };

            $process = new Process([
                'docker', 'compose', 'run', '--rm', '--network', 'none',
                '--memory=128m', '--cpus=0.5',
                'test-runner', 'timeout', '10s', $cmd, $copiedTestPath
            ]);

            $process->run();

            $output = $process->getOutput() . $process->getErrorOutput();

            $this->solution->update([
                'test_status' => 'finished',
                'test_output' => $output,
            ]);
        } finally {
            // Ensure cleanup happens even if the job fails
            Storage::disk('local')->delete("tests/{$solutionName}");
            Storage::disk('local')->delete("tests/{$test_name}");
        }
    }

    private function copyFile(string $newName, string $filePath):string{
        $newPath = "tests/{$newName}";
        // Copy the file from the original solution path to the new location
        if (Storage::disk('local')->exists($filePath)) {
            Storage::disk('local')->copy($filePath, $newPath);
        }

        return "app/{$newPath}";
    }
}
