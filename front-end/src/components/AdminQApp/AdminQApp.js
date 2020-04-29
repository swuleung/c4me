import React, { useState, useEffect } from 'react';
import {
    Button, Container, Row, Col, Table, Form, Alert,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import admin from '../../services/api/admin';
import './AdminQApp.scss';

const AdminQApp = () => {
    const [applications, setApplications] = useState([]);
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // get all the questionable acceptance decisions
        admin.getQuestionableApplications().then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.reason);
            }
            if (result.ok) {
                const apps = result.applications;
                for (let i = 0; i < apps.length; i += 1) {
                    for (let j = 0; j < apps[i].Colleges.length; j += 1) {
                        apps[i].Colleges[j].approval = false;
                    }
                }
                console.log(result.applications);
                setApplications(result.applications);
            }
        });
    }, []);


    /**
     * Changes the verification setting
     * @param {event} e
     */
    const handleVerificationChange = (e, verificationSetting) => {
        const indexUser = e.target.getAttribute('indexuser');
        const indexCollege = e.target.getAttribute('indexcollege');
        const newApplications = [...applications];
        newApplications[indexUser].Colleges[indexCollege].approval = verificationSetting;
        setApplications(newApplications);
    };

    /**
     *
     */
    const handleSubmitChanges = () => {
        const approvedApplications = [];
        for (let i = 0; i < applications.length; i += 1) {
            const colleges = applications[i].Colleges;
            for (let j = 0; j < colleges.length; j += 1) {
                if (colleges[j].approval) {
                    const app = colleges[j].Application;
                    app.IsQuestionable = false;
                    approvedApplications.push(app);
                }
            }
        }
        console.log(approvedApplications);
        // send approved applications to back-eend
    };

    const renderQApps = () => {
        const appsHTML = [];
        for (let i = 0; i < applications.length; i += 1) {
            const currentUser = applications[i];
            for (let j = 0; j < currentUser.Colleges.length; j += 1) {
                const college = currentUser.Colleges[j];
                appsHTML.push(
                    <tr key={`app-${i}-${j}`}>
                        <td>
                            <Link to={`/profile/${currentUser.Username}`} target="_blank">
                                {currentUser.Username}
                            </Link>
                        </td>
                        <td className={college.Application.Status}>
                            {college.Application.Status}
                        </td>
                        <td>
                            <Link to={`/colleges/${college.CollegeId}`} target="_blank">
                                {college.Name}
                            </Link>
                        </td>
                        <td>
                            {college.approval
                                ? (
                                    <span
                                        role="button"
                                        tabIndex={i}
                                        className="deny"
                                        indexuser={i}
                                        indexcollege={j}
                                        onClick={(e) => { handleVerificationChange(e, false); }}
                                        onKeyDown={(e) => { handleVerificationChange(e, false); }}
                                    >
                                    Deny
                                    </span>
                                )
                                : (
                                    <span
                                        role="button"
                                        tabIndex={i}
                                        className="approve"
                                        indexuser={i}
                                        indexcollege={j}
                                        onClick={(e) => { handleVerificationChange(e, true); }}
                                        onKeyDown={(e) => { handleVerificationChange(e, true); }}
                                    >
                                    Approve
                                    </span>
                                )}

                        </td>
                    </tr>,
                );
            }
        }
        return appsHTML;
    };

    return (
        <Container>
            <h1>
                Questionable Acceptance Decisions
            </h1>
            <p>
                Validate questionable acceptance decisions. Click on the username or college to go to their respective profiles. Verify an application by clicking approve. You must click on "Save Changes" at the bottom for changes to be saved in the database.
            </p>
            {errorAlert
                ? <Alert variant="danger">{errorMessage}</Alert>
                : (
                    <Form onSubmit={(e) => { e.preventDefault(); handleSubmitChanges(); }}>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Status</th>
                                    <th>College</th>
                                    <th>Verification</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderQApps()}
                            </tbody>
                        </Table>
                        <Button className="btn-block" variant="primary" type="submit">
                    Save Changes
                        </Button>
                    </Form>
                )}
        </Container>
    );
};


export default AdminQApp;
