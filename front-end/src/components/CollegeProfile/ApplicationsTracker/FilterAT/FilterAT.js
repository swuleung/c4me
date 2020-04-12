/**
 * This component is the filter box for the Applications Tracker
 */
import React, { useState, useEffect } from 'react';
import {
    Container, Form, Col, OverlayTrigger, Popover, Table, Button, ListGroup,
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import Autosuggest from 'react-autosuggest';

import './FilterAT.scss';

const FilterAT = (props) => {
    // state variables
    const [lax, setLax] = useState('lax');
    const [collegeClass, setCollegeCLass] = useState({
        lowerCollegeClass: '',
        upperCollegeClass: '',
    });
    // status list
    const [statuses, setStatuses] = useState({
        accepted: false,
        deferred: false,
        denied: false,
        pending: false,
        waitlisted: false,
        withdrawn: false,
    });
    const [highSchool, setHighSchool] = useState('');

    const [highSchoolList, setHighSchoolList] = useState([]);
    // pass filter changes to main Applications Tracker
    const { handleFilterChange, allHighSchools } = props;
    const [suggestions, setSuggestions] = useState([]);

    /**
     * Handle the change in high school list
     * @param {event} event
     * @param {highSchool} suggestion
     */
    const handleAddHighSchool = (event, { suggestion }) => {
        const newHighSchools = [...highSchoolList];
        newHighSchools.push(suggestion);
        setHighSchool('');
        setHighSchoolList(newHighSchools);
    };


    /**
     *  Handle the changes in deleting a high school from list
     * @param {event} e
     */
    const handleDeleteHighSchool = (e) => {
        const index = e.target.getAttribute('index');
        const newHighSchools = [...highSchoolList];
        newHighSchools.splice(index, 1);
        setHighSchoolList(newHighSchools);
    };

    /**
     * Generate html for the high school list to display under the autosuggest
     */
    const generateHighSchoolList = () => {
        const highSchoolsHTML = [];
        for (let i = 0; i < highSchoolList.length; i += 1) {
            highSchoolsHTML.push(
                <tr className="mb-0" key={`hs-${i}`}>
                    <td>
                        {highSchoolList[i].Name}
                    </td>
                    <td>
                        <span role="button" className="delete text-right" tabIndex={i} index={`${i}`} onClick={(e) => handleDeleteHighSchool(e)} onKeyDown={(e) => handleDeleteHighSchool(e)}>&#10005;</span>
                    </td>
                </tr>,
            );
        }
        return highSchoolsHTML;
    };

    /**
     * Build the query for filters before passing it up to Applications Tracker
     */
    const buildATQuery = () => {
        const filters = {};

        if (lax === 'lax') {
            filters.lax = true;
        } else {
            filters.lax = false;
        }
        if ((collegeClass.lowerCollegeClass).trim() !== '' && parseInt(collegeClass.lowerCollegeClass, 10) > -1) {
            filters.lowerCollegeClass = parseInt(collegeClass.lowerCollegeClass, 10);
        }

        if ((collegeClass.upperCollegeClass).trim() !== '' && parseInt(collegeClass.upperCollegeClass, 10) > -1) {
            filters.upperCollegeClass = parseInt(collegeClass.upperCollegeClass, 10);
        }

        let selectedStatuses = [];
        // get the selected statuses
        const entries = Object.entries(statuses);
        for (let i = 0; i < entries.length; i += 1) {
            if (entries[i][1]) {
                selectedStatuses.push(entries[i][0]);
            }
        }

        if (selectedStatuses.length === 0) {
            selectedStatuses = ['accepted', 'deferred', 'denied', 'pending', 'waitlisted', 'withdrawn'];
        }
        filters.statuses = selectedStatuses;

        if (highSchoolList.length) {
            filters.highSchools = [highSchoolList.map((hs) => hs.HighSchoolId)];
        }
        // pass this up to ApplicationsTracker
        handleFilterChange(filters);
    };

    /**
     * The next several functions with suggestion in the name are to pass through to the Autosuggest box
     */
    // Get suggestions from text box
    const getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0 ? allHighSchools : allHighSchools.filter((hs) => hs.Name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    };

    // get the value of a suggestion
    const getSuggestionValue = (suggestion) => suggestion.Name;

    // display the suggestion
    const renderSuggestion = (suggestion) => (
        <ListGroup.Item>
            {suggestion.Name.toLowerCase().split(' ').map((s) => {
                if (s !== 'and' && s !== 'of') return s.charAt(0).toUpperCase() + s.substring(1);
                return s;
            }).join(' ')}
        </ListGroup.Item>
    );

    // input properties for Autosuggest
    const inputProps = {
        placeholder: 'Enter a high school name',
        value: highSchool,
        onChange: (e, { newValue }) => setHighSchool(newValue),
    };

    // what happens when a suggestion is asked to be fetched
    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value));
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    // load high schoools
    useEffect(() => {
    }, []);

    // display the filter box
    return (

        <Container id="filter-box">
            <h2>Filters</h2>
            <Form onSubmit={(e) => { e.preventDefault(); buildATQuery(); }}>
                <b>Type of Filtering&nbsp;</b>
                <OverlayTrigger
                    placement="right"
                    overlay={(
                        <Popover id="popover-basic">
                            <Popover.Title>Type of Filtering</Popover.Title>
                            <Popover.Content>
                                            Lax will include schools whose values are null for these filters.
                            </Popover.Content>
                        </Popover>
                    )}
                >
                    <FontAwesomeIcon className="text-info" icon={faQuestionCircle} />
                </OverlayTrigger>
                <Form.Group>
                    <Form.Check name="isLax" inline label="Strict" value="strict" type="radio" checked={lax === 'strict'} onChange={(e) => setLax(e.target.value)} />
                    <Form.Check name="isLax" inline label="Lax" value="lax" checked={lax === 'lax'} type="radio" onChange={(e) => setLax(e.target.value)} />
                </Form.Group>
                <b>College Class&nbsp;</b>
                <OverlayTrigger
                    placement="right"
                    overlay={(
                        <Popover id="popover-basic">
                            <Popover.Title>College Class</Popover.Title>
                            <Popover.Content>
                                            Choose the college graduation year of the to filter by. For example, 2022-2024
                            </Popover.Content>
                        </Popover>
                    )}
                >
                    <FontAwesomeIcon className="text-info" icon={faQuestionCircle} />
                </OverlayTrigger>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Control type="number" placeholder="Min" min="0" max="2030" step="1" onChange={(e) => setCollegeCLass({ ...collegeClass, lowerCollegeClass: e.target.value })} />
                    </Form.Group>
                                -
                    <Form.Group as={Col}>
                        <Form.Control type="text" placeholder="Max" onChange={(e) => setCollegeCLass({ ...collegeClass, upperCollegeClass: e.target.value })} />
                    </Form.Group>

                </Form.Row>

                <b>Status&nbsp;</b>
                <OverlayTrigger
                    placement="right"
                    overlay={(
                        <Popover id="popover-basic">
                            <Popover.Title>Status</Popover.Title>
                            <Popover.Content>
                                            Filter by type of status. If all or none is selected, it will return all statuses.
                            </Popover.Content>
                        </Popover>
                    )}
                >
                    <FontAwesomeIcon className="text-info" icon={faQuestionCircle} />
                </OverlayTrigger>
                <Form.Group>
                    <Form.Check name="status" label="accepted" type="checkbox" checked={statuses.accepted} onChange={(e) => setStatuses({ ...statuses, accepted: e.target.checked })} />
                    <Form.Check name="status" label="deferred" type="checkbox" checked={statuses.deferred} onChange={(e) => setStatuses({ ...statuses, deferred: e.target.checked })} />
                    <Form.Check name="status" label="denied" type="checkbox" checked={statuses.denied} onChange={(e) => setStatuses({ ...statuses, denied: e.target.checked })} />
                    <Form.Check name="status" label="pending" type="checkbox" checked={statuses.pending} onChange={(e) => setStatuses({ ...statuses, pending: e.target.checked })} />
                    <Form.Check name="status" label="waitlisted" type="checkbox" checked={statuses.waitlisted} onChange={(e) => setStatuses({ ...statuses, waitlisted: e.target.checked })} />
                    <Form.Check name="status" label="withdrawn" type="checkbox" checked={statuses.withdrawn} onChange={(e) => setStatuses({ ...statuses, withdrawn: e.target.checked })} />
                </Form.Group>

                <b>High Schools&nbsp;</b>
                <OverlayTrigger
                    placement="right"
                    overlay={(
                        <Popover id="popover-basic">
                            <Popover.Title>High Schools</Popover.Title>
                            <Popover.Content>
                                            Enter high school names to filter by specific high schools.
                            </Popover.Content>
                        </Popover>
                    )}
                >
                    <FontAwesomeIcon className="text-info" icon={faQuestionCircle} />
                </OverlayTrigger>

                <br />
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    shouldRenderSuggestions={() => true}
                    inputProps={inputProps}
                    onSuggestionSelected={handleAddHighSchool}
                    theme={{
                        input: 'form-control',
                        container: 'react-autosuggest__container',
                        containerOpen: 'react-autosuggest__container--open',
                        inputOpen: 'react-autosuggest__input--open',
                        inputFocused: 'react-autosuggest__input--focused',
                        suggestionsContainer: 'react-autosuggest__suggestions-container',
                        suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
                        suggestionsList: 'list-group',
                        suggestion: 'react-autosuggest__suggestion',
                        suggestionFirst: 'react-autosuggest__suggestion--first',
                        suggestionHighlighted: 'react-autosuggest__suggestion--highlighted',
                        sectionContainer: 'react-autosuggest__section-container',
                        sectionContainerFirst: 'react-autosuggest__section-container--first',
                        sectionTitle: 'react-autosuggest__section-title',
                    }}
                />
                <Table size="sm" borderless>
                    <tbody>
                        {generateHighSchoolList()}
                    </tbody>
                </Table>
                <Button className="btn-block" variant="primary" type="submit">
                                Apply Filters
                </Button>
            </Form>
        </Container>
    );
};

export default FilterAT;
