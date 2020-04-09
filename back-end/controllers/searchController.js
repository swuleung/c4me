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
//     "region" : "northeast",
//     "SATEBRWMin": 500,
//     "SATEBRWMax": 600,
//     "SATMathMin" : 500,
//     "SATMathMax" : 600,
//     "name" : "University",
//     "ACTCompositeMin" : 20,
//     "ACTCompositeMax" : 30,
//     "costInStateMin" : 10000,
//     "costOutOfStateMax" : 50000,
//     "major" : "math",
//     "major2" : "computer"
// }
exports.searchCollege = async ( filters ) => {
    let searchResults = {};
    try {
        
        let criteria = {};
        let query = {};

        if ( filters.name )
            criteria.Name = { [Op.substring] : filters.name };
        if ( filters.admissionRateMin && filters.admissionRateMax )
            criteria.AdmissionRate = { [Op.between] : [ filters.admissionRateMin, filters.admissionRateMax] };
        if ( filters.costInStateMax && filters.costOutOfStateMax ) {
            criteria.CostOfAttendanceInState = { [Op.lte] : filters.costInStateMax };
            criteria.CostOfAttendanceOutOfState = { [Op.lte] : filters.costOutOfStateMax };
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
        if ( filters.SATMathMin && filters.SATMathMax )
            criteria.SATMath = { [Op.between] : [ filters.SATMathMin, filters.SATMathMax] };
        if ( filters.SATEBRWMin && filters.SATEBRWMax )
            criteria.SATEBRW = { [Op.between] : [ filters.SATEBRWMin, filters.SATEBRWMax] };
        if ( filters.ACTCompositeMin && filters.ACTCompositeMax )
            criteria.ACTComposite = { [Op.between] : [ filters.ACTCompositeMin, filters.ACTCompositeMax] };
        
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
}