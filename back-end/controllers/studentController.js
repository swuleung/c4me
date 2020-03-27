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
    for (let i = 0; i < newApplications.length; i++) {
        try {
            models.Application.upsert({
                username: username,
                college: parseInt(newApplications[i].college),
                status:  newApplications[i].status
            });
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