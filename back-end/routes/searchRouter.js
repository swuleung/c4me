const express = require('express');

const router = express.Router();
const authentication = require('../utils/auth');
const searchController = require('../controllers/searchController');

router.post('/', async (req, res) => {
    // authentication check
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else {
            // get search results
            const result = await searchController.searchCollege(req.body.filters, authorized.username);
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

router.post('/recommender', async (req, res) => {
    // authentication check
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else {
            // get search results
            const result = await searchController.calcScores(
                req.body.collegeIds, authorized.username,
            );
            if (result.error) res.status(400);
            res.send(result);
        }
    }
});

module.exports = router;
