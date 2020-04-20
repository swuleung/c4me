module.exports = {
    getSearchResults: async function getSearchResults(filters, sortBy) {
        try {
            const filtersToSend = { ...filters };
            if (sortBy !== 'none') {
                filtersToSend.sortAttribute = sortBy;
                filtersToSend.sortDirection = 'ASC';
            }
            const results = await fetch('http://localhost:9000/search/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({ filters: filtersToSend }),

            });
            return await results.json();
        } catch (error) {
            return {
                error: `Search failure ${error.message}`,
            };
        }
    },
};
