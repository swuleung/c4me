const express = require('express');
const router = express.Router();
const authentication = require('../utils/auth');
const studentController = require('../controllers/studentController');

router.get('/:username', async function (req, res) {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: "error", error: "No token provided" });
    } else {
        let authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie("access_token");
            res.status(400).send(authorized);
        } else {
            let result = await studentController.getStudent(req.params.username);
            if (result.error) {
                if (result.error == 'Something went wrong') res.status(500);
                else res.status(400);
            }
            res.send(result);
        }
    }
});

router.get('/:username/applications', async function (req, res) {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: "error", error: "No token provided" });
    } else {
        let authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie("access_token");
            res.status(400).send(authorized);
        } else {
            let result = await studentController.getStudentApplications(req.params.username);
            if (result.error) {
                if (result.error == 'Something went wrong') res.status(500);
                else res.status(400);
            }
            res.send(result);
        }
    }
});

module.exports = router;
