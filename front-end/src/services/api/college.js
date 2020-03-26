module.exports = {
    getCollegeByID: async function (collegeID) {
        try {
            let college = await fetch(`http://localhost:9000/colleges/${collegeID}`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                }
            });
            return await college.json();
        } catch (error) {
            return {
                error: error.message + ' college data'
            }
        }
    },
    getAllColleges: async function() {
        try {
            let college = await fetch(`http://localhost:9000/colleges/all`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                }
            });
            return await college.json();
        } catch (error) {
            return {
                error: error.message + ' college data'
            }
        }
    }
};