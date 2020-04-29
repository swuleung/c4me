const { agent } = require('../shared');
const { expect } = require('../shared');

/**
 * Tests are described with "describe" & "it"
 */
describe('Questionable Acceptance Decisions', () => {
    describe('Fix mochaStudent scores to make not questionable', () => {
        it('Update mochaStudent with stats to fit Stony Brook University', (done) => {
            agent
                .post('/students/mochaStudent/edit')
                .send({
                    student: {
                        ACTComposite: 28,
                        GPA: 3.4,
                        Major1: 'African-American/Black Studies',
                        Major2: 'Biology',
                        ResidenceState: 'NY',
                        SATMath: 650,
                        SATEBRW: 690,
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    const { student } = res.body;
                    expect(student.Username).to.equal('mochaStudent');
                    done();
                });
        });

        it('Update application, re-run to get not isquestionable', (done) => {
            agent
                .get('/students/mochaStudent/applications')
                .end((err, res) => {
                    res.should.have.status(200);
                    const { applications } = res.body;
                    applications[0].Status = 'denied';
                    agent
                        .post('/students/mochaStudent/applications/edit')
                        .send({
                            applications: applications,
                        })
                        .end((error, response) => {
                            response.should.have.status(200);
                            expect(response.body.applications.length).to.equal(1);
                            expect(response.body.applications[0]).to.shallowDeepEqual({
                                Status: 'denied',
                                IsQuestionable: true,
                                Username: 'mochaStudent',
                            });
                            const secondApp = response.body.applications;
                            secondApp[0].Status = 'accepted';
                            agent
                                .post('/students/mochaStudent/applications/edit')
                                .send({
                                    applications: secondApp,
                                })
                                .end((er, resp) => {
                                    resp.should.have.status(200);
                                    expect(resp.body.applications.length).to.equal(1);
                                    expect(resp.body.applications[0]).to.shallowDeepEqual({
                                        Status: 'accepted',
                                        IsQuestionable: false,
                                        Username: 'mochaStudent',
                                    });
                                    done();
                                });
                        });
                });
        });
    });
    describe('Remove mochaStudent SAT Score', () => {
        it('Update mochaStudent without SAT Score', (done) => {
            agent
                .post('/students/mochaStudent/edit')
                .send({
                    student: {
                        SATMath: null,
                        SATEBRW: null,
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    const { student } = res.body;
                    expect(student.Username).to.equal('mochaStudent');
                    done();
                });
        });
        it('Update application, re-run without SAT Score', (done) => {
            agent
                .get('/students/mochaStudent/applications')
                .end((err, res) => {
                    res.should.have.status(200);
                    const { applications } = res.body;
                    applications[0].Status = 'denied';
                    agent
                        .post('/students/mochaStudent/applications/edit')
                        .send({
                            applications: applications,
                        })
                        .end((error, response) => {
                            response.should.have.status(200);
                            expect(response.body.applications.length).to.equal(1);
                            expect(response.body.applications[0]).to.shallowDeepEqual({
                                Status: 'denied',
                                IsQuestionable: true,
                                Username: 'mochaStudent',
                            });
                            const secondApp = response.body.applications;
                            secondApp[0].Status = 'accepted';
                            agent
                                .post('/students/mochaStudent/applications/edit')
                                .send({
                                    applications: secondApp,
                                })
                                .end((er, resp) => {
                                    resp.should.have.status(200);
                                    expect(resp.body.applications.length).to.equal(1);
                                    expect(resp.body.applications[0]).to.shallowDeepEqual({
                                        Status: 'accepted',
                                        IsQuestionable: false,
                                        Username: 'mochaStudent',
                                    });
                                    done();
                                });
                        });
                });
        });
    });

    describe('Remove mochaStudent ACT Composite', () => {
        it('Update mochaStudent without ACT Composite', (done) => {
            agent
                .post('/students/mochaStudent/edit')
                .send({
                    student: {
                        ACTComposite: null,
                        SATMath: 650,
                        SATEBRW: 690,
                    },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    const { student } = res.body;
                    expect(student.Username).to.equal('mochaStudent');
                    done();
                });
        });
        it('Update application, re-run without ACT Composite (should pass)', (done) => {
            agent
                .get('/students/mochaStudent/applications')
                .end((err, res) => {
                    res.should.have.status(200);
                    const { applications } = res.body;
                    applications[0].Status = 'denied';
                    agent
                        .post('/students/mochaStudent/applications/edit')
                        .send({
                            applications: applications,
                        })
                        .end((error, response) => {
                            response.should.have.status(200);
                            expect(response.body.applications.length).to.equal(1);
                            expect(response.body.applications[0]).to.shallowDeepEqual({
                                Status: 'denied',
                                IsQuestionable: true,
                                Username: 'mochaStudent',
                            });
                            const secondApp = response.body.applications;
                            secondApp[0].Status = 'accepted';
                            agent
                                .post('/students/mochaStudent/applications/edit')
                                .send({
                                    applications: secondApp,
                                })
                                .end((er, resp) => {
                                    resp.should.have.status(200);
                                    expect(resp.body.applications.length).to.equal(1);
                                    expect(resp.body.applications[0]).to.shallowDeepEqual({
                                        Status: 'accepted',
                                        IsQuestionable: false,
                                        Username: 'mochaStudent',
                                    });
                                    done();
                                });
                        });
                });
        });
    });
});
