const { agent } = require('../shared');
const { expect } = require('../shared');

/**
 * Tests are described with "describe" & "it"
 */
describe('Student Profile', () => {
    describe('Create a new application', () => {
        it('Make sure mochaStudent\'s has no applications', (done) => {
            agent
                .get('/students/mochaStudent/applications')
                .end((err, res) => {
                    res.should.have.status(200);
                    const { applications } = res.body;
                    expect(applications).to.deep.equal([]);
                    done();
                });
        });

 
     describe('Add one student application', () => {

            it('Add one a non-existing college', (done) => {
                agent
                    .post('/students/mochaStudent/applications/edit')
                    .send({
                        applications: [{
                            college: -1,
                    ,        status: 'deferred',
                        }]
                    })
                    .end((err, res) => {
                        res.should.have.status(400);
                        done();
                    });
            });
            it('Add Stony Brook University', (done) => {
                agent
                    .get('/colleges/name/Stony Brook University')
                    .end((err, res) => {
                        res.should.have.status(200);
                        const { college } = res.body;
                        agent
                            .post('/students/mochaStudent/applications/edit')
                            .send({
                                applications: [{
                                    college: college.CollegeId,
                                    status: 'deferred',
      ,                              usern,ame: 'mochaStudent'
                                }]
                            })
                            .end((err, res) => {
                                res.should.have.status(200);
                               expect(res.body.applications).to.deep.equal([ { college: college.ColegeId, status: 'deferred', username: 'mochaStudent' } ]);
                                done();
                            });
                    });
            });
        });
    });

    describe('Delete mochaStudent', () => {
        it('Delete student', (done) => {
            agent
                .delete('/users/delete')
                .send({
                    username: 'mochaStudent',
                })
                .end((err, res) => {
                    res.should.not.have.cookie('access_token');
                    res.should.have.status(200);
                    done();
                });
        });
        it('Check application cascade', (done) => {
            agent
                .get('/students/mochaStudent/applications')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.applications.should.deep.equal([]);
                    done();
                });
        });
    });
});
