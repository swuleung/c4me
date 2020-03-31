const models = require('../models');
const { Op } = require("sequelize");

exports.searchCollege = async ( filters ) => {
    let searchResults = {};
    try {

        criteria = {}
        console.log( criteria );
        console.log( filters );
        if ( "name" in filters ) {
            console.log( "name is present" );
            console.log( filters.name );
            criteria.Name = { [Op.substring] : filters.name };
            console.log("done");
        }
        
        console.log( criteria );

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

        //SAT Math, SAT EBRW, ACT Composite: range for average scores for enrolled freshmen
        //college majors
        // Working filters: name, ranking, admission rate, size, ACT Composite, SAT Math, SAT EBRW

        console.log( criteria );
        query = {
            raw: true,
            where: criteria
        };

        // query = {
        //     raw: true,
        //     where: filters
        // };

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