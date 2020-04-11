const { Op } = require('sequelize');
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
            order: [
                ['Name', 'ASC'],
            ],
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

exports.getMajorsByCollegeID = async (collegeID) => {
    let majors = [];
    try {
        majors = await models.Major.findAll({
            attributes: ['MajorId', 'Major'],
            include: [{
                model: models.College,
                where: { CollegeId: collegeID },
                attributes: [],
            }],
            order: [
                ['Major', 'ASC'],
            ],
        });
    } catch (error) {
        return {
            error: 'Unable to get majors',
            reason: error,
        };
    }

    return {
        ok: 'Successfully got majors',
        majors: majors,
    };
};


/**
 * This computes the weights and averages
 * @param {*} applications
 * applications with user information for a college
 *
 */
const processApplications = (applications) => {
    const processedApplications = [];
    let averageGPA = 0;
    let countGPA = 0;
    let averageSATMath = 0;
    let countSATMath = 0;
    let averageSATEBRW = 0;
    let countSATEBRW = 0;
    let averageACTComposite = 0;
    let countACTComposite = 0;
    let averageWeight = 0;

    for (let i = 0; i < applications.length; i += 1) {
        const app = applications[i];
        let percent = 0;
        let weight = 0;

        if (app.GPA) {
            countGPA += 1;
            averageGPA += parseFloat(app.GPA);
        }

        if (app.SATLit) {
            percent += 5;
            weight += (app.SATLit / 800.0) * 5;
        }

        if (app.SATUs) {
            percent += 5;
            weight += (app.SATUs / 800.0) * 5;
        }

        if (app.SATWorld) {
            percent += 5;
            weight += (app.SATWorld / 800.0) * 5;
        }

        if (app.SATMathI) {
            percent += 5;
            weight += (app.SATMathI / 800.0) * 5;
        }

        if (app.SATMathII) {
            percent += 5;
            weight += (app.SATMathII / 800.0) * 5;
        }

        if (app.SATEco) {
            percent += 5;
            weight += (app.SATEco / 800.0) * 5;
        }

        if (app.SATMol) {
            percent += 5;
            weight += (app.SATMol / 800.0) * 5;
        }

        if (app.SATChem) {
            percent += 5;
            weight += (app.SATChem / 800.0) * 5;
        }
        if (app.SATPhys) {
            percent += 5;
            weight += (app.SATPhys / 800.0) * 5;
        }

        // mainTests are the SATEBRW, SATMath, and ACTComposite
        let mainTests = 0;
        if (app.ACTComposite) {
            countACTComposite += 1;
            averageACTComposite += app.ACTComposite;
            mainTests += 1;
        }
        if (app.SATMath) {
            countSATMath += 1;
            averageSATMath += app.SATMath;
            mainTests += 1;
        }
        if (app.SATEBRW) {
            countSATEBRW += 1;
            averageSATEBRW += app.SATEBRW;
            mainTests += 1;
        }

        if (mainTests) {
            weight += (app.ACTComposite / 36) * ((100 - percent) / mainTests);
            weight += (app.SATMath / 800) * ((100 - percent) / mainTests);
            weight += (app.SATEBRW / 800) * ((100 - percent) / mainTests);
        }
        const processedApp = app;
        processedApp.weight = weight;
        averageWeight += weight;
        processedApplications.push(processedApp);
    }
    if (countGPA) averageGPA /= countGPA;
    if (countSATMath) averageSATMath /= countSATMath;
    if (countSATEBRW) averageSATEBRW /= countSATEBRW;
    if (countACTComposite) averageACTComposite /= countACTComposite;
    if (applications.length) averageWeight /= applications.length;

    return {
        ok: 'Successfully got applications tracker data',
        applications: processedApplications,
        averages: {
            avgGPA: averageGPA.toFixed(2),
            avgSATMath: Math.round(averageSATMath),
            avgSATEBRW: Math.round(averageSATEBRW),
            avgACTComposite: Math.round(averageACTComposite),
            avgWeight: Math.round(averageWeight),
        },
    };
};

exports.getAcceptedApplicationsByCollegeID = async (collegeID) => {
    let applications = [];
    const applicationWhereClause = {
        isQuestionable: false,
        status: {
            [Op.eq]: 'accepted',
        },
    };

    const query = {
        where: { CollegeId: collegeID },
        include: [{
            model: models.User,
            through: {
                where: applicationWhereClause,
                attributes: { exclude: ['isQuestionable', 'createdAt', 'updatedAt'] },
            },
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt', 'APPassed', 'residenceState',
                    'highschoolCity', 'highschoolState', 'major1', 'major2'],
            },
        }],
    };
    try {
        applications = (await models.College.findOne(query));
    } catch (error) {
        return {
            error: 'Unable to get applications for applications tracker',
            reason: error.message,
        };
    }

    if (!applications) {
        return {
            ok: 'No accepted data for college',
            applications: [],
            averages: {},
        };
    }
    return processApplications(applications.toJSON().Users);
};

/**
 * This function is specifically used by the Applications tracker
 */
exports.getApplicationsByCollegeID = async (collegeID, filters) => {
    let applications = [];
    const userWhereClause = {};
    const applicationWhereClause = {
        isQuestionable: false,
    };
    const highSchoolWhereClause = {};

    let HighSchoolId = { [Op.or]: {} };
    let collegeClass = { [Op.or]: {} };
    let status = { [Op.or]: {} };

    // make the collegeClass filters optional if lax
    if (filters.lax) {
        collegeClass = {
            [Op.or]: { [Op.eq]: null },
        };
    }

    const includeHS = {
        model: models.HighSchool,
        attributes: [],
    };

    if (filters.highSchools) {
        if (filters.lax) {
            HighSchoolId = {
                [Op.or]: { [Op.eq]: null },
            };
            includeHS.required = false;
        }
        HighSchoolId[Op.or][Op.in] = filters.highSchools;
        highSchoolWhereClause.HighSchoolId = HighSchoolId;
        includeHS.where = highSchoolWhereClause;
    }

    if (filters.statuses) {
        if (filters.lax) {
            status = {
                [Op.or]: { [Op.eq]: null },
            };
        }
        status[Op.or][Op.in] = filters.statuses;
        applicationWhereClause.status = status;
    }

    if (filters.lowerCollegeClass) {
        collegeClass[Op.or][Op.and] = { [Op.gte]: filters.lowerCollegeClass };
    }
    if (filters.upperCollegeClass) {
        collegeClass[Op.or][Op.and] = { [Op.lte]: filters.upperCollegeClass };
    }
    if (filters.upperCollegeClass || filters.lowerCollegeClass) {
        userWhereClause.collegeClass = collegeClass;
    }

    const query = {
        where: { CollegeId: collegeID },
        include: [{
            model: models.User,
            through: {
                where: applicationWhereClause,
                attributes: { exclude: ['isQuestionable', 'createdAt', 'updatedAt'] },
            },
            where: userWhereClause,
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt', 'APPassed', 'residenceState',
                    'highschoolCity', 'highschoolState', 'major1', 'major2'],
            },
            include: [
                includeHS,
            ],
        }],
    };
    try {
        applications = await models.College.findOne(query);
    } catch (error) {
        return {
            error: 'Unable to get applications for applications tracker',
            reason: error.message,
        };
    }

    let acceptedApplications = null;
    try {
        acceptedApplications = await this.getAcceptedApplicationsByCollegeID(collegeID);
    } catch (error) {
        return {
            error: 'Unable to get applications for applications tracker',
            reason: error.message,
        };
    }

    const acceptedAverages = {
        avgAcceptedGPA: acceptedApplications.averages.avgGPA,
        avgAcceptedSATMath: acceptedApplications.averages.avgSATMath,
        avgAcceptedSATEBRW: acceptedApplications.averages.avgSATEBRW,
        avgAcceptedACTComposite: acceptedApplications.averages.avgACTComposite,
    };

    if (!applications) {
        return {
            ok: 'No data for college',
            applications: [],
            averages: { ...acceptedAverages },
        };
    }

    const processedFilteredApplications = processApplications(applications.toJSON().Users);
    // eslint-disable-next-line max-len
    processedFilteredApplications.averages = { ...processedFilteredApplications.averages, ...acceptedAverages };

    return processedFilteredApplications;
};
