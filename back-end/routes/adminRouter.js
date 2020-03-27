const express = require('express');
const router = express.Router();
const authentication = require('../utils/auth');
const adminController = require('../controllers/adminController');

router.get('/scrapeCollegeRanking', async function(req, res) {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: "error", error: "No token provided" });
    } else {
        let authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie("access_token");
            res.status(400).send(authorized);
        } else if(!adminController.checkAdmin(authorized.username)) { 
            res.status(400).send(authorized);
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

router.get('/scrapeCollegeData', async function(req, res) {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: "error", error: "No token provided" });
    } else {
        let authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie("access_token");
            res.status(400).send(authorized);
        } else if(!adminController.checkAdmin(authorized.username)) { 
            res.status(400).send(authorized);
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

router.get('/deleteStudentProfiles', async function (req, res) {
    if (!req.cookies.access_token) {
        res.status(405).send({ status: "error", error: "No token provided" });
    } else {
        let authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie("access_token");
            res.status(404).send(authorized);
        } else if (!adminController.checkAdmin(authorized.username)) {
            res.status(403).send(authorized);
        } else {
            console.log('Delete Student Profiles');
            let rmvd = await adminController.removeAllUsers();
            console.log(rmvd);
            if(rmvd.ok){
                res.status(200);
                res.send(rmvd);
            }
            else{
                res.status(400).
                res.send(rmvd);
            }
        }
    } 
 });
 
 
 



module.exports = router;