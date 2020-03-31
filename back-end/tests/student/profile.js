const { agent } = require('../shared');
const { expect } = require('../shared');

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
                        username, isAdmin, APPassed, ...details
                    } = student;
                    expect(username).to.equal('mochaStudent');
                    expect(isAdmin).to.be.false;

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
                    GPA: 3.0,
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    const { student } = res.body;
                    expect(student.username).to.equal('mochaStudent');
                    expect(student.GPA).to.equal(3.0);
                    done();
                });
        });
        it('Update mochaStudent with invalid data (ACTComposite out of Range)', (done) => {
            agent
                .post('/students/mochaStudent/edit')
                .send({
                    ACTComposite: 37,
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
                    ACTComposite: 2,
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    const { student } = res.body;
                    expect(student.username).to.equal('mochaStudent');
                    expect(student.ACTComposite).to.equal(2);
                    done();
                });
        });
        it('Update mochaStudent with invalid data (Illegal residenceState)', (done) => {
            agent
                .post('/students/mochaStudent/edit')
                .send({
                    residenceState: 'ZZ',
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
        it('Update mochaStudent with valid data (Legal residenceState)', (done) => {
            agent
                .post('/students/mochaStudent/edit')
                .send({
                    residenceState: 'AL',
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    const { student } = res.body;
                    expect(student.username).to.equal('mochaStudent');
                    expect(student.residenceState).to.equal('AL');
                    done();
                });
        });
        it('Update mochaStudent with invalid data (SATMath out of Range)', (done) => {
            agent
                .post('/students/mochaStudent/edit')
                .send({
                    SATMath: 801,
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
                    SATMath: 200,
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    const { student } = res.body;
                    expect(student.username).to.equal('mochaStudent');
                    expect(student.SATMath).to.equal(200);
                    done();
                });
        });
        it('Update mochaStudent with invalid data (APPassed out of Range)', (done) => {
            agent
                .post('/students/mochaStudent/edit')
                .send({
                    APPassed: 39,
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
                    APPassed: 1,
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    const { student } = res.body;
                    expect(student.username).to.equal('mochaStudent');
                    expect(student.APPassed).to.equal(1);
                    done();
                });
        });
    });
});
