const models = require('../models');
const fs = require('fs');
const puppeteer = require('puppeteer');

let colleges = fs.readFileSync('./utils/colleges.txt').toString().split('\r\n'); // colleges.txt file into string array
const rankingsURL = 'https://www.timeshighereducation.com/rankings/united-states/2020#!/page/0/length/-1/sort_by/rank/sort_order/asc/cols/stats';

exports.getAdmin = async (username) => {
    let admin = {};
    try {
        admin = await models.User.findAll({
            limit: 1,
            raw: true,
            where: {
                username: username,
                isAdmin: true
            }
        });
    } catch (error) {
        return {
            error: 'Invalid admin',
            reason: error
        };
    }
    if (!admin.length) {
        return {
            error: 'User not found',
            reason: 'User does not exist in DB'
        }
    }

    return {
        ok: 'Success',
        admin: admin[0]
    }
}

exports.scrapeCollegeRankings = async() => {
    let newCollege = {};

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(rankingsURL);

    for(let college of colleges) {
        let rankingEl = await page.$x(`//tr[contains(., '${college}')]/td[1]`);
        ranking = await page.evaluate(el => el.textContent, rankingEl[0]);
        try {
            newCollege = await models.College.upsert({
                Name: college,
                Ranking: ranking,
                CollegeId: 0
            });
        } catch(error) {
            console.log(error);
            return {
                error: 'Something went wrong',
                reason: error
            };
        }
    }

    return { ok: 'Success' };
}