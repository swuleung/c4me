const student = {
    /**
     * Edits the student information in database with a POST
     * @param {string} username
     * @param {Object} studentInfo
     * @param {Object} highSchoolInfo
     */
    editStudent: async function editStudent(username, studentInfo, highSchoolInfo) {
        try {
            const student = await fetch(`/students/${username}/edit`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({ student: studentInfo, highSchool: highSchoolInfo }),
            });
            return await student.json();
        } catch (error) {
            return {
                error: `${error.message} student data`,
            };
        }
    },
    /**
     * Get the student information associated to username with a GET
     * @param {string} username
     */
    getStudent: async function getStudent(username) {
        try {
            const student = await fetch(`/students/${username}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            return await student.json();
        } catch (error) {
            return {
                error: `${error.message} student data`,
            };
        }
    },
    /**
     * Edit student's applications with a POST
     * @param {string} username
     * @param {string} applications
     */
    editStudentApplications: async function editStudentApplications(username, applications) {
        try {
            const newApplications = await fetch(`/students/${username}/applications/edit`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({ applications: applications }),
            });
            return await newApplications.json();
        } catch (error) {
            return {
                error: `${error.message} student data`,
            };
        }
    },
    /**
     * Gets the student's applications with a GET
     * @param {string} username
     */
    getStudentApplications: async function getStudentApplications(username) {
        try {
            const applications = await fetch(`/students/${username}/applications`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });
            return await applications.json();
        } catch (error) {
            return {
                error: `${error.message} student data`,
            };
        }
    },
};

export default student;
