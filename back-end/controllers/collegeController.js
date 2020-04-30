const { Op } = require('sequelize');
const models = require('../models');

/**
 * Get a college's information using its ID
 * @param {integer} collegeID
 */
exports.getCollegeByID = async (collegeID) => {
    let college = {};
    try {
        // find with collegeID
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
    // no colleges found (length === 0)
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

/**
 * Get a college's information with the collegeName
 * @param {string} collegeName
 */
exports.getCollegeByName = async (collegeName) => {
    let college = {};
    try {
        // find with college name
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
    // no college found (length === 0)
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

/**
 * Get all colleges within the database
 */
exports.getAllColleges = async () => {
    let colleges = [];
    try {
        // find all colleges and return with ascending order by name
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

    // empty database
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

/**
 * Delete all the colleges within the database
 */
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

/**
 * Get all the majors from a college using the college ID
 * @param {integer} collegeID
 */
exports.getMajorsByCollegeID = async (collegeID) => {
    let majors = [];
    try {
        // use major table to find all majors with collegeId
        majors = await models.Major.findAll({
            raw: true,
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
 * Process the applications to count averages from a college
 * Returns the applications with avereages and weight
 * @param {[Applications]} applications
 */
const processApplications = (applications) => {
    const processedApplications = [];

    // start the averages at 0
    let averageGPA = 0;
    let countGPA = 0;
    let averageSATMath = 0;
    let countSATMath = 0;
    let averageSATEBRW = 0;
    let countSATEBRW = 0;
    let averageACTComposite = 0;
    let countACTComposite = 0;
    let averageWeight = 0;

    // for each application, calculate the weight and add their #s to the average
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

        // 100percent - previous tests is dided equally in maintests
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

    // calculate averages
    // avoid 0 division with if statements
    if (countGPA) averageGPA /= countGPA;
    if (countSATMath) averageSATMath /= countSATMath;
    if (countSATEBRW) averageSATEBRW /= countSATEBRW;
    if (countACTComposite) averageACTComposite /= countACTComposite;
    if (applications.length) averageWeight /= applications.length;

    return {
        ok: 'Successfully got applications tracker data',
        applications: processedApplications,
        averages: {
            avgGPA: averageGPA.toFixed(2), // to 2 decimal places
            avgSATMath: Math.round(averageSATMath),
            avgSATEBRW: Math.round(averageSATEBRW),
            avgACTComposite: Math.round(averageACTComposite),
            avgWeight: Math.round(averageWeight),
        },
    };
};

/**
 *
 * @param {integer} collegeID ID of College to find applications by
 * @param {Filters} filters Filters object
 */
exports.getApplicationsWithFilter = async (collegeID, filters) => {
    let applications = [];
    // query parts
    const applicationWhereClause = {
        IsQuestionable: false,
    };
    const userWhereClause = {
    };
    let collegeClass = { [Op.or]: {} };
    let status = { [Op.or]: {} };
    const includeHS = {
        model: models.HighSchool,
        attributes: [],
    };

    // make the collegeClass filters optional if lax
    if (filters.lax) {
        collegeClass = {
            [Op.or]: { [Op.eq]: null },
        };
    }

    // if there is a list of high schools, try
    if (filters.highSchools) {
        // allow null if lax
        if (filters.lax) {
            userWhereClause.HighSchoolId = {
                [Op.or]: {
                    [Op.eq]: null,
                    [Op.in]: filters.highSchools,
                },
            };
        } else {
            userWhereClause.HighSchoolId = {
                [Op.in]: filters.highSchools,
            };
        }
    }

    // if there are statuses, add the list in
    if (filters.statuses) {
        // allow null if lax
        if (filters.lax) {
            status = {
                [Op.or]: { [Op.eq]: null },
            };
        }
        status[Op.or][Op.in] = filters.statuses;
        applicationWhereClause.Status = status;
    }

    // handle the collegeClasses
    if (filters.lowerCollegeClass && filters.upperCollegeClass) {
        collegeClass[Op.or][Op.between] = [filters.lowerCollegeClass, filters.upperCollegeClass];
        userWhereClause.CollegeClass = collegeClass;
    } else if (filters.lowerCollegeClass) {
        collegeClass[Op.or][Op.gte] = filters.lowerCollegeClass;
        userWhereClause.CollegeClass = collegeClass;
    } else if (filters.upperCollegeClass) {
        collegeClass[Op.or][Op.lte] = filters.upperCollegeClass;
        userWhereClause.CollegeClass = collegeClass;
    }

    // complete query
    const query = {
        where: { CollegeId: collegeID },
        include: [{
            model: models.User,
            through: {
                where: applicationWhereClause,
                attributes: { exclude: ['IsQuestionable', 'createdAt', 'updatedAt'] },
            },
            where: userWhereClause,
            attributes: {
                exclude: ['Password', 'createdAt', 'updatedAt', 'APPassed', 'ResidenceState',
                    'City', 'State'],
            },
            include: [
                includeHS,
            ],
        }],
    };

    // execute query
    try {
        applications = await models.College.findOne(query);
    } catch (error) {
        return {
            error: 'Unable to get applications for applications tracker',
            reason: error.message,
        };
    }
    return applications;
};

/**
 *
 * @param {integer} collegeID
 * @param {object} filters
 *    filters: {
 *       lowerCollegeClass: <integer>
 *       upperCollegeClass: <integer>
 *       statuses: ['accepted', ...]
 *       highSchools: [highSchoolId, ...]
 *       lax: <boolean>
 *    }
 * Each filter is optional
 */
exports.getApplicationsByCollegeID = async (collegeID, filters) => {
    // get the accepted applications with no filters for averages
    let acceptedApps = await getApplicationsWithFilter(collegeID, { statuses: ['accepted'] });
    let acceptedAverages = {};
    if (acceptedApps) {
        acceptedApps = processApplications(acceptedApps.toJSON().Users);
        acceptedAverages = {
            avgAcceptedGPA: acceptedApps.averages.avgGPA,
            avgAcceptedSATMath: acceptedApps.averages.avgSATMath,
            avgAcceptedSATEBRW: acceptedApps.averages.avgSATEBRW,
            avgAcceptedACTComposite: acceptedApps.averages.avgACTComposite,
        };
    }

    const applications = await getApplicationsWithFilter(collegeID, filters);
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
