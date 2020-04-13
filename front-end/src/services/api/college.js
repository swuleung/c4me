const college = {
    /**
     *  Get the college information of one college with a GET
     * @param {integer} collegeID
     */
    getCollegeByID: async function getCollegeByID(collegeID) {
        try {
            const collegeInfo = await fetch(`/colleges/id/${collegeID}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            return await collegeInfo.json();
        } catch (error) {
            return {
                error: `${error.message} college data`,
            };
        }
    },
    /**
     * Get all colleges from the database with a GET
     */
    getAllColleges: async function getAllColleges() {
        try {
            const allColleges = await fetch('/colleges/all', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            return await allColleges.json();
        } catch (error) {
            return {
                error: `${error.message} college data`,
            };
        }
    },
    /**
     *  Get the specified college's major
     * @param {integer} collegeID
     */
    getMajorsByCollegeID: async function getMajorsByCollegeID(collegeID) {
        try {
            const majors = await fetch(`http://localhost:9000/colleges/id/${collegeID}/majors`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            return await majors.json();
        } catch (error) {
            return {
                error: `${error.message} major data data for ${collegeID}`,
            };
        }
    },
};

export default college;
