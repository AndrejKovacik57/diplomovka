<?php

require 'uloha.php';

function test_exercise1(): void {
    $inputs = [
        ["Andrej", "jerdnA"],
        ["Eva", "avE"],
        ["", ""],
    ];

    $testName = "test_exercise1";
    $allPassed = true;

    foreach ($inputs as [$input, $expected]) {
        $result = exercise1($input);
        $status = $result === $expected ? "PASS" : "FAIL";
        $allPassed = $allPassed && ($status === "PASS");

        echo "[$status] $testName | input: '$input' | expected: '$expected' | got: '$result'\n";
    }

    // Summary line for DB-level test result
    echo "[" . ($allPassed ? "PASS" : "FAIL") . "] $testName\n";
}

function test_exercise2(): void {
    $inputs = [
        ["hello world hello", ['hello' => 2, 'world' => 1]],
        ["one two two three three three", ['one' => 1, 'two' => 2, 'three' => 3]],
        ["", ['' => 1]],
        ["a a a a", ['a' => 4]],
        ["dog cat dog cat dog", ['dog' => 3, 'cat' => 2]],
    ];

    $testName = "test_exercise2";
    $allPassed = true;

    foreach ($inputs as [$input, $expected]) {
        $result = exercise2($input);
        $status = $result == $expected ? "PASS" : "FAIL";
        $allPassed = $allPassed && ($status === "PASS");

        $expectedStr = "'" . json_encode($expected) . "'";
        $resultStr = "'" . json_encode($result) . "'";

        echo "[$status] $testName | input: '$input' | expected: $expectedStr | got: $resultStr\n";
    }

    echo "[" . ($allPassed ? "PASS" : "FAIL") . "] $testName\n";
}



test_exercise1();
test_exercise2();
