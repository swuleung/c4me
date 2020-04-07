const models = require('../models');
const puppeteer = require('puppeteer');

const config = require(__dirname + '/../config/config.json')["development"];
const nicheURL = config.NICHE_URL;

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
        college: highSchool[0].toJSON(),
    };
};

exports.getHighSchoolByName = async (highSchoolName) => {
    let highSchool = {};
    try {
        highSchool = await models.HighSchool.findAll({
            limit: 1,
            where: {
                HighSchool: highSchoolName,
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
        college: highSchool[0].toJSON(),
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

exports.scrapeHighSchoolData = async(highSchoolName, highSchoolCity, highSchoolState) => {
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

    const nicheHSURL = `${nicheURL}${highSchoolName.replace(' ', '-')}-${highSchoolCity}-${highSchoolState}/`;
    const academicsURL = nicheHSURL + '/academics';

    await page.goto(academicsURL);
    const nicheAcademicScore = await page.$x('//div[contains(@class, \'niche__grade--section\')]');

    const averageSAT = await page.$x('//div[contains(., \'Average SAT\')]/div[@class=\'scalar__value\']/text()[1]');
    const SATMath = await page.$x('//div[contains(., \'Average SAT\')]/div[contains(., \'Math\')]/div[@class=\'scalar__value\']');
    const SATEBRW = await page.$x('//div[contains(., \'Average SAT\')]/div[contains(., \'Verbal\')]/div[@class=\'scalar__value\']');

    const averageACT = await page.$x('//div[contains(., \'Average ACT\')]/div[@class=\'scalar__value\']/text()[1]');
    const ACTMath = await page.$x('//div[contains(., \'Average ACT\')]/div[contains(., \'Math\')]/div[@class=\'scalar__value\']');
    const ACTReading = await page.$x('//div[contains(., \'Average SAT\')]/div[contains(., \'Reading\')]/div[@class=\'scalar__value\']');
    const ACTEnglish = await page.$x('//div[contains(., \'Average SAT\')]/div[contains(., \'English\')]/div[@class=\'scalar__value\']');
    const ACTScience = await page.$x('//div[contains(., \'Average SAT\')]/div[contains(., \'Science\')]/div[@class=\'scalar__value\']');

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
        ACTScience: ACTScience
    }

    const errors = [];
    while (Object.keys(highSchoolObject).length > 1) {
        try {
            await models.HighSchool.upsert(collegeObject);
            break;
        } catch (error) {
            if (error instanceof sequelize.ValidationError) {
                delete highSchoolObject[error.errors[0].path];
            } else {
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
}