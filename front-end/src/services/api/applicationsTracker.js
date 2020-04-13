const applicationsTracker = {
    /**
     *  Get the applications tracker information by sending the filters that are passed by the component
     * @param {integer} collegeID
     * @param {filter object} filters
     */
    getApplicationsTrackerData: async function getApplicationsTrackerData(collegeID, filters) {
        try {
            const applications = await fetch(`http://localhost:9000/colleges/id/${collegeID}/applications`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({ filters: filters }),
            });
            return await applications.json();
        } catch (error) {
            return {
                error: `${error.message} in getting applications tracker data`,
            };
        }
    },
};

export default applicationsTracker;
