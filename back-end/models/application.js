
/**
 * This a JOIN between College & User
 * The associations are defined in college.js & user.js
 */
module.exports = (sequelize, DataTypes) => {
    const Application = sequelize.define('Application', {
        status: {
            type: DataTypes.STRING,
            validate: { isIn: [['accepted', 'pending', 'waitlisted', 'deferred', 'denied', 'withdrawn']] },
            defaultValue: 'pending',
        },
        isQuestionable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
    return Application;
};
