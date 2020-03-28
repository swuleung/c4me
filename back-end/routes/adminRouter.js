const express = require('express');
const router = express.Router();
const authentication = require('../utils/auth');
const adminController = require('../controllers/adminController');

router.get('/scrapeCollegeRanking', async function (req, res) {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: "error", error: "No token provided" });
    } else {
        let authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie("access_token");
            res.status(400).send({ status: "error", error: "Not authorized" });
        } else if (!(await adminController.checkAdmin(authorized.username))) {
            res.status(400).send({ status: "error", error: "Not an admin" });
        } else {
            let result = await adminController.scrapeCollegeRankings();
            if (result.error) {
                if (result.error == 'Something went wrong') res.status(500);
                else res.status(400);
            }
            res.send(result);
        }
    }
});

router.get('/scrapeCollegeData', async function (req, res) {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: "error", error: "No token provided" });
    } else {
        let authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie("access_token");
            res.status(400).send({ status: "error", error: "Not authorized" });
        } else if (!(await adminController.checkAdmin(authorized.username))) {
            res.status(400).send({ status: "error", error: "Not an admin" });
        } else {
            let result = await adminController.scrapeCollegeData();
            if (result.error) {
                if (result.error == 'Something went wrong') res.status(500);
                else res.status(400);
            }
            res.send(result);
        }
    }
});

router.get('/importStudents', async function (req, res) {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: "error", error: "No token provided" });
    } else {
        let authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie("access_token");
            res.status(400).send(authorized);
        } else if (!adminController.checkAdmin(authorized.username)) {
            res.status(400).send(authorized);
        } else {
            let result = await adminController.importStudents();
            res.send(result);
        }
    }
});

router.get('/importApplications', async function (req, res) {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: "error", error: "No token provided" });
    } else {
        let authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie("access_token");
            res.status(400).send(authorized);
        } else if (!adminController.checkAdmin(authorized.username)) {
            res.status(400).send(authorized);
        } else {
            let result = await adminController.importApplications();
            res.send(result);
        }
    }
});

router.get('/deleteStudentProfiles', async function (req, res) {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: "error", error: "No token provided" });
    } else {
        let authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie("access_token");
            res.status(400).send(authorized);
        } else if (!adminController.checkAdmin(authorized.username)) {
            res.status(400).send(authorized);
        } else {
            let rmvd = await adminController.removeAllUsers();
            if(!rmvd.ok){
                res.status(400);
            }
                res.send(rmvd);
        }
    } 
 });
 
 
 



module.exports = router;