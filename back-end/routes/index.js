var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function (req, res) {
    res.send({
        title: 'C4Me API'
    });
});

module.exports = router;
