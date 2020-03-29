const agent = require('../shared').agent;
const expect = require('../shared').expect;

describe("Student Application", () => {
    describe("Create a new application", () => {
        it('Make sure mochaStudent\'s has no applications', (done) => {
            agent
                .get('/students/mochaStudent/applications')
                .end((err, res) => {
                    res.should.have.status(200);
                    let applications = res.body.applications;
                    expect(applications).to.deep.equal([]);
                    done();
                });
        });

        it('Add one student application', () => {
            it('Add one college', (done) => {
                agent
                    .post('/students/mochaStudent/applications/edit')
                    .send({
                        college: 1,
                        status: 'waitlisted'
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        let application = res.body.applications;
                        expect(application).to.depp.equal({
                            college: 1,
                            status: 'waitlisted',
                            username: 'mochaStudent'
                        });
                        done();
                    }); 
            });
        });
    });

    describe('Delete mochaStudent', () => {
        it('Delete student', (done) => {
            agent
                .delete('/users/delete')
                .send({
                    'username': 'mochaStudent'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.not.have.cookie('access_token');
                    done();
                });
        })
    })

    describe("Check if application was deleted", () => {
        it ("Check if application does not exist", (done) => {
            agent 
                .get('/student/mochaStudent/applications')
                .end((err,res) => {
                    res.should.have.status(404);
                    done();
                })
        })
    })
});