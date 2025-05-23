<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignUpRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class AuthController extends Controller
{

    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function signUp(SignUpRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $result = $this->authService->register($data);
            return response()->json($result, ResponseAlias::HTTP_OK);
        } catch (\Exception $e) {
            report($e);
            return response()->json(['error' => 'Registration failed'], ResponseAlias::HTTP_BAD_REQUEST);
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $data = $request->validated();
        $result = $this->authService->authenticate($data);

        if (!$result) {
            return response()->json(['error' => 'Invalid credentials'], ResponseAlias::HTTP_UNAUTHORIZED);
        }

        return response()->json($result, ResponseAlias::HTTP_OK);
    }

    public function changePassword(Request $request): JsonResponse{
        try{

            $data = $request->validate([
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
            ]);

            $result = $this->authService->changePassword($data);
            return response()->json(['message' => $result], ResponseAlias::HTTP_OK);

        }
        catch (\Exception $e){
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }

    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());
        return response()->json([], ResponseAlias::HTTP_UNAUTHORIZED);
    }
}
