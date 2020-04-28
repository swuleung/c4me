
/**
 * This a JOIN between College & User
 * The associations are defined in college.js & user.js
 */
module.exports = (sequelize, DataTypes) => {
    const Application = sequelize.define('Application', {
        Status: {
            type: DataTypes.STRING,
            validate: { isIn: [['accepted', 'pending', 'waitlisted', 'deferred', 'denied', 'withdrawn']] },
            defaultValue: 'pending',
        },
        IsQuestionable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });
    return Application;
};
