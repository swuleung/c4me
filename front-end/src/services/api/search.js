module.exports = {
   searchCollege: async function searchCollege() {
        try {
            let searchCollege = await fetch('http://localhost:9000/searcg/', {
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
                    costInStateMin : costInStateMin,
                    costOutOfStateMax : costOutOfStateMax,
                    major : major,
                    major2 : major2
                }),
                credentials: 'include',
            });
            return await login.json();
        } catch (error) {
            return {
                error: `Search failure ${error.message}`,
            };
        }
    }
};
