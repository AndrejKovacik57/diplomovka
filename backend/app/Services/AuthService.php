<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function register(array $data): array
    {
        return DB::transaction(function () use ($data) {
            $user = User::query()->create([
                'first_name' => $data['firstName'],
                'last_name' => $data['lastName'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            $user->sendEmailVerificationNotification();
            $token = $user->createToken('main')->plainTextToken;

            return ['user' => $user, 'token' => $token];
        });
    }

    public function authenticate(array $credentials): ?array
    {
        if (!Auth::attempt($credentials)) {
            return null;
        }

        $user = Auth::user();
        \assert($user instanceof User);
        $token = $user->createToken('main')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function logout($user): void
    {
        $user->currentAccessToken()->delete();
    }
}
