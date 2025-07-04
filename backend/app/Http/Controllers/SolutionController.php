<?php

namespace App\Http\Controllers;

use App\Http\Requests\SolutionRequest;
use App\Models\Solution;
use App\Models\User;
use App\Services\SolutionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class SolutionController extends Controller
{

    protected SolutionService $solutionService;

    public function __construct(SolutionService $solutionService)
    {
        $this->solutionService = $solutionService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $solutions = $user->solutions()
            ->active()
            ->with('courseExercise.course', 'courseExercise.exercise')
            ->get();


        return response()->json($solutions, ResponseAlias::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SolutionRequest $request): JsonResponse
    {
        try {
            $fields = $request->validated();
            $solution = $this->solutionService->storeSolution($fields);
            return response()->json(['solution' => $solution], ResponseAlias::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Solution $solution)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SolutionRequest $request, Solution $solution)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Solution $solution)
    {
        //
    }
}
