const { agent } = require('../shared');
const { expect } = require('../shared');

describe('Scrape college information', () => {
    describe('Delete all users', () => {
        it('Deletes all users', (done) => {
            agent
                .delete('/admin/deleteStudentProfiles')
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
                .get('/admin/importStudents')
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
                        username: 'mochaImport',
                        GPA: '3.50',
                        residenceState: 'NJ',
                        collegeClass: 2024,
                        major1: 'English',
                        major2: 'Spanish',
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
                        isAdmin: false,
                        HighSchool: {
                            ACTEnglish: 30,
                            ACTMath: 29,
                            ACTReading: 30,
                            ACTScience: 29,
                            AverageACT: 30,
                            AverageSAT: 1320,
                            HighSchoolCity: 'Ridgewood',
                            HighSchoolId: 2,
                            HighSchoolState: 'NJ',
                            Name: 'Ridgewood High School',
                            NicheAcademicScore: 'A+',
                            SATEBRW: 650,
                            SATMath: 670,
                        },
                        HighSchoolId: 2,
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
                        username: 'mochaImportWrong',
                        GPA: '3.50',
                        residenceState: 'NJ',
                        collegeClass: 2028,
                        major1: 'English',
                        major2: 'Spanish',
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
                        isAdmin: false,
                        HighSchool: {
                            ACTEnglish: 30,
                            ACTMath: 29,
                            ACTReading: 30,
                            ACTScience: 29,
                            AverageACT: 30,
                            AverageSAT: 1320,
                            HighSchoolCity: 'Ridgewood',
                            HighSchoolId: 2,
                            HighSchoolState: 'NJ',
                            Name: 'Ridgewood High School',
                            NicheAcademicScore: 'A+',
                            SATEBRW: 650,
                            SATMath: 670,
                        },
                        HighSchoolId: 2,
                    });
                    done();
                });
        });

        it('Import student', (done) => {
            agent
                .get('/admin/importApplications')
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
                    expect(applications[0].status).to.equal('accepted');
                    agent
                        .get(`/colleges/id/${applications[0].college}`)
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
