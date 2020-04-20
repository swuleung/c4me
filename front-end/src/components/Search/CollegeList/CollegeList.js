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
                    <Row>
                        <Col>
                            <h3>{college.Name}</h3>
                            {college.InstitutionType === '1' ? (
                                'Public school'
                            ) : college.InstitutionType === '2' ? (
                                'Private nonprofit school'
                            ) : college.InstitutionType === '3' ? (
                                'Private for-profit'
                            ) : 'Unknown type of school'}
                            {' in '}
                            {college.Location}
                        </Col>
                        <Col className="text-right">
                            <Link to={`/colleges/${college.CollegeId}`} target="_blank">Go to College ↗</Link>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col>
                            <CardDeck>
                                <Card>
                                    <div className="student-details text-center">
                                        <div className="detail-title">Admission Rate</div>
                                        <div className="detail-score text-center">
                                            {college.AdmissionRate ? college.AdmissionRate : 'N/A'}
                                        </div>
                                    </div>
                                </Card>
                                <Card>
                                    <div className="student-details text-center">
                                        <div className="detail-title">Ranking</div>
                                        <div className="detail-score text-center">
                                            {college.Ranking ? college.Ranking : 'N/A'}
                                        </div>
                                    </div>
                                </Card>
                                <Card>
                                    <div className="student-details text-center">
                                        <div className="detail-title">Size</div>
                                        <div className="detail-score text-center">
                                            {college.Size ? college.Size : 'N/A'}
                                        </div>
                                    </div>
                                </Card>
                                <Card>
                                    <div className="student-details text-center">
                                        <div className="detail-title">Cost</div>
                                        <div className="detail-score text-center">
                                            {college.CostOfAttendanceInState}
                                            {college.CostOfAttendanceOutOfState}
                                            {/* TODO: Show cost based on location */}
                                        </div>
                                    </div>
                                </Card>
                            </CardDeck>
                        </Col>
                    </Row>
                </div>
            ))}
        </>
    );
};

export default CollegeList;
