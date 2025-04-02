<?php

namespace App\Http\Controllers;

use App\Models\User;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Laravel\Socialite\Facades\Socialite;

class AuthControllerGoogle extends Controller
{
    public function redirectToAuth(): JsonResponse
    {
        return response()->json([
            'url' => Socialite::driver('google')
                ->stateless()
                ->redirect()
                ->getTargetUrl(),
        ]);
    }

    public function handleAuthCallback(): JsonResponse
    {
        try {
            $socialiteUser = Socialite::driver('google')->stateless()->user();
        } catch (ClientException $e) {
            return response()->json(['error' => 'Invalid credentials provided.'], 422);
        }

        try {
            DB::beginTransaction();
            $user = User::query()->where('email', $socialiteUser->getEmail())->first();
            if (!$user) {
                $first_name = "";
                $last_name = "";
                $user_name = explode(' ', $socialiteUser->getName());

                if(count($user_name) == 2){
                    $first_name = $user_name[0];
                    $last_name = $user_name[1];
                }
                $user = User::query()
                    ->firstOrCreate(
                        [
                            'email' => $socialiteUser->getEmail(),
                            'first_name' => $first_name,
                            'last_name' => $last_name,
                            'email_verified_at' => now(),
                            'google_id' => $socialiteUser->getId()
                        ]
                    );
            }
            else{
                if ($user->google_id == null) {
                    $user->google_id = $socialiteUser->getId();
                    $user->save();
                }
            }
            $token = $user->createToken('main')->plainTextToken;

            DB::commit();
            return response()->json(['user' => $user, 'token' => $token], 200);
        }catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create exercise'. $e], 500);
        }

    }
}
