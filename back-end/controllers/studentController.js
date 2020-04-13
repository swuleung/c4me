const models = require('../models');
const { scrapeHighSchoolData } = require('./highschoolController');

/**
 *  Get the student using sequelize
 * @param {string} username
 */
exports.getStudent = async (username) => {
    let student = {};
    try {
        // find the student including the high school information
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
    // student is null
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

/**
 *  Update the student with new information
 * @param {string} username
 * @param {Student} newStudent
 * @param {HighSchool} newHighSchool
 */
exports.updateStudent = async (username, newStudent, newHighSchool) => {
    let student = [];
    try {
        // find the student in database
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
    // student was not found
    if (!student.length) {
        return {
            error: 'User not found',
            reason: 'User does not exist in DB',
        };
    }
    // update the student details
    try {
        await student[0].update(newStudent);
    } catch (error) {
        return {
            error: 'Error updating student',
            reason: error,
        };
    }
    // if the high school is supplied
    if (newHighSchool) {
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
    }
    return {
        ok: 'Success',
        student: student[0],
    };
};

/**
 * Change a student's high school & scrape if it is new
 * @param {Student} student Sequelize instance
 * @param {HighSchool} highSchool Object with Name, City, and State
 */
exports.updateStudentHighSchool = async (student, highSchool) => {
    let newHighSchool = {};
    if (!(highSchool.Name && highSchool.HighSchoolCity && highSchool.HighSchoolState)) {
        return {
            ok: 'No high school provided',
            highSchool: null,
        };
    }

    try {
        // see if high school exists
        newHighSchool = await models.HighSchool.findOne({
            where: highSchool,
        });
    } catch (error) {
        return {
            error: 'Unable to query for high school',
            reason: error,
        };
    }
    // newHighSchool is null
    if (!newHighSchool) {
        try {
            const casedHS = { ...highSchool };
            // fix string
            casedHS.Name = casedHS.Name.toLowerCase().split(' ').map((s) => {
                if (s !== 'and' && s !== 'of') return s.charAt(0).toUpperCase() + s.substring(1);
                return s;
            }).join(' ');
            casedHS.HighSchoolCity = casedHS.HighSchoolCity.toLowerCase().split(' ').map((s) => {
                if (s !== 'and' && s !== 'of') return s.charAt(0).toUpperCase() + s.substring(1);
                return s;
            }).join(' ');

            // make a new high school
            newHighSchool = await models.HighSchool.create(casedHS);
        } catch (error) {
            return {
                error: 'Unable to create high school',
                reason: error,
            };
        }
        try {
            // scrape new high school
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
        // update the student with new high school id
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

/**
 * Get a student's applications
 * @param {string} username
 */
exports.getStudentApplications = async (username) => {
    let applications = {};
    try {
        // use the username in where clause to get all
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

/**
 * Update the students applications using the list
 * @param {string} username
 * @param {[Applications]} newApplications
 */
exports.updateStudentApplications = async (username, newApplications) => {
    // copy the applications to not change paramater in function
    const copyApplications = [...newApplications];
    // find the current applications in the db
    const allApplications = await models.Application.findAll({
        where: {
            username: username,
        },
    });
    const errors = [];
    const changes = [];
    // loop through the current applications and compare with new applications
    for (let i = 0; i < allApplications.length; i += 1) {
        // eslint-disable-line max-len
        const found = copyApplications.findIndex((app) => parseInt(app.college, 10) === allApplications[i].dataValues.college); // eslint-disable-line max-len

        // if the application is found, update it
        if (found > -1) {
            changes.push(allApplications[i].update(copyApplications[found]).catch(
                (error) => {
                    errors.push({
                        error: `Error updating application: ${allApplications[i]}`,
                        reason: error,
                    });
                },
            ));
            // remove it from the copy of applications
            copyApplications.splice(found, 1);
        } else {
            // if the application was not found, delete it
            changes.push(allApplications[i].destroy().catch((error) => {
                errors.push({
                    error: `Error deleting application: ${allApplications[i]}`,
                    reason: error,
                });
            }));
        }
    }
    // for all remaining new applications, create them
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
    // resolve all asynchronous calls
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
