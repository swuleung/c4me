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
    const nicheHSURL = `${nicheURL}${highSchoolName.replace('&', 'and').replace(/[^A-Za-z0-9_ ]/g, '').replace('and', '-and-')}-${highSchoolCity}-${highSchoolState}/academics/`.replace(/\s+/g, '-').toLowerCase();
    console.log(nicheHSURL);

    // sets the user agent for puppeteer
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    await page.goto(nicheHSURL);

    // finds elements for data values and takes the text values
    const nicheAcademicScoreEl = await page.$x('//div[contains(@class, \'niche__grade--section\')]');
    const nicheAcademicScore = await page.evaluate((el) => el.textContent, nicheAcademicScoreEl[0]);

    const graduationRateEl =  await page.$x('//div[contains(., \'Average Graduation Rate\')]/following-sibling::div[@class=\'scalar__value\']');
    const graduationRate = parseInt(await page.evaluate((el) => el.textContent, graduationRateEl[0]), 10);

    const averageSATEl = await page.$x('//div[contains(., \'Average SAT\')]/div[@class=\'scalar__value\']/text()[1]');
    const averageSAT = await page.evaluate((el) => el.textContent, averageSATEl[0]);
    const SATMathEl = await page.$x('//div[contains(., \'Average SAT\')]/div[contains(., \'Math\')]/div[@class=\'scalar__value\']');
    const SATMath = await page.evaluate((el) => el.textContent, SATMathEl[0]);
    const SATEBRWEl = await page.$x('//div[contains(., \'Average SAT\')]/div[contains(., \'Verbal\')]/div[@class=\'scalar__value\']');
    const SATEBRW = await page.evaluate((el) => el.textContent, SATEBRWEl[0]);

    const averageACTEl = await page.$x('//div[contains(., \'Average ACT\')]/div[@class=\'scalar__value\']/text()[1]');
    const averageACT = await page.evaluate((el) => el.textContent, averageACTEl[0]);
    const ACTMathEl = await page.$x('//div[contains(., \'Average ACT\')]/div[contains(., \'Math\')]/div[@class=\'scalar__value\']');
    const ACTMath = await page.evaluate((el) => el.textContent, ACTMathEl[0]);
    const ACTReadingEl = await page.$x('//div[contains(., \'Average ACT\')]/div[contains(., \'Reading\')]/div[@class=\'scalar__value\']');
    const ACTReading = await page.evaluate((el) => el.textContent, ACTReadingEl[0]);
    const ACTEnglishEl = await page.$x('//div[contains(., \'Average ACT\')]/div[contains(., \'English\')]/div[@class=\'scalar__value\']');
    const ACTEnglish = await page.evaluate((el) => el.textContent, ACTEnglishEl[0]);
    const ACTScienceEl = await page.$x('//div[contains(., \'Average ACT\')]/div[contains(., \'Science\')]/div[@class=\'scalar__value\']');
    const ACTScience = await page.evaluate((el) => el.textContent, ACTScienceEl[0]);

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
