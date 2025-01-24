<?php

namespace App;

enum RolesEnum: string
{
    case ADMIN = 'admin';
    case USER = 'user';
    case STUDENT = 'student';
    case TEACHER = 'teacher';

    public static function labels(): array{
        return [
            self::ADMIN->value => 'Admin',
            self::USER->value => 'User',
            self::STUDENT->value => 'Student',
            self::TEACHER->value => 'Teacher'
        ];
    }
    public function label(): string{
        return match($this){
            self::ADMIN => 'Admin',
            self::USER => 'User',
            self::STUDENT => 'Student',
            self::TEACHER => 'Teacher'
        };
    }
}
