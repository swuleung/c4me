import React, { useState } from 'react';
import { Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { scrapeCollegeRanking, scrapeCollegeData, importCollegeScorecard, deleteAllStudents } from '../../services/api/admin';

const Admin = (props) => {
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleScrapeCollegeRankings = () => {
        scrapeCollegeRanking().then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
            }
        });
    }

    const handleImportCollegeScorecard = () => {
        importCollegeScorecard().then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
            }
        });
    }

    const handleScrapeCollegeData = () => {
        scrapeCollegeData().then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
            }
        });
    }
    
    const handleDeleteAllStudents = () => {
        deleteAllStudents().then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
            }
        });
    }

    return (
        <div>
            {errorAlert &&
                <Alert variant="danger">
                    {errorMessage}
                </Alert>
            }
            <Container>
                <Row className='align-items-center mb-3'>
                    <Col sm='8'>
                        <h2>Scrape College Rankings</h2>
                        <div>Overwrites the ranking of colleges in database with WSJ/THE 2020 rankings</div>
                    </Col>
                    <Col sm='4'>
                        <Button onClick={e =>{ handleScrapeCollegeRankings(e) }} className="float-right">Scrape College Rankings</Button>
                    </Col>
                </Row>
                <Row className='align-items-center mb-3'>
                    <Col sm='8'>
                        <h2>Import College Scorecard</h2>
                        <div>Overwrites Admission Rate, Institution Type, Location, Student Debt, and Size of colleges in database with information from the College Scorecard data file.</div>
                    </Col>
                    <Col sm='4'>
                        <Button onClick={e =>{ handleImportCollegeScorecard(e) }} className="float-right">Import College Scorecard</Button>
                    </Col>
                </Row>
                <Row className='align-items-center mb-3'>
                    <Col sm='8'>
                        <h2>Scrape CollegeData.com</h2>
                        <div>Overwrites Cost of Attendance, Completion Rate, GPA, SAT and ACT scores of colleges in database with data from CollegeData.com</div>
                    </Col>
                    <Col sm='4'>
                        <Button onClick={e =>{ handleScrapeCollegeData(e) }} className="float-right">Scrape CollegeData.com</Button>
                    </Col>
                </Row>
                <Row className='align-items-center mb-3'>
                    <Col sm='8'>
                        <h2>Delete All Students</h2>
                    </Col>
                    <Col sm='4'>
                        <Button onClick={e =>{ handleDeleteAllStudents(e) }} className="float-right">Delete All Students</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Admin;
