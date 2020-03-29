function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

describe("top", function () {
    beforeEach(function () {
       console.log("running something before each test");
    });
    importTest('user.js', './user/simple');
    importTest('profile.js', './student/profile')
    importTest('application.js', './student/application')
    after(function () {
        console.log("after all tests");
    });
});