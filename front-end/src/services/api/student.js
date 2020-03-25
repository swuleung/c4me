module.exports = {
    editStudent: async function (username, studentInfo) {
        try {
            let student = await fetch(`http://localhost:9000/students/${username}/edit`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(studentInfo)
            })
            return await student.json();
        } catch (error) {
            return {
                error: error.message + ' student data'
            }
        }
    },
    getStudent: async function (username) {
        try {
            let student = await fetch(`http://localhost:9000/students/${username}`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                }
            });
            return await student.json();
        } catch (error) {
            return {
                error: error.message + ' student data'
            }
        }
    },
    editStudentApplications: async function (username, applications) {
        try {
            let newApplications = await fetch(`http://localhost:9000/students/${username}/applications/edit`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({ applications: applications })
            });
            return await newApplications.json()
        } catch (error) {
            return {
                error: error.message + ' student data'
            }
        }
    },
    getStudentApplications: async function (username) {
        try {
            let applications = await fetch(`http://localhost:9000/students/${username}/applications`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                },
            });
            return await applications.json()
        } catch (error) {
            return {
                error: error.message + ' student data'
            }
        }
    }
};