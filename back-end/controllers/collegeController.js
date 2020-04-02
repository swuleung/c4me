const models = require('../models');

exports.getCollegeByID = async (collegeID) => {
    let college = {};
    try {
        college = await models.College.findAll({
            limit: 1,
            where: {
                CollegeId: collegeID,
            },
        });
    } catch (error) {
        return {
            error: 'Invalid college',
            reason: error,
        };
    }
    if (!college.length) {
        return {
            error: 'College not found',
            reason: 'College does not exist in DB',
        };
    }
    return {
        ok: 'Success',
        college: college[0].toJSON(),
    };
};

exports.getCollegeByName = async (collegeName) => {
    let college = {};
    try {
        college = await models.College.findAll({
            limit: 1,
            where: {
                Name: collegeName,
            },
        });
    } catch (error) {
        return {
            error: 'Error finding college',
            reason: error,
        };
    }
    if (!college.length) {
        return {
            error: 'College not found',
            reason: 'College does not exist in DB',
        };
    }
    return {
        ok: 'Success',
        college: college[0].toJSON(),
    };
};

exports.getAllColleges = async () => {
    let colleges = [];
    try {
        colleges = await models.College.findAll({
            raw: true,
        });
    } catch (error) {
        return {
            error: 'Error fetching colleges',
            reason: error,
        };
    }
    if (!colleges.length) {
        return {
            error: 'No colleges in the db',
            reason: 'No collegs in the db',
        };
    }
    return {
        ok: 'Success',
        colleges: colleges,
    };
};

exports.deleteAllColleges = async () => {
    try {
        models.College.destroy({
            where: {},
        });
    } catch (error) {
        return {
            error: 'Unable to delete all colleges',
            reason: error,
        };
    }

    return {
        ok: 'Deleted colleges successfully',
    };
};
