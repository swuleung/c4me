const models = require('../models');
const { scrapeHighSchoolData } = require('./highschoolController');
const { getCollegeByID, getCollegeByName, getMajorsByCollegeID } = require('./collegeController');
const {
    northeastRegion, southRegion, midwestRegion, westRegion, ACTtoSAT,
} = require('./sharedControllerVars');

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
                Username: username,
                IsAdmin: false,
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
                Username: username,
                IsAdmin: false,
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
    if (student.HighSchoolId && Object.keys(highSchool).length === 0) {
        try {
            // update the student with new high school id
            await student.update({ HighSchoolId: null });
        } catch (error) {
            return {
                error: 'Unable to remove high school from student',
                reason: error,
            };
        }
        return {
            ok: 'Success',
            highSchool: null,
        };
    } else if (!(highSchool.Name && highSchool.City && highSchool.State)) {
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
        const casedHS = { ...highSchool };
        // fix string to uppercase each word
        casedHS.Name = casedHS.Name.toLowerCase().split(' ').map((s) => {
            if (s !== 'and' && s !== 'of') return s.charAt(0).toUpperCase() + s.substring(1);
            return s;
        }).join(' ');
        casedHS.City = casedHS.City.toLowerCase().split(' ').map((s) => {
            if (s !== 'and' && s !== 'of') return s.charAt(0).toUpperCase() + s.substring(1);
            return s;
        }).join(' ');

        try {
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
            await scrapeHighSchoolData(
                casedHS.Name,
                casedHS.City,
                casedHS.State,
            );
        } catch (error) {
            return {
                error: `Unable to scrape data for ${highSchool.Name}-${highSchool.City}, ${highSchool.State}`,
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
                Username: username,
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
            Username: username,
        },
    });
    const errors = [];
    const changes = [];
    // loop through the current applications and compare with new applications
    for (let i = 0; i < allApplications.length; i += 1) {
        // eslint-disable-line max-len
        const found = copyApplications.findIndex((app) => parseInt(app.CollegeId, 10) === allApplications[i].dataValues.CollegeId); // eslint-disable-line max-len

        // if the application is found, update it
        if (found > -1) {
            const newApp = copyApplications[found];
            if (newApp.Status !== allApplications[i].dataValues.Status && (newApp.Status === 'accepted' || newApp.Status === 'denied')) {
                // eslint-disable-next-line no-await-in-loop, max-len
                copyApplications[found].IsQuestionable = await this.calcQuestionableApplication(copyApplications[found]);
            } else if (newApp.Status !== 'accepted' && newApp.Status !== 'denied') {
                copyApplications[found].IsQuestionable = false;
            }

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
            if (copyApplications[i].Status === 'accepted' || copyApplications[i].Status === 'denied') {
                // eslint-disable-next-line no-await-in-loop, max-len
                copyApplications[i].IsQuestionable = await this.calcQuestionableApplication(copyApplications[i]);
            } else if (copyApplications[i].Status !== 'accepted' && copyApplications[i].Status !== 'denied') {
                copyApplications[i].IsQuestionable = false;
            }

            changes.push(models.Application.create(copyApplications[i]).catch((error) => {
                errors.push({
                    error: `Error creating application:  ${copyApplications[i]}`,
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

/**
 * Calculates the similarity points based on deviation from student's high school values
 * @param {integer} base initial similarity point value
 * @param {int/float} studentValue the current value for the student
 * @param {int/float} collegeValue the other college value to compare with
 * @param {int/float} deviation the amount difference
 * @param {int/float} deduction similarity points to deduct
 */
exports.calculateCredibilityPoints = (base, studentValue, collegeValue, deviation, deduction) => {
    // if the other high school's value is within deviation value of student's high school
    if (studentValue >= collegeValue) {
        return base;
    }
    return Math.max(base
        - Math.ceil(Math.abs((studentValue - collegeValue) / deviation) / deduction),
    0);
};

/**
 * Calculates the questionable factor of a decision
 * based on the student and college data
 * @param {json} application
 */
exports.calcQuestionableApplication = async (app) => {
    let thisCollege = null;
    // get the college either by ID or by Name
    if (app.CollegeId) thisCollege = (await getCollegeByID(app.CollegeId)).college;
    if (app.Name) thisCollege = (await getCollegeByName(app.Name)).college;
    if (!thisCollege) return true;

    const thisStudent = (await this.getStudent(app.Username)).student;
    if (!thisStudent) return true;

    let qScore = 0;

    const totalSATcollege = (thisCollege.SATMath + thisCollege.SATEBRW);
    let totalSATstudent = (thisStudent.SATMath + thisStudent.SATEBRW);
    if (!totalSATstudent && thisStudent.ACTComposite) {
        totalSATstudent = ACTtoSAT[thisStudent.ACTComposite];
    }
    // college SAT
    if (totalSATcollege !== 0) {
        qScore += this.calculateCredibilityPoints(10, totalSATstudent, totalSATcollege, 50, 1);
    } else if (thisCollege.ACTComposite) {
        // no college SAT but ACT
        qScore += this.calculateCredibilityPoints(10,
            totalSATstudent,
            ACTtoSAT[thisCollege.ACTComposite],
            50, 1);
    }

    // college ACT
    if (thisCollege.ACTComposite) {
        if (!thisStudent.ACTComposite) {
            qScore += this.calculateCredibilityPoints(10,
                totalSATstudent,
                ACTtoSAT[thisCollege.ACTComposite],
                50, 1);
        } else {
            qScore += this.calculateCredibilityPoints(10,
                thisStudent.ACTComposite,
                thisCollege.ACTComposite,
                2, 1);
        }
    } else if (totalSATcollege !== 0) {
        // no college ACT but SAT
        if (!thisStudent.ACTComposite) {
            qScore += this.calculateCredibilityPoints(10,
                totalSATstudent,
                ACTtoSAT[thisCollege.ACTComposite],
                50, 1);
        } else {
            qScore += this.calculateCredibilityPoints(10,
                ACTtoSAT[thisStudent.ACTComposite],
                totalSATcollege,
                50, 1);
        }
    }

    // college doesnt have information at all
    if (totalSATcollege === 0 && !thisCollege.ACTComposite) {
        qScore += 20;
    }

    // Relevant Majors - 5
    const { majors } = (await getMajorsByCollegeID(thisCollege.CollegeId));
    if (thisStudent.Major1 && thisStudent.Major2) {
        // eslint-disable-next-line max-len
        if (majors.find((m) => m.Major.toLowerCase().includes(thisStudent.Major1.toLowerCase()))) { qScore += 5; }
        // eslint-disable-next-line max-len
        if (majors.find((m) => m.Major.toLowerCase().includes(thisStudent.Major2.toLowerCase()))) { qScore += 5; }
    } else if (thisStudent.Major1) {
        // eslint-disable-next-line max-len
        if (majors.find((m) => m.Major.toLowerCase().includes(thisStudent.Major1.toLowerCase()))) { qScore += 10; }
    } else if (thisStudent.Major2) {
        // eslint-disable-next-line max-len
        if (majors.find((m) => m.Major.toLowerCase().includes(thisStudent.Major2.toLowerCase()))) { qScore += 10; }
    }

    // GPA - 10
    qScore += this.calculateCredibilityPoints(10, thisStudent.GPA, thisCollege.GPA, 0.05, 1);

    // ResidenceState - 5 for state match & 2.5 for region match
    const studentState = thisStudent.ResidenceState;
    const collegeState = thisCollege.Location;


    let locationCheck = 0;
    // if they are in a public school, add points
    if (thisCollege.InstitutionType === '1') {
        locationCheck = 5;
        if (studentState === collegeState) {
            qScore += 5;
        }
    }

    // determine questionable status & update accordingly
    let threshold = qScore / (45 + locationCheck);
    threshold = (app.Status === 'denied') ? (1 - threshold) : threshold;

    if (threshold < 0.65) {
        return true;
    }
    return false;
};
