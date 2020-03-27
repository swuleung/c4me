module.exports = {
    DeleteAllUsers: async function() {
        try{
            fetch("http://localhost:9000/admin/deleteStudentProfiles", {
                method: "GET",
                credentials: 'include',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                }
            });
        }
        catch(err){
            return {error: error,
                reason: error
            }
        }
    }
};