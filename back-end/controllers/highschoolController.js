const sequelize = require('sequelize');
const puppeteer = require('puppeteer');
const { getPathConfig } = require('../utils/readAppFiles');
const models = require('../models');

/**
 * Get a high school's information using its id
 * @param {integer} highSchoolId
 */
exports.getHighSchoolById = async (highSchoolId) => {
    let highSchool = {};
    try {
        // find with highSchoolId
        highSchool = await models.HighSchool.findAll({
            limit: 1,
            where: {
                HighSchoolId: highSchoolId,
            },
        });
    } catch (error) {
        return {
            error: 'Invalid high school',
            reason: error,
        };
    }
    // no high schools found (length === 0)
    if (!highSchool.length) {
        return {
            error: 'High school not found',
            reason: 'High school does not exist in DB',
        };
    }
    return {
        ok: 'Success',
        highSchool: highSchool[0].toJSON(),
    };
};


/**
 * Get a high school's information using its name
 * @param {string} highSchoolName
 */
exports.getHighSchoolByName = async (highSchoolName) => {
    let highSchool = {};
    try {
        // find with high school name
        highSchool = await models.HighSchool.findAll({
            limit: 1,
            where: {
                Name: highSchoolName,
            },
        });
    } catch (error) {
        return {
            error: 'Error finding high school',
            reason: error,
        };
    }
    // no high schools found (length === 0)
    if (!highSchool.length) {
        return {
            error: 'High school not found',
            reason: 'High school does not exist in DB',
        };
    }
    return {
        ok: 'Success',
        highSchool: highSchool[0].toJSON(),
    };
};

/**
 * Get all high schools within the database
 */
exports.getAllHighSchools = async () => {
    let highSchools = [];
    try {
        // find all high schools
        highSchools = await models.HighSchool.findAll({
            raw: true,
        });
    } catch (error) {
        return {
            error: 'Error fetching high schools',
            reason: error,
        };
    }
    // no high schools found (length === 0)
    if (!highSchools.length) {
        return {
            error: 'No high schools in the db',
            reason: 'No high schools in the db',
        };
    }
    return {
        ok: 'Success',
        highSchools: highSchools,
    };
};

/**
 * Delete all the high schools within the database
 */
exports.deleteAllHighSchools = async () => {
    try {
        models.HighSchool.destroy({
            where: {},
        });
    } catch (error) {
        return {
            error: 'Unable to delete all high schools',
            reason: error,
        };
    }

    return {
        ok: 'Deleted high schools successfully',
    };
};

/**
 * Scrapes Niche.com for high school data
 * Every error is compiled into a `errors` list but will return 200.
 * @param {string} highSchoolName
 * @param {string} highSchoolCity
 * @param {string} highSchoolState
 */
exports.scrapeHighSchoolData = async (highSchoolName, highSchoolCity, highSchoolState) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });

    // read from path in paths.json
    const nicheURL = getPathConfig().NICHE_URL;
    // takes inputted high school data and creates url
    const nicheHSURL = `${nicheURL}${highSchoolName.replace('&', '-and-').replace(/[^A-Za-z0-9_\- ]/g, '')}-${highSchoolCity}-${highSchoolState}/academics/`.replace(/\s+/g, '-').toLowerCase();
    console.log(nicheHSURL);

    // sets the user agent for puppeteer
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    await page.goto(nicheHSURL);

    // finds elements for data values and takes the text values
    const nicheAcademicScoreEl = await page.$x('//div[contains(@class, \'niche__grade--section\')]');
    const nicheAcademicScore = nicheAcademicScoreEl.length
        ? await page.evaluate((el) => el.textContent, nicheAcademicScoreEl[0])
        : null;
    const graduationRateEl = await page.$x('//div[contains(., \'Average Graduation Rate\')]/following-sibling::div[@class=\'scalar__value\']');
    const graduationRate = graduationRateEl.length
        ? parseInt(await page.evaluate((el) => el.textContent, graduationRateEl[0]), 10)
        : null;
    const averageSATEl = await page.$x('//div[contains(., \'Average SAT\')]/div[@class=\'scalar__value\']/text()[1]');
    const averageSAT = averageSATEl.length
        ? await page.evaluate((el) => el.textContent, averageSATEl[0])
        : null;
    const SATMathEl = await page.$x('//div[contains(., \'Average SAT\')]/div[contains(., \'Math\')]/div[@class=\'scalar__value\']');
    const SATMath = SATMathEl.length
        ? await page.evaluate((el) => el.textContent, SATMathEl[0])
        : null;
    const SATEBRWEl = await page.$x('//div[contains(., \'Average SAT\')]/div[contains(., \'Verbal\')]/div[@class=\'scalar__value\']');
    const SATEBRW = SATEBRWEl.length
        ? await page.evaluate((el) => el.textContent, SATEBRWEl[0])
        : null;
    const averageACTEl = await page.$x('//div[contains(., \'Average ACT\')]/div[@class=\'scalar__value\']/text()[1]');
    const averageACT = averageACTEl.length
        ? await page.evaluate((el) => el.textContent, averageACTEl[0])
        : null;
    const ACTMathEl = await page.$x('//div[contains(., \'Average ACT\')]/div[contains(., \'Math\')]/div[@class=\'scalar__value\']');
    const ACTMath = ACTMathEl.length
        ? await page.evaluate((el) => el.textContent, ACTMathEl[0])
        : null;
    const ACTReadingEl = await page.$x('//div[contains(., \'Average ACT\')]/div[contains(., \'Reading\')]/div[@class=\'scalar__value\']');
    const ACTReading = ACTReadingEl.length
        ? await page.evaluate((el) => el.textContent, ACTReadingEl[0])
        : null;
    const ACTEnglishEl = await page.$x('//div[contains(., \'Average ACT\')]/div[contains(., \'English\')]/div[@class=\'scalar__value\']');
    const ACTEnglish = ACTEnglishEl.length
        ? await page.evaluate((el) => el.textContent, ACTEnglishEl[0])
        : null;
    const ACTScienceEl = await page.$x('//div[contains(., \'Average ACT\')]/div[contains(., \'Science\')]/div[@class=\'scalar__value\']');
    const ACTScience = ACTScienceEl.length
        ? await page.evaluate((el) => el.textContent, ACTScienceEl[0])
        : null;

    // creates the high school object
    const highSchoolObject = {
        Name: highSchoolName,
        HighSchoolCity: highSchoolCity,
        HighSchoolState: highSchoolState,
        NicheAcademicScore: nicheAcademicScore,
        GraduationRate: graduationRate,
        AverageSAT: averageSAT,
        SATMath: SATMath,
        SATEBRW: SATEBRW,
        AverageACT: averageACT,
        ACTMath: ACTMath,
        ACTReading: ACTReading,
        ACTEnglish: ACTEnglish,
        ACTScience: ACTScience,
    };

    const errors = [];
    // updates the high school model data without errors
    while (Object.keys(highSchoolObject).length > 1) {
        try {
            // eslint-disable-next-line no-await-in-loop
            await models.HighSchool.upsert(highSchoolObject);
            break;
        } catch (error) {
            if (error instanceof sequelize.ValidationError) {
                delete highSchoolObject[error.errors[0].path];
            } else {
                console.log(error);
                errors.push({
                    error: `Unable to add ${highSchoolName}`,
                    reason: error,
                });
                break;
            }
        }
    }

    if (errors.length) {
        return {
            error: 'Error scraping high school',
            reason: errors,
        };
    }

    await page.close();
    await browser.close();
    return { ok: `Success. Able to scrape ${highSchoolName} data.` };
};

/**
 * Finds the value(min/max) that closest to the given value
 * @param {float} min
 * @param {float} max
 * @param {float} value
 */
exports.findCloserValue = (min, max, value) => {
    const upper = Math.abs(max - value);
    const lower = Math.abs(min - value);
    if (upper < lower) {
        return upper;
    }
    return lower;
};

/**
 * Calculates the similarity points based on deviation from student's high school values
 * @param {integer} base initial similarity point value
 * @param {float} studentHSValue
 * @param {float} otherHSValue
 * @param {float} deviation
 * @param {float} deduction
 */
exports.calculateSimilarityPoints = (base, studentHSValue, otherHSValue, deviation, deduction) => {
    // if the other high school's value is within deviation value of student's high school
    if (otherHSValue >= studentHSValue - deviation && otherHSValue <= studentHSValue + deviation) {
        return base;
    }
    // finds the closer value to the other high school to increment
    const value = this.findCloserValue(
        studentHSValue - deviation,
        studentHSValue + deviation,
        otherHSValue,
    );
    // every increment of deviation from the closer value, 1 similarity point deducted
    return Math.max(base - Math.ceil(Math.abs((value - otherHSValue) / deviation) / deduction), 0);
};

/**
 * Returns list of high schools sorted by similarity points
 * @param {string} username
 */
exports.findSimilarHS = async (username) => {
    let highSchools;
    const student = await models.User.findOne({
        where: {
            username: username,
            isAdmin: false,
        },
        include: [{
            model: models.HighSchool,
        }],
    });
    if (!student.HighSchool) {
        return {
            error: 'No high school in student profile',
            reason: 'No high school in student profile',
        };
    }
    const studentHS = student.HighSchool;
    const result = await this.getAllHighSchools();
    if (result.ok) {
        highSchools = result.highSchools;
    } else {
        return result;
    }
    // stores numerical value of letter grades
    const grades = {};
    grades['A+'] = 0;
    grades.A = 1;
    grades['A-'] = 2;
    grades['B+'] = 3;
    grades.B = 4;
    grades['B-'] = 5;
    grades['C+'] = 6;
    grades.C = 7;
    grades['C-'] = 8;
    grades['D+'] = 9;
    grades.D = 10;
    grades['D-'] = 11;

    // conversion for act score to sat score
    const ACTtoSAT = {};
    ACTtoSAT[9] = 590;
    ACTtoSAT[10] = 630;
    ACTtoSAT[11] = 670;
    ACTtoSAT[12] = 710;
    ACTtoSAT[13] = 760;
    ACTtoSAT[14] = 800;
    ACTtoSAT[15] = 850;
    ACTtoSAT[16] = 890;
    ACTtoSAT[17] = 930;
    ACTtoSAT[18] = 970;
    ACTtoSAT[19] = 1010;
    ACTtoSAT[20] = 1040;
    ACTtoSAT[21] = 1080;
    ACTtoSAT[22] = 1110;
    ACTtoSAT[23] = 1140;
    ACTtoSAT[24] = 1180;
    ACTtoSAT[25] = 1210;
    ACTtoSAT[26] = 1240;
    ACTtoSAT[27] = 1280;
    ACTtoSAT[28] = 1310;
    ACTtoSAT[29] = 1340;
    ACTtoSAT[30] = 1370;
    ACTtoSAT[31] = 1400;
    ACTtoSAT[32] = 1430;
    ACTtoSAT[33] = 1460;
    ACTtoSAT[34] = 1500;
    ACTtoSAT[35] = 1540;
    ACTtoSAT[36] = 1590;

    // get students of high school of given student
    // eslint-disable-next-line no-await-in-loop
    const students = await models.User.findAll({
        include: [{
            model: models.HighSchool,
            where: { HighSchoolId: studentHS.HighSchoolId },
        }],
    });

    // loops through all high schools and give similarity points
    for (let i = 0; i < highSchools.length; i += 1) {
        const highSchool = highSchools[i];
        if (studentHS.Name !== highSchool.Name
            && studentHS.HighSchoolCity !== highSchool.HighSchoolCity
            && studentHS.HighSchoolState !== highSchool.HighSchoolState) {
            let similarityPoints = 0;
            if (studentHS.NicheAcademicScore && highSchool.NicheAcademicScore) {
                if (studentHS.NicheAcademicScore === highSchool.NicheAcademicScore) {
                    similarityPoints += 12;
                } else {
                    // if the scores are different find the difference in the grade values
                    const difference = Math.abs(grades[studentHS.NicheAcademicScore]
                        - grades[highSchool.NicheAcademicScore]);
                    similarityPoints += (12 - difference);
                }
            }
            if (studentHS.GraduationRate && highSchool.GraduationRate) {
                let studentGR = studentHS.GraduationRate;
                // if the graduation rate is within 5% of student's high school
                if (highSchool.GraduationRate >= studentGR - 5
                    && highSchool.GraduationRate <= studentGR + 5) {
                    similarityPoints += 10;
                } else {
                    // finds the closer value to the other high school to increment
                    studentGR = this.findCloserValue(
                        studentGR - 5,
                        studentGR + 5,
                        highSchool.GraduationRate,
                    );
                    // every increment of 2% from the closer value, 1 similarity point deducted
                    similarityPoints += Math.max(
                        10 - Math.ceil(Math.abs(studentGR - highSchool.GraduationRate) / 2), 0,
                    );
                }
            }
            if (studentHS.AverageSAT && highSchool.AverageSAT) {
                similarityPoints += this.calculateSimilarityPoints(
                    10, studentHS.AverageSAT, highSchool.AverageSAT, 50, 1,
                );
            }
            if (studentHS.SATMath && highSchool.SATMath) {
                similarityPoints += this.calculateSimilarityPoints(
                    2, studentHS.SATMath, highSchool.SATMath, 25, 0.5,
                );
            }
            if (studentHS.SATEBRW && highSchool.SATEBRW) {
                similarityPoints += this.calculateSimilarityPoints(
                    2, studentHS.SATEBRW, highSchool.SATEBRW, 25, 0.5,
                );
            }
            if (studentHS.AverageACT && highSchool.AverageACT) {
                similarityPoints += this.calculateSimilarityPoints(
                    10, studentHS.AverageACT, highSchool.AverageACT, 2, 1,
                );
            }
            if (studentHS.ACTMath && highSchool.ACTMath) {
                similarityPoints += this.calculateSimilarityPoints(
                    1, studentHS.ACTMath, highSchool.ACTMath, 2, 0.5,
                );
            }
            if (studentHS.ACTReading && highSchool.ACTReading) {
                similarityPoints += this.calculateSimilarityPoints(
                    1, studentHS.ACTReading, highSchool.ACTReading, 2, 0.5,
                );
            }
            if (studentHS.ACTEnglish && highSchool.ACTEnglish) {
                similarityPoints += this.calculateSimilarityPoints(
                    1, studentHS.ACTEnglish, highSchool.ACTEnglish, 2, 0.5,
                );
            }
            if (studentHS.ACTScience && highSchool.ACTScience) {
                similarityPoints += this.calculateSimilarityPoints(
                    1, studentHS.ACTScience, highSchool.ACTScience, 2, 0.5,
                );
            }
            // if one school has only SAT and the other has only ACT
            if (studentHS.AverageSAT && !studentHS.AverageACT
                && highSchool.AverageACT && !highSchool.AverageSAT) {
                // convert ACT score of other high school to SAT score
                const otherConvertedSAT = ACTtoSAT[highSchool.AverageACT];
                similarityPoints += this.calculateSimilarityPoints(
                    10, studentHS.AverageSAT, otherConvertedSAT, 50, 1,
                );
            }
            if (!studentHS.AverageSAT && studentHS.AverageACT
                && !highSchool.AverageACT && highSchool.AverageSAT) {
                // convert ACT score of student's high school to SAT score
                const studentConvertedSAT = ACTtoSAT[studentHS.AverageACT];
                similarityPoints += this.calculateSimilarityPoints(
                    10, studentConvertedSAT, highSchool.AverageSAT, 50, 1,
                );
            }
            // get all students of high school and find avg gpa
            // eslint-disable-next-line no-await-in-loop
            const otherStudents = await models.User.findAll({
                include: [{
                    model: models.HighSchool,
                    where: { HighSchoolId: highSchool.HighSchoolId },
                }],
            });
            if (students.length && otherStudents.length) {
                let sum = 0;
                let otherSum = 0;
                for (let j = 0; j < students.length; j += 1) {
                    sum += parseFloat(students[j].GPA);
                }
                for (let j = 0; j < otherStudents.length; j += 1) {
                    otherSum += parseFloat(otherStudents[j].GPA);
                }
                similarityPoints += this.calculateSimilarityPoints(
                    5, sum / students.length, otherSum / otherStudents.length, 0.05, 1,
                );
            }
            highSchool.similarityPoints = similarityPoints;
        } else {
            // removes student's high school from list
            highSchools.splice(i, 1);
            i -= 1;
        }
    }
    highSchools.sort((a, b) => b.similarityPoints - a.similarityPoints);
    return {
        ok: 'Success',
        highSchools: highSchools,
    };
};
