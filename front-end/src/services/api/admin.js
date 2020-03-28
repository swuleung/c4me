module.exports = {
    scrapeCollegeRanking: async function () {
        try {
            let result = await fetch(`http://localhost:9000/admin/scrapeCollegeRanking`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                }
        });
        return await result.json();
        } catch (error) {
            return {
                error: error.message + ' sql data'
            }
        }
    },
    deleteAllUsers: async function() {
        try{
            fetch("http://localhost:9000/admin/deleteStudentProfiles", {
                method: "GET",
                credentials: 'include',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                }
            });
            return await result.json();
        } catch (error) {
            return {
                error: error.message + ' sql data'
            }
        }
    },
    scrapeCollegeData: async function () {
        try {
            let result = await fetch(`http://localhost:9000/admin/scrapeCollegeData`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                }
            });
            return await result.json();
        } catch (error) {
            return {
                error: error.message + ' sql data'
            }
        }
    },
    importCollegeScorecard: async function () {
        try {
            let result = await fetch(`http://localhost:9000/admin/importCollegeScorecard`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
            });
            return await result.json()
        } catch (error) {
            return {
                error: error.message + ' sql data'
            }
        }
    }
}