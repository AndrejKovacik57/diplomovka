<?php

namespace App\Http\Controllers;

use App\Http\Requests\SolutionRequest;
use App\Models\Exercise;
use App\Models\Solutions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use phpDocumentor\Reflection\Types\Integer;

class TestsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SolutionRequest $request)
    {
    }

    /**
     * Display the specified resource.
     */

    private function copyFile(string $newName, string $filePath):string{
        $newPath = "tests/{$newName}";
        // Copy the file from the original solution path to the new location
        if (Storage::disk('local')->exists($filePath)) {
            Storage::disk('local')->copy($filePath, $newPath);
        }

        return storage_path("app/{$newPath}");
    }

    public function show($id)
    {
        Log::info('logujem ' . $id);
        $solution = Solutions::query()->findOrFail($id);

        Log::info('step1');
        $exerciseID = $solution->exercise_id;
        Log::info('step2');
        $exercise = Exercise::with(['tests'])->findOrFail($exerciseID);
        Log::info('step3');
        $solutionPath = $solution->file_path;
        $solutionName = $solution->file_name;
        Log::info('step4');
//        $newSolutionPath = "tests/{$solutionName}";
        $this->copyFile($solutionName, $solutionPath);
        Log::info('step5');
        Log::info($solutionPath);
        Log::info($solutionName);
        Log::info('priecinok '.getcwd());

        Log::info($exercise->title);
        $testResults = "";

        foreach ($exercise->tests as $test) {
            $test_path = $test->file_path;
            $test_name = $test->file_name;

            $command = "php ../storage/app/private/tests/{$test_name}";
            exec($command, $output, $exitCode);

            Log::info('step8');
            Log::info("Command Executed: {$command}");
            Log::info("Command Output: " . implode("\n", $output));
            Log::info("Exit Code: {$exitCode}");

            // Store output
            $testResults= implode("\n", $output);
        }

        return response()->json(['output' => $testResults], 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Solutions $solution)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Solutions $solution)
    {
        //
    }
}
