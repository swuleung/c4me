const { agent } = require('../shared');
const { expect } = require('../shared');

/**
 * Tests are described with "describe" & "it"
 */
describe('Search Colleges', () => {
    it('Login to user', (done) => {
        agent
            .post('/users/login')
            .send({
                username: 'mocha5',
                password: 'bob!pass1',
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.have.cookie('access_token');
                done();
            });
    });

    it('Search with no filters', (done) => {
        agent
            .post('/search')
            .send({
                filters: {},
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.colleges).to.shallowDeepEqual(
                    [
                        {
                            Name: 'Stony Brook University',
                        },
                        {
                            Name: 'Idaho State University',
                        },
                    ],
                );
                done();
            });
    });

    it('Search with sort by name', (done) => {
        agent
            .post('/search')
            .send({
                filters: {
                    sortAttribute: 'Name',
                    sortDirection: 'ASC',
                },
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.colleges).to.shallowDeepEqual(
                    [
                        {
                            Name: 'Idaho State University',
                        },
                        {
                            Name: 'Stony Brook University',
                        },
                    ],
                );
                done();
            });
    });

    it('Search with sort by ranking', (done) => {
        agent
            .post('/search')
            .send({
                filters: {
                    sortAttribute: 'Ranking',
                    sortDirection: 'ASC',
                },
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.colleges).to.shallowDeepEqual(
                    [
                        {
                            Name: 'Stony Brook University',
                        },
                        {
                            Name: 'Idaho State University',
                        },
                    ],
                );
                done();
            });
    });

    it('Search with name filter', (done) => {
        agent
            .post('/search')
            .send({
                filters: {
                    name: 'stony',
                },
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.colleges.length).to.equal(1);
                expect(res.body.colleges).to.shallowDeepEqual(
                    [
                        {
                            Name: 'Stony Brook University',
                        },
                    ],
                );
                done();
            });
    });

    it('Search with major filter', (done) => {
        agent
            .post('/search')
            .send({
                filters: {
                    major: 'accounting',
                },
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.colleges.length).to.equal(1);
                expect(res.body.colleges).to.shallowDeepEqual(
                    [
                        {
                            Name: 'Idaho State University',
                        },
                    ],
                );
                done();
            });
    });

    it('Search with size filter', (done) => {
        agent
            .post('/search')
            .send({
                filters: {
                    sizeMin: 10000,
                    sizeMax: 20000,
                },
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.colleges.length).to.equal(1);
                expect(res.body.colleges).to.shallowDeepEqual(
                    [
                        {
                            Name: 'Stony Brook University',
                        },
                    ],
                );
                done();
            });
    });

    it('Search with admissionRateFilter lax=false', (done) => {
        agent
            .post('/search')
            .send({
                filters: {
                    admissionRateMin: 0,
                    admissionRateMax: 50,
                },
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.colleges.length).to.equal(1);
                expect(res.body.colleges).to.shallowDeepEqual(
                    [
                        {
                            Name: 'Stony Brook University',
                        },
                    ],
                );
                done();
            });
    });

    it('Search with admissionRateFilter lax=true', (done) => {
        agent
            .post('/search')
            .send({
                filters: {
                    admissionRateMin: 0,
                    admissionRateMax: 50,
                    lax: true,
                },
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.colleges).to.shallowDeepEqual(
                    [
                        {
                            Name: 'Stony Brook University',
                        },
                        {
                            Name: 'Idaho State University',
                        },
                    ],
                );
                done();
            });
    });

    it('Search with college ranking', (done) => {
        agent
            .post('/search')
            .send({
                filters: {
                    rankingMin: 0,
                    rankingMax: 120,
                },
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.colleges.length).to.equal(1);
                expect(res.body.colleges).to.shallowDeepEqual(
                    [
                        {
                            Name: 'Stony Brook University',
                        },
                    ],
                );
                done();
            });
    });

    it('Search with SAT EBRW & SAT MATH', (done) => {
        agent
            .post('/search')
            .send({
                filters: {
                    SATEBRWMin: 600,
                    SATEBRWMax: 700,
                    SATMathMin: 600,
                    SATMathMax: 700,
                },
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.colleges.length).to.equal(1);
                expect(res.body.colleges).to.shallowDeepEqual(
                    [
                        {
                            Name: 'Stony Brook University',
                        },
                    ],
                );
                done();
            });
    });

    it('Search with ACT Composite filter', (done) => {
        agent
            .post('/search')
            .send({
                filters: {
                    ACTCompositeMin: 20,
                    ACTCompositeMax: 25,
                },
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.colleges.length).to.equal(1);
                expect(res.body.colleges).to.shallowDeepEqual(
                    [
                        {
                            Name: 'Idaho State University',
                        },
                    ],
                );
                done();
            });
    });

    it('Search with Cost of Attendance filter max=100000', (done) => {
        agent
            .post('/search')
            .send({
                filters: {
                    costMax: 100000,
                },
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.colleges).to.shallowDeepEqual(
                    [
                        {
                            Name: 'Stony Brook University',
                        },
                        {
                            Name: 'Idaho State University',
                        },
                    ],
                );
                done();
            });
    });

    it('Search with Cost of Attendance filter max=36000', (done) => {
        agent
            .post('/search')
            .send({
                filters: {
                    costMax: 36000,
                },
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.colleges.length).to.equal(1);
                expect(res.body.colleges).to.shallowDeepEqual(
                    [
                        {
                            Name: 'Idaho State University',
                        },
                    ],
                );
                done();
            });
    });

    it('Search with Regions filter', (done) => {
        agent
            .post('/search')
            .send({
                filters: {
                    regions: ['northeast'],
                },
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.colleges.length).to.equal(1);
                expect(res.body.colleges).to.shallowDeepEqual(
                    [
                        {
                            Name: 'Stony Brook University',
                        },
                    ],
                );
                done();
            });
    });


    it('Search with states filter with NY', (done) => {
        agent
            .post('/search')
            .send({
                filters: {
                    states: ['NY'],
                },
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.colleges.length).to.equal(1);
                expect(res.body.colleges).to.shallowDeepEqual(
                    [
                        {
                            Name: 'Stony Brook University',
                        },
                    ],
                );
                done();
            });
    });

    it('Search with states filter with NY', (done) => {
        agent
            .post('/search')
            .send({
                filters: {
                    states: ['NY', 'ID'],
                },
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.colleges).to.shallowDeepEqual(
                    [
                        {
                            Name: 'Stony Brook University',
                        },
                        {
                            Name: 'Idaho State University',
                        },
                    ],
                );
                done();
            });
    });

    it('Search with combined filters', (done) => {
        agent
            .post('/search')
            .send({
                filters: {
                    states: ['NY', 'ID'],
                    costMax: 100000,
                    admissionRateMin: 0,
                    admissionRateMax: 50,
                    lax: true,
                    sortAttribute: 'Name',
                    sortDirection: 'ASC',
                },
            })
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.colleges).to.shallowDeepEqual(
                    [
                        {
                            Name: 'Idaho State University',
                        },
                        {
                            Name: 'Stony Brook University',
                        },
                    ],
                );
                done();
            });
    });

    it('Get recommender scores for Stony Brook University', (done) => {
        agent
            .get('/colleges/name/Stony Brook University')
            .end((err, res) => {
                res.should.have.status(200);
                const { college } = res.body;
                const SBUCollegeId = college.CollegeId;
                agent
                    .post('/search/recommender')
                    .send({
                        collegeIds: [SBUCollegeId],
                    })
                    .end((error, response) => {
                        response.should.have.status(200);
                        expect(response.body.scores).to.deep.equal([{ Name: 'Stony Brook University', score: 0.82 }]);
                        done();
                    });
            });
    });

    it('Get a closer recommendation score', (done) => {
        agent
            .post('/students/mocha5/edit')
            .send({
                student: {
                    ACTComposite: 28,
                    SATMath: 675,
                    SATEBRW: 671,
                    GPA: 3.83,
                    ResidenceState: 'NY',
                },
            })
            .end((err, res) => {
                res.should.have.status(200);
                const { student } = res.body;
                expect(student.Username).to.equal('mocha5');

                agent
                    .get('/colleges/name/Stony Brook University')
                    .end((err2, collegeRes) => {
                        collegeRes.should.have.status(200);
                        const { college } = collegeRes.body;
                        const SBUCollegeId = college.CollegeId;
                        agent
                            .post('/search/recommender')
                            .send({
                                collegeIds: [SBUCollegeId],
                            })
                            .end((error, response) => {
                                response.should.have.status(200);
                                expect(response.body.scores).to.deep.equal([{ Name: 'Stony Brook University', score: 1 }]);
                                done();
                            });
                    });
            });
    });
});
