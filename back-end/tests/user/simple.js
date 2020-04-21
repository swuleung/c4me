const { agent } = require('../shared');

/**
 * Tests are described with "describe" & "it"
 */
describe('Simple Create/Login/Delete', () => {
    describe('Create User', () => {
        it('Creates a new user', (done) => {
            agent
                .post('/users/create')
                .send({
                    Username: 'mocha',
                    Password: 'Password',
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('Login', () => {
        it('Login as user', (done) => {
            agent
                .post('/users/login')
                .send({
                    Username: 'mocha',
                    Password: 'password',
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.have.cookie('access_token');
                    done();
                });
        });
    });

    describe('Delete', () => {
        it('Delete user', (done) => {
            agent
                .delete('/users/delete')
                .send({
                    Username: 'mocha',
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.not.have.cookie('access_token');
                    done();
                });
        });
    });
});
