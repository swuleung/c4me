const express = require('express');
const router = express.Router();
const authentication = require('../utils/auth');
const collegeController = require('../controllers/collegeController');

router.get('/:collegeID', async function (req, res) {
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
            if (collegeID === 'all') {
                result = await collegeController.getAllColleges();
            } else {
                result = await collegeController.getCollegeByID(req.params.collegeID);
            }
            if (result.error) {
                if (result.error == 'Something went wrong') res.status(500);
                else res.status(400);
            }
            res.send(result);
        }
    }
});

module.exports = router;
