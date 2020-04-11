const college = {
    getCollegeByID: async function getCollegeByID(collegeID) {
        try {
            const college = await fetch(`http://localhost:9000/colleges/id/${collegeID}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            return await college.json();
        } catch (error) {
            return {
                error: `${error.message} college data`,
            };
        }
    },
    getAllColleges: async function getAllColleges() {
        try {
            const college = await fetch('http://localhost:9000/colleges/all', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            return await college.json();
        } catch (error) {
            return {
                error: `${error.message} college data`,
            };
        }
    },
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