import React, { useState, useEffect } from "react";
import {
    Button, Container, Row, Col, Table
} from 'react-bootstrap';
import admin from '../../services/api/admin';

const AdminQApp = () => {

    const [qApps, setQApps]  =   useState([]);

    useEffect(() => {
        admin.getQuestionableApplications().then((resultApp) => {
            // if (resultApp.error) {
            //     setErrorAlert(true);
            //     errorString.push(<h4 key="importAppError" className="alert-heading">{resultApp.error}</h4>);
            //     if (resultApp.reason) {
            //         for (let i = 0; i < (resultApp.reason).length; i += 1) {
            //             errorString.push(<p key={`importAppError-${i}`}>{resultApp.reason[i].error}</p>);
            //         }
            //         setErrorMessage([...errorMessage, ...errorString]);
            //     } else {
            //         setErrorMessage('Process may have timed out');
            //     }
            // } fix error catching
            
            if (resultApp.ok) {
                console.log(resultApp.Result);
                setQApps( resultApp.Result );
            }
        });
    },[]
    );


    const renderQApps = () => {
        const appsHTML = [];
                for (var i = 0 ; i < qApps.length; i++){
                    appsHTML.push(
                        <tr className="application" key={i}>
                        <td>
                            {qApps[i].username}
                        </td>
                        <td className={qApps[i].status}>
                            {qApps[i].status}
                        </td>
                        <td className={"college"+qApps[i].college}>
                            {qApps[i].college}
                        </td>
                    </tr>,
                    );
                }
                console.log(appsHTML);
        return appsHTML;
    }

    return ( 
    
    
    
    
    <Container>
    { renderQApps() }
</Container>    

    ) ;







}





export default AdminQApp;