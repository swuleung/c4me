const agent = require('../shared').agent;
const expect = require('../shared').expect;
const stonybrook = require('../shared').stonybrook;

describe("Scrape college information", () => {
    describe("Import student and application", () => {
        it('Import students: mochaImport & mochaImportWrong', function (done) {
            agent
                .get('/admin/importStudents')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Check mochaImport', function (done) {
            agent
                .get('/students/mochaImport')
                .end((err, res) => {
                    res.should.have.status(200);
                    let student = res.body.student;
                    expect(student).to.deep.equal({
                        username: 'mochaImport',
                        GPA: '3.50',
                        residenceState: 'NJ',
                        highschoolName: 'Ridgewood High School',
                        highschoolCity: 'Ridegwood',
                        highschoolState: 'NJ',
                        collegeClass: 2024,
                        major1: 'English',
                        major2: 'Spanish',
                        SATEBRW: 750,
                        SATMath: 670,
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
                        isAdmin: false
                    });
                    done();
                });
        });

        it('Check mochaImportWrong', function (done) {
            agent
                .get('/students/mochaImportWrong')
                .end((err, res) => {
                    res.should.have.status(200);
                    let student = res.body.student;
                    expect(student).to.deep.equal({
                        username: 'mochaImportWrong',
                        GPA: '3.50',
                        residenceState: 'NJ',
                        highschoolName: 'Ridgewood High School',
                        highschoolCity: 'Ridegwood',
                        highschoolState: 'NJ',
                        collegeClass: 2024,
                        major1: 'English',
                        major2: 'Spanish',
                        SATEBRW: 750,
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
                        isAdmin: false
                    });
                    done();
                });
        });

        it('Import student', function (done) {
            agent
                .get('/admin/importApplications')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Check mochaImport', function (done) {
            agent
                .get('/students/mochaImport/applications')
                .end((err, res) => {
                    res.should.have.status(200);
                    let applications = res.body.applications;
                    expect(applications[0].status).to.equal('accepted')
                    agent
                        .get('/colleges/id/' + applications[0].college)
                        .end((err, res) => {
                            res.should.have.status(200);
                            let college = res.body.college;
                            expect(college.Name).to.equal('Stony Brook University')

                            done();
                        });
                });
        });
    });
});