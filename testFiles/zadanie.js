function exercise1() {
    return "Hello world!";
}

if (require.main === module) {
    console.log(exercise1());
}

module.exports = { exercise1 };
