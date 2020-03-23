const sequelize = require('sequelize');
const models = require('../models');
const bcrypt = require('bcrypt');
const authentication = require('../utils/auth');

exports.createuser = async (user) => {
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
    let newStudent = {};
    try {
        newStudent = await models.Student.create({
            username: newUser.username,
            GPA: user.GPA,
            residenceState: user.residenceState,
            highschoolName: user.highschoolName,
            highschoolState: user.highschoolState,
            collegeClass: user.collegeClass,
            major1: user.major1,
            major2: user.major2,
            SATMath: user.SATMath,
            SATEBRW: user.SATEBRW,
            ACTEnglish: user.ACTEnglish,
            ACTMath: user.ACTMath,
            ACTReading: user.ACTReading,
            ACTScience: user.ACTScience,
            ACTComposite: user.ACTComposite,
            SATLit: user.SATLit,
            SATUs: user.SATUs,
            SATWorld: user.SATWorld,
            SATMathI: user.SATMathI,
            SATMathII: user.SATMathII,
            SATEco: user.SATEco,
            SATMol: user.SATMol,
            SATChem: user.SATChem,
            SATPhys: user.SATPhys,
            APPassed: user.APPassed
        });
    } catch (error) {
        newUser.destroy();
        if (error instanceof sequelize.ValidationError) {
            return {
                error: 'Data does not conform to contraints',
                reason: error.errors[0].message
            }
        } else {
            return {
                error: 'Something went wrong',
                reason: error
            }
        }
    }
    return { ok: 'Success', student: newStudent };
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
                username: usernam
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