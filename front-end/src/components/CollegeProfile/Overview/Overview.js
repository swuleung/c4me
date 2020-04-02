import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Container, Row, Col } from 'react-bootstrap';
import { getCollegeByID } from '../../../services/api/college';
import './Overview.scss';

const Overview = (props) => {
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
    }, []);

    return (
        <div>
            <Container>
                <Row className="text-center mb-3">
                    <Col>
                        <div className={'overview-title'}>Graduation Rate</div>
                        <div className={'overview-text'}>{props.college.CompletionRate ? props.college.CompletionRate + '%' : 'N/A'}</div>
                    </Col>
                    <Col>
                        <div className={'overview-title'}>Admission Rate</div>
                        <div className={'overview-text'}>{props.college.AdmissionRate ? props.college.AdmissionRate + '%' : 'N/A'}</div>
                    </Col>
                    <Col>
                        <div className={'overview-title'}>Ranking</div>
                        <div className={'overview-text'}>{props.college.Ranking ? props.college.Ranking : 'N/A'}</div>
                    </Col>
                </Row>
                <Row className="text-center">
                    {props.college.CostOfAttendanceInState == props.college.CostOfAttendanceOutOfState
                        ? <Col>
                            <div className={'overview-title'}>Cost of Attendance</div>
                            <div className={'overview-text'}>{props.college.CostOfAttendanceOutOfState ? '$' + props.college.CostOfAttendanceOutOfState : 'N/A'}</div>
                        </Col>
                        : <>
                            <Col>
                                <div className={'overview-title'}>In-State Cost</div>
                                <div className={'overview-text'}>{props.college.CostOfAttendanceInState ? '$' + props.college.CostOfAttendanceInState : 'N/A'}</div>
                            </Col>
                            <Col>
                                <div className={'overview-title'}>Out-of-State Cost</div>
                                <div className={'overview-text'}>{props.college.CostOfAttendanceOutOfState ? '$' + props.college.CostOfAttendanceOutOfState : 'N/A'}</div>
                            </Col>
                        </>
                    }
                    <Col>
                        <div className={'overview-title'}>Undergraduate Enrollment</div>
                        <div className={'overview-text'}>{props.college.Size ? props.college.Size : 'N/A'}</div>
                    </Col>
                    <Col>
                        <div className={'overview-title'}>Median Student Debt</
                        div>
                        <div className={'overview-text'}>${props.college.StudentDebt ? props.college.StudentDebt : 'N/A'}</div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Overview;
