const models = require('../models');

exports.getStudent = async (username) => {
    let student = {};
    try {
        student = await models.User.findAll({
            limit: 1,
            where: {
                username,
                isAdmin: false,
            },
        });
    } catch (error) {
        return {
            error: 'Invalid student',
            reason: error,
        };
    }
    if (!student.length) {
        return {
            error: 'User not found',
            reason: 'User does not exist in DB',
        };
    }
    return {
        ok: 'Success',
        student: student[0].toJSON(),
    };
};

exports.updateStudent = async (username, newStudent) => {
    let student = [];
    try {
        student = await models.User.findAll({
            where: {
                username,
                isAdmin: false,
            },
        });
    } catch (error) {
        return {
            error: 'Invalid student',
            reason: error,
        };
    }
    if (!student.length) {
        return {
            error: 'User not found',
            reason: 'User does not exist in DB',
        };
    }
    try {
        await student[0].update(newStudent);
    } catch (error) {
        return {
            error: 'Error updating student',
            reason: error,
        };
    }
    return {
        ok: 'Success',
        student: student[0],
    };
};

exports.getStudentApplications = async (username) => {
    let applications = {};
    try {
        applications = await models.Application.findAll({
            raw: true,
            where: {
                username,
            },
        });
    } catch (error) {
        return {
            error: 'Invalid student',
            reason: error,
        };
    }
    return {
        ok: 'Success',
        applications,
    };
};

exports.updateStudentApplications = async (username, newApplications) => {
    const copyApplications = [...newApplications];
    const allApplications = await models.Application.findAll({
        where: {
            username,
        },
    });
    const errors = [];
    const changes = [];
    for (let i = 0; i < allApplications.length; i += 1) {
        // eslint-disable-line max-len
        const found = copyApplications.findIndex((app) => parseInt(app.college, 10) === allApplications[i].dataValues.college); // eslint-disable-line max-len
        if (found > -1) {
            changes.push(allApplications[i].update(copyApplications[found].college).catch(
                (error) => {
                    errors.push({
                        error: `Error updating application: ${allApplications[i]}`,
                        reason: error,
                    });
                },
            ));
            copyApplications.splice(found, 1);
        } else {
            changes.push(allApplications[i].destroy().catch((error) => {
                errors.push({
                    error: `Error deleting application: ${allApplications[i]}`,
                    reason: error,
                });
            }));
        }
    }
    /* eslint-enable no-await-in-loop */

    if (copyApplications.length) {
        for (let i = 0; i < copyApplications.length; i += 1) {
            changes.push(models.Application.create(copyApplications[i]).catch((error) => {
                errors.push({
                    error: `Error creating application:  ${allApplications[i]}`,
                    reason: error,
                });
            }));
        }
    }
    await Promise.all(changes).catch((error) => errors.push(`Error in processing application changes ${error.message}`));
    if (errors.length) {
        return {
            error: 'Error updating some applications',
            reason: errors,
        };
    }
    return {
        ok: 'Success',
        applications: newApplications,
    };
};
