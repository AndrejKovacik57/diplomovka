<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function userExercises(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $courses = $user->courses()->with('exercises')->get();

        return response()->json([
            'user' => $user,
            'courses' => $courses
        ]);
    }
}
