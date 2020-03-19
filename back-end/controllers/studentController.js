const sequelize = require('sequelize');
const models = require('../models');
const bcrypt = require('bcrypt');
const authentication = require('../utils/auth');

exports.getStudent = async (username) => {
    let student = {};
    try {
        student = await models.Student.findAll({
            limit: 1,
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
    if (!student.length) {
        return {
            error: 'User not found',
            reason: 'User does not exist in DB'
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