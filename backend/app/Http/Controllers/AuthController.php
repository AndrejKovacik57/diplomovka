<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignUpRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

    public function signUp(SignUpRequest $request): \Illuminate\Http\JsonResponse
    {

        try {
            Log::info('test login1');
            $data = $request->validated();

            Log::info('test login2');
            DB::beginTransaction();
            $user = User::query()->create([
                'first_name' => $data['firstName'],
                'last_name' => $data['lastName'],
                'email' => $data['email'],
                'password' => bcrypt($data['password'])
            ]);
            $token = $user->createToken('main')->plainTextToken;

            DB::commit();
            return response()->json(['user' => $user, 'token' => $token], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create exercise'. $e], 500);
        }
    }

    public function login(LoginRequest $request)
    {
        $data = $request->validated();
        if(!Auth::attempt($data)){
            return response()->json(['error' => 'Invalid credentials'], 401);
        }
        $user = Auth::user();
        \assert($user instanceof User);
        $token = $user->createToken('main')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 200);

    }

    public function logout(request $request){
       $user = $request->user();
       $user->currentAccessToken()->delete();
       return response()->json([],204);
    }
}
