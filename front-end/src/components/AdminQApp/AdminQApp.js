import React, { useState, useEffect } from "react";
import {
    Button, Container, Row, Col, Table
} from 'react-bootstrap';
import admin from '../../services/api/admin';

const AdminQApp = () => {

    const [qApps, setQApps]  =   useState([]);
    const [qUnis, setQUnis]  =   useState([]);

    useEffect(() => {
        admin.getQuestionableApplications().then((resultApp) => {
            if (resultApp.errorMsg) {
                console.log("Error in querying questionable applications")
            }
            else if (resultApp.ok) {
                if (resultApp.Result.error){
                    console.log(resultApp.Result.reason);
                }
                else{
                    setQApps( resultApp.Result.qApps);
                    setQUnis(resultApp.Result.qUnis);
                }
            }
        });
    },[]
    );


    const getName = (id) => {
        console.log("getNAame");
        for (var i = 0 ; i < qUnis.length; i ++){
            if (id == qUnis.CollegeId){ return (qUnis.Name);}
        }
        return ("");
    }


    const isNotQuestionable = (App) => {
       // admin.notQuestionable(qApps[idx]);        
    }

    const isStillQuestionable = (idx) => {


        ///Just remove the html element from the front en
    }

    const renderQApps = () => {
        const appsHTML = [];
                for (var i = 0 ; i < qApps.length; i++){
                    var s = "";

                appsHTML.push(
                        <tr className="application" key={i}>
                        <td>
                            {qApps[i].username}
                        </td>
                        <td className={qApps[i].status}>
                            {qApps[i].status}
                        </td>
                         <td className={"college"+qApps[i].college}>
                            {
                                     getName(qApps[i].college)
                                     
                                    //WHY DOES THIS NOT WORK         
                                     
                                     
                            }
                        </td>
                        <td>
                            <Button onClick={ isNotQuestionable(qApps[i])}>Not Questionable</Button>
                        </td>
                        <td>
                            <Button>Questionable</Button>
                        </td>
                        
                    </tr>,
                    );
                }
        return appsHTML;
    }

    return ( 
    <Container>
        <Table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Status</th>
                    <th>University</th>
                </tr>
            </thead>
            <tbody>
             { renderQApps() }
            </tbody>
        </Table>
    </Container>
    ) ;







}





export default AdminQApp;