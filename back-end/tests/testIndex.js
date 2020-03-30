function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

describe("c4me", function () {
    importTest('user.js', './user/simple');
    importTest('profile.js', './student/profile');
    importTest('application.js', './student/application');
    importTest('adminCollege.js', './admin/adminCollege.js' );
    importTest('adminStudent.js', './admin/adminStudent.js' );
    importTest('college.js','./college/college');
});