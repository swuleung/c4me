const sequelize = require('sequelize');
const puppeteer = require('puppeteer');
const { getPathConfig } = require('../utils/readAppFiles');
const models = require('../models');

exports.getHighSchoolById = async (highSchoolId) => {
    let highSchool = {};
    try {
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

exports.getHighSchoolByName = async (highSchoolName) => {
    let highSchool = {};
    try {
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

exports.getAllHighSchools = async () => {
    let highSchools = [];
    try {
        highSchools = await models.HighSchool.findAll({
            raw: true,
        });
    } catch (error) {
        return {
            error: 'Error fetching high schools',
            reason: error,
        };
    }
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

exports.scrapeHighSchoolData = async (highSchoolName, highSchoolCity, highSchoolState) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });

    const nicheURL = getPathConfig().NICHE_URL;
    const nicheHSURL = `${nicheURL}${highSchoolName.replace('&', 'and').replace(/[^A-Za-z0-9_ ]/g, '').replace('and', '-and-')}-${highSchoolCity}-${highSchoolState}/academics/`.replace(/\s+/g, '-').toLowerCase();
    console.log(nicheHSURL);

    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    await page.goto(nicheHSURL);
    const nicheAcademicScoreEl = await page.$x('//div[contains(@class, \'niche__grade--section\')]');
    const nicheAcademicScore = await page.evaluate((el) => el.textContent, nicheAcademicScoreEl[0]);

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

    const highSchoolObject = {
        Name: highSchoolName,
        HighSchoolCity: highSchoolCity,
        HighSchoolState: highSchoolState,
        NicheAcademicScore: nicheAcademicScore,
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
