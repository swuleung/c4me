/**
 * Applications Tracker component within the CollegeProfile
 */
import React, { useState, useEffect } from 'react';
import {
    Alert, Col, Row, Card, CardDeck, Button,
} from 'react-bootstrap';
import FilterAT from './FilterAT/FilterAT';
import ATScatterplot from './ATScatterplot/ATScatterplot';
import ATList from './ATList/ATList';
import applicationsTrackerAPI from '../../../services/api/applicationsTracker';
import highSchoolAPI from '../../../services/api/highSchool';
import './ApplicationsTracker.scss';

const ApplicationsTracker = (props) => {
    // state veriables
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [filters, setFilters] = useState({});
    const [applications, setApplications] = useState([]);
    const [averages, setAverages] = useState({});
    const [listATView, setListATView] = useState(true);
    const [highSchools, setHighSchools] = useState([]);

    // deconstruct props
    const { college } = props;
    const {
        CollegeId,
    } = college;

    useEffect(() => {
        // fetch application data based on the filters passed from FilterAT
        applicationsTrackerAPI.getApplicationsTrackerData(CollegeId, filters).then((results) => {
            if (results.error) {
                setErrorAlert(true);
                setErrorMessage(results.reason);
            }
            if (results.ok) {
                setErrorAlert(false);
                setApplications(results.applications.sort((a, b) => (a.Application.Status.localeCompare(b.Application.Status))));
                setAverages(results.averages);
            }
        });

        highSchoolAPI.getAllHighSchools().then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
                setHighSchools(result.highSchools.sort((a, b) => (a.Name.localeCompare(b.Name))));
            }
        });
    }, [CollegeId, filters]);

    // display the ApplicationTracker
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
                                        <Row>
                                            <Col>
                                                <div className="at-title">GPA</div>
                                                <div className="at-text">{averages.avgGPA ? averages.avgGPA : 'N/A'}</div>
                                            </Col>
                                            <Col>
                                                <div className="at-title">SAT Math</div>
                                                <div className="at-text">{averages.avgSATMath ? averages.avgSATMath : 'N/A'}</div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className="at-title">SAT EBRW</div>
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
                                        <Row>
                                            <Col>
                                                <div className="at-title">GPA</div>
                                                <div className="at-text">{averages.avgAcceptedGPA !== '0.00' ? averages.avgAcceptedGPA : 'N/A'}</div>
                                            </Col>
                                            <Col>
                                                <div className="at-title">SAT Math</div>
                                                <div className="at-text">{averages.avgAcceptedSATMath ? averages.avgAcceptedSATMath : 'N/A'}</div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className="at-title">SAT EBRW</div>
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
                                <FilterAT allHighSchools={highSchools} handleFilterChange={setFilters} />
                            </Col>
                            <Col xs="8">
                                <div className="list mb-2">
                                    <p className="mb-0">
                                        <b>
                                            {applications.length}
                                            {' matching students'}
                                        </b>
                                    </p>
                                    <Button variant="outline-primary" onClick={() => setListATView(!listATView)}>
                                        {
                                            listATView
                                                ? 'Switch to Scatterplot View'
                                                : 'Switch to List View'
                                        }
                                    </Button>
                                </div>
                                {listATView
                                    ? <ATList allHighSchools={highSchools} applications={applications} />
                                    : <ATScatterplot applications={applications} averages={averages} />}
                            </Col>
                        </Row>
                    </>
                )}
        </>
    );
};

export default ApplicationsTracker;
