<?php

namespace App\Services;

use App\Models\CourseEnrollment;
use App\Models\User;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laravel\Socialite\Facades\Socialite;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class ThirdPartyAuthService
{
    public function getGoogleRedirectUrl(): string
    {
        return Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
    }

    public function handleGoogleCallback(): array
    {
        try {
            $socialiteUser = Socialite::driver('google')->stateless()->user();
        } catch (ClientException $e) {
            abort(ResponseAlias::HTTP_UNPROCESSABLE_ENTITY, 'Invalid credentials provided.');
        }

        return DB::transaction(function () use ($socialiteUser) {
            $user = User::query()->where('email', $socialiteUser->getEmail())->first();

            if (!$user) {
                $nameParts = explode(' ', $socialiteUser->getName(), 2);
                $firstName = $nameParts[0] ?? '';
                $lastName = $nameParts[1] ?? '';

                $user = User::query()->firstOrCreate([
                    'email' => $socialiteUser->getEmail()
                ], [
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email_verified_at' => now(),
                    'google_id' => $socialiteUser->getId()
                ]);
            } else if (!$user->google_id) {
                $user->google_id = $socialiteUser->getId();
                $user->save();
            }

            $token = $user->createToken('main')->plainTextToken;

            return [
                'user' => $user->only([
                    'id', 'email', 'first_name', 'last_name', 'stuba_email', 'uid', 'uisid',
                    'employee_type', 'google_id', 'email_verified_at', 'created_at', 'updated_at'
                ]),
                'token' => $token
            ];
        });
    }

    public function handleAISLogin(array $credentials): array
    {
        $ldapuid = $credentials['username'];
        $ldappass = $credentials['password'];

        $dn = 'ou=People, DC=stuba, DC=sk';
        $ldaprdn = "uid=$ldapuid, $dn";
        $ldapconn = ldap_connect("ldap.stuba.sk");

        if (!$ldapconn) {
            abort(ResponseAlias::HTTP_INTERNAL_SERVER_ERROR, 'Could not connect to LDAP server.');
        }

        ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
        $ldapbind = ldap_bind($ldapconn, $ldaprdn, $ldappass);

        if (!$ldapbind) {
            abort(ResponseAlias::HTTP_FORBIDDEN, 'LDAP bind failed.');
        }

        $filter = "(uid=$ldapuid)";
        $result = ldap_search($ldapconn, $dn, $filter);
        $entries = ldap_get_entries($ldapconn, $result);

        if (!isset($entries[0])) {
            abort(ResponseAlias::HTTP_NOT_FOUND, 'No LDAP entries found.');
        }

        $userData = [];
        foreach ($entries[0] as $key => $value) {
            if (!is_int($key)) {
                $userData[$key] = is_array($value) && isset($value[0]) ? $value[0] : $value;
            }
        }

        $user = User::query()->findOrFail(Auth::id());

        return DB::transaction(function () use ($user, $userData) {
            $user->uid = $userData['uid'] ?? null;
            $user->uisid = $userData['uisid'] ?? null;
            $user->stuba_email = $userData['mail'] ?? null;
            $user->employee_type = $userData['employeetype'] ?? null;
            $user->save();

            $token = $user->createToken('main')->plainTextToken;

            $enrollments = CourseEnrollment::query()->where('uid', $user->uid)->get();
            foreach ($enrollments as $enrollment) {
                $course = $enrollment->course;
                if (!$course->users()->where('user_id', $user->id)->exists()) {
                    $course->users()->attach($user->id);
                }
                $enrollment->delete();
            }

            return ['user' => $user, 'token' => $token];
        });
    }
}
