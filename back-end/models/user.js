'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        password: DataTypes.CHAR(60), // bcrypt hash only requires 60 bits only
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        hooks: {
            beforeCreate: ((user) => {
                return bcrypt.hash(user.password, 10)
                    .then(hash => {
                        user.password = hash;
                    })
                    .catch(err => {
                        throw new Error();
                    });
            })
        }
    });
    User.associate = function (models) {
        models.User.hasOne(models.Student, { foreignKey: 'username' })
    };
    return User;
};