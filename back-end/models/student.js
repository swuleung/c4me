'use strict';

module.exports = (sequelize, DataTypes) => {
    let Student = sequelize.define('Student', {
        "username": {
            type: DataTypes.STRING,
            primaryKey: true
        },
        // "GPA": DataTypes.DECIMAL(3,2),
        // "residenceState": DataTypes.S
    });

    Student.associate = function (models) {
        models.Student.belongsTo(models.User, { foreignKey: "username", targetKey: "username" });
    };
    return Student;
};