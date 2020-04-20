import React, { useState, useEffect } from 'react';
import {
    Alert, Col, Row, Container, Form, Button,
} from 'react-bootstrap';

import { getSearchResults } from '../../services/api/search';
import FilterColleges from './FilterColleges/FilterColleges';
import CollegeList from './CollegeList/CollegeList';
import './Search.scss';

const Search = () => {
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState('none');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        console.log(filters);
        console.log(sortBy);
        getSearchResults(filters, sortBy).then((results) => {
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
    }, [filters, sortBy]);

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
                                {/* TODO: College Recommender toggle */}
                                <div className="list mb-2">
                                    <Button>
                                        College Recommender
                                    </Button>
                                    <p className="mb-0">
                                        <b>
                                            {searchResults.length}
                                            {' matching colleges'}
                                        </b>
                                    </p>
                                    <Form.Control className="w-25" as="select" value={sortBy} onChange={(e) => { setSortBy(e.target.value); }}>
                                        <option value="none" disabled>Sort by</option>
                                        <option value="Name">Name</option>
                                        <option value="AdmissionRate">Admission Rate</option>
                                        <option value="Cost">Cost of Attendance</option>
                                        <option value="Ranking">Ranking</option>
                                    </Form.Control>
                                </div>
                                <CollegeList colleges={searchResults} />
                            </Col>
                        </Row>
                    </Container>
                )}
        </>
    );
};

export default Search;
