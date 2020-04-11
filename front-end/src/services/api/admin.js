const admin = {
    scrapeCollegeRanking: async function scrapeCollegeRanking() {
        try {
            const result = await fetch('/admin/scrapeCollegeRanking', {
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
            const result = fetch('/admin/deleteStudentProfiles', {
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
            const result = await fetch('/admin/scrapeCollegeData', {
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
            const result = await fetch('/admin/importCollegeScorecard', {
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
            const result = await fetch('/admin/importStudents', {
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
            const result = await fetch('/admin/importApplications', {
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
            const result = await fetch('/admin/verifyAdmin', {
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
};

export default admin;