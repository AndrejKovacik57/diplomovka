<?php

namespace App\Services;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

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

    public function changePassword(array $passwords): string
    {
        $user = Auth::user();
        \assert($user instanceof User);

        if (!Hash::check($passwords['current_password'], $user->password)) {
            throw new Exception('Current password does not match.', ResponseAlias::HTTP_FORBIDDEN);
        }
        return DB::transaction(function () use ($user, $passwords) {
            $user->password = Hash::make($passwords['new_password']);
            $user->save();

            return 'Password changed successfully.';
        });
    }

    public function logout($user): void
    {
        $user->currentAccessToken()->delete();
    }
}
