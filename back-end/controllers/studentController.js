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

    console.log(student[0]);
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
    console.log(newApplications);
    for (let i = 0; i < newApplications.length; i++) {
        let applications = [];
        console.log(newApplications[i]);
        try {
            applications = await models.Application.findAll({
                // TODO CHANGE THE SEARCH PARAMETER TO USERNAME, COLLEGE
                where: {
                    ApplicationId: newApplications[i].CollegeId,
                    username: username
                }
            });
        } catch (error) {
            return {
                error: 'Invalid application',
                reason: error
            };
        }
        if (!applications.length) {
            return {
                error: 'Application not found',
                reason: 'Application does not exist in DB'
            }
        }
        try {
            await applications[0].update(newApplications[i]);
        } catch (error) {
            return {
                error: 'Error updating application',
                reason: error
            }
        }
    }
    return {
        ok: 'Success',
        applications: newApplications
    }
}