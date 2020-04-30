const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authentication = require('../utils/auth');

/**
 * Route to create an account
 * POST with body:
 * {
 *   username: <username:>
 *   password: <password>
 * }
 */
router.post('/create', (req, res) => {
    userController.createUser(req.body.username, req.body.password).then((result) => {
        if (result.error) res.status(400);
        res.send(result);
    });
});

/**
 * Deletes one user if they are logged in as that user.
 * DELETE with body:
 * {
 *   username: <username>
 * }
 */
router.delete('/delete', async (req, res) => {
    // authenticated checks
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
            // delete the user if authenticated
            userController.deleteUser(req.body.username).then((result) => {
                if (result.error) res.status(400);
                res.send(result);
            });
        }
    }
});

/**
 *  Login as that user by setting access_token to a JWT token
 * POST with body:
 * {
 *   username: <username>
 *   password: <password>
 * }
 */
router.post('/login', (req, res) => {
    userController.login(req.body.username, req.body.password).then((result) => {
        if (result.error) {
            if (result.error) res.status(400);
            res.send(result);
        } else {
            res.cookie('access_token', result.access_token, { maxAge: new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)) });
            res.send({ ok: result.ok });
        }
    });
});

/**
 * Logout out of user by clearing access_token
 * GET request with no params
 */
router.get('/logout', (req, res) => {
    res.clearCookie('access_token');
    res.send({
        ok: 'Logged out',
    });
});
module.exports = router;
