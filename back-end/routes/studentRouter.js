const express = require('express');

const router = express.Router();
const authentication = require('../utils/auth');
const studentController = require('../controllers/studentController');

router.get('/:username', async (req, res) => {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else {
            const result = await studentController.getStudent(req.params.username);
            if (result.error) {
                if (result.error === 'Something went wrong') res.status(500);
                else res.status(400);
            }
            res.send(result);
        }
    }
});

router.get('/:username/applications', async (req, res) => {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else {
            const result = await studentController.getStudentApplications(req.params.username);
            if (result.error) {
                if (result.error === 'Something went wrong') res.status(500);
                else res.status(400);
            }
            res.send(result);
        }
    }
});

router.post('/:username/applications/edit', async (req, res) => {
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
            const result = await studentController.updateStudentApplications(
                req.params.username,
                req.body.applications,
            );
            if (result.error) {
                if (result.error === 'Something went wrong') res.status(500);
                else res.status(400);
            }
            res.send(result);
        }
    }
});

router.post('/:username/edit', async (req, res) => {
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
            const result = await studentController.updateStudent(req.params.username, req.body);
            if (result.error) {
                if (result.error === 'Something went wrong') res.status(500);
                else res.status(400);
            }
            res.send(result);
        }
    }
});

module.exports = router;
