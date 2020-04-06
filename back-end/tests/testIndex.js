function importTest(name, path) {
    describe(name, () => {
        require(path); // eslint-disable-line import/no-dynamic-require
    });
}

describe('c4me', () => {
    importTest('user.js', './user/simple');
    importTest('profile.js', './student/profile');
    importTest('application.js', './student/application');
    importTest('adminCollege.js', './admin/adminCollege.js');
    importTest('adminStudent.js', './admin/adminStudent.js');
    importTest('college.js', './college/college');
});
