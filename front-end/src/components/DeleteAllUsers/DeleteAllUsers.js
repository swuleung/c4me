import React, { useState } from '../../../node_modules/react';
import { Link } from '../../../node_modules/react-router-dom';
import { Form, Button, Alert } from '../../../node_modules/react-bootstrap';
import './DeleteAllUsers.scss';


const DeleteAllUsers =  (props) => {
    console.log(props);
    try{
        console.log(props);
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
        console.log(":^<");
    }
};


export default DeleteAllUsers ;