const models = require('../models');
const fs = require('fs');
const puppeteer = require('puppeteer');

let colleges = fs.readFileSync('./utils/colleges.txt').toString().split('\r\n'); // colleges.txt file into string array
const rankingsURL = 'https://www.timeshighereducation.com/rankings/united-states/2020#!/page/0/length/-1/sort_by/rank/sort_order/asc/cols/stats';
const collegeDataURL = 'https://www.collegedata.com/college/';

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
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(rankingsURL);

    // Request interception to block css and images to speed up scraping
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if(req.resourceType() === 'stylesheet' || req.resourceType() === 'font' || req.resourceType() === 'image') {
            req.abort();
        } else {
            req.continue();
        }
    });

    for(let college of colleges) {
        let rankingEl = await page.$x(`//tr[contains(., '${college}')]/td[1]`);
        ranking = await page.evaluate(el => el.textContent, rankingEl[0]);
        try {
            await models.College.upsert({
                Name: college,
                Ranking: ranking
            });
        } catch(error) {
            await page.close();
            await browser.close();
            return {
                error: 'Something went wrong',
                reason: error
            };
        }
    }

    await page.close();
    await browser.close();
    return { ok: 'Success' };
}

// Scrapes CollegeData.com for Admission Rate, Size, Cost of Attendance
exports.scrapeCollegeData = async() => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });

    // Request interception to block css and images to speed up scraping
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if(req.resourceType() === 'stylesheet' || req.resourceType() === 'font' || req.resourceType() === 'image') {
            req.abort();
        } else {
            req.continue();
        }
    });

    for(let college of colleges) {
        // removes all special chars and replaces spaces with -
        let collegeStr = college.replace(/The\s/g, '').replace(/[^A-Z0-9]+/ig, ' ').replace(/\s/g, '-').replace('SUNY', 'State-University-of-New-York'); 
        let collegeURL = collegeDataURL + collegeStr;

        await page.goto(collegeURL);

        // Finds elements that contain the data value
        let admissionRateEl = await page.$x(`//dt[contains(.,'Overall Admission Rate')]/following-sibling::dd[1]`);
        let completionRateEl = await page.$x(`//dt[contains(., 'Students Graduating Within 4 Years')]//following-sibling::dd[1]`);
        let costOfAttendanceEl = await page.$x(`//dt[contains(., 'Cost of Attendance')]//following-sibling::dd[1]`);
        let gpaEl = await page.$x(`//dt[contains(., 'Average GPA')]//following-sibling::dd[1]`);
        let satMathEl = await page.$x(`//dt[contains(., 'SAT Math')]//following-sibling::dd[1]`);
        let satEbrwEl = await page.$x(`//dt[contains(., 'SAT EBRW')]//following-sibling::dd[1]`);
        let actCompositeEl = await page.$x(`//dt[contains(., 'ACT Composite')]//following-sibling::dd[1]`);
        let sizeEl = await page.$x(`//span[contains(., 'Undergraduate')]//preceding-sibling::span[1]`);
        // TODO: scrape major info from /?tab=profile-academics-tab

        admissionRateFull = await page.evaluate(el => el.textContent, admissionRateEl[0]);
        admissionRate = admissionRateFull.substring(0, admissionRateFull.indexOf('%'));

        completionRateFull = await page.evaluate(el => el.textContent, completionRateEl[0]);
        if(completionRateFull == 'Not reported') completionRate = null;
        else completionRate = completionRateFull.substring(0, completionRateFull.indexOf('%'));

        costOfAttendance = await page.evaluate(el => el.textContent, costOfAttendanceEl[0]);
        if(costOfAttendance == 'Not available') costOfAttendance = null;
        else if(costOfAttendance.includes('In-state') || costOfAttendance.includes('Out-of-state')) {
            costOfAttendanceInState = costOfAttendance.substring(0, costOfAttendance.indexOf('Out')).replace(/[^0-9]/g, '');
            costOfAttendanceOutOfState = costOfAttendance.substring(costOfAttendance.indexOf('Out')).replace(/[^0-9]/g, '');
        } else costOfAttendanceInState = costOfAttendanceOutOfState = costOfAttendance.replace(/[^0-9]/g, '');

        gpa = await page.evaluate(el => el.textContent, gpaEl[0]);
        if(gpa.includes('Not reported')) gpa = null;

        satMathFull = await page.evaluate(el => el.textContent, satMathEl[0]);
        if(satMathFull.includes('Not reported')) satMath = null;
        else if(satMathFull.includes('average')) {
            satMath = satMathFull.substring(0, satMathFull.indexOf('average')).trim();
        } else {
            satMathNums = satMathFull.substring(0, satMathFull.indexOf('range')).split('-');
            satMath = (parseInt(satMathNums[0]) + parseInt(satMathNums[1])) / 2;
        }
        
        satEbrwFull = await page.evaluate(el => el.textContent, satEbrwEl[0]);
        if(satEbrwFull.includes('Not reported')) satEbrw = null;
        else if(satEbrwFull.includes('average')) {
            satEbrw = satEbrwFull.substring(0, satEbrwFull.indexOf('average')).trim();
        } else {
            satEbrwhNums = satEbrwFull.substring(0, satEbrwFull.indexOf('range')).split('-');
            satEbrw = (parseInt(satEbrwhNums[0]) + parseInt(satEbrwhNums[1])) / 2;
        }

        actCompositeFull = await page.evaluate(el => el.textContent, actCompositeEl[0]);
        if(actCompositeFull.includes('Not reported')) actComposite = null;
        else if(actCompositeFull.includes('average')) {
            actComposite = actCompositeFull.substring(0, actCompositeFull.indexOf('average')).trim();
        } else {
            actCompositeNums = actCompositeFull.substring(0, actCompositeFull.indexOf('range')).split('-');
            actComposite = (parseInt(actCompositeNums[0]) + parseInt(actCompositeNums[1])) / 2;
        }

        size = (await page.evaluate(el => el.textContent, sizeEl[0])).replace(/[^0-9]/g, '');

        let majorEls = await page.$x(`(//div[contains(., 'Undergraduate Majors')])[last()]//ul`);
        let majors = [];
        for(let majorEl of majorEls) {
            let listChildren = await page.evaluate(el => el.textContent, majorEl);
            majors = majors.concat(listChildren.trim().split('\n'));
        }

        let thereIsError = null;

        try {
            await models.College.upsert({
                AdmissionRate: admissionRate,
                Name: college,
                CompletionRate: completionRate,
                CostOfAttendanceInState: costOfAttendanceInState,
                CostOfAttendanceOutOfState: costOfAttendanceOutOfState,
                GPA: gpa,
                SATMath: satMath,
                SATEBRW: satEbrw,
                ACTComposite: actComposite,
                Size: size
            });
            let addedCollege = await models.College.findOne({ where: { Name: college } });
            majors.forEach(async (major) => {
                try {
                    await models.Major.upsert({
                        Major: major
                    });
                    let addedMajor = await models.Major.findOne({ where: { Major: major }});
                    await addedCollege.addMajor(addedMajor);
                } catch(error) {
                    thereIsError = `Something went wrong in ${college}`;
                }
            });
        } catch(error) {
            thereIsError = `Something went wrong in ${college}`;
        }
    }
    
    if(thereIsError != null) {
        return {
            error: 'Something went wrong',
            reason: error
        };
    }

    await page.close();
    await browser.close();
    return { ok: 'Success' };
}