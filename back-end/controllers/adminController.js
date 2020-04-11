const sequelize = require('sequelize');
const fs = require('fs');
const puppeteer = require('puppeteer');
const parse = require('csv-parse');
const models = require('../models');
const { updateStudentHighSchool } = require('./studentController');

let collegeFile = `${__dirname}/../assets/colleges.txt`;
if (process.env.NODE_ENV === 'test') {
    collegeFile = `${__dirname}/../tests/testData/colleges.txt`;
}
const colleges = fs.readFileSync(collegeFile).toString().split(/\r?\n/); // colleges.txt file into string array

// eslint-disable-next-line import/no-dynamic-require
const config = require(`${__dirname}/../config/config.json`).development;
const rankingsURL = config.RANKING_URL;
const collegeDataURL = config.COLLEGEDATA_URL;

exports.checkAdmin = async (username) => {
    let admin = {};
    try {
        admin = await models.User.findAll({
            limit: 1,
            raw: true,
            where: {
                username: username,
                isAdmin: true,
            },
        });
    } catch (error) {
        return false;
    }
    if (!admin.length) {
        return false;
    }

    return true;
};

exports.scrapeCollegeRankings = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
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
    const errors = [];
    for (let i = 0; i < colleges.length; i += 1) {
        /* eslint-disable no-await-in-loop */
        const rankingEl = await page.$x(`//tr[contains(., '${colleges[i]}')]/td[1]`);
        const ranking = await page.evaluate((el) => el.textContent, rankingEl[0]);
        /* eslint-enable no-await-in-loop */
        updates.push(models.College.upsert({
            Name: colleges[i],
            Ranking: ranking.replace('=', ''),
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

    if (errors.length) {
        return { error: 'Error Scraping College Rankings', reason: errors };
    }
    return { ok: 'Successfully scraped college rankings' };
};

// Scrapes CollegeData.com for Cost of Attendance, Completion Rate, GPA, SAT and ACT scores
exports.scrapeCollegeData = async () => {
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

    const errors = [];
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < colleges.length; i += 1) {
        // removes all special chars and replaces spaces with -
        const collegeStr = colleges[i].replace(/The\s/g, '').replace(/[^A-Z0-9]+/ig, ' ').replace(/\s/g, '-').replace('SUNY', 'State-University-of-New-York');
        const collegeURL = collegeDataURL + collegeStr;
        await page.goto(collegeURL);

        // Finds elements that contain the data value
        const completionRateEl = await page.$x('//dt[contains(., \'Students Graduating Within 4 Years\')]//following-sibling::dd[1]');
        const costOfAttendanceEl = await page.$x('//dt[contains(., \'Cost of Attendance\')]//following-sibling::dd[1]');
        const gpaEl = await page.$x('//dt[contains(., \'Average GPA\')]//following-sibling::dd[1]');
        const satMathEl = await page.$x('//dt[contains(., \'SAT Math\')]//following-sibling::dd[1]');
        const satEbrwEl = await page.$x('//dt[contains(., \'SAT EBRW\')]//following-sibling::dd[1]');
        const actCompositeEl = await page.$x('//dt[contains(., \'ACT Composite\')]//following-sibling::dd[1]');

        const completionRateFull = await page.evaluate((el) => el.textContent, completionRateEl[0]);
        let completionRate = null;
        if (completionRateFull === 'Not reported') completionRate = null;
        else completionRate = parseFloat(completionRateFull.substring(0, completionRateFull.indexOf('%')));

        let costOfAttendance = await page.evaluate((el) => el.textContent, costOfAttendanceEl[0]);
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

        let gpa = await page.evaluate((el) => el.textContent, gpaEl[0]);
        if (gpa.includes('Not reported')) gpa = null;

        const satMathFull = await page.evaluate((el) => el.textContent, satMathEl[0]);
        let satMathNums = null;
        let satMath = null;
        if (satMathFull.includes('Not reported')) satMath = null;
        else if (satMathFull.includes('average')) {
            satMath = satMathFull.substring(0, satMathFull.indexOf('average')).trim();
        } else {
            satMathNums = satMathFull.substring(0, satMathFull.indexOf('range')).split('-');
            satMath = (parseInt(satMathNums[0], 10) + parseInt(satMathNums[1], 10)) / 2.0;
        }

        const satEbrwFull = await page.evaluate((el) => el.textContent, satEbrwEl[0]);
        let satEbrwhNums = null;
        let satEbrw = null;
        if (satEbrwFull.includes('Not reported')) satEbrw = null;
        else if (satEbrwFull.includes('average')) {
            satEbrw = satEbrwFull.substring(0, satEbrwFull.indexOf('average')).trim();
        } else {
            satEbrwhNums = satEbrwFull.substring(0, satEbrwFull.indexOf('range')).split('-');
            satEbrw = (parseInt(satEbrwhNums[0], 10) + parseInt(satEbrwhNums[1], 10)) / 2.0;
        }

        const actCompositeFull = await page.evaluate((el) => el.textContent, actCompositeEl[0]);
        let actCompositeNums = null;
        let actComposite = null;
        if (actCompositeFull.includes('Not reported')) actComposite = null;
        else if (actCompositeFull.includes('average')) {
            actComposite = actCompositeFull.substring(0, actCompositeFull.indexOf('average')).trim();
        } else {
            actCompositeNums = actCompositeFull.substring(0, actCompositeFull.indexOf('range')).split('-');
            actComposite = (parseInt(actCompositeNums[0], 10) + parseInt(actCompositeNums[1], 10)) / 2.0; // eslint-disable-line max-len
        }

        const majorEls = await page.$x('(//div[contains(., \'Undergraduate Majors\')])[last()]//ul');
        let preMajors = [];
        for (let j = 0; j < majorEls.length; j += 1) {
            const listChildren = await page.evaluate((el) => el.textContent, majorEls[j]);
            preMajors = preMajors.concat(listChildren.trim().split('\n'));
        }
        const majors = preMajors.map((m) => m.trim());
        const collegeObject = {
            Name: colleges[i],
            CompletionRate: completionRate,
            CostOfAttendanceInState: costOfAttendanceInState,
            CostOfAttendanceOutOfState: costOfAttendanceOutOfState,
            GPA: gpa,
            SATMath: satMath,
            SATEBRW: satEbrw,
            ACTComposite: actComposite,
        };


        while (Object.keys(collegeObject).length > 1) {
            try {
                await models.College.upsert(collegeObject);
                break;
            } catch (error) {
                if (error instanceof sequelize.ValidationError) {
                    delete collegeObject[error.errors[0].path];
                } else {
                    errors.push({
                        error: `Unable to add ${colleges[i]}`,
                        reason: error,
                    });
                    break;
                }
            }
        }
        try {
            const addedCollege = await models.College.findOne({ where: { Name: colleges[i] } });
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
                    errors.push({ error: `Something went wrong in ${colleges[i]} adding ${major}`, reason: error });
                }
            });
        } catch (error) {
            errors.push({
                error: `Unable to add ${colleges[i]}`,
                reason: error,
            });
        }
    }
    /* eslint-enable no-await-in-loop */

    if (errors.length) {
        return {
            error: 'Error scraping colleges',
            reason: errors,
        };
    }

    await page.close();
    await browser.close();
    return { ok: 'Success. Able to scrape all colleges in file.' };
};

exports.importCollegeScorecard = async () => {
    const errors = [];
    const csvData = [];
    await new Promise(((resolve, reject) => {
        fs.createReadStream('./assets/collegeScorecard.csv')
            .pipe(parse({ delimiter: ',', columns: true }))
            .on('data', (csvRow) => {
                const collegeStr = csvRow.INSTNM.replace('-Bloomington', ' Bloomington').replace('-Amherst', ' Amherst').replace('The University', 'University').replace(' Saint ', ' St ')
                    .replace('Franklin and Marshall', 'Franklin & Marshall')
                    .replace('-', ', ');
                if (colleges.includes(collegeStr)) {
                    const college = collegeStr;
                    const admissionRate = csvRow.ADM_RATE !== 'NULL' ? csvRow.ADM_RATE * 100 : null;
                    const instiType = csvRow.CONTROL;
                    const studentDebt = csvRow.GRAD_DEBT_MDN;
                    const location = csvRow.STABBR;
                    const size = csvRow.UG !== 'NULL' ? csvRow.UG : csvRow.UGDS;
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

exports.deleteAllStudents = async () => {
    try {
        await models.User.destroy({
            where: { isAdmin: false },
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
        let studentFile = `${__dirname}/../assets/students-100.csv`;
        if (process.env.NODE_ENV === 'test') {
            studentFile = `${__dirname}/../tests/testData/students-1.csv`;
        }
        fs.createReadStream(studentFile)
            .on('error', (error) => {
                console.log(error.message);
            })
            .pipe(parse({ delimiter: ',', columns: true, trim: true }))
            .on('data', async (row) => {
                // create the user object
                const user = {
                    username: row.userid,
                    password: row.password,
                    GPA: row.GPA,
                    residenceState: row.residence_state,
                    collegeClass: row.college_class,
                    major1: row.major_1,
                    major2: row.major_2,
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
                    HighSchoolCity: row.high_school_city,
                    HighSchoolState: row.high_school_state,
                };

                // change empty string to null values
                Object.keys(user).forEach((key) => { if (user[key] === '') { user[key] = null; } });

                // remove high school properties with empty string values
                Object.keys(highSchool).forEach((key) => { if (highSchool[key] === '') { delete highSchool[key]; } });

                users.push({
                    user: user,
                    highSchool: highSchool,
                });
                console.log(user);
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
                // create the user
                const student = await models.User.create(user);
                
                const result = await updateStudentHighSchool(student, highSchool);
                if (result.ok) {
                    student.HighSchool = result.highSchool;
                } else {
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
                        error: `Error in creating ${user.username}: Username is not unique`,
                        reason: error.message,
                    });
                    break;
                } else {
                    // other error of adding in user
                    errors.push({
                        error: `Error in creating ${user.username}: ${error.message} ${user.name}`,
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
        ok: 'Success',
    };
};

exports.importApplications = async () => {
    const errors = [];
    const applications = [];
    await new Promise(((resolve) => {
        let applicationFile = `${__dirname}/../assets/applications-1.csv`;
        if (process.env.NODE_ENV === 'test') {
            applicationFile = `${__dirname}/../tests/testData/applications-1.csv`;
        }
        fs.createReadStream(applicationFile)
            .on('error', (error) => {
                errors.push({
                    error: error.message,
                    reason: error,
                });
            })
            .pipe(parse({ delimiter: ',', columns: true }))
            .on('data', async (row) => {
                const application = {
                    collegeName: row.college,
                    username: row.userid,
                    status: row.status.replace('-', ''),
                };
                applications.push(application);
            })
            .on('end', () => {
                resolve(applications);
            });
    }));
    /* eslint-disable no-await-in-loop */
    for (let appIndex = 0; appIndex < applications.length; appIndex += 1) {
        try {
            const college = await models.College.findOne({
                where: { Name: applications[appIndex].collegeName },
                raw: true,
            });
            if (college !== null) {
                applications[appIndex].college = college.CollegeId;
                await models.Application.create(applications[appIndex]);
            } else {
                errors.push({
                    error: `Error in creating app for ${applications[appIndex].collegeName}: no matching college in database`,
                });
            }
        } catch (error) {
            errors.push({
                error: `Error in creating app for ${applications[appIndex].collegeName}: ${error.message} ${error.name}`,
                reason: error,
            });
        }
    }
    /* eslint-enable no-await-in-loop */
    if (errors.length) {
        return {
            error: 'Error importing applications',
            reason: errors,
        };
    }
    return {
        ok: 'Success',
    };
};
