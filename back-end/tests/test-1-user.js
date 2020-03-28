// Import the dependencies for testing
const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../app');

// Configure chai
chai.use(chaiHTTP);
chai.should();

const agent = chai.request.agent(app);

describe("User", () => {
    describe("Create User", () => {
        // Test to get all students record
        it("Creates a new user", (done) => {
            agent
                .post('/users/create')
                .send({
                    'username': 'mocha3',
                    'password': 'password',
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
                    'username': 'mocha3',
                    'password': 'password',
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.have.cookie('access_token');
                    done();
                });
        })
    });

    describe('Delete', () => {
        it('Delete user', (done) => {
            agent
                .delete('/users/delete')
                .send({
                    'username': 'mocha3'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.not.have.cookie('access_token');
                    done();
                });
        })
    })
});