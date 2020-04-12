const { agent } = require('../shared');
const { expect } = require('../shared');

/**
 * Tests are described with "describe" & "it"
 */
describe('Applications Tracker', () => {
    let SBUCollegeId = -1;
    it('Get unfiltered applications', (done) => {
        agent
            .get('/colleges/name/Stony Brook University')
            .end((err, res) => {
                res.should.have.status(200);
                const { college } = res.body;
                SBUCollegeId = college.CollegeId;

                agent
                    .post(`/colleges/id/${SBUCollegeId}/applications`)
                    .end((error, response) => {
                        response.should.have.status(200);

                        expect(response.body.applications).to.shallowDeepEqual([
                            {
                                username: 'mocha3',
                                Application: { status: 'withdrawn', college: SBUCollegeId, username: 'mocha3' },
                            },
                            {
                                username: 'mochaImport',
                                Application: { status: 'accepted', college: SBUCollegeId, username: 'mochaImport' },
                            },
                            {
                                username: 'mochaImportWrong',
                                Application: { status: 'pending', college: SBUCollegeId, username: 'mochaImportWrong' },
                            },
                        ]);
                        expect(response.body.averages).to.shallowDeepEqual({
                            avgGPA: '3.50',
                            avgSATMath: 800,
                            avgSATEBRW: 533,
                            avgACTComposite: 32,
                            avgAcceptedGPA: '3.50',
                            avgAcceptedSATMath: 800,
                            avgAcceptedSATEBRW: 800,
                            avgAcceptedACTComposite: 32,
                            avgWeight: 74,
                        });
                        done();
                    });
            });
    });

    it('Filter by accepted status', (done) => {
        agent
            .post(`/colleges/id/${SBUCollegeId}/applications`)
            .send({
                filters: {
                    statuses: ['accepted'],
                },
            })
            .end((error, response) => {
                response.should.have.status(200);
                expect(response.body.applications).to.deep.equal([
                    {
                        username: 'mochaImport',
                        isAdmin: false,
                        GPA: '3.50',
                        collegeClass: 2024,
                        SATMath: 800,
                        SATEBRW: 800,
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
                        HighSchoolId: 2,
                        Application: {
                            college: SBUCollegeId,
                            status: 'accepted',
                            username: 'mochaImport',
                        },
                        weight: 83.38171296296295,
                    }]);
                expect(response.body.averages).to.shallowDeepEqual({
                    avgGPA: '3.50',
                    avgSATMath: 800,
                    avgSATEBRW: 800,
                    avgACTComposite: 32,
                    avgAcceptedGPA: '3.50',
                    avgAcceptedSATMath: 800,
                    avgAcceptedSATEBRW: 800,
                    avgAcceptedACTComposite: 32,
                    avgWeight: 83,
                });
                done();
            });
    });

    it('Filter by waitlist (not in any application) status', (done) => {
        agent
            .post(`/colleges/id/${SBUCollegeId}/applications`)
            .send({
                filters: {
                    statuses: ['waitlist'],
                },
            })
            .end((error, response) => {
                response.should.have.status(200);
                expect(response.body.applications).to.deep.equal([]);
                expect(response.body.averages).to.shallowDeepEqual({
                    avgAcceptedGPA: '3.50',
                    avgAcceptedSATMath: 800,
                    avgAcceptedSATEBRW: 800,
                    avgAcceptedACTComposite: 32,
                });
                done();
            });
    });

    it('Filter by statuses with all included apps', (done) => {
        agent
            .post(`/colleges/id/${SBUCollegeId}/applications`)
            .send({
                filters: {
                    statuses: ['accepted', 'pending', 'withdrawn'],
                },
            })
            .end((error, response) => {
                response.should.have.status(200);
                expect(response.body.applications).to.shallowDeepEqual([
                    {
                        username: 'mocha3',
                        Application: { status: 'withdrawn', college: SBUCollegeId, username: 'mocha3' },
                    },
                    {
                        username: 'mochaImport',
                        Application: { status: 'accepted', college: SBUCollegeId, username: 'mochaImport' },
                    },
                    {
                        username: 'mochaImportWrong',
                        Application: { status: 'pending', college: SBUCollegeId, username: 'mochaImportWrong' },
                    },
                ]);
                expect(response.body.averages).to.shallowDeepEqual({
                    avgGPA: '3.50',
                    avgSATMath: 800,
                    avgSATEBRW: 533,
                    avgACTComposite: 32,
                    avgAcceptedGPA: '3.50',
                    avgAcceptedSATMath: 800,
                    avgAcceptedSATEBRW: 800,
                    avgAcceptedACTComposite: 32,
                    avgWeight: 74,
                });
                done();
            });
    });


    it('Filter by college class', (done) => {
        agent
            .post(`/colleges/id/${SBUCollegeId}/applications`)
            .send({
                filters: {
                    lowerCollegeClass: 2020,
                    upperCollegeClass: 2024,
                },
            })
            .end((error, response) => {
                response.should.have.status(200);
                expect(response.body.applications).to.deep.equal([
                    {
                        username: 'mochaImport',
                        isAdmin: false,
                        GPA: '3.50',
                        collegeClass: 2024,
                        SATMath: 800,
                        SATEBRW: 800,
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
                        HighSchoolId: 2,
                        Application: {
                            college: SBUCollegeId,
                            status: 'accepted',
                            username: 'mochaImport',
                        },
                        weight: 83.38171296296295,
                    }]);
                expect(response.body.averages).to.shallowDeepEqual({
                    avgGPA: '3.50',
                    avgSATMath: 800,
                    avgSATEBRW: 800,
                    avgACTComposite: 32,
                    avgAcceptedGPA: '3.50',
                    avgAcceptedSATMath: 800,
                    avgAcceptedSATEBRW: 800,
                    avgAcceptedACTComposite: 32,
                    avgWeight: 83,
                });
                done();
            });
    });

    it('Filter by Ridgewood High School', (done) => {
        agent.get('/highSchools/name/Ridgewood High School').end((err, res) => {
            res.should.have.status(200);
            const hsId = res.body.highSchool.HighSchoolId;
            agent
                .post(`/colleges/id/${SBUCollegeId}/applications`)
                .send({
                    filters: {
                        lax: false,
                        highSchools: [hsId],
                    },
                })
                .end((error, response) => {
                    response.should.have.status(200);
                    expect(response.body.applications).to.shallowDeepEqual([
                        {
                            username: 'mochaImport',
                            Application: { status: 'accepted', college: SBUCollegeId, username: 'mochaImport' },
                        },
                        {
                            username: 'mochaImportWrong',
                            Application: { status: 'pending', college: SBUCollegeId, username: 'mochaImportWrong' },
                        },
                    ]);
                    expect(response.body.averages).to.shallowDeepEqual({
                        avgGPA: '3.50',
                        avgSATMath: 800,
                        avgSATEBRW: 600,
                        avgACTComposite: 32,
                        avgAcceptedGPA: '3.50',
                        avgAcceptedSATMath: 800,
                        avgAcceptedSATEBRW: 800,
                        avgAcceptedACTComposite: 32,
                        avgWeight: 76,
                    });
                    done();
                });
        });
    });


    it('Combine all filters', (done) => {
        agent.get('/highSchools/name/Ridgewood High School').end((err, res) => {
            const hsId = res.body.highSchool.HighSchoolId;
            agent
                .post(`/colleges/id/${SBUCollegeId}/applications`)
                .send({
                    filters: {
                        highschools: [hsId],
                        lowerCollegeClass: 2020,
                        upperCollegeClass: 2028,
                        statuses: ['accepted', 'pending', 'withdrawn'],
                        lax: true,
                    },
                })
                .end((error, response) => {
                    response.should.have.status(200);
                    expect(response.body.applications).to.shallowDeepEqual([
                        {
                            username: 'mocha3',
                            Application: { status: 'withdrawn', college: SBUCollegeId, username: 'mocha3' },
                        },
                        {
                            username: 'mochaImport',
                            Application: { status: 'accepted', college: SBUCollegeId, username: 'mochaImport' },
                        },
                        {
                            username: 'mochaImportWrong',
                            Application: { status: 'pending', college: SBUCollegeId, username: 'mochaImportWrong' },
                        },
                    ]);
                    expect(response.body.averages).to.shallowDeepEqual({
                        avgGPA: '3.50',
                        avgSATMath: 800,
                        avgSATEBRW: 533,
                        avgACTComposite: 32,
                        avgAcceptedGPA: '3.50',
                        avgAcceptedSATMath: 800,
                        avgAcceptedSATEBRW: 800,
                        avgAcceptedACTComposite: 32,
                        avgWeight: 74,
                    });
                    done();
                });
        });
    });
});
