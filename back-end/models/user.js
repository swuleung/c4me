'use strict';
const bcrypt = require('bcrypt');
const array_of_states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MH', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'PW', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY', null];

module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        password: {
            type: DataTypes.CHAR(60), // bcrypt hash only requires 60 bits only
            allowNull: false
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        GPA: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: null,
            validate: {
                min: 0,
                max: 4.0
            }
        },
        residenceState: {
            type: DataTypes.CHAR(2),
            validate: { isIn: [array_of_states] },
            defaultValue: null
        },
        highschoolName: {
            type: DataTypes.STRING,
            defaultValue: null
        },
        highschoolState: {
            type: DataTypes.CHAR(2),
            validate: { isIn: [array_of_states] },
            defaultValue: null
        },
        collegeClass: {
            type: DataTypes.INTEGER,
            validate: {
                min: 0
            },
            defaultValue: null
        },
        major1: {
            type: DataTypes.STRING,
            defaultValue: null
        },
        major2: {
            type: DataTypes.STRING,
            defaultValue: null
        },
        SATMath: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800
            },
            defaultValue: null
        },
        SATEBRW: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800
            },
            defaultValue: null
        },
        ACTEnglish: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 36
            },
            defaultValue: null
        },
        ACTMath: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 36
            },
            defaultValue: null
        },
        ACTReading: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 36
            },
            defaultValue: null
        },
        ACTScience: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 36
            },
            defaultValue: null
        },
        ACTComposite: {
            type: DataTypes.INTEGER,
            validate: {
                min: 1,
                max: 36
            },
            defaultValue: null
        },
        SATLit: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800
            },
            defaultValue: null
        },
        SATUs: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800
            },
            defaultValue: null
        },
        SATWorld: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800
            },
            defaultValue: null
        },
        SATMathI: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800
            },
            defaultValue: null
        },
        SATMathII: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800
            },
            defaultValue: null
        },
        SATEco: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800
            },
            defaultValue: null
        },
        SATMol: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800
            },
            defaultValue: null
        },
        SATChem: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800
            },
            defaultValue: null
        },
        SATPhys: {
            type: DataTypes.INTEGER,
            validate: {
                min: 200,
                max: 800
            },
            defaultValue: null
        },
        APPassed: {
            type: DataTypes.INTEGER,
            validate: {
                min: 0
            },
            defaultValue: 0
        }
    }, {
        hooks: {
            beforeCreate: ((user) => {
                return bcrypt.hash(user.password, 10)
                    .then(hash => {
                        user.password = hash;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }),
            beforeUpdate: ((user) => {
                return bcrypt.hash(user.password, 10)
                    .then(hash => {
                        user.password = hash;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
        }
    });
    User.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());
        delete values.password;
        delete values.createdAt;
        delete values.updatedAt;

        return values;
    }

    User.associate = (models) => {
        User.belongsToMany(models.College, {through: 'Application', foreignKey: 'username'});
    }
    return User;
};