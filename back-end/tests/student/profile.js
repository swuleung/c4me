const { agent } = require('../shared');
const { expect } = require('../shared');

/**
 * Tests are described with "describe" & "it"
 */
describe('Student Profile', () => {
    describe('Create & login as mochaStudent', () => {
        it('Creates mochaStudent', (done) => {
            agent
                .post('/users/create')
                .send({
                    username: 'mochaStudent',
                    password: 'password',
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('Login as mochaStudent', (done) => {
            agent
                .post('/users/login')
                .send({
                    username: 'mochaStudent',
                    password: 'password',
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.have.cookie('access_token');
                    done();
                });
        });
    });

    describe('GET/UPDATE mochaStudent', () => {
        it('Make sure mochaStudent\'s values are null or 0', (done) => {
            agent
                .get('/students/mochaStudent')
                .end((err, res) => {
                    res.should.have.status(200);
                    const { student } = res.body;
                    const {
                        Username, IsAdmin, APPassed, ...details
                    } = student;
                    expect(Username).to.equal('mochaStudent');
                    expect(IsAdmin).to.be.false;

                    Object.keys(details).forEach((key) => {
                        expect(details[key]).to.be.null;
                    });
                    done();
                });
        });
        it('Update mochaStudent with valid data', (done) => {
            agent
                .post('/students/mochaStudent/edit')
                .send({
                    student: { GPA: 3.0 },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    const { student } = res.body;
                    expect(student.Username).to.equal('mochaStudent');
                    expect(student.GPA).to.equal(3.0);
                    done();
                });
        });
        it('Update mochaStudent with invalid data (ACTComposite out of Range)', (done) => {
            agent
                .post('/students/mochaStudent/edit')
                .send({
                    student: { ACTComposite: 37 },
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        it('Update mochaStudent with valid data (ACTComposite in Range)', (done) => {
            agent
                .post('/students/mochaStudent/edit')
                .send({
                    student: { ACTComposite: 2 },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    const { student } = res.body;
                    expect(student.Username).to.equal('mochaStudent');
                    expect(student.ACTComposite).to.equal(2);
                    done();
                });
        });
        it('Update mochaStudent with invalid data (Illegal ResidenceState)', (done) => {
            agent
                .post('/students/mochaStudent/edit')
                .send({
                    student: { ResidenceState: 'ZZ' },
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        it('Update mochaStudent with valid data (Legal ResidenceState)', (done) => {
            agent
                .post('/students/mochaStudent/edit')
                .send({
                    student: { ResidenceState: 'AL' },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    const { student } = res.body;
                    expect(student.Username).to.equal('mochaStudent');
                    expect(student.ResidenceState).to.equal('AL');
                    done();
                });
        });
        it('Update mochaStudent with invalid data (SATMath out of Range)', (done) => {
            agent
                .post('/students/mochaStudent/edit')
                .send({
                    student: { SATMath: 801 },
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        it('Update mochaStudent with valid data (SATMath in Range)', (done) => {
            agent
                .post('/students/mochaStudent/edit')
                .send({
                    student: { SATMath: 200 },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    const { student } = res.body;
                    expect(student.Username).to.equal('mochaStudent');
                    expect(student.SATMath).to.equal(200);
                    done();
                });
        });
        it('Update mochaStudent with invalid data (APPassed out of Range)', (done) => {
            agent
                .post('/students/mochaStudent/edit')
                .send({
                    student: { APPassed: 39 },
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        it('Update mochaStudent with valid data (APPassed in Range)', (done) => {
            agent
                .post('/students/mochaStudent/edit')
                .send({
                    student: { APPassed: 1 },
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    const { student } = res.body;
                    expect(student.Username).to.equal('mochaStudent');
                    expect(student.APPassed).to.equal(1);
                    done();
                });
        });
    });
});
