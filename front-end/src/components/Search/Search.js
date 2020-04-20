import React, { useState, useEffect } from 'react';
import {
    Alert, Col, Row, Container,
} from 'react-bootstrap';

import { getSearchResults } from '../../services/api/search';
import FilterColleges from './FilterColleges/FilterColleges';
import CollegeList from './CollegeList/CollegeList';
import './Search.scss';

const Search = () => {
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [filters, setFilters] = useState({});
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        console.log(filters);
        getSearchResults(filters).then((results) => {
            if (results.error) {
                setErrorAlert(true);
                setErrorMessage(results.reason);
            }
            if (results.ok) {
                setErrorAlert(false);
                console.log(results);
                setSearchResults(results.colleges);
            }
        });
    }, [filters]);

    return (
        <>
            {errorAlert
                ? <Alert variant="danger">{errorMessage}</Alert>
                : (
                    <Container>
                        <Row>
                            <Col>
                                <h1>Search for Colleges</h1>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="4">
                                <FilterColleges handleFilterChange={setFilters} />
                            </Col>
                            <Col xs="8">
                                <CollegeList colleges={searchResults} />
                            </Col>
                        </Row>
                    </Container>
                )}
        </>
    );
};

export default Search;
