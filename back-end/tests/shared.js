// Import the dependencies for testing
const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../app');

// Configure chai
chai.use(chaiHTTP);
chai.should();

const agent = chai.request.agent(app);
const expect = chai.expect;

exports.agent = agent;
exports.expect = expect;