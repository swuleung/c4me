const { agent } = require('../shared');
const { expect } = require('../shared');

/**
 * Tests are described with "describe" & "it"
 */
describe('Login as admin & delete high schools', () => {
    it('Login as admin test', (done) => {
        agent
            .post('/users/login')
            .send({
                username: 'admin',
                password: 'admin',
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.have.cookie('access_token');
                done();
            });
    });

    it('Delete all high schools', (done) => {
        agent
            .delete('/admin/delete-all-high-schools')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});

describe('Import students and applications from csv files', () => {
    describe('Delete all users', () => {
        it('Deletes all users', (done) => {
            agent
                .delete('/admin/delete-student-profiles')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('Import student and application', () => {
        it('Import students: mochaImport & mochaImportWrong', function importStudents(done) {
            this.timeout(30000);
            agent
                .get('/admin/import-students')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Check mochaImport', (done) => {
            agent
                .get('/students/mochaImport')
                .end((err, res) => {
                    res.should.have.status(200);
                    const { student } = res.body;
                    expect(student).to.shallowDeepEqual({
                        Username: 'mochaImport',
                        GPA: '3.50',
                        ResidenceState: 'NJ',
                        CollegeClass: 2024,
                        Major1: 'English',
                        Major2: 'Spanish',
                        SATEBRW: 800,
                        SATMath: 800,
                        ACTEnglish: 35,
                        ACTMath: 28,
                        ACTReading: 33,
                        ACTScience: 32,
                        ACTComposite: 32,
                        SATLit: 740,
                        SATUs: 670,
                        SATWorld: 690,
                        SATMathI: 700,
                        SATMathII: 300,
                        SATEco: 500,
                        SATMol: 600,
                        SATChem: 233,
                        SATPhys: 434,
                        APPassed: 3,
                        IsAdmin: false,
                    });
                    done();
                });
        });

        it('Check mochaImportWrong', (done) => {
            agent
                .get('/students/mochaImportWrong')
                .end((err, res) => {
                    res.should.have.status(200);
                    const { student } = res.body;
                    expect(student).to.shallowDeepEqual({
                        Username: 'mochaImportWrong',
                        GPA: '3.50',
                        ResidenceState: 'NJ',
                        CollegeClass: 2028,
                        Major1: 'English',
                        Major2: 'Spanish',
                        SATEBRW: 400,
                        SATMath: null,
                        ACTEnglish: 35,
                        ACTMath: 28,
                        ACTReading: 33,
                        ACTScience: 32,
                        ACTComposite: 32,
                        SATLit: 740,
                        SATUs: 670,
                        SATWorld: 690,
                        SATMathI: 700,
                        SATMathII: 300,
                        SATEco: 500,
                        SATMol: 600,
                        SATChem: 233,
                        SATPhys: 434,
                        APPassed: 3,
                        IsAdmin: false,
                    });
                    done();
                });
        });

        it('Import applications', (done) => {
            agent
                .get('/admin/import-applications')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Check mochaImport', (done) => {
            agent
                .get('/students/mochaImport/applications')
                .end((err, res) => {
                    res.should.have.status(200);
                    const { applications } = res.body;
                    expect(applications[0].Status).to.equal('accepted');
                    agent
                        .get(`/colleges/id/${applications[0].CollegeId}`)
                        .end((error, response) => {
                            response.should.have.status(200);
                            const { college } = response.body;
                            expect(college.Name).to.equal('Stony Brook University');

                            done();
                        });
                });
        });
    });
});
