function importTest(name, path) {
    describe(name, () => {
        require(path); // eslint-disable-line import/no-dynamic-require
    });
}

// import all the tests
describe('c4me', () => {
    importTest('user.js', './user/simple');
    importTest('adminCollege.js', './admin/adminCollege.js');
    importTest('profile.js', './student/profile');
    importTest('application.js', './student/application');
    importTest('adminStudent.js', './admin/adminStudent.js');
    importTest('college.js', './college/college');
    importTest('appplicationsTracker.js', './college/applicationsTracker.js');
});
