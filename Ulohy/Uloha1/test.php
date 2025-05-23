<?php

require 'uloha.php';

function test_exercise1(): void {
    $result = exercise1("Andrej");
    if ($result === "jerdnA") {
        echo "[PASS] test_exercise1\n";
    } else {
        echo "[FAIL] test_exercise1 - got '$result'\n";
    }
}

function test_exercise2(): void {
    $expected = ['hello' => 2, 'world' => 1];
    $result = exercise2("hello world hello");

    if ($result == $expected) {
        echo "[PASS] test_exercise2\n";
    } else {
        echo "[FAIL] test_exercise2 - got ";
        print_r($result);
    }
}

test_exercise1();
test_exercise2();
