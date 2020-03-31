
module.exports = (sequelize, DataTypes) => {
    const Major = sequelize.define('Major', {
        MajorId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        Major: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['Major'],
            },
        ],
    });

    Major.associate = (models) => {
        Major.belongsToMany(models.College, { through: 'CollegeMajors' });
    };
    return Major;
};
