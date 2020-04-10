import React, { useState } from 'react';
import {
    Button, Alert, Container, Row, Col,
} from 'react-bootstrap';
import {
    scrapeCollegeRanking, scrapeCollegeData, importCollegeScorecard, deleteAllStudents, importStudents, importStudentApplications,
} from '../../services/api/admin';
import ReactDOM from 'react-dom';

const Admin = () => {
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

    const toggleAll = (b) =>{
        setDisableRanking(b);
        setDisableScorecard(b);
        setDisableCollegeData(b);
        setDisableDelete(b);
        setDisableProfile(b);
    }

    const handleScrapeCollegeRankings = () => {
        toggleAll(true);
        setProgressAlert(true);
        setErrorAlert(false);
        setSuccessAlert(false);
        setProgressMessage('Scraping college ranking');
        scrapeCollegeRanking().then((result) => {
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
        toggleAll(false);
        });
    };

    const handleImportCollegeScorecard = () => {
        toggleAll(true);
        setProgressAlert(true);
        setErrorAlert(false);
        setSuccessAlert(false);
        setProgressMessage('Importing college scorecard');
        importCollegeScorecard().then((result) => {
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
            toggleAll(false);
        });
    };

    const handleScrapeCollegeData = () => {
        toggleAll(true);
        setProgressAlert(true);
        setProgressAlert(true);
        setErrorAlert(false);
        setSuccessAlert(false);
        setProgressMessage('Scraping CollegeData');
        scrapeCollegeData().then((result) => {
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
            toggleAll(false);
        });
    };

    const handleDeleteAllStudents = () => {
        toggleAll(true);
        setProgressAlert(true);
        setErrorAlert(false);
        setSuccessAlert(false);
        setProgressMessage('Deleting student profiles');
        deleteAllStudents().then((result) => {
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
            toggleAll(false);
        });
    };

    const handleImportStudentProfiles = () => {
        toggleAll(true);
        setDisableProfile(true);
        setProgressAlert(true);
        setProgressAlert(true);
        setErrorAlert(false);
        setSuccessAlert(false);
        setProgressMessage('Importing student profiles');
        importStudents().then((resultStudent) => {
            const errorString = [];
            if (resultStudent.error) {
                setProgressAlert(false);
                setErrorAlert(true);
                errorString.push(<h4 key="importStudentError" className="alert-heading">{resultStudent.error}</h4>);
                for (let i = 0; i < (resultStudent.reason).length; i += 1) {
                    errorString.push(<p key={`importStudentError-${i}`}>{resultStudent.reason[i].error}</p>);
                }
                setErrorMessage(errorString);
            }
            if (resultStudent.ok) {
                importStudentApplications().then((resultApp) => {
                    if (resultApp.error) {
                        setProgressAlert(false);
                        setErrorAlert(true);
                        errorString.push(<h4 key="importAppError" className="alert-heading">{resultApp.error}</h4>);
                        for (let i = 0; i < (resultApp.reason).length; i += 1) {
                            errorString.push(<p key={`importAppError-${i}`}>{resultApp.reason[i].error}</p>);
                        }
                        setErrorMessage(errorString);
                    }
                    if (resultApp.ok) {
                        setErrorAlert(false);
                        setProgressAlert(false);
                        setSuccessAlert(true);
                        setSuccessMessage('Student profile import complete.');
                    }
                });
            }
            toggleAll(false);
            setDisableProfile(false);
        });
    };

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
                    <Col sm="2" >
                        <Button onClick={(e) => { handleScrapeCollegeRankings(e); }} disabled={disableRanking} className={"float-right","btn1"}>Scrape College Rankings</Button>
                    </Col>
                </Row>
                <Row className="align-items-center mb-3">
                    <Col sm="10">
                        <h2>Import College Scorecard</h2>
                        <div>Overwrites Admission Rate, Institution Type, Location, Student Debt, and Size of colleges in database with information from the College Scorecard data file.</div>
                    </Col>
                    <Col sm="2" className="btn">
                        <Button onClick={(e) => { handleImportCollegeScorecard(e); }} disabled={disableScorecard} className={"float-right","btn1"}>Import College Scorecard</Button> 
                    </Col>
                </Row>
                <Row className="align-items-center mb-3">
                    <Col sm="10">
                        <h2>Scrape CollegeData.com</h2>
                        <div>Overwrites Cost of Attendance, Completion Rate, GPA, SAT and ACT scores of colleges in database with data from CollegeData.com</div>
                    </Col>
                    <Col sm="2" className="btn">
                        <Button onClick={(e) => { handleScrapeCollegeData(e); }} disabled={disableCollegeData} className={"float-right","btn1"}>Scrape CollegeData.com</Button>
                    </Col>
                </Row>
                <Row className="align-items-center mb-3">
                    <Col sm="10">
                        <h2>Delete All Student Profiles</h2>
                    </Col>
                    <Col sm="2" className="btn">
                        <Button onClick={(e) => { handleDeleteAllStudents(e); }} disabled={disableDelete} className={"float-right","btn1"}>Delete All Student Profiles</Button>
                    </Col>
                </Row>
                <Row className="align-items-center mb-3">
                    <Col sm="10">
                        <h2>Import Student Profile Dataset</h2>
                        <div>Imports student profiles to system databse with information included in the students and applications csv files</div>
                    </Col>
                    <Col sm="2" className="btn">
                        <Button onClick={(e) => { handleImportStudentProfiles(e); }} disabled={disableProfile} className={"float-right","btn1"}>Import Student Profile Dataset</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Admin;
