<?php

require 'uloha.php';

function test_exercise1(): void {
    $result = exercise1("hello world");
    echo $result === "olleh dlrow" ? "[PASS] test_exercise1\n" : "[FAIL] test_exercise1 - got '$result'\n";
}

function test_exercise2(): void {
    $result = exercise2("Alice,50;Bob,90;Charlie,85");
    echo $result === "Bob" ? "[PASS] test_exercise2\n" : "[FAIL] test_exercise2 - got '$result'\n";
}

function test_exercise3(): void {
    $result = exercise3([2, 4, 6, 7, 11, 13, 15, 17]);
    $expected = [2, 7, 11, 13, 17];
    echo $result === $expected ? "[PASS] test_exercise3\n" : "[FAIL] test_exercise3 - got " . print_r($result, true);
}

test_exercise1();
test_exercise2();
test_exercise3();
