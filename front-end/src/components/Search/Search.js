import React, { useState, useEffect } from 'react';
import {
    Alert, Col, Row, Container,
} from 'react-bootstrap';

import { getSearchResults } from '../../services/api/search';
import FilterColleges from './FilterColleges/FilterColleges';
import CollegeList from './CollegeList/CollegeList';
import './Search.scss';

const Search = (props) => {
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [filters, setFilters] = useState({});
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        getSearchResults(filters).then((results) => {
            if (results.error) {
                setErrorAlert(true);
                setErrorMessage(results.reason);
            }
            if (results.ok) {
                setErrorAlert(false);
                setSearchResults(results.searchResults.sort((a, b) => (a.College.status.localeCompare(b.College.status) ? 1 : -1)));
            }
        });
    }, [filters]);

    return (
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
    );
};

export default Search;
