module.exports = {
    getAllHighSchools: async function getAllHighSchools() {
        try {
            const highSchools = await fetch('http://localhost:9000/highSchools/all', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            return await highSchools.json();
        } catch (error) {
            return {
                error: `${error.message} college data`,
            };
        }
    },
    getHighSchoolByUser: async function getHighSchoolByUser(username) {
        try {
            const highSchool = await fetch(`http://localhost:9000/highSchools/${username}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            return await highSchool.json();
        } catch(error) {
            return {
                error: `${error.message} high school data`
            }
        }
    },
    editHighSchool: async function editHighSchool(username, highSchool) {
        try {
            const newHighSchool = await fetch(`http://localhost:9000/highSchools/${username}/edit`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({ highSchool: highSchool }),
            });
            return await newHighSchool.json();
        } catch (error) {
            return {
                error: `${error.message} high school data`,
            };
        }
    },
}