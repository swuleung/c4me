import React, { useState, useEffect } from 'react';
import {
    Alert, Col, Row, Container, Form, Button, OverlayTrigger, Tooltip,
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAmountDown, faSortAmountUp } from '@fortawesome/free-solid-svg-icons';
import FilterColleges from './FilterColleges/FilterColleges';
import CollegeList from './CollegeList/CollegeList';
import studentAPI from '../../services/api/student';
import searchAPI from '../../services/api/search';
import './Search.scss';

const Search = () => {
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState('none');
    const [sortAsc, setSortAsc] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [student, setStudent] = useState({});

    useEffect(() => {
        const sortDirection = sortAsc ? 'ASC' : 'DESC';

        // Cost is soted customly
        const sortByFilter = sortBy === 'Cost' ? 'none' : sortBy;


        // get search results with filters and sort
        searchAPI.getSearchResults(filters, sortByFilter, sortDirection).then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.reason);
            }
            if (result.ok) {
                setErrorAlert(false);
                if (sortBy === 'Cost') {
                    // get the current student informationf or comparison
                    studentAPI.getStudent(localStorage.getItem('username')).then((studentResult) => {
                        const stud = studentResult.student ? studentResult.student : {};
                        result.colleges.sort((a, b) => {
                            const costA = a.Location === stud.residenceState ? a.CostOfAttendanceInState : a.CostOfAttendanceOutOfState;
                            const costB = b.Location === stud.residenceState ? b.CostOfAttendanceInState : b.CostOfAttendanceOutOfState;
                            if (sortAsc) return costA - costB;
                            return costB - costA;
                        });
                        setStudent(stud);
                        setSearchResults(result.colleges);
                    });
                } else {
                    setSearchResults(result.colleges);
                }
            }
        });
    }, [filters, sortBy, sortAsc]);

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
                                    <Button className="btn-sm">
                                        College Recommender
                                    </Button>
                                    <p className="mb-0">
                                        <b>
                                            {searchResults.length}
                                            {' matching colleges'}
                                        </b>
                                    </p>
                                    <div className="d-flex">
                                        <Form.Control as="select" value={sortBy} onChange={(e) => { setSortBy(e.target.value); }}>
                                            <option value="none" disabled>Sort by</option>
                                            <option value="Name">Name</option>
                                            <option value="AdmissionRate">Admission Rate</option>
                                            <option value="Cost">Cost of Attendance</option>
                                            <option value="Ranking">Ranking</option>
                                        </Form.Control>
                                        <OverlayTrigger
                                            placement="right"
                                            overlay={(
                                                <Tooltip>
                                                    {`Sort Direction: ${sortAsc ? 'Ascending' : 'Descending'}`}
                                                </Tooltip>
                                            )}
                                        >
                                            <Button className="btn-sm ml-1" variant="info">
                                                <FontAwesomeIcon className="sort-icon" icon={sortAsc ? faSortAmountUp : faSortAmountDown} onClick={() => setSortAsc(!sortAsc)} />
                                            </Button>
                                        </OverlayTrigger>

                                    </div>
                                </div>
                                {sortBy === 'Cost' && student.residenceState == null ? <Alert variant="info">Sorting by out-of-state cost of attendance. Add your residence state in your profile to show in-state cost.</Alert> : <></>}
                                <CollegeList student={student} colleges={searchResults} />
                            </Col>
                        </Row>
                    </Container>
                )}
        </>
    );
};

export default Search;
