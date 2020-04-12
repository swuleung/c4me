const express = require('express');

const router = express.Router();
const authentication = require('../utils/auth');
const collegeController = require('../controllers/collegeController');

/**
 * Find a college using the college ID
 * GET request with param collegeID
 */
router.get('/id/:collegeID', async (req, res) => {
    // authentication
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else {
            let result = {};
            const { collegeID } = req.params;
            // get the results from controller
            result = await collegeController.getCollegeByID(collegeID);
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

/**
 * List all colleges within the database
 * GET request
 */
router.get('/all', async (req, res) => {
    // authentication check
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else {
            let result = {};
            // get the results
            result = await collegeController.getAllColleges();
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

/**
 * Get a college using its name
 * GET request with param collegeName
 */
router.get('/name/:collegeName', async (req, res) => {
    // authentication check
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else {
            let result = {};
            // get the results
            result = await collegeController.getCollegeByName(req.params.collegeName);
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

/**
 * Get all majors for a speicified college
 * GET request with param collegeID
 */
router.get('/id/:collegeID/majors', async (req, res) => {
    // authentication check
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else {
            let result = {};
            result = await collegeController.getMajorsByCollegeID(req.params.collegeID);
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

/**
 * Get applications for application tracker
 * POST request with param collegeId and body:
 * {
 *    filters: {
 *       lowerCollegeClass: <integer>
 *       upperCollegeClass: <integer>
 *       statuses: ['accepted', ...]
 *       highSchools: [highSchoolId, ...]
 *       lax: <boolean>
 *    }
 * }
 *
 * Each filter is optional
 */
router.post('/id/:collegeID/applications', async (req, res) => {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else {
            let result = {};
            // eslint-disable-next-line max-len
            result = await collegeController.getApplicationsByCollegeID(req.params.collegeID, req.body.filters ? req.body.filters : {});
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});
module.exports = router;
