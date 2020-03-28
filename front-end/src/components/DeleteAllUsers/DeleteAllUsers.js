import './DeleteAllUsers.scss';


const DeleteAllUsers =  (props) => {
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
    catch(error){
        return {error: error,
                reason: error
            }
    }
};


export default DeleteAllUsers ;