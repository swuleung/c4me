/**
 * This component shows similar high schools to the current user
 */
import React, { useState, useEffect } from 'react';
import {
    Alert, Col, Row, Container, Spinner,
} from 'react-bootstrap';
import './SimilarHighSchool.scss';
import highSchoolAPI from '../../services/api/highSchool';
import studentAPI from '../../services/api/student';

const SimilarHighSchool = () => {
    // set state variables
    const [student, setStudent] = useState({});
    const [averageGPA, setAverageGPA] = useState('N/A');
    const [highSchools, setHighSchools] = useState([]);
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
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
        setShowSpinner(true);
        highSchoolAPI.findSimilarHS().then((result) => {
            setShowSpinner(false);
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
                setAverageGPA(result.averageGPA.toFixed(2));
                setHighSchools(result.highSchools);
            }
        });
    }, []);

    // display high school list
    return (
        <div>
            <div>
                {student.HighSchool
                    ? (
                        <>
                            <Container>
                                <Row>
                                    <Col className="h1">
                                        <Row>
                                            {student.HighSchool.Name ? student.HighSchool.Name.toLowerCase().split(' ').map((s) => {
                                                if (s !== 'and' && s !== 'of') return s.charAt(0).toUpperCase() + s.substring(1);
                                                return s;
                                            }).join(' ') : 'No high school provided'}
                                        </Row>
                                    </Col>
                                    <Col className="text-right">
                                        <Row>
                                            <Col><span className="niche-academic-score font-weight-bold text-center h1">{student.HighSchool.NicheAcademicScore}</span></Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className="highschool-location">
                                    {student.HighSchool.City ? `${student.HighSchool.City}, ` : ''}
                                    {student.HighSchool.State ? student.HighSchool.State : ''}
                                </Row>
                                <Row className="mt-2 border p-3">
                                    <Col className="text-center">
                                        <div className="overview-title">Average SAT</div>
                                        <div className="similar-text">{student.HighSchool.AverageSAT ? student.HighSchool.AverageSAT : 'N/A'}</div>
                                    </Col>
                                    <Col>
                                        <Row>
                                            <Col>Math</Col>
                                            <Col>{student.HighSchool.SATMath ? student.HighSchool.SATMath : '-'}</Col>
                                        </Row>
                                        <Row>
                                            <Col>EBRW</Col>
                                            <Col>{student.HighSchool.SATEBRW ? student.HighSchool.SATEBRW : '-'}</Col>
                                        </Row>
                                    </Col>
                                    <Col className="text-center">
                                        <div className="overview-title">Average ACT</div>
                                        <div className="similar-text">{student.HighSchool.AverageACT ? student.HighSchool.AverageACT : 'N/A'}</div>
                                    </Col>
                                    <Col>
                                        <Row>
                                            <Col>Math</Col>
                                            <Col>{student.HighSchool.ACTMath ? student.HighSchool.ACTMath : '-'}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Reading</Col>
                                            <Col>{student.HighSchool.ACTReading ? student.HighSchool.ACTReading : '-'}</Col>
                                        </Row>
                                        <Row>
                                            <Col>English</Col>
                                            <Col>{student.HighSchool.ACTEnglish ? student.HighSchool.ACTEnglish : '-'}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Science</Col>
                                            <Col>{student.HighSchool.ACTScience ? student.HighSchool.ACTScience : '-'}</Col>
                                        </Row>
                                    </Col>
                                    <Col className="text-center">
                                        <div className="overview-title">Graduation Rate</div>
                                        <div className="similar-text">{student.HighSchool.GraduationRate ? `${student.HighSchool.GraduationRate}%` : 'N/A'}</div>
                                    </Col>
                                    <Col className="text-center">
                                        <div className="overview-title">Average GPA</div>
                                        <div className="similar-text">{averageGPA || 'N/A'}</div>
                                    </Col>
                                </Row>
                            </Container>
                            <br />
                            <Container>
                                <h1>Similar High Schools</h1>
                                {errorAlert
                                    ? <Alert variant="danger">{errorMessage}</Alert>
                                    : showSpinner
                                        ? (
                                            <div className="text-center">
                                                <Spinner className="large-spinner" style={{ width: '10rem', height: '10rem' }} animation="grow" variant="primary" />
                                            </div>
                                        )
                                        : highSchools.map((highSchool) => (
                                            <div className="border rounded-lg mb-2 p-3" key={highSchool.HighSchoolId}>
                                                <Row className="mb-2">
                                                    <Col>
                                                        <Row className="h5 font-weight-bold mb-0"><Col>{highSchool.Name}</Col></Row>
                                                        <Row>
                                                            <Col>{`${highSchool.City}, ${highSchool.State}`}</Col>
                                                        </Row>
                                                    </Col>
                                                    <Col className="h4 text-center">
                                                        {highSchool.similarityScore ? `${Math.round(highSchool.similarityScore)}%` : 'N/A'}
                                                        {' Similarity'}
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
                                                        <div className="similar-text">{highSchool.AverageSAT ? highSchool.AverageSAT : 'N/A'}</div>
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
                                                    <Col className="text-center">
                                                        <div className="overview-title">Average ACT</div>
                                                        <div className="similar-text">{highSchool.AverageACT ? highSchool.AverageACT : 'N/A'}</div>
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
                                                    <Col className="text-center">
                                                        <div className="overview-title">Graduation Rate</div>
                                                        <div className="similar-text">
                                                            {highSchool.GraduationRate ? `${highSchool.GraduationRate}%` : 'N/A'}
                                                        </div>
                                                    </Col>
                                                    <Col className="text-center">
                                                        <div className="overview-title">Average GPA</div>
                                                        <div className="similar-text">
                                                            {highSchool.averageGPA ? highSchool.averageGPA.toFixed(2) : 'N/A'}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        ))}
                            </Container>
                        </>
                    ) : <Alert variant="info">Go to your profile and add a high school to see similar high schools.</Alert>}
            </div>
        </div>
    );
};

export default SimilarHighSchool;
