const admin = {
    /**
     * Send a GET request to scrape college ranking and return response
     */
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
                error: `${error.message}`,
            };
        }
    },
    /**
     * Send a DELETE request to delete all students and return response
     */
    deleteAllStudents: async function deleteAllStudents() {
        try {
            const result = await fetch('/admin/deleteStudentProfiles', {
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
    /**
     * Send a GET request to scrape college data and return response
     */
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
                error: `${error.message}`,
            };
        }
    },
    /**
     * Send a GET request to import college score card and return response
     */
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
                error: `${error.message}`,
            };
        }
    },
    /**
     * Send a GET request to import students and return response
     */
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
                error: `${error.message}`,
            };
        }
    },
    /**
     * Send a GET request to import applications and return response
     */
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
                error: `${error.message}`,
            };
        }
    },
    /**
     * Send a GET request to verify admin status of current user and return response
     */
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
                error: `${error.message}`,
            };
        }
    },

    /**
     * Send a GET request for all Questionable Applications
     */
    getQuestionableApplications: async function getQuestionableApplications() {
        try {
            const qApps = await fetch('/admin/questionable-decisions', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            return qApps.json();
        } catch (error) {
            return {
                error: `${error.message}`,
            };
        }
    },
    updateApplications: async function updateApplications(applications) {
        try {
            const result = await fetch('/admin/update-applications ', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({
                    applications: applications,
                }),
            });

            return await result.json();
        } catch (error) {
            return {
                error: `Create account failure ${error.message}`,
            };
        }
    },
};

export default admin;
