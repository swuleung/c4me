const sequelize = require('sequelize');
const models = require('../models');

exports.createuser = async (user) => {
    let newUser = {};
    try {
        newUser = await models.User.create({
            username: user.username,
            password: user.password
        });
    } catch (error) {
        if (error instanceof sequelize.UniqueConstraintError) {
            return { error: 'Username must be unique', reason: error.errors[0].message };
        }
        return {
            error: 'Something went wrong',
            reason: error
        };
    }
    let newStudent = {};
    try {
        newStudent = await models.Student.create({
            username: newUser.username,
            GPA: user.GPA,
            residenceState: user.residenceState,
            highschoolName: user.highschoolName,
            highschoolState: user.highschoolState,
            collegeClass: user.collegeClass,
            major1: user.major1,
            major2: user.major2,
            SATMath: user.SATMath,
            SATEBRW: user.SATEBRW,
            ACTEnglish: user.ACTEnglish,
            ACTMath: user.ACTMath,
            ACTReading: user.ACTReading,
            ACTScience: user.ACTScience,
            ACTComposite: user.ACTComposite,
            SATLit: user.SATLit,
            SATUs: user.SATUs,
            SATWorld: user.SATWorld,
            SATMathI: user.SATMathI,
            SATMathII: user.SATMathII,
            SATEco: user.SATEco,
            SATMol: user.SATMol,
            SATChem: user.SATChem,
            SATPhys: user.SATPhys,
            APPassed: user.APPassed
        });
    } catch (error) {
        newUser.destroy();
        if (error instanceof sequelize.ValidationError) {
            return {
                error: 'Data does not conform to contraints',
                reason: error.errors[0].message
            }
        } else {
            return {
                error: 'Something went wrong',
                reason: error
            }
        }
    }
    return { student: newStudent };
}