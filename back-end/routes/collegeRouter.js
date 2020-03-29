const express = require('express');
const router = express.Router();
const authentication = require('../utils/auth');
const collegeController = require('../controllers/collegeController');

router.get('/id/:collegeID', async function (req, res) {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: "error", error: "No token provided" });
    } else {
        let authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie("access_token");
            res.status(400).send(authorized);
        } else {
            let result = {}
            let collegeID = req.params.collegeID;
            result = await collegeController.getCollegeByID(collegeID);
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

router.get('/all', async function (req, res) {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: "error", error: "No token provided" });
    } else {
        let authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie("access_token");
            res.status(400).send(authorized);
        } else {
            let result = {}
            result = await collegeController.getAllColleges();
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

router.get('/name/:collegeName', async function (req, res) {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: "error", error: "No token provided" });
    } else {
        let authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie("access_token");
            res.status(400).send(authorized);
        } else {
            let result = {}
            let collegeName = req.params.collegeName;
            result = await collegeController.getCollegeByName(req.params.collegeName);
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

module.exports = router;
