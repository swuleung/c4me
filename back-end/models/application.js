'use strict';

module.exports = (sequelize, DataTypes) => {
    let Application = sequelize.define('Application', {
        ApplicationId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true // TODO change this to a double primary key (student, college)
        },
        // TODO Wait for college model to exist to attach the college as a foreign key
        college: {
            type: DataTypes.STRING
        },
        username: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.STRING,
            validate: { isIn: [['accepted', 'pending', 'waitlisted', 'deferred', 'denied', 'withdrawn']] },
            defaultValue: 'pending'
        }
    });

    Application.associate = function (models) {
        models.Application.belongsTo(models.Student, { foreignKey: 'username', targetKey: 'username', onDelete: 'CASCADE' });
        // TODO Belong to college
        //models.Application.belongsTo(models.College, { foreignKey: 'college', targetKey: 'college', onDelete: 'CASCADE' });
    };
    return Application;
};