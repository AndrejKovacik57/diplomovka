<?php

namespace App\Notifications;

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class CustomVerifyEmail extends VerifyEmail
{
    protected function verificationUrl($notifiable): string
    {
        Log::info('Custom verification URL being used');
        $frontendUrl = config('app.front_end', 'http://localhost:3000');
        Log::info('url is: ' . $frontendUrl);

        $temporarySignedURL = URL::temporarySignedRoute(
            'verification.verify', // the backend route name
            now()->addMinutes(60),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
        $afterApi = Str::after($temporarySignedURL, '/api/');
        $output = $frontendUrl . '/' . $afterApi;
        // Replace backend API base with frontend base

        Log::info('output '. $output);
        return $output;
    }
}
