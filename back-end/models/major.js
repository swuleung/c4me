'use strict';

module.exports = (sequelize, DataTypes) => {
    let Major = sequelize.define('Major', {
        MajorId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Major: {
            type: DataTypes.STRING,
            defaultValue: null
        },
    });
    
    Major.associate = (models) => {
        Major.belongsToMany(models.College, { through: 'CollegeMajors' });
    }
    return Major;
};