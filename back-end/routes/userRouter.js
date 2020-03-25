const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
router.post('/create', function (req, res) {
    userController.createUser(req.body).then(result => {
        if (result.error) {
            if (result.error == 'Something went wrong') res.status(500);
            else res.status(400);
        }
        res.send(result);
    });
});

router.post('/login', function (req, res) {
    userController.login(req.body).then(result => {
        if (result.error) {
            if (result.error == 'Something went wrong') res.status(500);
            else res.status(400);
        }
        res.cookie("access_token", result.access_token);
        res.send(result);
    });
});

router.post('/delete', function (req,res){
    if (adminController.checkAdmin(req.body.username)){
        adminController.removeAllUsers().then(result =>{            
            if (result.error) {
                if (result.error == 'Something went wrong') res.status(500);
                else res.status(400);
            }
        });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('access_token');
    res.send({
        ok: 'Logged out'
    })
})
module.exports = router;
