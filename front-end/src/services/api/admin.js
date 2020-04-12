module.exports = {
    scrapeCollegeRanking: async function scrapeCollegeRanking() {
        try {
            const result = await fetch('http://localhost:9000/admin/scrapeCollegeRanking', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            return await result.json();
        } catch (error) {
            return {
                error: `${error.message} sql data`,
            };
        }
    },
    deleteAllStudents: async function deleteAllStudents() {
        try {
            const result = fetch('http://localhost:9000/admin/deleteStudentProfiles', {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            return await result;
        } catch (error) {
            return {
                error: error.message,
            };
        }
    },
    scrapeCollegeData: async function scrapeCollegeData() {
        try {
            const result = await fetch('http://localhost:9000/admin/scrapeCollegeData', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            return await result.json();
        } catch (error) {
            return {
                error: `${error.message} sql data`,
            };
        }
    },
    importCollegeScorecard: async function importCollegeScorecard() {
        try {
            const result = await fetch('http://localhost:9000/admin/importCollegeScorecard', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            return await result.json();
        } catch (error) {
            return {
                error: `${error.message} sql data`,
            };
        }
    },
    importStudents: async function importStudents() {
        try {
            const result = await fetch('http://localhost:9000/admin/importStudents', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            return await result.json();
        } catch (error) {
            return {
                error: `${error.message} sql data`,
            };
        }
    },
    importStudentApplications: async function importStudentApplications() {
        try {
            const result = await fetch('http://localhost:9000/admin/importApplications', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            return await result.json();
        } catch (error) {
            return {
                error: `${error.message} sql data`,
            };
        }
    },
    verifyAdmin: async function verifyAdmin() {
        try {
            const result = await fetch('http://localhost:9000/admin/verifyAdmin', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            return await result.json();
        } catch (error) {
            return {
                error: `${error.message} sql data`,
            };
        }
    },

    getApplications: async function getApplications(){
        try {
            const result = await fetch('http://localhost:9000/admin/getApplications', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            return await result.json();
        } catch (error) {
            return {
                error: `${error.message} sql data`,
            };
        }
    }
};
