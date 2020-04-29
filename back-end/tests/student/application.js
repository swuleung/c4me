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
                            CollegeId: -1,
                            Status: 'deferred',
                        }],
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
                                    CollegeId: college.CollegeId,
                                    Status: 'deferred',
                                    Username: 'mochaStudent',
                                }],
                            })
                            .end((error, response) => {
                                response.should.have.status(200);
                                expect(response.body.applications).to.deep.equal([{ CollegeId: college.CollegeId, Status: 'deferred', Username: 'mochaStudent' }]);
                                done();
                            });
                    });
            });
        });
    });
});
