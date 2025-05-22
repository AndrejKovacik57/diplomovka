<?php

namespace App\Http\Controllers;

use App\Services\ThirdPartyAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthControllerThirdParty extends Controller
{
    protected ThirdPartyAuthService $authService;

    public function __construct(ThirdPartyAuthService $authService)
    {
        $this->authService = $authService;
    }

    public function redirectToAuthGoogle(): JsonResponse
    {
        return response()->json([
            'url' => $this->authService->getGoogleRedirectUrl()
        ]);
    }

    public function handleAuthCallback(): JsonResponse
    {
        try {
            $result = $this->authService->handleGoogleCallback();
            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    public function AISLogin(Request $request): JsonResponse
    {
        try {
            $credentials = $request->only(['username', 'password']);
            $result = $this->authService->handleAISLogin($credentials);
            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }
}
