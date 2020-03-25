import { Form, Button, Alert } from '../../../node_modules/react-bootstrap';
import './DeleteAllUsers.scss';
import { Link } from '../../../node_modules/react-router-dom';


const DeleteAllUsers =  (props) => {
    console.log(props);
    fetch("http://localhost:9000/users/delete", 
        {
            method: 'DELETE',
            body: {username:'admin'}
        }
    ).catch((error) => {
        console.log("DeleteError");
        console.log(error);
    });

    return(
        console.log("Deleted All Users (except admin)")
    );



};


export default DeleteAllUsers;