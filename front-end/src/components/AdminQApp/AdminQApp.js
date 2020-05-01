/**
 * This component is where the admin can set an application to not questionable.
 */
import React, { useState, useEffect } from 'react';
import {
    Button, Container, Table, Form, Alert, Spinner,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import admin from '../../services/api/admin';
import './AdminQApp.scss';

const AdminQApp = () => {
    const [applications, setApplications] = useState([]);
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        // get all the questionable acceptance decisions
        setShowSpinner(true);
        admin.getQuestionableApplications().then((result) => {
            setShowSpinner(false);
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
     * Update the applications that have been changed and re-fetch applications
     */
    const handleSubmitChanges = () => {
        const approvedApplications = [];
        for (let i = 0; i < applications.length; i += 1) {
            const colleges = applications[i].Colleges;
            for (let j = 0; j < colleges.length; j += 1) {
                if (colleges[j].approval) {
                    const app = colleges[j].Application;
                    approvedApplications.push(app);
                }
            }
        }
        // send approved applications to back-eend
        admin.updateApplications(approvedApplications).then((result) => {
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
                setApplications(result.applications);
            }
        });
    };

    /**
     * Render each row for each user's questionable acceptance decisions
     */
    const renderQApps = () => {
        const appsHTML = [];
        for (let i = 0; i < applications.length; i += 1) {
            const currentUser = applications[i];
            // for each user, get all the applications that are questionable
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
                Validate questionable acceptance decisions. Click on the username or college to go to their respective profiles. Verify an application by clicking approve. You must click on &quot;Save Changes&quot; at the bottom for changes to be saved in the database.
            </p>
            {errorAlert
                ? <Alert variant="danger">{errorMessage}</Alert>
                : showSpinner
                    ? (
                        <div className="text-center">
                            <Spinner className="large-spinner" style={{ width: '10rem', height: '10rem' }} animation="grow" variant="primary" />
                        </div>
                    )

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
