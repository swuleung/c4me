const { Op } = require('sequelize');
const models = require('../models');
const { getStudent } = require('./studentController');
const { getCollegeByID } = require('./collegeController');
const { getMajorsByCollegeID } = require('./collegeController');
const { findSimilarHS } = require('./highschoolController');

const {
    northeastRegion, southRegion, midwestRegion, westRegion,
} = require('./sharedControllerVars');

/**
 *
 * @param {*} filters Filters object
 * @param {*} username Current student's username
 *
 * The keys in this object will be the filter names
 * The values are the filter values
 * Filters that involve ranges will require 2 keys: a min and a max
 * e.g. admissionRateMin and admissionRateMax
 * An example filter:
 * {
 *     "region" : "west",
 *     "SATEBRWMin": 0,
 *     "SATEBRWMax": 800,
 *     "SATMathMin" : 0,
 *     "SATMathMax" : 800,
 *     "name" : "University",
 *     "ACTCompositeMin" : 0,
 *     "ACTCompositeMax" : 35,
 *     "costMax" : 100000,
 *     "major" : "math",
 *     "major2" : "computer",
 *     "rankingMin" : 0,
 *     "rankingMax" : 1000,
 *     "sizeMin" : 0,
 *     "sizeMax" : 50000,
 *     "sortAttribute" : "name",
 *     "sortDirection" : "ASC",
 *     "lax" : "True"
 * }
 */
exports.searchCollege = async (filters, username) => {
    let searchResults = {};
    try {
        const criteria = {};
        const query = {};

        if (filters.hasOwnProperty('name')) criteria.Name = { [Op.substring]: filters.name };

        if (filters.hasOwnProperty('admissionRateMin') && filters.hasOwnProperty('admissionRateMax')) {
            if (filters.lax) {
                criteria.AdmissionRate = {
                    [Op.or]: [
                        { [Op.eq]: null },
                        { [Op.between]: [filters.admissionRateMin, filters.admissionRateMax] },
                    ],
                };
            } else {
                criteria.AdmissionRate = {
                    [Op.between]: [filters.admissionRateMin, filters.admissionRateMax],
                };
            }
        }

        if (filters.hasOwnProperty('costMax')) {
            // Out of state costs later in the code.
            if (filters.lax) {
                criteria.CostOfAttendanceInState = {
                    [Op.or]: [
                        { [Op.eq]: null },
                        { [Op.lte]: filters.costMax },
                    ],
                };
            } else {
                criteria.CostOfAttendanceInState = { [Op.lte]: filters.costMax };
            }
        }

        let locations = [];

        if (filters.hasOwnProperty('regions')) {
            if (filters.regions.includes('northeast')) {
                locations = locations.concat(northeastRegion);
            }
            if (filters.regions.includes('south')) {
                locations = locations.concat(southRegion);
            }
            if (filters.regions.includes('midwest')) {
                locations = locations.concat(midwestRegion);
            }
            if (filters.regions.includes('west')) {
                locations = locations.concat(westRegion);
            }
        }

        if (filters.states && filters.states.length) {
            locations = locations.concat(filters.states);
        }

        if (locations.length !== 0) {
            if (filters.lax) {
                criteria.Location = {
                    [Op.or]: [
                        { [Op.eq]: null },
                        { [Op.in]: locations },
                    ],
                };
            } else {
                criteria.Location = { [Op.in]: locations };
            }
        }

        if (filters.hasOwnProperty('rankingMin') && filters.hasOwnProperty('rankingMax')) {
            if (filters.lax) {
                criteria.Ranking = {
                    [Op.or]: [
                        { [Op.eq]: null },
                        { [Op.between]: [filters.rankingMin, filters.rankingMax] },
                    ],
                };
            } else {
                criteria.Ranking = { [Op.between]: [filters.rankingMin, filters.rankingMax] };
            }
        }

        if (filters.hasOwnProperty('sizeMin') && filters.hasOwnProperty('sizeMax')) {
            if (filters.lax) {
                criteria.Size = {
                    [Op.or]: [
                        { [Op.eq]: null },
                        { [Op.between]: [filters.sizeMin, filters.sizeMax] },
                    ],
                };
            } else {
                criteria.Size = { [Op.between]: [filters.sizeMin, filters.sizeMax] };
            }
        }

        if (filters.hasOwnProperty('SATMathMin') && filters.hasOwnProperty('SATMathMax')) {
            if (filters.lax) {
                criteria.SATMath = {
                    [Op.or]: [
                        { [Op.eq]: null },
                        { [Op.between]: [filters.SATMathMin, filters.SATMathMax] },
                    ],
                };
            } else {
                criteria.SATMath = { [Op.between]: [filters.SATMathMin, filters.SATMathMax] };
            }
        }
        if (filters.hasOwnProperty('SATEBRWMin') && filters.hasOwnProperty('SATEBRWMax')) {
            if (filters.lax) {
                criteria.SATEBRW = {
                    [Op.or]: [
                        { [Op.eq]: null },
                        { [Op.between]: [filters.SATEBRWMin, filters.SATEBRWMax] },
                    ],
                };
            } else {
                criteria.SATEBRW = { [Op.between]: [filters.SATEBRWMin, filters.SATEBRWMax] };
            }
        }
        if (filters.hasOwnProperty('ACTCompositeMin') && filters.hasOwnProperty('ACTCompositeMax')) {
            if (filters.lax) {
                criteria.ACTComposite = {
                    [Op.or]: [
                        { [Op.eq]: null },
                        { [Op.between]: [filters.ACTCompositeMin, filters.ACTCompositeMax] },
                    ],
                };
            } else {
                criteria.ACTComposite = {
                    [Op.between]: [filters.ACTCompositeMin, filters.ACTCompositeMax],
                };
            }
        }

        // the major filter is a bit weird since their can be 1 or 2 majors.
        // I stuck with this solution for now.
        if (filters.hasOwnProperty('major') && filters.hasOwnProperty('major2')) {
            query.include = [{
                model: models.Major,
                where: {
                    Major: {
                        [Op.or]: [
                            { [Op.substring]: filters.major },
                            { [Op.substring]: filters.major2 },
                        ],
                    },
                },
            }];
        } else if (filters.hasOwnProperty('major')) {
            query.include = [{
                model: models.Major,
                where: {
                    Major: { [Op.substring]: filters.major },
                },
            }];
        } else if (filters.hasOwnProperty('major2')) {
            query.include = [{
                model: models.Major,
                where: {
                    Major: { [Op.substring]: filters.major2 },
                },
            }];
        }

        // this part of the code is for sorting the search results
        // sortAttribute is expected to be one of the attribute names of the college database
        // sortDirection is expected to be either 'DESC' or 'ASC'
        if (filters.hasOwnProperty('sortAttribute') && filters.hasOwnProperty('sortDirection')) query.order = [[filters.sortAttribute, filters.sortDirection]];

        query.where = criteria;
        searchResults = await models.College.findAll( query );


        // the following code is for the removal of duplicate colleges.
        // there can be duplicate results because when you search via majors,
        // there can be more results for the same college, just with different majors
        let collegeID = -1;
        for (let i = searchResults.length - 1; i >= 0; i -= 1) {
            if (collegeID !== searchResults[i].CollegeId) collegeID = searchResults[i].CollegeId;
            else searchResults.splice(i, 1);
        }

        // the code above for 2 majors queries as an OR.
        // the following code is to keep only the AND cases.
        if (filters.major && filters.major2) {
            for (let i = searchResults.length - 1; i >= 0; i -= 1) {
                // eslint-disable-next-line no-await-in-loop
                const majors = await searchResults[i].getMajors();

                let flag1 = false;
                let flag2 = false;
                for (let j = 0; j < majors.length; j += 1) {
                    if (majors[j].Major.toLowerCase().includes(filters.major.toLowerCase())) {
                        flag1 = true;
                    }
                    if (majors[j].Major.toLowerCase().includes(filters.major2.toLowerCase())) {
                        flag2 = true;
                    }
                }
                if (!(flag1 && flag2)) searchResults.splice(i, 1);
            }
        }

        // the following code is for removing college's whose out of state costs
        // exceeeds the filters costMax.
        if (filters.hasOwnProperty('costMax')) {
            const student = await getStudent(username);
            if (student.student) {
                const state = student.student.residenceState;
                for (let i = searchResults.length - 1; i >= 0; i -= 1) {
                    // eslint-disable-next-line no-continue
                    if (state === searchResults[i].Location) continue;
                    else if (searchResults[i].CostOfAttendanceOutOfState > filters.costMax) {
                        searchResults.splice(i, 1);
                    }
                }
            }
        }
    } catch (error) {
        return {
            error: 'searchCollege failed',
            reason: error,
        };
    }
    return {
        ok: 'Success',
        colleges : searchResults
    }
};

exports.calcScores = async ( collegeIDList, username ) => {
	let scoreResults = {};
	try {
		
		const student = await getStudent( username );
		
		const state = student.student.ResidenceState;
		const major1 = student.student.Major1;
		const major2 = student.student.Major2;
		const SATMath = student.student.SATMath;
		const SATEBRW = student.student.SATEBRW;
		const ACTComposite = student.student.ACTComposite;
		const GPA = student.student.GPA;

		const IDList = collegeIDList.collegeIDs;
		let colleges = [];
		for (let i = IDList.length - 1; i >= 0; i--) {
			const c = await getCollegeByID( IDList[i] );
			colleges.push( c.college );
		}
		
		let score = 0;
		let maxScore = 0;

		let similarHS = await findSimilarHS( username );
		similarHS = similarHS.highschools.slice( 0, 3 );
		console.log( similarHS );

		for (let i = colleges.length - 1; i >= 0; i--) {

			score = 0;
			maxScore = 0;
			if ( state != null ) {
				maxScore += 10;
				if ( colleges[i].Location == state )
					score += 10;
				else if ( northeastRegion.includes( colleges[i].Location ) 
						&& northeastRegion.includes( state ) )
					score += 5;
				else if ( southRegion.includes( colleges[i].Location ) 
						&& southRegion.includes( state ) )
					score += 5;
				else if ( westRegion.includes( colleges[i].Location ) 
						&& westRegion.includes( state ) )
					score += 5;
				else if ( midwestRegion.includes( colleges[i].Location ) 
						&& midwestRegion.includes( state ) )
					score += 5;
			}

			const majors = await getMajorsByCollegeID( colleges[i].CollegeId );

			if ( major1 != null ) {
				maxScore += 5;
				for (let j = majors.length - 1; j >= 0; j--) {
					if ( majors[j].Major.toLowerCase().includes( major1.toLowerCase() ) )
						score += 5;
				}
			}
			if ( major2 != null) {
				maxScore += 5;
				for (let j = majors.length - 1; j >= 0; j--) {
					if ( major2 != null && majors[j].Major.toLowerCase().includes( major2.toLowerCase() ) )
						score += 5;
				}
			}
				
			if ( ACTComposite != null ) {
				maxScore += 10;
				let points = 10 - Math.floor( Math.abs( colleges[i].ACTComposite - ACTComposite ) / 2 );
				if (points > 0)
					score += points;
			}
			
			if ( SATMath != null ) {
				maxScore += 5;
				points = 5 - Math.floor( Math.abs( colleges[i].SATMath - SATMath ) / 25 );
				if (points > 0)
					score += points;
			}
				
			if ( SATEBRW != null ) {
				maxScore += 5;
				points = 5 - Math.floor( Math.abs( colleges[i].SATEBRW - SATEBRW ) / 25 );
				if (points > 0)
					score += points;
			}
			
			if ( GPA != null ) {
				maxScore += 10;
				points = 10 - Math.floor( Math.abs( colleges[i].GPA - GPA ) / 0.1 );
				if (points > 0)
					score += points;
			}
			


			scoreResults[ colleges[i].Name ] = score / maxScore;
		}

// Similar Students
// 10
// See section 1.2.1 for calculating similar students and how many recommendation points would be given.


	}
	catch (error) {
		return {
            error: 'calcScores failed',
            reason: error
        };
	}
	return {
		ok: 'Success',
        scores : scoreResults
	}

};
