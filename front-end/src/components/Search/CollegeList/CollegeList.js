/**
 * This is the list view of Applicationst Tracker
 */
import React from 'react';
import {
    Col, Row, Card, CardDeck,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './CollegeList.scss';

const CollegeList = (props) => {
    const { colleges } = props;
    // map all the applications to the HTML below
    return (
        <>
            {colleges.map((college, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div className="border mb-2 student-container" key={college.Name}>
                    <Row className="student-title mb-3">
                        <Col className="font-weight-bold student-name">
                            {college.Name}
                        </Col>
                        <Col className="text-center">
                            {/* {app.Application.status} */}
                        </Col>
                        <Col className="text-right">
                            <Link to={`/colleges/${college.CollegeId}`} target="_blank">Go to Profile↗</Link>
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col>
                            <CardDeck>
                                <Card>
                                    <div className="student-details text-center">
                                        <div className="detail-title">GPA</div>
                                        <div className="detail-score text-center">
                                            {app.GPA ? app.GPA : 'N/A'}
                                        </div>
                                    </div>
                                </Card>
                                <Card>
                                    <div className="student-details text-center">
                                        <div className="detail-title">SAT Math</div>
                                        <div className="detail-score text-center">
                                            {app.SATMath ? app.SATMath : 'N/A'}
                                        </div>
                                    </div>
                                </Card>
                                <Card>
                                    <div className="student-details text-center">
                                        <div className="detail-title">SAT EBRW</div>
                                        <div className="detail-score text-center">
                                            {app.SATEBRW ? app.SATEBRW : 'N/A'}
                                        </div>
                                    </div>
                                </Card>
                                <Card>
                                    <div className="student-details text-center">
                                        <div className="detail-title">ACT</div>
                                        <div className="detail-score text-center">
                                            {app.ACTComposite ? app.ACTComposite : 'N/A'}
                                        </div>
                                    </div>
                                </Card>
                            </CardDeck>
                        </Col>
                    </Row>
                    <Row className="student-title mt-3">
                        <Col>
                            {highSchoolName}
                        </Col>
                        <Col className="text-right">
                            {app.collegeClass ? `Class of ${app.collegeClass}` : 'No college class provided'}
                        </Col>
                    </Row> */}
                </div>
            ))}
        </>
    );
};

export default CollegeList;
