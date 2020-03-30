const agent = require('../shared').agent;
const expect = require('../shared').expect;

describe("Student Profile", () => {
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
            it('Add one a non-existing college', (done) => {
                agent
                    .post('/students/mochaStudent/applications/edit')
                    .send({
                        college: -1,
                        status: 'deferred'
                    })
                    .end((err, res) => {
                        res.should.have.status(400);
                        done();
                    }); 
            });            
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
                        expect(application).to.deep.equal({
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
                    res.should.not.have.cookie('access_token');
                    res.should.have.status(200);
                    done();
                });
        })
        it ("Check application cascade", (done) => {
            agent 
                .get('/students/mochaStudent/applications')
                .end((err,res) => {
                    res.should.have.status(200);
                    res.body.applications.should.deep.equal([]);
                    done();
                })
        })
    })
});