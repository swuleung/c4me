const highSchool = {
    /**
     * Get all high schools from the database with a GET
     */
    getAllHighSchools: async function getAllHighSchools() {
        try {
            const highSchools = await fetch('/highSchools/all', {
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
                error: `${error.message} high school data`,
            };
        }
    },
};

export default highSchool;
