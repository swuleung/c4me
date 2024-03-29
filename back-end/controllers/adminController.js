const sequelize = require('sequelize');
const fs = require('fs');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const parse = require('csv-parse');
const models = require('../models');
const { getCollegeList, getPathConfig } = require('../utils/readAppFiles');
const { updateStudentHighSchool, calcQuestionableApplication } = require('./studentController');
const { getAllColleges } = require('./collegeController');

/**
 * Check if a user is an admin with a DB call
 * @param {string} username
 */
exports.checkAdmin = async (username) => {
    let admin = {};
    try {
        // IsAdmin is true
        admin = await models.User.findAll({
            limit: 1,
            raw: true,
            where: {
                Username: username,
                IsAdmin: true,
            },
        });
    } catch (error) {
        return false;
    }

    // if admin user is not found, it is not an admin
    if (!admin.length) {
        return false;
    }

    return true;
};

/**
 * Scrapes college rankings from WSJ/THE.
 * Every error is compiled into a `errors` list but will return 200.
 */
exports.scrapeCollegeRankings = async () => {
    const errors = [];
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 926 });
        // read from path in paths.json
        const rankingsURL = getPathConfig().RANKING_URL;
        await page.goto(rankingsURL);

        // Request interception to block css and images to speed up scraping
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font' || req.resourceType() === 'image') {
                req.abort();
            } else {
                req.continue();
            }
        });

        const updates = [];
        const colleges = getCollegeList();
        // for each college in colleges.txt scrape the ranking and update the database
        for (let i = 0; i < colleges.length; i += 1) {
        /* eslint-disable no-await-in-loop */
            const rankingEl = await page.$x(`//tr[contains(., '${colleges[i]}')]/td[1]`);
            const ranking = await page.evaluate((el) => el.textContent, rankingEl[0]);

            let calculatedRanking = ranking.replace('=', '').replace('>', '');
            // check if there is a hyphen in ranking
            if (calculatedRanking.indexOf('-') !== -1) {
                const splittedRanking = calculatedRanking.split('-');
                calculatedRanking = (parseInt(splittedRanking[0], 10)
                + parseInt(splittedRanking[1], 10)) / 2;
            }
            calculatedRanking = parseInt(calculatedRanking, 10);
            /* eslint-enable no-await-in-loop */
            // updates the rankings for college and add to the updates
            updates.push(models.College.upsert({
                Name: colleges[i],
                Ranking: calculatedRanking,
            }).catch((error) => {
                errors.push({
                    error: 'Something went wrong',
                    reason: error,
                });
            }));
        }
        await Promise.all(updates).catch((err) => {
            errors.push(err);
        });
        await page.close();
        await browser.close();
    } catch (error) {
        return {
            error: 'Unable to scrape college rankings',
            reason: error,
        };
    }

    if (errors.length) {
        return { error: 'Error Scraping College Rankings', reason: errors };
    }
    return { ok: 'Successfully scraped college rankings' };
};

const scrapeCollegeFields = async (cheer, name) => {
    const errors = [];
    const $ = cheer;
    const completionRateFull = $('#profile-overview > div:nth-child(8) > div > dl > dd:nth-child(8)').text();
    let costOfAttendance = $('#profile-overview > div:nth-child(5) > div > dl > dd:nth-child(2)').text();
    let gpa = $('#profile-overview > div:nth-child(4) > div > dl:nth-child(4) > dd:nth-child(2)').text();
    const satMathFull = $('#profile-overview > div:nth-child(4) > div > dl:nth-child(4) > dd:nth-child(4)').text();
    const satEbrwFull = $('#profile-overview > div:nth-child(4) > div > dl:nth-child(4) > dd:nth-child(6)').text();
    const actCompositeFull = $('#profile-overview > div:nth-child(4) > div > dl:nth-child(4) > dd:nth-child(8)').text();

    let completionRate = null;
    if (completionRateFull === 'Not reported') completionRate = null;
    else completionRate = parseFloat(completionRateFull.substring(0, completionRateFull.indexOf('%')));

    // takes the text value of element and determines the cost of attendance
    // eslint-disable-next-line max-len
    let costOfAttendanceInState = null;
    let costOfAttendanceOutOfState = null;
    if (costOfAttendance === 'Not available') costOfAttendance = null;
    else if (costOfAttendance.includes('In-state') || costOfAttendance.includes('Out-of-state')) {
        costOfAttendanceInState = costOfAttendance.substring(0, costOfAttendance.indexOf('Out')).replace(/[^0-9]/g, '');
        costOfAttendanceOutOfState = costOfAttendance.substring(costOfAttendance.indexOf('Out')).replace(/[^0-9]/g, '');
    } else {
        const attendanceCost = costOfAttendance.replace(/[^0-9]/g, '');
        costOfAttendanceInState = attendanceCost;
        costOfAttendanceOutOfState = attendanceCost;
    }

    // takes the text value of element and determines the gpa
    if (gpa.includes('Not reported')) gpa = null;

    // takes the text value of element and determines the sat math
    let satMathNums = null;
    let satMath = null;
    if (satMathFull.includes('Not reported')) satMath = null;
    else if (satMathFull.includes('average')) {
        satMath = satMathFull.substring(0, satMathFull.indexOf('average')).trim();
    } else {
        satMathNums = satMathFull.substring(0, satMathFull.indexOf('range')).split('-');
        satMath = (parseInt(satMathNums[0], 10) + parseInt(satMathNums[1], 10)) / 2.0;
    }

    // takes the text value of element and determines the sat ebrw
    let satEbrwhNums = null;
    let satEbrw = null;
    if (satEbrwFull.includes('Not reported')) satEbrw = null;
    else if (satEbrwFull.includes('average')) {
        satEbrw = satEbrwFull.substring(0, satEbrwFull.indexOf('average')).trim();
    } else {
        satEbrwhNums = satEbrwFull.substring(0, satEbrwFull.indexOf('range')).split('-');
        satEbrw = (parseInt(satEbrwhNums[0], 10) + parseInt(satEbrwhNums[1], 10)) / 2.0;
    }

    // takes the text value of element and determines the act composite
    let actCompositeNums = null;
    let actComposite = null;
    if (actCompositeFull.includes('Not reported')) actComposite = null;
    else if (actCompositeFull.includes('average')) {
        actComposite = actCompositeFull.substring(0, actCompositeFull.indexOf('average')).trim();
    } else {
        actCompositeNums = actCompositeFull.substring(0, actCompositeFull.indexOf('range')).split('-');
        actComposite = (parseInt(actCompositeNums[0], 10) + parseInt(actCompositeNums[1], 10)) / 2.0; // eslint-disable-line max-len
    }

    // create the college object
    const collegeObject = {
        Name: name,
        CompletionRate: completionRate,
        CostOfAttendanceInState: costOfAttendanceInState,
        CostOfAttendanceOutOfState: costOfAttendanceOutOfState,
        GPA: gpa,
        SATMath: satMath,
        SATEBRW: satEbrw,
        ACTComposite: actComposite,
    };

    // updates the college model data without errors
    while (Object.keys(collegeObject).length > 1) {
        try {
            // eslint-disable-next-line no-await-in-loop
            await models.College.upsert(collegeObject);
            break;
        } catch (error) {
            if (error instanceof sequelize.ValidationError) {
                delete collegeObject[error.errors[0].path];
            } else {
                errors.push({
                    error: `Unable to add ${name}`,
                    reason: error,
                });
                break;
            }
        }
    }
    if (errors.length) {
        return errors;
    }
    return null;
};

const scrapeCollegeMajors = async (cheer, name) => {
    const errors = [];
    const $ = cheer;
    // find elements containing majors
    const preMajors = [];
    $('.card-body:contains(\'Undergraduate Education\') .list--nice li').each((idx, el) => {
        const major = $(el).text();
        preMajors.push(major);
    });

    const majors = preMajors.map((m) => m.trim());

    try {
        // finds the added college to add majors
        const addedCollege = await models.College.findOne({ where: { Name: name } });
        majors.forEach(async (major) => {
            try {
                await models.Major.upsert({
                    Major: major,
                }, {
                    logging: false,
                });
                const addedMajor = await models.Major.findOne({
                    where: { Major: major }, logging: false,
                });
                await addedCollege.addMajor(addedMajor, { logging: false });
            } catch (error) {
                errors.push({ error: `Something went wrong in ${name} adding ${major}`, reason: error });
            }
        });
    } catch (error) {
        errors.push({
            error: `Unable to add ${name}`,
            reason: error,
        });
    }
    if (errors.length) {
        return errors;
    }
    return null;
};

/**
 * Scrapes CollegeData.com for Cost of Attendance, Completion Rate, GPA, SAT and ACT scores
 * Every error is compiled into a `errors` list but will return 200.
 */
exports.scrapeCollegeData = async () => {
    let errors = [];
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 926 });

        // Request interception to block css and images to speed up scraping
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font' || req.resourceType() === 'image') {
                req.abort();
            } else {
                req.continue();
            }
        });

        const colleges = getCollegeList();
        // read from path in paths.json
        const collegeDataURL = getPathConfig().COLLEGEDATA_URL;
        /* eslint-disable no-await-in-loop */
        // for each college in colleges.txt scrape college data and update the database
        const updates = [];
        for (let i = 0; i < colleges.length; i += 1) {
            // removes all special chars and replaces spaces with -
            const collegeStr = colleges[i].replace(/The\s/g, '').replace(/[^A-Z0-9]+/ig, ' ').replace(/\s/g, '-').replace('SUNY', 'State-University-of-New-York');
            const collegeURL = collegeDataURL + collegeStr;
            await models.College.upsert({ Name: colleges[i] });

            await page.goto(collegeURL);
            let content = await page.content();
            let $ = cheerio.load(content);
            updates.push(scrapeCollegeFields($, colleges[i]));

            // Go academics tab to retrieve majors
            await page.goto(`${collegeURL}/?tab=profile-academics-tab`);
            content = await page.content();
            $ = cheerio.load(content);
            updates.push(scrapeCollegeMajors($, colleges[i]));
        }
        await Promise.all(updates).then((results) => {
            errors = results.filter((r) => r);
        });
        // close browser and pages since there is no more need
        await page.close();
        await browser.close();
    } catch (error) {
        return {
            error: 'Unable to scrape data',
            reason: error,
        };
    }
    /* eslint-enable no-await-in-loop */

    if (errors.length) {
        return {
            error: 'Error scraping colleges',
            reason: errors,
        };
    }

    return { ok: 'Success. Able to scrape all colleges in file.' };
};

/**
 * Import admission rate, institution type, student debt, location, and size from CSV File.
 * Every error is compiled into a `errors` list but will return 200.
 */
exports.importCollegeScorecard = async () => {
    const errors = [];
    const csvData = [];
    const colleges = getCollegeList();
    const paths = getPathConfig();
    // read from path in paths.json
    const collegeScorecardPath = `${__dirname}/${paths.ASSETS}/${paths.COLLEGE_SCORECARD}`;

    await new Promise(((resolve, reject) => {
        fs.createReadStream(collegeScorecardPath)
            .pipe(parse({ delimiter: ',', columns: true }))
            .on('data', (csvRow) => {
                // fixes any issues with the college name in the csv vs. colleges.txt
                const collegeStr = csvRow.INSTNM.replace('-Bloomington', ' Bloomington').replace('-Amherst', ' Amherst').replace('The University', 'University').replace(' Saint ', ' St ')
                    .replace('Franklin and Marshall', 'Franklin & Marshall')
                    .replace('-', ', ');
                // if colleges.txt has the current row in the csv
                if (colleges.includes(collegeStr)) {
                    const college = collegeStr;
                    const admissionRate = csvRow.ADM_RATE !== 'NULL' ? csvRow.ADM_RATE * 100 : null;
                    const instiType = csvRow.CONTROL;
                    const studentDebt = csvRow.GRAD_DEBT_MDN;
                    const location = csvRow.STABBR;
                    const size = csvRow.UG !== 'NULL' ? csvRow.UG : csvRow.UGDS;
                    // adds the college object to the data
                    csvData.push({
                        Name: college,
                        AdmissionRate: admissionRate,
                        InstitutionType: instiType,
                        StudentDebt: studentDebt,
                        Location: location,
                        Size: size,
                    });
                }
            })
            .on('end', () => {
                resolve(csvData);
            })
            .on('error', reject);
    }));

    /* eslint-disable no-await-in-loop */
    // for each college, try to add it
    for (let row = 0; row < csvData.length; row += 1) {
        while (Object.keys(csvData[row]).length > 1) {
            try {
                await models.College.upsert(csvData[row]);
                break;
            } catch (error) {
                if (error instanceof sequelize.ValidationError) {
                    delete csvData[row][error.errors[0].path];
                } else {
                    errors.push({
                        error: `Unable to add ${csvData[row].Name}`,
                        reason: error,
                    });
                    break;
                }
            }
        }
    }
    /* eslint-enable no-await-in-loop */

    if (errors.length) {
        return {
            error: 'Error importing colleges',
            reason: errors,
        };
    }

    return { ok: 'Success. Able to scrape all colleges in file.' };
};


/**
 * Deletes all the student profiles and associated applications from the database.
 */
exports.deleteAllStudents = async () => {
    try {
        await models.User.destroy({
            where: { IsAdmin: false },
            cascade: true,
        });
        return { ok: 'All Students Deleted' };
    } catch (error) {
        return {
            error: 'Something wrong in deleteAllStudents',
            reason: error,
        };
    }
};

/**
 * Import student data from CSV File.
 * Every error is compiled into a `errors` list but will return 200.
 */
exports.importStudents = async () => {
    const errors = [];
    const users = [];

    // read the csv file
    await new Promise(((resolve) => {
        const paths = getPathConfig();
        const studentFile = `${__dirname}/${paths.ASSETS}/${paths.IMPORT_STUDENTS}`;
        fs.createReadStream(studentFile)
            .on('error', (error) => {
                console.log(error.message);
            })
            .pipe(parse({ delimiter: ',', columns: true, trim: true }))
            .on('data', async (row) => {
                // create the user object
                const user = {
                    Username: row.userid,
                    Password: row.password,
                    GPA: row.GPA,
                    ResidenceState: row.residence_state,
                    CollegeClass: row.college_class,
                    Major1: row.major_1,
                    Major2: row.major_2,
                    SATMath: row.SAT_math,
                    SATEBRW: row.SAT_EBRW,
                    ACTEnglish: row.ACT_English,
                    ACTMath: row.ACT_math,
                    ACTReading: row.ACT_reading,
                    ACTScience: row.ACT_science,
                    ACTComposite: row.ACT_composite,
                    SATLit: row.SAT_literature,
                    SATUs: row.SAT_US_hist,
                    SATWorld: row.SAT_world_hist,
                    SATMathI: row.SAT_math_I,
                    SATMathII: row.SAT_math_II,
                    SATEco: row.SAT_eco_bio,
                    SATMol: row.SAT_mol_bio,
                    SATChem: row.SAT_chemistry,
                    SATPhys: row.SAT_physics,
                    APPassed: row.num_AP_passed,
                };

                // create the high school object
                const highSchool = {
                    Name: row.high_school_name,
                    City: row.high_school_city,
                    State: row.high_school_state,
                };

                // change empty string to null values
                Object.keys(user).forEach((key) => { if (user[key] === '') { user[key] = null; } });

                // remove high school properties with empty string values
                Object.keys(highSchool).forEach((key) => { if (highSchool[key] === '') { delete highSchool[key]; } });

                users.push({
                    user: user,
                    highSchool: highSchool,
                });
            })
            .on('end', () => {
                resolve(users);
            });
    }));

    /* eslint-disable no-await-in-loop */

    // loop through each user from file & create it
    for (let userIndex = 0; userIndex < users.length; userIndex += 1) {
        const { user } = users[userIndex];
        const { highSchool } = users[userIndex];
        while (Object.keys(user).length > 1) {
            try {
                const student = await models.User.create(user);

                const result = await updateStudentHighSchool(student, highSchool);
                if (!result.ok) {
                    errors.push(result);
                }
                break;
            } catch (error) {
                // check errors to see if it's invaliid
                // invalid fields are removed and this is re-run
                if (error instanceof sequelize.ValidationError
                    && !(error instanceof sequelize.UniqueConstraintError)) {
                    delete user[error.errors[0].path];
                } else if (error instanceof sequelize.UniqueConstraintError) {
                    // not unique username error
                    errors.push({
                        error: `Error in creating ${user.Username}: Username is not unique`,
                        reason: error.message,
                    });
                    break;
                } else {
                    // other error of adding in user
                    errors.push({
                        error: `Error in creating ${user.Username}: ${error.message}`,
                        reason: error,
                    });
                    break;
                }
            }
        }
    }
    /* eslint-enable no-await-in-loop */

    // if there were any errors, report it
    if (errors.length) {
        return {
            error: 'Error importing students',
            reason: errors,
        };
    }

    // no errors
    return {
        ok: 'Successessfully imported students',
    };
};

/**
 * Import application data from CSV File.
 * Every error is compiled into a `errors` list but will return 200.
 */
exports.importApplications = async () => {
    const errors = [];
    const applications = [];
    await new Promise(((resolve) => {
        const paths = getPathConfig();
        // read from path in paths.json
        const applicationFile = `${__dirname}/${paths.ASSETS}/${paths.IMPORT_APPLICATIONS}`;
        fs.createReadStream(applicationFile)
            .on('error', (error) => {
                errors.push({
                    error: error.message,
                    reason: error,
                });
            })
            .pipe(parse({ delimiter: ',', columns: true }))
            .on('data', async (row) => {
                // set up the application object
                const application = {
                    Name: row.college,
                    Username: row.userid,
                    Status: row.status.replace('-', ''),
                };
                applications.push(application);
            })
            .on('end', () => {
                resolve(applications);
            });
    }));
    /* eslint-disable no-await-in-loop */
    const colleges = {};
    const collegeList = (await getAllColleges()).colleges;

    if (collegeList) {
        for (let i = 0; i < collegeList.length; i += 1) {
            colleges[collegeList[i].Name] = collegeList[i].CollegeId;
        }
    } else {
        return {
            error: 'Error importing applications',
            reason: 'No colleges in database',
        };
    }

    // for each application, try to add it
    for (let appIndex = 0; appIndex < applications.length; appIndex += 1) {
        try {
            // find the college
            const collegeId = colleges[applications[appIndex].Name];
            if (collegeId !== null) {
                if (applications[appIndex].Status === 'accepted'
                || applications[appIndex].Status === 'denied') {
                    // eslint-disable-next-line max-len
                    const isQuestionable = await calcQuestionableApplication(applications[appIndex]);
                    applications[appIndex].IsQuestionable = isQuestionable;
                }
                // add the application
                applications[appIndex].CollegeId = collegeId;
                await models.Application.create(applications[appIndex]);
            } else {
                errors.push({
                    error: `Error in creating app for ${applications[appIndex].CollegeId}: no matching college in database`,
                });
            }
        } catch (error) {
            errors.push({
                error: `Error in creating app for ${applications[appIndex].Name} for ${applications[appIndex].Username} with status ${applications[appIndex].Status}: ${error.name}`,
                reason: error.message,
            });
        }
    }
    /* eslint-enable no-await-in-loop */
    if (errors.length) {
        return {
            error: 'Error importing some applications',
            reason: errors,
        };
    }
    return {
        ok: 'Successfully imported applications',
    };
};


/**
 * Gets all the questionable applications with their college information
 */
exports.getQuestionableApplications = async () => {
    let qApps = {};
    try {
        qApps = await models.User.findAll({
            include: [{
                model: models.College,
                required: true,
                through: {
                    where: {
                        IsQuestionable: true,
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
                attributes: ['CollegeId', 'Name'],
            }],
            attributes: ['Username'],
        });
    } catch (error) {
        return {
            error: error,
            reason: error.message,
        };
    }

    return {
        ok: 'Successfully got questionable apps',
        applications: qApps,
    };
};

/**
 * Update a list of applications
 * @param {[Application]} applications List of applications to be updated
 */
exports.updateApplications = async (applications) => {
    const errors = [];
    const updates = [];
    for (let i = 0; i < applications.length; i += 1) {
        updates.push(models.Application.update(
            {
                IsQuestionable: false,
            },
            {
                where: applications[i],
            },
        ).catch(
            // eslint-disable-next-line no-loop-func
            (error) => {
                errors.push({
                    error: `Error updating application: ${applications[i]}`,
                    reason: error,
                });
            },
        ));
    }
    await Promise.all(updates).catch((error) => errors.push(`Error in processing application changes ${error.message}`));
    if (errors.length) {
        return {
            error: 'Error updating some applications',
            reason: errors,
        };
    }

    return {
        ok: 'Successfully update all applications',
    };
};
