import React, { useState, useEffect } from 'react';
import {
    Alert, Container, Row, Col,
} from 'react-bootstrap';
import collegeAPI from '../../../services/api/college';
import './Overview.scss';

const Overview = (props) => {
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [majors, setMajors] = useState([]);
    const { college } = props;
    const {
        CollegeId,
        CompletionRate,
        AdmissionRate,
        Ranking,
        CostOfAttendanceInState,
        CostOfAttendanceOutOfState,
        Size,
        StudentDebt,
        SATMath,
        SATEBRW,
        ACTComposite,
        GPA,
    } = college;
    const generateMajors = () => {
        if (!majors || !majors.length) {
            return <Row>No majors listed</Row>;
        }
        const leftSide = [];
        const rightSide = [];
        for (let i = 0; i < majors.length; i += 1) {
            if (i % 2) {
                rightSide.push(<Row key={majors[i].Major}>{majors[i].Major}</Row>);
            } else {
                leftSide.push(<Row key={majors[i].Major}>{majors[i].Major}</Row>);
            }
        }
        return (
            <Row>
                <Col>{leftSide}</Col>
                <Col>{rightSide}</Col>
            </Row>
        );
    };
    useEffect(() => {
        collegeAPI.getMajorsByCollegeID(CollegeId).then((results) => {
            if (results.error) {
                setErrorAlert(true);
                setErrorMessage(results.reason);
            }
            if (results.ok) {
                setErrorAlert(false);
                setMajors(results.majors);
            }
        });
    }, [CollegeId]);

    return (
        <>
            {' '}
            {errorAlert
                ? <Alert variant="danger">{errorMessage}</Alert>
                : (
                    <Container>
                        <Row className="text-center mb-3">
                            <Col>
                                <div className="overview-title">Graduation Rate</div>
                                <div className="overview-text">{CompletionRate ? `${CompletionRate}%` : 'N/A'}</div>
                            </Col>
                            <Col>
                                <div className="overview-title">Admission Rate</div>
                                <div className="overview-text">{AdmissionRate ? `${AdmissionRate}%` : 'N/A'}</div>
                            </Col>
                            <Col>
                                <div className="overview-title">Ranking</div>
                                <div className="overview-text">{Ranking || 'N/A'}</div>
                            </Col>
                        </Row>
                        <Row className="text-center">
                            {CostOfAttendanceInState === CostOfAttendanceOutOfState
                                ? (
                                    <Col>
                                        <div className="overview-title">Cost of Attendance</div>
                                        <div className="overview-text">{CostOfAttendanceOutOfState ? `$${CostOfAttendanceOutOfState.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : 'N/A'}</div>
                                    </Col>
                                )
                                : (
                                    <>
                                        <Col>
                                            <div className="overview-title">In-State Cost</div>
                                            <div className="overview-text">{CostOfAttendanceInState ? `$${CostOfAttendanceInState.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : 'N/A'}</div>
                                        </Col>
                                        <Col>
                                            <div className="overview-title">Out-of-State Cost</div>
                                            <div className="overview-text">{CostOfAttendanceOutOfState ? `$${CostOfAttendanceOutOfState.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : 'N/A'}</div>
                                        </Col>
                                    </>
                                )}
                            <Col>
                                <div className="overview-title">Undergraduate Enrollment</div>
                                <div className="overview-text">{Size ? Size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'N/A'}</div>
                            </Col>
                            <Col>
                                <div className="overview-title">
                                    Median Student Debt
                                </div>
                                <div className="overview-text">
                                    {StudentDebt ? '$' + StudentDebt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'N/A'}
                                </div>
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <h2>Admission Scores</h2>
                        </Row>
                        <Row>
                            <Col className="border-right  mr-0 text-center">
                                <div className="overview-title">SAT Math</div>
                                <div className="overview-text-md">{SATMath}</div>
                            </Col>
                            <Col className="border-right   mr-0 text-center">
                                <div className="overview-title">SAT EBRW</div>
                                <div className="overview-text-md">{SATEBRW}</div>
                            </Col>
                            <Col className="border-right  mr-0 text-center">
                                <div className="overview-title">ACT Composite</div>
                                <div className="overview-text-md">{ACTComposite}</div>
                            </Col>
                            <Col className=" mr-0 text-center">
                                <div className="overview-title">GPA</div>
                                <div className="overview-text-md">{GPA}</div>
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <h2>Majors</h2>
                        </Row>
                        {generateMajors()}
                    </Container>
                )}
        </>
    );
};

export default Overview;
