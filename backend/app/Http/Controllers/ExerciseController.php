<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExerciseRequest;
use App\Models\Exercise;
use App\Services\ExerciseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;


class ExerciseController extends Controller
{
    protected ExerciseService $exerciseService;

    public function __construct(ExerciseService $exerciseService)
    {
        $this->exerciseService = $exerciseService;
    }

    public function index(): JsonResponse
    {
        Log::info('Get all exercise');
        return response()->json(['exercises' => Exercise::all()], ResponseAlias::HTTP_OK);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(ExerciseRequest $request): JsonResponse
    {
        Log::info('Store exercise');
        try{
            $fields = $request->validated();

            $exercise = $this->exerciseService->createExercise($fields);

            return response()->json(['exercise' => $exercise], ResponseAlias::HTTP_CREATED);
        }catch (\Exception $e){
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        Log::info('Get exercise by id');
        try{
            $result = $this->exerciseService->getExerciseWithFiles($id);

            return response()->json($result, ResponseAlias::HTTP_OK);

        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], ResponseAlias::HTTP_BAD_REQUEST);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(ExerciseRequest $request, Exercise $exercise): JsonResponse
    {
        try {

            $fields = $request->validated();
            $exercise = $this->exerciseService->updateExercise($fields, $exercise);
            $result = $this->exerciseService->getExerciseWithFiles($exercise->id);

            return response()->json(['exercise' => $result], ResponseAlias::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Exercise $exercise): JsonResponse
    {
        $exercise->delete();

        return response()->json(['message' => 'Exercise deleted']);
    }


}
