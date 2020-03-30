const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.send({
        title: 'C4Me API',
    });
});

module.exports = router;
