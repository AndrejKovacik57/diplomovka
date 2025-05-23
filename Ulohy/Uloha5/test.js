const assert = require("assert");
const { exercise1, exercise2, exercise3 } = require("./uloha");

try {
    assert.strictEqual(
        exercise1("This exercise is particularly interesting"),
        "This esicrexe is yralulacitrerp gnitseretni"
    );
    console.log("[PASS] test_exercise1");
} catch (e) {
    console.error("[FAIL] test_exercise1:", e.message);
}

try {
    const result = exercise2([
        { type: "income", amount: 100 },
        { type: "expense", amount: 30 },
        { type: "income", amount: 50 }
    ]);
    assert.deepStrictEqual(result, { income: 150, expense: 30, balance: 120 });
    console.log("[PASS] test_exercise2");
} catch (e) {
    console.error("[FAIL] test_exercise2:", e.message);
}

try {
    assert.deepStrictEqual(
        exercise3({ "Alice": 1990, "Bob": 1980, "Charlie": 2000 }),
        ["Bob", "Alice", "Charlie"]
    );
    console.log("[PASS] test_exercise3");
} catch (e) {
    console.error("[FAIL] test_exercise3:", e.message);
}
