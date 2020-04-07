import React, { useState, useEffect } from 'react';
import {
    Alert, Col, Row,
} from '../../../../node_modules/react-bootstrap';
import FilterAT from './FilterAT/FilterAT';
import ATScatterplot from './ATScatterplot/ATScatterplot';

const ApplicationsTracker = (props) => {
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
    }, []);

    return (
        <>
            {' '}
            {errorAlert
                ? <Alert variant="danger">{errorMessage}</Alert>
                : (
                    <Row>
                        <Col xs="4">
                            <FilterAT />
                        </Col>
                        <Col>
                            <ATScatterplot />
                        </Col>
                    </Row>
                )}
        </>
    );
};

export default ApplicationsTracker;
