const assert = require('assert');
const { exercise4, exercise5 } = require('./uloha');

try {
    assert.deepStrictEqual(
        exercise4([
            { name: "Alice", age: 30 },
            { name: "Bob", age: 20 },
            { name: "Charlie", age: 35 }
        ]),
        ["Alice", "Charlie"]
    );
    console.log("[PASS] test_exercise4");
} catch (e) {
    console.log("[FAIL] test_exercise4:", e.message);
}

try {
    assert.deepStrictEqual(exercise5("Hello!"), { h: 1, e: 1, l: 2, o: 1 });
    assert.deepStrictEqual(exercise5("abc ABC"), { a: 2, b: 2, c: 2 });
    console.log("[PASS] test_exercise5");
} catch (e) {
    console.log("[FAIL] test_exercise5:", e.message);
}
