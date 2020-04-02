import React, { useState, useEffect } from 'react';
import { Link } from '../../../node_modules/react-router-dom';
import { Form, Button, Alert, Container, Tabs, Tab } from '../../../node_modules/react-bootstrap';
import Overview from './Overview/Overview';
import { getCollegeByID } from '../../services/api/college';

const CollegeProfile = (props) => {
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [college, setCollege] = useState({});
    const { match } = props;
    const { collegeID } = match.params;

    useEffect(() => {
        getCollegeByID(collegeID).then((results) => {
            setCollege(results.college);
            console.log(results.college);
        })
    }, [collegeID]);

    return (
        <div>
            <Container>
                <h1>{college.Name} in {college.Location} </h1>
                <Tabs defaultActiveKey="overview">
                    <Tab eventKey="overview" title="Overview">
                        <Overview college={college}></Overview>
                    </Tab>
                    <Tab eventKey="applications-tracker" title="Applications Tracker">

                    </Tab>
                </Tabs>
            </Container>
        </div>
    );
};

export default CollegeProfile;
