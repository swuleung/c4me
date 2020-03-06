const express = require('express');
const router = express.Router();
const models = require('../models');
const userController = require('../controllers/userController');

router.post('/create', function (req, res) {
    userController.createuser(req.body).then(result => {
        if (result.error) {
            if (result.error == 'Something went wrong') res.status(500);
            else res.status(400);
        }
        res.send(result)
    });
});

router.post('/login', function (req, res) {

});

module.exports = router;
