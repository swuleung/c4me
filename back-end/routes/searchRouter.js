const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.post('/searchCollegeResults', function (req, res) {
    searchController.searchCollege(req.body).then(result => {
        if (result.error) {
            if (result.error == 'Something went wrong') res.status(500);
            else res.status(400);
        }
        res.send(result);
    });
});

module.exports = router;
