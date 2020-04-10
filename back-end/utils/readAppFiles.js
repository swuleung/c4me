const fs = require('fs');

/**
 * Get the configuration for the app
 */
exports.getAppConfig = () => {
    const config = JSON.parse(fs.readFileSync(`${__dirname}/../config/config.json`, 'utf8'));

    if (process.env.NODE_ENV) {
        return config[process.env.NODE_ENV];
    } else {
        return config['development'];
    }
};

/**
 * Get the paths configuration file
 */
exports.getPathConfig = () => {
    const config = JSON.parse(fs.readFileSync(`${__dirname}/../config/paths.json`, 'utf8'));
    return config;
}

/** 
 * Get the list of colleges using the paths file
 */
exports.getCollegeList = () => {
    const path = this.getPathConfig();

    const collegeFile = `${__dirname}/${path.ASSETS_PATH}/${path.COLLEGE_NAMES}`;
    // colleges.txt file into string array
    const colleges = fs.readFileSync(collegeFile).toString().split(/\r?\n/);

    return colleges;
}