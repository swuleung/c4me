const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authentication = require('../utils/auth');

router.post('/create', (req, res) => {
    userController.createUser(req.body).then((result) => {
        if (result.error) {
            if (result.error === 'Something went wrong') res.status(500);
            else res.status(400);
        }
        res.send(result);
    });
});

router.delete('/delete', async (req, res) => {
    if (!req.cookies.access_token) {
        res.status(400).send({ status: 'error', error: 'No token provided' });
    } else {
        const authorized = await authentication.validateJWT(req.cookies.access_token);
        if (!authorized.username) {
            res.clearCookie('access_token');
            res.status(400).send(authorized);
        } else if (authorized.username !== req.body.username) {
            res.status(400).send({
                status: 'error',
                error: 'Cannot delete another user',
            });
        } else {
            userController.deleteUser(req.body.username).then((result) => {
                if (result.error) res.status(400);
                res.send(result);
            });
        }
    }
});

router.post('/login', (req, res) => {
    userController.login(req.body).then((result) => {
        if (result.error) {
            if (result.error === 'Something went wrong') res.status(500);
            else res.status(400);
        }
        res.cookie('access_token', result.access_token);
        res.send(result);
    });
});

router.get('/logout', (req, res) => {
    res.clearCookie('access_token');
    res.send({
        ok: 'Logged out',
    });
});
module.exports = router;
