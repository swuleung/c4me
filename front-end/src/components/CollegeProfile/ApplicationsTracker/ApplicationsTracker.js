import React, { useState, useEffect } from 'react';
import {
    Alert, Col, Row, Card, CardDeck
} from '../../../../node_modules/react-bootstrap';
import FilterAT from './FilterAT/FilterAT';
import ATScatterplot from './ATScatterplot/ATScatterplot';
import { getApplicationsTrackerData } from './../../../services/api/applicationsTracker';
import './ApplicationsTracker.scss';

const ApplicationsTracker = (props) => {
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [filters, setFilters] = useState({});
    const [application, setApplications] = useState([]);
    const [averages, setAverages] = useState({});
    const { college } = props;
    const {
        CollegeId
    } = college;

    useEffect(() => {
        console.log('ahh', averages);
        getApplicationsTrackerData(CollegeId, filters).then((results) => {
            if (results.error) {
                setErrorAlert(true);
                setErrorMessage(results.reason);
            }
            if (results.ok) {
                setErrorAlert(false);
                console.log(results.averages);
                console.log(results.applications);
                setApplications(results.applications);
                setAverages(results.averages);
            }
        });
    }, [CollegeId, filters]);

    return (
        <>
            {' '}
            {errorAlert
                ? <Alert variant="danger">{errorMessage}</Alert>
                : (
                    <>
                        <Row className="mb-3">
                            <Col>
                                <CardDeck>
                                    <Card body className="text-center">
                                        <h3>Average Student</h3>
                                        <Row >
                                            <Col>
                                                <div className="at-title">GPA</div>
                                                <div className="at-text">{averages.avgGPA ? averages.avgGPA : 'N/A'}</div>
                                            </Col>
                                            <Col>
                                                <div className="at-title">SAT Math</div>
                                                <div className="at-text">{averages.avgSATMath ? averages.avgSATMath : 'N/A'}</div>
                                            </Col>
                                        </Row>
                                        <Row >
                                            <Col>
                                                <div className="at-title">SAR EBRW</div>
                                                <div className="at-text">{averages.avgSATEBRW ? averages.avgSATEBRW : 'N/A'}</div>
                                            </Col>
                                            <Col>
                                                <div className="at-title">ACT Composite</div>
                                                <div className="at-text">{averages.avgACTComposite ? averages.avgACTComposite : 'N/A'}</div>
                                            </Col>
                                        </Row>
                                    </Card>
                                    <Card body className="text-center">
                                        <h3>Average Accepted Student</h3>
                                        <Row >
                                            <Col>
                                                <div className="at-title">GPA</div>
                                                <div className="at-text">{averages.avgAcceptedGPA ? averages.avgAcceptedGPA : 'N/A'}</div>
                                            </Col>
                                            <Col>
                                                <div className="at-title">SAT Math</div>
                                                <div className="at-text">{averages.avgAcceptedSATMath ? averages.avgAcceptedSATMath : 'N/A'}</div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className="at-title">SAR EBRW</div>
                                                <div className="at-text">{averages.avgAcceptedSATEBRW ? averages.avgAcceptedSATEBRW : 'N/A'}</div>
                                            </Col>
                                            <Col>
                                                <div className="at-title">ACT Composite</div>
                                                <div className="at-text">{averages.avgAcceptedACTComposite ? averages.avgAcceptedACTComposite : 'N/A'}</div>
                                            </Col>
                                        </Row>
                                    </Card>
                                </CardDeck>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="4">
                                <FilterAT handleFilterChange={setFilters} />
                            </Col>
                            <Col>
                                <ATScatterplot />
                            </Col>
                        </Row>
                    </>
                )
            }
        </>
    );
};

export default ApplicationsTracker;
