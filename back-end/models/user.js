
const bcrypt = require('bcrypt');

const UsStates = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MH', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'PW', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY', null];

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        Username: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        Password: {
            type: DataTypes.CHAR(60), // bcrypt hash only requires 60 bits only
            allowNull: false,
        },
        IsAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        GPA: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: null,
            validate: {
                min: 0,
                max: 4.0,
            },
        },
        ResidenceState: {
            type: DataTypes.CHAR(2),
            validate: { isIn: [UsStates] },
            defaultValue: null,
        },
        CollegeClass: {
            type: DataTypes.INTEGER,
            validate: {
                min: 0,
            },
            defaultValue: null,
        },
        Major1: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        Major2: {
            type: DataTypes.STRING,
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
        ACTEnglish: {
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
        },
        ACTComposite: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 36,
            },
            defaultValue: null,
        },
        SATLit: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800,
            },
            defaultValue: null,
        },
        SATUs: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800,
            },
            defaultValue: null,
        },
        SATWorld: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800,
            },
            defaultValue: null,
        },
        SATMathI: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800,
            },
            defaultValue: null,
        },
        SATMathII: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800,
            },
            defaultValue: null,
        },
        SATEco: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800,
            },
            defaultValue: null,
        },
        SATMol: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800,
            },
            defaultValue: null,
        },
        SATChem: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800,
            },
            defaultValue: null,
        },
        SATPhys: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800,
            },
            defaultValue: null,
        },
        APPassed: {
            type: DataTypes.INTEGER,
            validate: {
                min: 0,
                max: 38,
            },
            defaultValue: 0,
        },
    }, {
        hooks: {
            beforeCreate: ((user) => bcrypt.hash(user.Password, 10)
                .then((hash) => {
                    user.Password = hash; // eslint-disable-line no-param-reassign
                })
                .catch((err) => {
                    console.log(err);
                })),
        },
    });

    User.prototype.toJSON = function toJSON() {
        const values = { ...this.get() };
        delete values.Password;
        delete values.createdAt;
        delete values.updatedAt;

        return values;
    };

    User.associate = (models) => {
        User.belongsToMany(models.College, { through: 'Application', foreignKey: 'Username' });
        User.belongsTo(models.HighSchool, { foreignKey: 'HighSchoolId' });
    };
    return User;
};
