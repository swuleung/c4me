const sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const models = require('../models');
const authentication = require('../utils/auth');

/**
 * Create a new user
 * @param {string} username Username  to be created with user
 * @param {string} password Password (unhashed) to be created with user
 */
exports.createUser = async (username, password) => {
    let newUser = {};
    try {
        // sequelize call to create
        newUser = await models.User.create({
            Username: username,
            Password: password,
        });
    } catch (error) {
        if (error instanceof sequelize.UniqueConstraintError) {
            return { error: 'Username must be unique', reason: error.errors[0].message };
        }
        return {
            error: 'Something went wrong',
            reason: error,
        };
    }
    return { ok: 'Success', student: newUser };
};

/**
 * Check user for login
 * @param {string} username Username to login
 * @param {string} password Password (unhashed)
 */
exports.login = async (username, password) => {
    let user = {};
    try {
        // only need to find one since usernames are unique
        user = await models.User.findOne({
            raw: true,
            where: {
                Username: username,
            },
        });
    } catch (error) {
        return {
            error: 'Invalid user',
            reason: error,
        };
    }
    // if user is null from findOne
    if (!user) {
        return {
            error: 'User not found',
            reason: 'User does not exist in DB',
        };
    }
    let passwordCheck = false;

    // user bcrypt ot check password
    try {
        passwordCheck = await bcrypt.compare(password, user.Password);
    } catch (error) {
        return {
            error: 'Error checking password',
            reason: error,
        };
    }

    // password returned null for incorrect password
    if (!passwordCheck) {
        return {
            error: 'Incorrect password',
            reason: 'User did not input correct password',
        };
    }

    // generate new JWT token if password passses with username as info
    const jwtToken = authentication.generateKey(username);

    // failure of token generation
    if (jwtToken === {}) {
        return {
            error: 'Unable to generate token',
            reason: 'Invalid paramaters',
        };
    }
    return { ok: 'Success', access_token: jwtToken };
};

/**
 * Delete user
 * @param {string} username Username to be deleted
 * Authentication is checke din router
 */
exports.deleteUser = async (username) => {
    try {
        await models.User.destroy({
            where: {
                Username: username,
            },
        });
    } catch (error) {
        return {
            error: 'Something went wrong',
            reason: error,
        };
    }
    return { ok: 'Success' };
};
