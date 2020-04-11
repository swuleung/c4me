module.exports = {
   getSearchResults: async function getSearchResults( filters ) {
        try {
            let getSearchResults = await fetch('http://localhost:9000/searcg/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({ filters: filters }),
                credentials: 'include',
            });
            return await getSearchResults.json();
        } catch (error) {
            return {
                error: `Search failure ${error.message}`,
            };
        }
    }
};
