
const UsStates = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MH', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'PW', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY', null];

module.exports = (sequelize, DataTypes) => {
    const HighSchool = sequelize.define('HighSchool', {
        HighSchoolId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        Name: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        HighSchoolCity: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        HighSchoolState: {
            type: DataTypes.CHAR(2),
            validate: { isIn: [UsStates] },
            defaultValue: null,
        },
        Ranking: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        NicheAcademicScore: { 
            type: DataTypes.STRING,
            defaultValue: null,
        },
        GPA: {
            type: DataTypes.DECIMAL(3, 2),
            validate: {
                min: 0,
                max: 4,
            },
            defaultValue: null,
        },
        AverageSAT: {
            type: DataTypes.INTEGER,
            validate: {
                min: 400,
                max: 1600,
            },
            defaultValue: null,
        },
        SATMath: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800,
            },
            defaultValue: null,
        },
        SATEBRW: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800,
            },
            defaultValue: null,
        },
        AverageACT: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 36,
            },
            defaultValue: null,
        },
        ACTMath: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 36,
            },
            defaultValue: null,
        },
        ACTEnglish: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 36,
            },
            defaultValue: null,
        },
        ACTReading: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 36,
            },
            defaultValue: null,
        },
        ACTScience: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 36,
            },
            defaultValue: null,
        }
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['Name'],
            },
        ],
    });
    HighSchool.associate = (models) => {
        HighSchool.belongsToMany(models.User, { through: 'StudentHighSchools' });
    };
    return HighSchool;
};