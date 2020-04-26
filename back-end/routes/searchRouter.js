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

            searchController.searchCollege( req.body,  authorized.username ).then(result => {
		        if (result.error) {
		            if (result.error == 'Something went wrong') res.status(500);
		            else res.status(400);
		        }
		        res.send(result);
    		});
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

            searchController.calcScores( req.body,  authorized.username ).then(result => {
                if (result.error) {
                    if (result.error == 'Something went wrong') res.status(500);
                    else res.status(400);
                }
                res.send(result);
            });
        }
    }

});

module.exports = router;
