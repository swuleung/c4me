/**
 * This is the list view of Applicationst Tracker
 */
import React from 'react';
import {
    Col, Row, Card, CardDeck,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './ATList.scss';

const ATList = (props) => {
    const { applications } = props;
    // map all the applications to the HTML below
    return (
        <>
            {applications.map((app) => (
                <div className="border mb-2 student-container" key={app.Application.status}>
                    <Row className="student-title mb-3">
                        <Col className="font-weight-bold student-name">
                            {app.username}
                        </Col>
                        <Col className={`${app.Application.status} text-center`}>
                            {app.Application.status}
                        </Col>
                        <Col className="text-right">
                            <Link to={`/profile/${app.username}`} target="_blank">Go to Profile↗</Link>
                        </Col>
                    </Row>
                    <Row>
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
                </div>
            ))}
        </>
    );
};

export default ATList;
