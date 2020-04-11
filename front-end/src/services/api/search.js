module.exports = {
   getSearchResults: async function getSearchResults() {
        try {
            let getSearchResults = await fetch('http://localhost:9000/searcg/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({
                    region : region,
                    SATEBRWMin: SATEBRWMin,
                    SATEBRWMax: SATEBRWMax,
                    SATMathMin : SATMathMin,
                    SATMathMax : SATMathMax,
                    name : name,
                    ACTCompositeMin : ACTCompositeMin,
                    ACTCompositeMax : ACTCompositeMax,
                    costInStateMax : costInStateMax,
                    costOutOfStateMax : costOutOfStateMax,
                    major : major,
                    major2 : major2
                }),
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
