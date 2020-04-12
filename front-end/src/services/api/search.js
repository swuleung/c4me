module.exports = {
   getSearchResults: async function getSearchResults( filters ) {
        try {
            const getSearchResults = await fetch('http://localhost:9000/searcg/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({ filters: filters }),
                
            });
            return await getSearchResults.json();
        } catch (error) {
            return {
                error: `Search failure ${error.message}`,
            };
        }
    }
};
