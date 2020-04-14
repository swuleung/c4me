/**
 * College Profile page with Overview & Applications Tracker
 */
import React, { useState, useEffect } from 'react';
import {
    Alert, Container, Tabs, Tab,
} from '../../../node_modules/react-bootstrap';
import Overview from './Overview/Overview';
import ApplicationsTracker from './ApplicationsTracker/ApplicationsTracker';
import collegeAPI from '../../services/api/college';

const CollegeProfile = (props) => {
    // state variables
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [college, setCollege] = useState({});
    const { match } = props;
    const { collegeID } = match.params;

    // Get the college information
    useEffect(() => {
        collegeAPI.getCollegeByID(collegeID).then((results) => {
            if (results.error) {
                setErrorAlert(true);
                setErrorMessage(results.error);
            }
            if (results.ok) {
                setErrorAlert(false);
                setCollege(results.college);
            }
        });
    }, [collegeID]);

    // Display the college information
    return (
        <>
            {' '}
            {errorAlert
                ? <Alert variant="danger">{errorMessage}</Alert>
                : (
                    <Container>
                        <h1>{college.Name}</h1>
                        <h2 className="text-muted">
                            {college.InstitutionType === '1' ? (
                                'Public school'
                            ) : college.InstitutionType === '2' ? (
                                'Private nonprofit school'
                            ) : college.InstitutionType === '3' ? (
                                'Private for-profit'
                            ) : 'Unknown type of school'}
                            {' in '}
                            {college.Location}
                        </h2>
                        <Tabs defaultActiveKey="overview">
                            <Tab eventKey="overview" title="Overview">
                                <Overview college={college} />
                            </Tab>
                            <Tab eventKey="applications-tracker" title="Applications Tracker">
                                <br />
                                <ApplicationsTracker college={college} />
                            </Tab>
                        </Tabs>
                    </Container>
                )}
        </>
    );
};

export default CollegeProfile;
