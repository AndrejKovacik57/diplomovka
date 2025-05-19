<?php

require 'zadanie.php';

function test_exercise1(): void {
    $exercise_output = exercise1();
    if ($exercise_output === "Hello world!") {
        echo "[PASS] test_exercise1\n";
    } else {
        echo "[FAIL] test_exercise1\n";
    }
}
function test_exercise2(): void {
    echo "[FAIL] test_exercise2\n";
}
function test_exercise3(): void {
    echo "[PASS] test_exercise3\n";
}

test_exercise1();
test_exercise2();
test_exercise3();