const express = require('express');

const router = express.Router();
const authentication = require('../utils/auth');
const collegeController = require('../controllers/collegeController');

router.get('/id/:collegeID', async (req, res) => {
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
            result = await collegeController.getCollegeByID(collegeID);
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

router.get('/all', async (req, res) => {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else {
            let result = {};
            result = await collegeController.getAllColleges();
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

router.get('/name/:collegeName', async (req, res) => {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else {
            let result = {};
            result = await collegeController.getCollegeByName(req.params.collegeName);
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

router.get('/id/:collegeID/majors', async (req, res) => {
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
