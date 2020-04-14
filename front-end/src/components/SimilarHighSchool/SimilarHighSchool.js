import React, { useState, useEffect } from 'react';
import {
    Alert, Col, Row, Container,
} from 'react-bootstrap';
import './SimilarHighSchool.scss';
import highSchoolAPI from '../../services/api/highSchool';
import studentAPI from '../../services/api/student';

const SimilarHighSchool = () => {
    // set state variables
    const [student, setStudent] = useState({});
    const [highSchools, setHighSchools] = useState([]);
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * Fetches student and high school data
     */
    useEffect(() => {
        studentAPI.getStudent(localStorage.getItem('username')).then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
                setStudent(result.student);
            }
        });
        highSchoolAPI.getAllHighSchools().then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
                setHighSchools(result.highSchools);
            }
        });
    }, []);

    // display high school list
    return (
        <div>
            {errorAlert
                ? <Alert variant="danger">{errorMessage}</Alert>
                : (
                    <div>
                        {student.HighSchool
                            ? (
                                <>
                                    <Container>
                                        <Row>
                                            <h1>
                                                {student.HighSchool.Name ? student.HighSchool.Name.toLowerCase().split(' ').map((s) => {
                                                    if (s !== 'and' && s !== 'of') return s.charAt(0).toUpperCase() + s.substring(1);
                                                    return s;
                                                }).join(' ') : 'No high school provided'}
                                            </h1>
                                        </Row>
                                        <Row>
                                            {student.HighSchool.HighSchoolCity ? `${student.HighSchool.HighSchoolCity}, ` : ''}
                                            {student.HighSchool.HighSchoolState ? student.HighSchool.HighSchoolState : ''}
                                        </Row>
                                    </Container>
                                    <br />
                                    <Container>
                                        <h1>Similar High Schools</h1>
                                        {highSchools.map((highSchool) => (
                                            highSchool.Name !== student.HighSchool.Name
                                                ? (
                                                    <div className="border mb-2 p-3" key={highSchool.HighSchoolId}>
                                                        <Row className="mb-2">
                                                            <Col>
                                                                <Row className="h5 font-weight-bold mb-0"><Col>{highSchool.Name}</Col></Row>
                                                                <Row>
                                                                    <Col>{`${highSchool.HighSchoolCity}, ${highSchool.HighSchoolState}`}</Col>
                                                                </Row>
                                                            </Col>
                                                            <Col className="h5 text-center">
                                                                {highSchool.GraduationRate}
                                                                % Graduation
                                                            </Col>
                                                            <Col className="text-right">
                                                                <Row>
                                                                    <Col><span className="niche-academic-score font-weight-bold text-center h3">{highSchool.NicheAcademicScore}</span></Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col className="text-center">
                                                                <div className="overview-title">Average SAT</div>
                                                                <div className="overview-text">{highSchool.AverageSAT ? highSchool.AverageSAT : 'N/A'}</div>
                                                            </Col>
                                                            <Col>
                                                                <Row>
                                                                    <Col>Math</Col>
                                                                    <Col>{highSchool.SATMath ? highSchool.SATMath : '-'}</Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col>EBRW</Col>
                                                                    <Col>{highSchool.SATEBRW ? highSchool.SATEBRW : '-'}</Col>
                                                                </Row>
                                                            </Col>
                                                            <Col />
                                                            <Col className="text-center">
                                                                <div className="overview-title">Average ACT</div>
                                                                <div className="overview-text">{highSchool.AverageACT ? highSchool.AverageACT : 'N/A'}</div>
                                                            </Col>
                                                            <Col>
                                                                <Row>
                                                                    <Col>Math</Col>
                                                                    <Col>{highSchool.ACTMath ? highSchool.ACTMath : '-'}</Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col>Reading</Col>
                                                                    <Col>{highSchool.ACTReading ? highSchool.ACTReading : '-'}</Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col>English</Col>
                                                                    <Col>{highSchool.ACTEnglish ? highSchool.ACTEnglish : '-'}</Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col>Science</Col>
                                                                    <Col>{highSchool.ACTScience ? highSchool.ACTScience : '-'}</Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                )
                                                : <></>
                                        ))}
                                    </Container>
                                </>
                            ) : <Alert variant="info">Go to your profile and add a high school to see similar high schools.</Alert>}
                    </div>
                )}
        </div>
    );
};

export default SimilarHighSchool;
