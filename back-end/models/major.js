'use strict';

module.exports = (sequelize, DataTypes) => {
    let Major = sequelize.define('Major', {
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