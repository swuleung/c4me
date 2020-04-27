import React, { useState } from 'react';
import {
    Button, Alert, Container, Row, Col, Table
} from 'react-bootstrap';
import admin from '../../services/api/admin';

const Admin = () => {
    // state variables
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [progressAlert, setProgressAlert] = useState(false);
    const [progressMessage, setProgressMessage] = useState('');
    const [successAlert, setSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [disableRanking, setDisableRanking] = useState(false);
    const [disableScorecard, setDisableScorecard] = useState(false);
    const [disableCollegeData, setDisableCollegeData] = useState(false);
    const [disableDelete, setDisableDelete] = useState(false);
    const [disableProfile, setDisableProfile] = useState(false);
    const [disableViewApps,setDisableViewApps] = useState(false);

    const toggleProfiles = (b) =>{
        setDisableDelete(b);
        setDisableProfile(b);
    }
    
    /**
     * Handle the button click for scrape college rankings
     */
    const handleScrapeCollegeRankings = () => {
        setDisableRanking(true);
        setProgressAlert(true);
        setErrorAlert(false);
        setSuccessAlert(false);
        setProgressMessage('Scraping college ranking');
        admin.scrapeCollegeRanking().then((result) => {
            if (result.error) {
                setProgressAlert(false);
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
                setProgressAlert(false);
                setSuccessAlert(true);
                setSuccessMessage('College ranking scraping complete.');
            }
            setDisableRanking(false);
        });
    };

    /**
     * Handle the button click for import college scorecard
     */
    const handleImportCollegeScorecard = () => {
        setDisableScorecard(true);
        setProgressAlert(true);
        setErrorAlert(false);
        setSuccessAlert(false);
        setProgressMessage('Importing college scorecard');
        admin.importCollegeScorecard().then((result) => {
            if (result.error) {
                setProgressAlert(false);
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
                setProgressAlert(false);
                setSuccessAlert(true);
                setSuccessMessage('College scorecard import complete.');
            }
            setDisableScorecard(false);
        });
    };

    /**
     * Handle the button click for scrape college data
     */
    const handleScrapeCollegeData = () => {
        setDisableCollegeData(true);
        setProgressAlert(true);
        setProgressAlert(true);
        setErrorAlert(false);
        setSuccessAlert(false);
        setProgressMessage('Scraping CollegeData');
        admin.scrapeCollegeData().then((result) => {
            if (result.error) {
                setProgressAlert(false);
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
                setProgressAlert(false);
                setSuccessAlert(true);
                setSuccessMessage('CollegeData scraping complete.');
            }
            setDisableCollegeData(false);
        });
    };

    /**
     * Handle button click for delete all students
     */
    const handleDeleteAllStudents = () => {
        toggleProfiles(true);
        setProgressAlert(true);
        setErrorAlert(false);
        setSuccessAlert(false);
        setProgressMessage('Deleting student profiles');
        admin.deleteAllStudents().then((result) => {
            if (result.error) {
                setProgressAlert(false);
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
                setProgressAlert(false);
                setSuccessAlert(true);
                setSuccessMessage('Delete student profiles complete');
            }
            toggleProfiles(false);
        });
    };

    /**
     * Handle the button click for import student profiles
     */
    const handleImportStudentProfiles = () => {
        toggleProfiles(true);
        setProgressAlert(true);
        setProgressAlert(true);
        setErrorAlert(false);
        setSuccessAlert(false);
        setProgressMessage('Importing student profiles');
        admin.importStudents().then((resultStudent) => {
            const errorString = [];
            if (resultStudent.error) {
                setProgressAlert(false);
                setErrorAlert(true);
                errorString.push(<h4 key="importStudentError" className="alert-heading">{resultStudent.error}</h4>);
                if (resultStudent.reason) {
                    for (let i = 0; i < (resultStudent.reason).length; i += 1) {
                        errorString.push(<p key={`importStudentError-${i}`}>{resultStudent.reason[i].error}</p>);
                    }
                    setErrorMessage(errorString);
                } else {
                    setErrorMessage('Process may have timed out');
                }
            }
            // import applications even with errors from import students
            admin.importStudentApplications().then((resultApp) => {
                if (resultApp.error) {
                    setProgressAlert(false);
                    setErrorAlert(true);
                    errorString.push(<h4 key="importAppError" className="alert-heading">{resultApp.error}</h4>);
                    if (resultApp.reason) {
                        for (let i = 0; i < (resultApp.reason).length; i += 1) {
                            errorString.push(<p key={`importAppError-${i}`}>{resultApp.reason[i].error}</p>);
                        }
                        setErrorMessage([...errorMessage, ...errorString]);
                    } else {
                        setErrorMessage('Process may have timed out');
                    }
                }
                if (resultApp.ok) {
                    setProgressAlert(false);
                    setSuccessAlert(true);
                    setSuccessMessage('Student profile import complete.');
                }
            });
            toggleProfiles(false);
            setDisableProfile(false);
        });
    };

    /**
     * Entry point in viewing Questionable Applications
     */

     const handleViewQuestionableApplications = () => {
        const errorString = [];
        var apps = [];
        setDisableViewApps(true);
        admin.getQuestionableApplications().then((resultApp) => {
            if (resultApp.error) {
                setErrorAlert(true);
                errorString.push(<h4 key="importAppError" className="alert-heading">{resultApp.error}</h4>);
                if (resultApp.reason) {
                    for (let i = 0; i < (resultApp.reason).length; i += 1) {
                        errorString.push(<p key={`importAppError-${i}`}>{resultApp.reason[i].error}</p>);
                    }
                    setErrorMessage([...errorMessage, ...errorString]);
                } else {
                    setErrorMessage('Process may have timed out');
                }
            }
            if (resultApp.ok) {
                apps = resultApp.Result;
            }
        });

        if (apps.length){
            var appsHTML = [];
                for (var i = 0 ; i < apps.length; i++){
                    appsHTML.push(
                        <tr className="application" key={i}>
                        <td>
                            {apps[i].username}
                        </td>
                        <td className={apps[i].status}>
                            {apps[i].status}
                        </td>
                        <td className={"college"+apps[i].college}>
                            {apps[i].college}
                        </td>
                    </tr>,
                    );
                }
            setDisableViewApps(false);
            return appsHTML;
        }
        setDisableViewApps(false);
        return null;

     }

    // display the Admin page
    return (
        <div>
            {errorAlert
                && (
                    <Alert variant="danger">
                        {errorMessage}
                    </Alert>
                )}
            {progressAlert
                && (
                    <Alert variant="warning">
                        {progressMessage}
                    </Alert>
                )}
            {successAlert
                && (
                    <Alert variant="success">
                        {successMessage}
                    </Alert>
                )}
            <Container>
                <Row className="align-items-center mb-3">
                    <Col sm="10">
                        <h2>Scrape College Rankings</h2>
                        <div>Overwrites the ranking of colleges in database with WSJ/THE 2020 rankings</div>
                    </Col>
                    <Col sm="2">
                        <Button onClick={(e) => { handleScrapeCollegeRankings(e); }} disabled={disableRanking} className="float-right">Scrape College Rankings</Button>
                    </Col>
                </Row>
                <Row className="align-items-center mb-3">
                    <Col sm="10">
                        <h2>Import College Scorecard</h2>
                        <div>Overwrites Admission Rate, Institution Type, Location, Student Debt, and Size of colleges in database with information from the College Scorecard data file.</div>
                    </Col>
                    <Col sm="2">
                        <Button onClick={(e) => { handleImportCollegeScorecard(e); }} disabled={disableScorecard} className="float-right">Import College Scorecard</Button>
                    </Col>
                </Row>
                <Row className="align-items-center mb-3">
                    <Col sm="10">
                        <h2>Scrape CollegeData.com</h2>
                        <div>Overwrites Cost of Attendance, Completion Rate, GPA, SAT and ACT scores of colleges in database with data from CollegeData.com</div>
                    </Col>
                    <Col sm="2">
                        <Button onClick={(e) => { handleScrapeCollegeData(e); }} disabled={disableCollegeData} className="float-right">Scrape CollegeData.com</Button>
                    </Col>
                </Row>
                <Row className="align-items-center mb-3">
                    <Col sm="10">
                        <h2>Delete All Student Profiles</h2>
                    </Col>
                    <Col sm="2">
                        <Button onClick={(e) => { handleDeleteAllStudents(e); }} disabled={disableDelete} className="float-right">Delete All Student Profiles</Button>
                    </Col>
                </Row>
                <Row className="align-items-center mb-3">
                    <Col sm="10">
                        <h2>Import Student Profile Dataset</h2>
                        <div>Imports student profiles to system databse with information included in the students and applications csv files</div>
                    </Col>
                    <Col sm="2">
                        <Button onClick={(e) => { handleImportStudentProfiles(e); }} disabled={disableProfile} className="float-right">Import Student Profile Dataset</Button>
                    </Col>
                </Row>
                <Row className="align-items-center mb-3">
                    <Col sm="6">
                        <h3>Review Questionable Applications</h3>
                        </Col>
                    <Col sm="6">
                        <Button onClick={(e) => { handleViewQuestionableApplications(e); }} disabled={disableViewApps} className="float-right">View Questionable Applications</Button>
                    </Col>
                </Row>
                <Row className="align-items-center mb-3">
                    <Col sm="12">
                        <Table className="table-striped">
                            <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Status</th>
                                        <th>c4me.live/colleges/_?_</th>
                                    </tr>
                                </thead>
                                <body>
                                    {/* {handleViewQuestionableApplications()} */}
                                </body>
                        </Table>
                    </Col>
                </Row>

            </Container>
        </div>
    );
};

export default Admin;
