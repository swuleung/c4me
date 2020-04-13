const express = require('express');

const router = express.Router();
const authentication = require('../utils/auth');
const studentController = require('../controllers/studentController');

/**
 * Get the student details including high school but excluding applications
 * GET with param username
 */
router.get('/:username', async (req, res) => {
    // authentication check
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else {
            // get student using param info
            const result = await studentController.getStudent(req.params.username);
            if (result.error) {
                if (result.error === 'Something went wrong') res.status(500);
                else res.status(400);
            }
            res.send(result);
        }
    }
});

/**
 * Get the student applications
 * GET request with param username
 */
router.get('/:username/applications', async (req, res) => {
    // authentication check
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else {
            // get applications using username param
            const result = await studentController.getStudentApplications(req.params.username);
            if (result.error) {
                if (result.error === 'Something went wrong') res.status(500);
                else res.status(400);
            }
            res.send(result);
        }
    }
});

/**
 * Edit a student's applications including new, changed, and deleted applications
 * POST request with param username annd body:
 * {
 *   applications: [Applications]
 * }
 */
router.post('/:username/applications/edit', async (req, res) => {
    // authentication check
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else if (authorized.username !== req.params.username) {
            res.status(400).send({
                status: 'error',
                error: 'Cannot edit another user',
            });
        } else {
            // update applications using username param & application body
            const result = await studentController.updateStudentApplications(
                req.params.username,
                req.body.applications,
            );
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

/**
 * Edit a student's details excluding applications
 * POST request with param username and body {
 *   student: Student
 *   highSchool: HighSchool
 * }
 */
router.post('/:username/edit', async (req, res) => {
    // authentication check
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else if (authorized.username !== req.params.username) {
            res.status(400).send({
                status: 'error',
                error: 'Cannot edit another user',
            });
        } else {
            // update student using username param and student + high school body
            const result = await studentController.updateStudent(
                req.params.username,
                req.body.student,
                req.body.highSchool,
            );
            if (result.error) {
                if (result.error === 'Something went wrong') res.status(500);
                else res.status(400);
            }
            res.send(result);
        }
    }
});

module.exports = router;
