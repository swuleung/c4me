const express = require('express');

const router = express.Router();
const authentication = require('../utils/auth');
const adminController = require('../controllers/adminController');
const collegeController = require('../controllers/collegeController');

router.get('/scrapeCollegeRanking', async (req, res) => {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send({ status: 'error', error: 'Not authorized' });
        } else if (!(await adminController.checkAdmin(authorized.username))) {
            res.status(400).send({ status: 'error', error: 'Not an admin' });
        } else {
            const result = await adminController.scrapeCollegeRankings();
            if (result.error) {
                if (result.error === 'Something went wrong') res.status(500);
                else res.status(400);
            }
            res.send(result);
        }
    }
});

router.get('/scrapeCollegeData', async (req, res) => {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send({ status: 'error', error: 'Not authorized' });
        } else if (!(await adminController.checkAdmin(authorized.username))) {
            res.status(400).send({ status: 'error', error: 'Not an admin' });
        } else {
            const result = await adminController.scrapeCollegeData();
            if (result.error) {
                if (result.error === 'Something went wrong') res.status(500);
                else res.status(400);
            }
            res.send(result);
        }
    }
});

router.get('/importCollegeScorecard', async (req, res) => {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send({ status: 'error', error: 'Not authorized' });
        } else if (!(await adminController.checkAdmin(authorized.username))) {
            res.status(400).send({ status: 'error', error: 'Not an admin' });
        } else {
            const result = await adminController.importCollegeScorecard();
            if (result.error) {
                if (result.error === 'Something went wrong') res.status(500);
                else res.status(400);
            }
            res.send(result);
        }
    }
});

router.delete('/deleteStudentProfiles', async (req, res) => {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else if (!adminController.checkAdmin(authorized.username)) {
            res.status(400).send(authorized);
        } else {
            const rmvd = await adminController.deleteAllStudents();
            if (!rmvd.ok) {
                res.status(400);
            }
            res.send(rmvd);
        }
    }
});

router.get('/importStudents', async (req, res) => {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else if (!adminController.checkAdmin(authorized.username)) {
            res.status(400).send(authorized);
        } else {
            const result = await adminController.importStudents();
            res.send(result);
        }
    }
});

router.get('/importApplications', async (req, res) => {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else if (!adminController.checkAdmin(authorized.username)) {
            res.status(400).send(authorized);
        } else {
            const result = await adminController.importApplications();
            res.send(result);
        }
    }
});


router.delete('/deleteAllColleges', async (req, res) => {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else if (!adminController.checkAdmin(authorized.username)) {
            res.status(400).send(authorized);
        } else {
            const result = await collegeController.deleteAllColleges();
            if (!result.ok) res.status(400);
            res.send(result);
        }
    }
});

router.get('/verifyAdmin', async (req, res) => {
    if (!req.cookies.access_token) {
        res.send({
            ok: 'Successfaully checked admin',
            isAdmin: false,
        });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        const result = await adminController.checkAdmin(authorized.username);
        res.send({
            ok: 'Successfaully checked admin',
            isAdmin: result,
        });
    }
});

router.get('/getApplications', async (req,res) => {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else if (!adminController.checkAdmin(authorized.username)) {
            res.status(400).send(authorized);
        } else {
            const result = await adminController.getApplications();
            res.send(result);
        }
    }
});
module.exports = router;
