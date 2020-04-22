const models = require('../models');
const { Op } = require("sequelize");

const northeastRegion = ["ME", "VT", "NH", "MA", "RI", "CT", "NY", "PA", "NJ"]; //9 states
const southRegion = ["DE", "MD", "WV", "VA", "NC", "SC", "GA", "FL", "KY", "TN", "MS", "AL", "AR", "LA", "OK", "TX"]; //16 states
const midwestRegion = ["OH", "MI", "IN", "WI", "IL", "MN", "IA", "MO", "ND", "SD", "NE", "KS"]; //12 statesa=
const westRegion = ["AK", "HI", "WA", "OR", "CA", "MT", "ID", "WY", "NV", "UT", "CO", "AZ", "NM"]; //13 states



//  Parameters: filters
//  Filters is an object. 
//  The keys in this object will be the filter names
//  The values are the filter values
//  Filters that involve ranges will require 2 keys: a min and a max
//  e.g. admissionRateMin and admissionRateMax
//  An example filter:
// {
//     "region" : "west",
//     "SATEBRWMin": 500,
//     "SATEBRWMax": 800,
//     "SATMathMin" : 500,
//     "SATMathMax" : 800,
//     "name" : "University",
//     "ACTCompositeMin" : 20,
//     "ACTCompositeMax" : 35,
//     "costInStateMax" : 50000,
//     "costOutOfStateMax" : 50000,
//     "major" : "math",
//     "major2" : "computer",
//     "rankingMin" : 0,
//     "rankingMax" : 1000,
//     "sizeMin" : 0,
//     "sizeMax" : 50000,
//     "sortAttribute" : "name",
//     "sortDirection" : "ASC",
//     "lax" : "True"
// }
exports.searchCollege = async ( filters ) => {
    let searchResults = {};
    try {
        
        let criteria = {};
        let query = {};

        if ( filters.name )
            criteria.Name = { [Op.substring] : filters.name };
        if ( filters.admissionRateMin && filters.admissionRateMax ) {
            if ( filters.lax ) {
                criteria.AdmissionRate = { [Op.or]: [{ [Op.eq]: null }, { [Op.between] : [ filters.admissionRateMin, filters.admissionRateMax] }] };
            }
            else {
                criteria.AdmissionRate = { [Op.between] : [ filters.admissionRateMin, filters.admissionRateMax] };
            }
        }
        if ( filters.costInStateMax && filters.costOutOfStateMax ) {
            if ( filters.lax ) {
                criteria.CostOfAttendanceInState = { [Op.or]: [{ [Op.eq]: null }, { [Op.lte] : filters.costInStateMax } ] };
                criteria.CostOfAttendanceOutOfState = { [Op.or]: [{ [Op.eq]: null }, { [Op.lte] : filters.costOutOfStateMax } ] };
            }
            else {
                criteria.CostOfAttendanceInState = { [Op.lte] : filters.costInStateMax };
                criteria.CostOfAttendanceOutOfState = { [Op.lte] : filters.costOutOfStateMax };
            }
        }
        if ( filters.region ) {
            switch ( filters.region ) {
                case "northeast":
                    criteria.Location = { [Op.in] : northeastRegion };
                    break;
                case "south":
                    criteria.Location = { [Op.in] : southRegion };
                    break;
                case "midwest":
                    criteria.Location = { [Op.in] : midwestRegion };
                    break;
                case "west":
                    criteria.Location = { [Op.in] : westRegion };
                    break;
                default:
                    console.log("unexpected value for location filter");
                    break;
            }
        }
        if ( filters.rankingMin && filters.rankingMax )
            criteria.Ranking = { [Op.between] : [ filters.rankingMin, filters.rankingMax] };
        if ( filters.sizeMin && filters.sizeMax )
            criteria.Size = { [Op.between] : [ filters.sizeMin, filters.sizeMax] };
        if ( filters.SATMathMin && filters.SATMathMax ) {
            if ( filters.lax ) {
                criteria.SATMath = { [Op.or]: [{ [Op.eq]: null }, { [Op.between] : [ filters.SATMathMin, filters.SATMathMax] }] };
            }
            else {
                criteria.SATMath = { [Op.between] : [ filters.SATMathMin, filters.SATMathMax] };
            }
        }
        if ( filters.SATEBRWMin && filters.SATEBRWMax ) {
            if ( filters.lax ) {
                criteria.SATEBRW = { [Op.or]: [{ [Op.eq]: null }, { [Op.between] : [ filters.SATEBRWMin, filters.SATEBRWMax] }] };
            }
            else {
                criteria.SATEBRW = { [Op.between] : [ filters.SATEBRWMin, filters.SATEBRWMax] };
            }
        }
        if ( filters.ACTCompositeMin && filters.ACTCompositeMax ) {
            if ( filters.lax ) {
                criteria.ACTComposite = { [Op.or]: [{ [Op.eq]: null }, { [Op.between] : [ filters.ACTCompositeMin, filters.ACTCompositeMax] }] };
            }
            else {
                criteria.ACTComposite = { [Op.between] : [ filters.ACTCompositeMin, filters.ACTCompositeMax] };
            }
        }
        
        // the major filter is a bit weird since their can be 1 or 2 majors.
        // I stuck with this solution for now.
        if ( filters.major && filters.major2 ) {
            query.include = 
            [{ 
                model: models.Major,
                where: {
                    Major : { 
                        [Op.or] : [
                            { [Op.substring] : filters.major },
                            { [Op.substring] : filters.major2 }
                        ]                  
                    }
                }
             }];
        }
        else if ( filters.major ) {
            query.include = 
            [{ 
                model: models.Major,
                where: {
                    Major : { [Op.substring] : filters.major }
                }
             }];
        }
        else if ( filters.major2 ) {
            query.include = 
            [{ 
                model: models.Major,
                where: {
                    Major : { [Op.substring] : filters.major2 }             
                }
             }];
        }

        // this part of the code is for sorting the search results
        // sortAttribute is expected to be one of the attribute names of the college database
        // sortDirection is expected to be either 'DESC' or 'ASC'
        if ( filters.sortAttribute && filters.sortDirection )
            query.order = [ [filters.sortAttribute, filters.sortDirection] ];

        query.raw = true;
        query.where = criteria;
        searchResults = await models.College.findAll( query );
        
        // the following code is for the removal of duplicate colleges.
        // there can be duplicate results because when you search via majors,
        // there can be more results for the same college, just with different majors
        let collegeID = -1;
        for ( let i = searchResults.length - 1; i >= 0; i--) {
            if ( collegeID != searchResults[i].CollegeId )
                collegeID = searchResults[i].CollegeId;
            else
                searchResults.splice( i , 1 );
        }
    } 
    catch (error) {
        return {
            error: 'searchCollege failed',
            reason: error
        };
    }
    return {
        ok: 'Success',
        colleges : searchResults
    }
};



/**
 * 
 * Updates questionability for all applications
 * 
 */
exports.calcQuestionableApplications = async () => {
    let applications = [];
    try {
        applications = (
            await models.Application.findAll({
                where:{
                    status: {
                        [Op.or]: ['accepted','rejected']
                    }
                }
            })
        );
    } catch (error) {
        return {
            error: 'Unable to get applications for applications tracker',
            reason: error.message,
        };
    }
    if (!applications) {
        return {
            ok: 'No accepted data for college',
            applications: [],
            averages: {},
        };
    }

    applications = applications.toJSON();
    

    //iterate thru each application
    for (let i = 0; i < applications.length; i++){
        let thisCollege = {};
        //Find the College of Application[i]
        try{
            thisCollege = (await models.College.findOne({
                where:{
                    CollegeId: applications[i].College
                }
            }))
        }catch (error) {
            return {
                error: 'Error in finding College for qScore',
                reason: error.message,
            };
        }
    
        if (!thisCollege) {
            return {
                ok: 'College does not exist'
            };
        }
        thisCollege = thisCollege.toJSON();
        //find the Student of Application[i]
        let thisStudent = {};
        try{
            thisStudent = (await models.User.findOne({
                where:{
                    username: applications[i].username
                }
            }))
        }catch (error) {
            return {
                error: 'Error in finding User for qScore',
                reason: error.message,
            };
        }
        if (!thisStudent) {
            return {
                ok: 'User does not exist'
            };
        }

        thisStudent = thisStudent.toJSON();

        var qScore = 0;
        //SAT - 10 
        var totalSATcollege = (thisCollege.SATMath + thisCollege.SATEBRW);
        var totalSATstudent = (thisStudent.SATMath + thisStudent.SATEBRW);
        qScore+=10;
        while ( totalSATcollege > totalSATstudent && qScore > 0){
            totalSATstudent += 50;
            qScore--;   
        }

        //ACT - 10 
        if (thisCollege.ACTComposite < thisStudent.ACTComposite){
            qScore+=10;
        } 
        else{
            var temp = 10;
            var tempACT = thisStudent.ACTComposite;
            while (temp > 0 && tempACT <= thisCollege.ACTComposite){
                tempACT+=2;
                temp--;
            }
            qScore+=temp;
        }

        //Relevant Majors - 5 
        var majors = collegeController.getMajorsByCollegeID(thisCollege.CollegeId);
        if (thisStudent.major1 in majors){ qScore += 2.5;}
        if (thisStudent.major2 in majors){ qScore += 2.5;}

        //GPA - 10
        if (thisStudent.GPA > thisCollege.GPA){ qScore+=10;}
        else{ 
            var temp = 10;
            var tempGPA = thisStudent.GPA;
            while(temp > 0 && thisCollege.GPA >= tempGPA){
                tempGPA+=.1;
                temp--;
            }
            qScore+=temp;
        }

        //ResidenceState - 5
        if (thisStudent.residenceState == thisCollege.residenceState){ qScore+=5;}
        else { 
            var studentRegion = (thisStudent.residenceState in northeastRegion) ? northeastRegion :
                                    (thisStudent.residenceState in southRegion) ? southRegion :
                                        (thisStudent.residenceState in midwestRegion) ? midwestRegion : westRegion;
            var collegeRegion = (thisCollege.residenceState in northeastRegion) ? northeastRegion :
                                    (thisCollege.residenceState in southRegion) ? southRegion :
                                        (thisCollege.residenceState in midwestRegion) ? midwestRegion : westRegion;
            
            if (collegeRegion == studentRegion){ qScore+=2.5;}
       }
       
       var threshold = qScore/40.0;
       threshold = (applications[i].status == 'denied') ?  (1-threshold) : threshold;
       if (threshold < .65){
           let updateValues = { isQuestionable: True };
           await models.Application.update(updateValues,{where: {username: thisStudent[i].username}});
       }
    }
};



