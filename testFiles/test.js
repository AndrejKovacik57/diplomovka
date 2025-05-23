const { exercise1 } = require('./zadanie');

function test_exercise1() {
    const result = exercise1();
    if (result === "Hello world!") {
        console.log("[PASS] test_exercise1");
    } else {
        console.log("[FAIL] test_exercise1");
    }
}

function test_exercise2() {
    console.log("[FAIL] test_exercise2");
}

function test_exercise3() {
    console.log("[PASS] test_exercise3");
}

test_exercise1();
test_exercise2();
test_exercise3();
