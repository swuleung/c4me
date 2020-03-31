const models = require('../models');
const { Op } = require("sequelize");


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
        criteria = {}
        
        if ( "name" in filters )
            criteria.Name = { [Op.substring] : filters.name };
        if ( "admissionRateMin" in filters && "admissionRateMax" in filters)
            criteria.AdmissionRate = { [Op.between] : [ filters.admissionRateMin, filters.admissionRateMax] };
        if ( "costMax" in filters )
            criteria.CostOfAttendanceInState = { [Op.lte] : filters.costMax };
        if ( "location" in filters ) 
            criteria.Location = filters.location;
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

        //college majors, location, cost of attendance To be completed
        // Working filters: name, ranking, admission rate, size, ACT Composite, SAT Math, SAT EBRW

        console.log( criteria );
        query = {
            raw: true,
            where: criteria
        };

        searchResults = await models.College.findAll( query );
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