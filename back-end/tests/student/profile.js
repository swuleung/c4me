const agent = require('../shared').agent;
const expect = require('../shared').expect;

describe("Student Profile", () => {
    describe("Create & login as mochaStudent", () => {
        it("Creates mochaStudent", (done) => {
            agent
                .post('/users/create')
                .send({
                    'username': 'mochaStudent',
                    'password': 'password',
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
                    'username': 'mochaStudent',
                    'password': 'password',
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
                    let student = res.body.student;
                    let { username, isAdmin, APPassed, ...details } = student;
                    expect(username).to.equal('mochaStudent');
                    expect(isAdmin).to.be.false;
                    for (let key in details) {
                        expect(details[key]).to.be.null;
                    }
                    done();
                });
        });

        it('Update mochaStudent with valid data', (done) => {
            agent
                .post('/students/mochaStudent/edit')
                .send({
                    GPA: 3.0
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    let student = res.body.student;
                    expect(student.username).to.equal('mochaStudent');
                    expect(student.GPA).to.be.equal(3.0);
                    done();
                })
        });
        it('Update mochaStudent with invalid data', (done) => {
            agent
                .post('/students/mochaStudent/edit')
                .send({
                    ACTComposite: 37
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    // Error message here
                    done();
                })
        });
    });
});