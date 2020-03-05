var express = require('express');
var router = express.Router();
var models = require('../models');

router.post('/createStudent', function (req, res) {
    models.User.create({
        username: req.body.username,
        password: req.body.password
    }).then((user) => {
        models.Student.create({
            username: user.username,
        })
    }).then(function () {
        res.redirect('/');
    });
});

router.post('/login', function (req, res) {

});

module.exports = router;
