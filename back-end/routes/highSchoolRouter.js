
const express = require('express');
const router = express.Router();
const authentication = require('../utils/auth');
const highschoolController = require('../controllers/highschoolController');

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
            result = await highschoolController.getAllHighSchools();
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

module.exports = router;