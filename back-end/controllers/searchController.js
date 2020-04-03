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
//     "location" : "NY",
//     "SATEBRWMin": 500,
//     "SATEBRWMax": 600,
//     "SATMathMin" : 500,
//     "SATMathMax" : 600,
//     "name" : "University",
//     "ACTCompositeMin" : 20,
//     "ACTCompositeMax" : 30
// }
exports.searchCollege = async ( filters ) => {
    let searchResults = {};
    try {
        
        let criteria = {};
        let query = {};
        if ( "name" in filters )
            criteria.Name = { [Op.substring] : filters.name };
        if ( "admissionRateMin" in filters && "admissionRateMax" in filters)
            criteria.AdmissionRate = { [Op.between] : [ filters.admissionRateMin, filters.admissionRateMax] };
        if ( "costInStateMax" in filters && "costOutOfStateMax" in filters ) {
            criteria.CostOfAttendanceInState = { [Op.lte] : filters.costInStateMax };
            criteria.CostOfAttendanceOutOfState = { [Op.lte] : filters.costOutOfMax };
        }

        if ( "location" in filters ) {
            //criteria.Location = filters.location;
            switch ( filters.location ) {
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
        if ( "rankingMin" in filters && "rankingMax" in filters )
            criteria.Ranking = { [Op.between] : [ filters.rankingMin, filters.rankingMax] };
        if ( "sizeMin" in filters && "sizeMax" in filters )
            criteria.Size = { [Op.between] : [ filters.sizeMin, filters.sizeMax] };
        if ( "SATMathMin" in filters && "SATMathMax" in filters )
            criteria.SATMath = { [Op.between] : [ filters.SATMathMin, filters.SATMathMax] };
        if ( "SATEBRWMin" in filters && "SATEBRWMax" in filters )
            criteria.SATEBRW = { [Op.between] : [ filters.SATEBRWMin, filters.SATEBRWMax] };
        if ( "ACTCompositeMin" in filters && "ACTCompositeMax" in filters )
            criteria.ACTComposite = { [Op.between] : [ filters.ACTCompositeMin, filters.ACTCompositeMax] };
        if ( "major" in filters ) {
            query.include = 
            [{ 
                model: models.Major,
                where: {
                    Major : { [Op.substring] : filters.major }
                }
             }];
        }
        //college majors, cost of attendance To be completed
        // Working filters: name, ranking, admission rate, size, ACT Composite, SAT Math, SAT EBRW, location

        query.raw = true;
        query.where = criteria;

        // query = {
        //     raw: true,
        //     where: filters
        // };

        searchResults = await models.College.findAll( query );

        // this code is for the removal of duplicate college.
        // there can be duplicate results because when you search via majors,
        // there can be more results for the same college, just with different majors
        let collegeID = -1;
        for ( let i = 0; i < searchResults.length; i++) {
            console.log("check");
            if ( collegeID == searchResults[i].CollegeId )
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