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
    }
}