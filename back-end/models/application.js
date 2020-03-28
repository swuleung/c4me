'use strict';
/** 
 * This a JOIN between College & User 
 * The associations are defined in college.js & user.js
 */
module.exports = (sequelize, DataTypes) => {
    let Application = sequelize.define('Application',{
        status: {
            type: DataTypes.STRING,
            validate: { isIn: [['accepted', 'pending', 'waitlisted', 'deferred', 'denied', 'withdrawn']] },
            defaultValue: 'pending'
        }
    });
    return Application;
};