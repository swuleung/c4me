const express = require('express');

const router = express.Router();
const authentication = require('../utils/auth');
const adminController = require('../controllers/adminController');
const collegeController = require('../controllers/collegeController');
const highSchoolController = require('../controllers/highschoolController');

/**
 * Scrape the college rankings from THE
 * GET request
 */
router.get('/scrape-college-ranking', async (req, res) => {
    // authentication check
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send({ status: 'error', error: 'Not authorized' });
            // verify that user is an admin
        } else if (!(await adminController.checkAdmin(authorized.username))) {
            res.status(400).send({ status: 'error', error: 'Not an admin' });
        } else {
            // scrape the rankings
            const result = await adminController.scrapeCollegeRankings();
            if (result.error) {
                if (result.error === 'Something went wrong') res.status(500);
                else res.status(400);
            }
            res.send(result);
        }
    }
});

/**
 * Scrape data from CollegeData
 * GET request
 */
router.get('/scrape-college-data', async (req, res) => {
    // authentication check
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send({ status: 'error', error: 'Not authorized' });
            // verify admin user
        } else if (!(await adminController.checkAdmin(authorized.username))) {
            res.status(400).send({ status: 'error', error: 'Not an admin' });
        } else {
            // scrape the data
            const result = await adminController.scrapeCollegeData();
            if (result.error) {
                if (result.error === 'Something went wrong') res.status(500);
                else res.status(400);
            }
            res.send(result);
        }
    }
});

/**
 * Import the collegescorecard data
 * GET request
 */
router.get('/import-college-scorecard', async (req, res) => {
    // authentication check
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send({ status: 'error', error: 'Not authorized' });
            // verify that user is admin
        } else if (!(await adminController.checkAdmin(authorized.username))) {
            res.status(400).send({ status: 'error', error: 'Not an admin' });
        } else {
            // import college scorecard
            const result = await adminController.importCollegeScorecard();
            if (result.error) {
                if (result.error === 'Something went wrong') res.status(500);
                else res.status(400);
            }
            res.send(result);
        }
    }
});

/**
 * Delete all student profiles
 * GET request
 */
router.delete('/delete-student-profiles', async (req, res) => {
    // authentication check
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
            // verify that user is admin
        } else if (!adminController.checkAdmin(authorized.username)) {
            res.status(400).send(authorized);
        } else {
            // delete all students
            const rmvd = await adminController.deleteAllStudents();
            if (!rmvd.ok) {
                res.status(400);
            }
            res.send(rmvd);
        }
    }
});

/**
 * Import students from CSV file
 * GET request
 */
router.get('/import-students', async (req, res) => {
    // authentication check
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
            // verify that user is admin
        } else if (!adminController.checkAdmin(authorized.username)) {
            res.status(400).send(authorized);
        } else {
            // import students
            const result = await adminController.importStudents();
            res.send(result);
        }
    }
});

/**
 * Import applications from CSV file
 * GET request
 */
router.get('/import-applications', async (req, res) => {
    // authentication check
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
            // verify that the user is an admin
        } else if (!adminController.checkAdmin(authorized.username)) {
            res.status(400).send(authorized);
        } else {
            // import applications
            const result = await adminController.importApplications();
            res.send(result);
        }
    }
});

/**
 * Delete all colleges
 * GET request
 */
router.delete('/delete-all-colleges', async (req, res) => {
    // authentication check
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
            // verify that user is an admin
        } else if (!adminController.checkAdmin(authorized.username)) {
            res.status(400).send(authorized);
        } else {
            // delete all colleges
            const result = await collegeController.deleteAllColleges();
            if (!result.ok) res.status(400);
            res.send(result);
        }
    }
});

/**
 * Delete all high schools
 * GET request
 */
router.delete('/delete-all-high-schools', async (req, res) => {
    // authentication check
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
            // verify that user is an admin
        } else if (!adminController.checkAdmin(authorized.username)) {
            res.status(400).send(authorized);
        } else {
            // delete all colleges
            const result = await highSchoolController.deleteAllHighSchools();
            if (!result.ok) res.status(400);
            res.send(result);
        }
    }
});

/**
 * Verify that a user is an admin
 * GET request
 */
router.get('/verify-admin', async (req, res) => {
    if (!req.cookies.access_token) {
        res.send({
            ok: 'Successfaully checked admin',
            IsAdmin: false,
        });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        // pass the username from token
        const result = await adminController.checkAdmin(authorized.username);
        res.send({
            ok: 'Successfaully checked admin',
            IsAdmin: result,
        });
    }
});

/**
 * Scrape High School
 * POST request with body
 * {
 *  "highSchoolName": "academy for information technology",
 *  "highSchoolCity": "scotch plains",
 *  "highSchoolState": "NJ"
 * }
 */
router.post('/scrape-high-school', async (req, res) => {
    // authentication check
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
            // verify that user is an admin
        } else if (!adminController.checkAdmin(authorized.username)) {
            res.status(400).send(authorized);
        } else {
            const result = await highSchoolController.scrapeHighSchoolData(
                req.body.highSchoolName,
                req.body.highSchoolCity,
                req.body.highSchoolState,
            );
            res.send(result);
        }
    }
});


/**
 * Get Questionable Applications
 *
 */
router.get('/questionable-decisions', async (req, res) => {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
            // verify that user is an admin
        } else if (!adminController.checkAdmin(authorized.username)) {
            res.status(400).send(authorized);
        } else {
            const result = await adminController.getQuestionableApplications();
            if (result.error) {
                res.status(400);
            }
            res.send(result);
        }
    }
});

router.post('/update-applications', async (req, res) => {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
            // verify that user is an admin
        } else if (!adminController.checkAdmin(authorized.username)) {
            res.status(400).send(authorized);
        } else {
            let result = await adminController.updateApplications(req.body.applications);
            if (result.error) {
                res.status(400);
            } else {
                result = await adminController.getQuestionableApplications();
                if (result.error) {
                    res.status(400);
                }
            }
            res.send(result);
        }
    }
});
module.exports = router;
