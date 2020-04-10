const models = require('../models');
const { scrapeHighSchoolData } = require('./highschoolController');

exports.getStudent = async (username) => {
    let student = {};
    try {
        student = await models.User.findOne({
            where: {
                username: username,
                isAdmin: false,
            },
            include: [{
                model: models.HighSchool,
            }],
        });
    } catch (error) {
        return {
            error: 'Invalid student',
            reason: error,
        };
    }
    if (!student) {
        return {
            error: 'User not found',
            reason: 'User does not exist in DB',
        };
    }
    return {
        ok: 'Success',
        student: student.toJSON(),
    };
};

exports.updateStudent = async (username, newStudent, newHighSchool) => {
    let student = [];
    try {
        student = await models.User.findAll({
            where: {
                username: username,
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
    try {
        const result = await this.updateStudentHighSchool(student[0], newHighSchool);
        if (result.ok) {
            student[0].HighSchool = result.highSchool;
        } else {
            return result;
        }
    } catch (error) {
        return {
            error: `Error adding high school to ${username}`,
            reason: error,
        };
    }
    return {
        ok: 'Success',
        student: student[0],
    };
};

exports.updateStudentHighSchool = async (student, highSchool) => {
    let newHighSchool = {};
    try {
        newHighSchool = await models.HighSchool.findOne({
            where: highSchool,
        });
    } catch (error) {
        return {
            error: 'Unable to query for high school',
            reason: error,
        };
    }
    if (!newHighSchool) {
        try {
            newHighSchool = await models.HighSchool.create(highSchool);
        } catch (error) {
            return {
                error: 'Unable to create high school',
                reason: error,
            };
        }
        try {
            scrapeHighSchoolData(
                highSchool.Name,
                highSchool.HighSchoolCity,
                highSchool.HighSchoolState,
            );
        } catch (error) {
            return {
                error: `Unable to scrape data for ${highSchool.Name}-${highSchool.HighSchoolCity}, ${highSchool.HighSchoolState}`,
                reason: error,
            };
        }
    }
    try {
        await student.update({ HighSchoolId: newHighSchool.HighSchoolId });
    } catch (error) {
        return {
            error: 'Unable to add high school to student',
            reason: error,
        };
    }
    return {
        ok: 'Success',
        highSchool: newHighSchool,
    };
};

exports.getStudentApplications = async (username) => {
    let applications = {};
    try {
        applications = await models.Application.findAll({
            raw: true,
            where: {
                username: username,
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
        applications: applications,
    };
};

exports.updateStudentApplications = async (username, newApplications) => {
    const copyApplications = [...newApplications];
    const allApplications = await models.Application.findAll({
        where: {
            username: username,
        },
    });
    const errors = [];
    const changes = [];
    for (let i = 0; i < allApplications.length; i += 1) {
        // eslint-disable-line max-len
        const found = copyApplications.findIndex((app) => parseInt(app.college, 10) === allApplications[i].dataValues.college); // eslint-disable-line max-len
        if (found > -1) {
            changes.push(allApplications[i].update(copyApplications[found]).catch(
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
