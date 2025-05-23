<?php
// Cvičenie 1: Pri zadaní vety vráťte jej verziu s obmenenými slovami, ale so zachovaným poradím slov.
// Vstup: Výstup: „hello world“ → Výstup: „olleh dlrow“.
function exercise1(string $input): string
{
    // TODO
    return $input;
}

// Cvičenie 2: Pri zadaní reťazca CSV s dvojicami „meno,skóre“ (napr. „Alice,50;Bob,40“) vráťte meno najlepšieho strelca.
function exercise2(string $csv): string
{
    // TODO
    return $csv;
}

// Cvičenie 3: Pri danom číselnom poli vráťte nové pole len s prvočíslami zoradenými vzostupne.
function exercise3(array $input): array
{
    // TODO
    return [$input];
}

if (__FILE__ == realpath($_SERVER['SCRIPT_FILENAME'])) {
    echo exercise1("hello world from OpenAI") . "\n";
    echo exercise2("Alice,50;Bob,90;Charlie,85") . "\n";
    print_r(exercise3([2, 4, 6, 7, 11, 13, 15, 17]));
}
