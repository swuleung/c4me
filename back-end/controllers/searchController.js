const models = require('../models');

exports.searchCollege = async ( filters ) => {
    let searchResults = {};
    try {
        query = {
            raw: true,
            where: filters
        };
        colleges : await models.College.findAll( query );
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