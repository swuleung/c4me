import React, { useState, useEffect } from 'react';
import {
    Alert, Col, Row, Container, Form, Button, OverlayTrigger, Tooltip, Spinner,
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
    const [showSpinner, setShowSpinner] = useState(false);
    const [collegeRecommenderToggle, setCollegeRecommenderToggle] = useState(false);

    useEffect(() => {
        const sortDirection = sortAsc ? 'ASC' : 'DESC';

        // Cost is soted customly
        const sortByFilter = sortBy === 'Cost' || sortBy === 'Score' ? 'none' : sortBy;

        setShowSpinner(true);
        // get search results with filters and sort
        searchAPI.getSearchResults(filters, sortByFilter, sortDirection).then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage('Error searching with the criteria');
            }
            if (result.ok) {
                setErrorAlert(false);
                // sort by cost in front-end
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
                        setShowSpinner(false);
                        // if recommnder toggle is on, get results
                        if (collegeRecommenderToggle) {
                            searchAPI.getCollegeRecommenderScore(result.colleges.map((c) => c.CollegeId))
                                .then((scoreResult) => {
                                    if (scoreResult.error) {
                                        setErrorAlert(true);
                                        setErrorMessage('Error getting college recommender score');
                                    }
                                    if (scoreResult.ok) {
                                        setSearchResults(result.colleges.map((c, i) => ({ ...c, recommender: scoreResult.scores[i] })));
                                    }
                                });
                        }
                    });
                } else if (collegeRecommenderToggle) {
                    // get the scores
                    searchAPI.getCollegeRecommenderScore(result.colleges.map((c) => c.CollegeId))
                        .then((scoreResult) => {
                            if (scoreResult.error) {
                                setErrorAlert(true);
                                setErrorMessage('Error getting college recommender score');
                            }
                            if (scoreResult.ok) {
                                // add scores to current reseults
                                const newSearchResults = result.colleges.map((c, i) => ({ ...c, recommender: scoreResult.scores[i] }));
                                // sort by score if desired
                                if (sortBy === 'Score') {
                                    newSearchResults.sort((a, b) => {
                                        if (sortAsc) {
                                            return a.recommender.score - b.recommender.score;
                                        }
                                        return b.recommender.score - a.recommender.score;
                                    });
                                    setSearchResults(newSearchResults);
                                    setShowSpinner(false);
                                } else {
                                    setSearchResults(newSearchResults);
                                    setShowSpinner(false);
                                }
                            }
                        });
                } else {
                    setSearchResults(result.colleges);
                    setShowSpinner(false);
                }
            }
        });
    }, [filters, sortBy, sortAsc, collegeRecommenderToggle]);

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
                    <Row className="mb-2">
                        <Col>
                            <Form>
                                <Form.Check
                                    id="switchEnabled"
                                    type="switch"
                                    label="College Recommender"
                                    onChange={() => setCollegeRecommenderToggle(!collegeRecommenderToggle)}
                                    checked={collegeRecommenderToggle}
                                />
                            </Form>
                        </Col>
                        <Col>
                            <b>
                                {searchResults.length}
                                {' matching colleges'}
                            </b>
                        </Col>
                        <Col>
                            <Form>
                                <Form.Control className="w-75 d-inline" as="select" value={sortBy} onChange={(e) => { setSortBy(e.target.value); }}>
                                    <option value="none" disabled>Sort by</option>
                                    <option value="Name">Name</option>
                                    <option value="AdmissionRate">Admission Rate</option>
                                    <option value="Cost">Cost of Attendance</option>
                                    <option value="Ranking">Ranking</option>
                                    <option value="Score">College Recommendation Score</option>
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
                            </Form>
                        </Col>
                    </Row>
                    {errorAlert && <Alert variant="danger">{errorMessage}</Alert>}
                    {collegeRecommenderToggle && <Alert variant="primary">College recommender toggle is on. Please wait while reccommendation results load.</Alert>}
                    {sortBy === 'Cost' && student.residenceState == null ? <Alert variant="info">Sorting by out-of-state cost of attendance. Add your residence state in your profile to show in-state cost.</Alert> : <></>}
                    {showSpinner
                        ? (
                            <div className="text-center">
                                <Spinner className="large-spinner" style={{ width: '10rem', height: '10rem' }} animation="grow" variant="primary" />
                            </div>
                        )
                        : <CollegeList student={student} colleges={searchResults} />}
                </Col>
            </Row>
        </Container>
    );
};

export default Search;
