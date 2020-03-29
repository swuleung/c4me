const sequelize = require('sequelize');
const models = require('../models');
const bcrypt = require('bcrypt');
const authentication = require('../utils/auth');

exports.getStudent = async (username) => {
    let student = {};
    try {
        student = await models.User.findAll({
            limit: 1,
            where: {
                username: username,
                isAdmin: false
            }
        });
    } catch (error) {
        return {
            error: 'Invalid student',
            reason: error
        };
    }
    if (!student.length) {
        return {
            error: 'User not found',
            reason: 'User does not exist in DB'
        }
    }
    return {
        ok: 'Success',
        student: student[0].toJSON()
    }
}

exports.updateStudent = async (username, newStudent) => {
    let student = [];
    try {
        student = await models.User.findAll({
            where: {
                username: username,
                isAdmin: false
            }
        });
    } catch (error) {
        return {
            error: 'Invalid student',
            reason: error
        };
    }
    if (!student.length) {
        return {
            error: 'User not found',
            reason: 'User does not exist in DB'
        }
    }
    try {
        await student[0].update(newStudent);
    } catch (error) {
        return {
            error: 'Error updating student',
            reason: error
        }
    }
    return {
        ok: 'Success',
        student: student[0]
    }
}

exports.getStudentApplications = async (username) => {
    let applications = {};
    try {
        applications = await models.Application.findAll({
            raw: true,
            where: {
                username: username
            }
        });
    } catch (error) {
        return {
            error: 'Invalid student',
            reason: error
        };
    }
    return {
        ok: 'Success',
        applications: applications
    }
}

exports.updateStudentApplications = async (username, newApplications) => {
    let copyApplications = [...newApplications];
    let allApplications = await models.Application.findAll({
        where: {
            username: username
        }
    });
    let errors = [];
    for (let i = 0; i < allApplications.length; i++) {
        let found = copyApplications.findIndex(app => parseInt(app.college) == allApplications[i].dataValues.college);
        if (found > -1) {
            try {
                await allApplications[i].update(copyApplications[found].college);
            } catch (error) {
                errors.push({
                    error: `Error updating application: ${allApplications[i]}`,
                    reason: error
                });
            }
            copyApplications.splice(found, 1);
        } else {
            try {
                await allApplications[i].destroy();
            } catch (error) {
                errors.push({
                    error: `Error deleting application: ${allApplications[i]}`,
                    reason: error
                });
            }
        }
    }

    if (copyApplications.length) {
        for (let i = 0; i < copyApplications.length; i++) {
            try {
                await models.Application.create(copyApplications[i]);
            } catch (error) {
                errors.push({
                    error: `Error creating application:  ${allApplications[i]}`,
                    reason: error
                });
            }
        }
    }
    if (errors.length) {
        return {
            error: 'Error updating some applications',
            reason: errors
        }
    }
    return {
        ok: 'Success',
        applications: newApplications
    }
}