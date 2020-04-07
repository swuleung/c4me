import React, { useState, useEffect } from 'react';
import {
    Alert, Container, Tabs, Tab,
} from 'react-bootstrap';

const ATScatterplot = (props) => {
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [college, setCollege] = useState({});

    useEffect(() => {
    }, []);

    return (
        <>
            {' '}
            {errorAlert
                ? <Alert variant="danger">{errorMessage}</Alert>
                : (
                    <Container>
                    hello
                    </Container>
                )}
        </>
    );
};

export default ATScatterplot;
