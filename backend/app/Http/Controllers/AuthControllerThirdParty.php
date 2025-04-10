<?php

namespace App\Http\Controllers;

use App\Models\User;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;

class AuthControllerThirdParty extends Controller
{
    public function redirectToAuthGoogle(): JsonResponse
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

        Log::info('test login1');
        try {

            Log::info('test login2');
            $socialiteUser = Socialite::driver('google')->stateless()->user();
        } catch (ClientException $e) {

            Log::info('test login3');
            return response()->json(['error' => 'Invalid credentials provided.'], 422);
        }

        try {
            DB::beginTransaction();

            Log::info('test login4');
            $user = User::query()->where('email', $socialiteUser->getEmail())->first();
            if (!$user) {

                Log::info('test login5');
                $first_name = "";
                $last_name = "";
                $user_name = explode(' ', $socialiteUser->getName());

                if(count($user_name) == 2){
                    $first_name = $user_name[0];
                    $last_name = $user_name[1];
                }
                Log::info('test login5.5');
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

                Log::info('test login6');
            }
            else{

                Log::info('test login7');
                if ($user->google_id == null) {
                    $user->google_id = $socialiteUser->getId();
                    $user->save();
                }
            }
            $token = $user->createToken('main')->plainTextToken;

            DB::commit();

            Log::info('test login8');
            return response()->json(['user' => $user, 'token' => $token], 200);
        }catch (\Exception $e) {
            DB::rollBack();

            Log::info('test login9');
            return response()->json(['error' => 'Failed to create user with google'. $e], 500);
        }

    }

    public function AISLogin(Request $request): JsonResponse
    {

        Log::info('test log0 ' . Auth::id());
        Log::info('test AISLogin1');
        $ldapuid = $request->input('username');
        $ldappass = $request->input('password');

        Log::info('$ldapuid '.$ldapuid);

        Log::info('$ldappass '.$ldappass);
        $dn  = 'ou=People, DC=stuba, DC=sk';
        $ldaprdn  = "uid=$ldapuid, $dn";


        Log::info('test AISLogin5');
        $ldapconn = ldap_connect("ldap.stuba.sk");
        Log::info('test AISLogin6');

        if (!$ldapconn) {

            Log::info('test AISLogin2');
            return response()->json([
                'error' => 'Could not connect to LDAP server.'
            ], 500); // Internal Server Error or you can use 401/403 if it's auth-related
        }else{

            Log::info('test AISLogin7');
            $set = ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
            // binding to ldap server
            $ldapbind = ldap_bind($ldapconn, $ldaprdn, $ldappass);

            Log::info('test AISLogin8');

            // verify binding
            if ($ldapbind) {

                Log::info('test AISLogin3');
                $filter = "(uid=$ldapuid)";
                $result = ldap_search($ldapconn, $dn, $filter);
                $entries = ldap_get_entries($ldapconn, $result);
                $userData = [];
                foreach ($entries[0] as $key => $value) {
                    if (!is_int($key)) {
                        // Skip if it doesn't have [0] value
                        $userData[$key] = is_array($value) && isset($value[0]) ? $value[0] : $value;
                    }
                }

                $user = User::query()->findOrFail(Auth::id());
                if ($user){
                    try {
                        DB::beginTransaction();
                        $user->uid = $userData['uid'];
                        $user->uisid = $userData['uisid'];
                        $user->stuba_email = $userData['mail'];
                        $user->employee_type = $userData['employeetype'];
                        $user->save();
                        $token = $user->createToken('main')->plainTextToken;

                        DB::commit();

                        return response()->json(['user' => $user, 'token' => $token], 200);
                    }catch (\Exception $e) {
                        DB::rollBack();

                        return response()->json(['error' => 'Failed to create user with google'. $e], 500);
                    }

                }else{
                    return response()->json([
                        'error' => "You are not logged in"
                    ], 401);

                }



            } else {

                Log::info('test AISLogin4');
                return response()->json([
                    'error' => "LDAP bind failed..."
                ], 403);
            }
        }

    }
}
