const search = {
    /**
     *
     * @param {filter} filters All the filters for a college to be applied
     * @param {string} sortBy The sort attribute to sort by
     * @param {string} sortDirection The sort direction: either acending or descending
     */
    getSearchResults: async function getSearchResults(filters, sortBy, sortDirection) {
        try {
            const filtersToSend = { ...filters };
            if (sortBy !== 'none') {
                filtersToSend.sortAttribute = sortBy;
                filtersToSend.sortDirection = sortDirection;
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

export default search;
