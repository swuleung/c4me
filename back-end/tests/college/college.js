// TODO
const { agent } = require('../shared');
const { expect } = require('../shared');

describe('College', () => {
    describe('Checks college table', () => {
        it('get all colleges', (done) => {
            agent
                .get('/colleges/all')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe(' Get college by name', () => {
        it("get 'Stony Brook University'", (done) => {
            agent
                .get('/colleges/name/Stony Brook University')
                .end((err, res) => {
                    res.should.have.status(200);
                    const { college } = res.body;
                    agent
                        .get(`/colleges/id/${college.CollegeId}`)
                        .end((error, response) => {
                            response.should.have.status(200);
                            expect(response.body.college.Name).equals.toString('Stony Brook University');
                            done();
                        });
                });
        });

        it('get invalid college with id = -1', (done) => {
            agent
                .get('/colleges/id/-1')
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });
});
