// Import the dependencies for testing
const chai = require('chai');
const chaiHTTP = require('chai-http');
const chaiShallowDeepEqual = require('chai-shallow-deep-equal');
const app = require('../app');

// Configure chai
chai.use(chaiHTTP);
chai.use(chaiShallowDeepEqual);
chai.should();

const agent = chai.request.agent(app);
const expect = chai.expect;

exports.agent = agent;
exports.expect = expect;