const assert = require('assert');
const { exercise3 } = require('./uloha');

try {
    assert.strictEqual(exercise3([1, 2, 3, 4]), 6);
    assert.strictEqual(exercise3([10, 15, 20]), 30);
    assert.strictEqual(exercise3([]), 0);
    console.log("[PASS] test_exercise3");
} catch (err) {
    console.log("[FAIL] test_exercise3:", err.message);
}
