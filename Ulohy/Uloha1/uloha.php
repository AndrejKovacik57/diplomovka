<?php

// Cvičenie 1: Vráťte reverzný tvar daného reťazca.
function exercise1(string $input): string
{
    // TODO:
    return $input;
}

// Cvičenie 2: Vráťte asociatívne pole s počtami jednotlivých slov v reťazci.
// "hello world hello" => ['hello' => 2, 'world' => 1]
function exercise2(string $input): array
{
    // TODO:
    return [$input];
}

// Pre manuálne testovanie
if (__FILE__ == realpath($_SERVER['SCRIPT_FILENAME'])) {
    print_r(exercise1("OpenAI"));
    echo "\n";
    print_r(exercise2("hello world hello"));
}
