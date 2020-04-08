const express = require('express');

const router = express.Router();
const authentication = require('../utils/auth');
const highSchoolController = require('../controllers/highSchoolController');

router.get('/id/:highSchoolId', async (req, res) => {
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
            result = await highSchoolController.getHighSchoolById(highSchoolID);
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
            result = await highSchoolController.getAllHighSchools();
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

router.get('/name/:highSchoolName', async (req, res) => {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else {
            let result = {};
            result = await highSchoolController.getHighSchoolByName(req.params.highSchoolName);
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

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
            result = await highSchoolController.scrapeHighSchoolData(req.body.highSchoolName, req.body.highSchoolCity, req.body.highSchoolState);
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

module.exports = router;
