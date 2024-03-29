/**
 * This is the list view of search results
 */
import React from 'react';
import {
    Col, Row, Card, CardDeck,
} from 'react-bootstrap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link } from 'react-router-dom';

import './CollegeList.scss';

const CollegeList = (props) => {
    const { colleges, student } = props;
    // map all the colleges to the HTML below
    return (
        <>
            {colleges.map((college) => (
                // eslint-disable-next-line react/no-array-index-key
                <div className="border mb-2 college-container" key={college.Name}>
                    <Row>
                        <Col xs="5">
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
                        {college.recommender && (
                            <Col xs="2">
                                <CircularProgressbar
                                    value={Math.round(college.recommender.score * 100)}
                                    maxValue="100"
                                    text={Math.round(college.recommender.score * 100).toString()}
                                    styles={buildStyles({
                                        strokeLinecap: 'round',
                                        textSize: '2.5rem',
                                        textColor: '#1091b3',
                                    })}
                                />
                            </Col>
                        )}
                        <Col className="text-right">
                            <Link to={`/colleges/${college.CollegeId}`} target="_blank">Go to College ↗</Link>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col>
                            <CardDeck>
                                <Card>
                                    <div className="college-details text-center">
                                        <div className="detail-title">Admission Rate</div>
                                        <div className="detail-score text-center">
                                            {college.AdmissionRate ? college.AdmissionRate : 'N/A'}
                                        </div>
                                    </div>
                                </Card>
                                <Card>
                                    <div className="college-details text-center">
                                        <div className="detail-title">Ranking</div>
                                        <div className="detail-score text-center">
                                            {college.Ranking ? college.Ranking : 'N/A'}
                                        </div>
                                    </div>
                                </Card>
                                <Card>
                                    <div className="college-details text-center">
                                        <div className="detail-title">Size</div>
                                        <div className="detail-score text-center">
                                            {college.Size ? college.Size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'N/A'}
                                        </div>
                                    </div>
                                </Card>
                                <Card>
                                    <div className="college-details text-center">
                                        <div className="detail-title">Cost</div>
                                        <div className="detail-score text-center">
                                            {student.ResidenceState === college.Location
                                                ? college.CostOfAttendanceInState
                                                    ? college.CostOfAttendanceInState.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                    : ''
                                                : college.CostOfAttendanceOutOfState
                                                    ? college.CostOfAttendanceOutOfState.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                    : ''}
                                            {!college.CostOfAttendanceInState && !college.CostOfAttendanceOutOfState ? 'N/A' : ''}
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
