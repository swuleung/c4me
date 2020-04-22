const express = require('express');

const router = express.Router();
const authentication = require('../utils/auth');
const highSchoolController = require('../controllers/highschoolController');

/**
 * Get high school information with ID
 * GET request with id param
 */
router.get('/id/:highSchoolId', async (req, res) => {
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
            const { highSchoolId } = req.params;
            // get the information
            result = await highSchoolController.getHighSchoolById(highSchoolId);
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

/**
 * Get all high schools
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
            // get all high schools
            result = await highSchoolController.getAllHighSchools();
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

/**
 * Get high school using name
 * GET request with high school name param
 */
router.get('/name/:highSchoolName', async (req, res) => {
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
            // get the high school with name
            result = await highSchoolController.getHighSchoolByName(req.params.highSchoolName);
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

/**
 * Scrape the high school data
 * POST request with body: {
 *    highSchoolName: <string>
 *    highSchoolCity: <string>
 *    highSchoolState: <string of 2 Letter State Code>
 * }
 */
router.post('/scrapeHighSchoolData', async (req, res) => {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else {
            let result = {};
            result = await highSchoolController.scrapeHighSchoolData(
                req.body.highSchoolName,
                req.body.highSchoolCity,
                req.body.highSchoolState,
            );
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

/**
 * Get list of similar high schools
 * GET request with body: {
 *      username: <string>
 * }
 */
router.get('/findSimilarHS/:username', async (req, res) => {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else {
            let result = {};
            result = await highSchoolController.findSimilarHS(req.params.username);
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

module.exports = router;
