const sequelize = require('sequelize');
const models = require('../models');
const bcrypt = require('bcrypt');
const authentication = require('../utils/auth');

exports.createUser = async (user) => {
    let newUser = {};
    try {
        newUser = await models.User.create({
            username: user.username,
            password: user.password
        });
    } catch (error) {
        if (error instanceof sequelize.UniqueConstraintError) {
            return { error: 'Username must be unique', reason: error.errors[0].message };
        }
        return {
            error: 'Something went wrong',
            reason: error
        };
    } 
    return { ok: 'Success', student: newUser };
}

exports.login = async (loginUser) => {
    let username = loginUser.username;
    let password = loginUser.password;
    let user = {};
    try {
        user = await models.User.findAll({
            limit: 1,
            raw: true,
            where: {
                username: username
            }
        });
    } catch (error) {
        return {
            error: 'Invalid user',
            reason: error
        };
    }
    if (!user.length) {
        return {
            error: 'User not found',
            reason: 'User does not exist in DB'
        }
    }
    user = user[0];
    let passwordCheck = false;
    try {
        passwordCheck = await bcrypt.compare(password, user.password);
    } catch (error) {
        return {
            error: 'Error checking password',
            reason: error
        };
    }
    if (!passwordCheck) {
        return {
            error: 'Incorrect password',
            reason: 'User did not input correct password'
        };
    }

    let jwtToken = authentication.generateKey(username);

    if (jwtToken == {}) {
        return {
            error: 'Unable to generate token',
            reason: 'Invalid paramaters'
        }
    }
    return { ok: 'Success', access_token: jwtToken };
}