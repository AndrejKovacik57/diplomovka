<?php

namespace App\Http\Controllers;

use App\Http\Requests\SolutionRequest;
use App\Models\Exercise;
use App\Models\Solutions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SolutionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Solutions::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SolutionRequest $request)
    {
        $fields = $request->validated();
        $exerciseID = $fields['exerciseId'];
        $exercise = Exercise::with(['tests'])->findOrFail($exerciseID);

        DB::beginTransaction();
        try {
            if ($request->has('codeFiles')) {
                foreach ($fields['codeFiles'] as $file) {
                    $name= $file->getClientOriginalName();
                    $extension = $file->getClientOriginalExtension();
                    $filePath = $file->store('solutions', 'local');
                    $noExtensionFilePath = preg_replace('/\.[^.]+$/', '', $filePath);
                    $finalPath = $noExtensionFilePath . '.' . $extension;

                    Storage::disk('local')->move($filePath, $finalPath);

                    $solution = $exercise->solutions()->create([
                        'file_path' => $finalPath,
                        'file_name' => $name
                    ]);
                }

            }
            DB::commit();
            return response()->json(['solutions' => $solution]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create exercise'. $e], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Solutions $solution)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SolutionRequest $request, Solutions $solution)
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
