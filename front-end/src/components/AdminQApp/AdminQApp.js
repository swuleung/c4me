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




/**
 * 
 * This just returns the name of the unversity wrt collegeID
 * @param {int} id
 * College ID that pairs with the name to return
 *
 */
const getName = (id) => {
        for (var i = 0 ; i < qUnis.length; i ++){
            if (id == qUnis.CollegeId){ return (qUnis.Name);}
        }
        return ("");
}



/**
 * 
 * Updates the application to be marked unQuestionable
 * 
 * @param {string} uName 
 * The username of the Application
 * @param {int} college 
 * The College ID of the application
 */
const isNotQuestionable = (uName, college) => {
       admin.notQuestionable(uName,college).then((result) => {
        if (result.ok){
            console.log(result.ok);
        }
        else{
            console.log(result);
        }
       });

       //remove element from front end
    }


/**
 * 
 * Have this app dissapear from the UI
 * (ideally isNotQuestionable can still call this, as this is 
 *  just updating what the admin sees and nothing in the back-end
 *  changes)
 * 
 */
const isStillQuestionable = (idx) => {}

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

                                //For some reason, this would not update
                                //with the proper cross-listed university.
                                //     getName(qApps[i].college)
                                     
                                                                
                            }
                        </td>
                        <td>
                            {
                                //
                                //The value i is the index within
                                // the qApps array of the application
                                // to be marked unquestionable
                                //onClick={ /*isNotQuestionable(qApps[i].username,qApps[i].college)*/}
                            }
                            <Button>Not Questionable</Button>
                        </td>
                        <td>
                            {


                                //
                                //
                                //onClick={isStillQuestionable(i)}
                                //

                            }
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