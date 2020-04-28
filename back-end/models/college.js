
const UsStates = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MH', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'PW', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY', null];

module.exports = (sequelize, DataTypes) => {
    const College = sequelize.define('College', {
        CollegeId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        Name: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        Ranking: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
        Size: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
        AdmissionRate: {
            type: DataTypes.DECIMAL(5, 2),
            validate: {
                min: 0,
                max: 100,
            },
            defaultValue: null,
        },
        CostOfAttendanceInState: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
        CostOfAttendanceOutOfState: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
        Location: {
            type: DataTypes.CHAR(2),
            validate: { isIn: [UsStates] },
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
        ACTComposite: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 36,
            },
            defaultValue: null,
        },
        InstitutionType: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        CompletionRate: {
            type: DataTypes.DECIMAL(5, 2),
            validate: {
                min: 0,
                max: 100,
            },
            defaultValue: null,
        },
        StudentDebt: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
    },
    {
        indexes: [
            {
                unique: true,
                fields: ['Name'],
            },
        ],
    });
    College.associate = (models) => {
        College.belongsToMany(models.User, { through: 'Application', foreignKey: 'CollegeId' });
        College.belongsToMany(models.Major, { through: 'CollegeMajors' });
    };
    return College;
};
