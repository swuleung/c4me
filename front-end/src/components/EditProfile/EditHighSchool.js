import React, { useState } from 'react';
import {
    Row, Col, Form, ListGroup, Popover, OverlayTrigger,
} from 'react-bootstrap';
import Autosuggest from 'react-autosuggest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';


const EditHighSchool = (props) => {
    const [suggestions, setSuggestions] = useState([]);

    const {
        highSchool,
        setHighSchool,
        newHighSchool,
        setNewHighSchool,
        highSchools,
        displayOtherHS,
        setDisplayOtherHS,
        displayAutosuggest,
        generateStateOptions,
    } = props;

    /**
     * Updates the high school state with data from form
     * @param {event} e
     */
    const handleHighSchoolChange = (e) => {
        let { value } = e.target;
        const { id } = e.target;
        if (value === '') value = null;
        setNewHighSchool({ ...newHighSchool, [id]: value });
    };

    /**
     * The next several functions with suggestion in the name are to pass through to the Autosuggest box
     */
    // Teach Autosuggest how to calculate suggestions for any given input value.
    const getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        const highSchoolSuggestions = [...highSchools];
        const result = inputLength === 0 ? highSchoolSuggestions : highSchoolSuggestions.filter((hs) => hs.Name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
        // always add the other option
        result.unshift({ Name: 'Other - New School' });
        return result;
    };

    // display the suggestion
    const renderSuggestion = (suggestion) => {
        if (suggestion.Name && suggestion.City && suggestion.State) {
            return (
                <ListGroup.Item>
                    {suggestion.Name}
                    {' '}
                    <small>
                        {suggestion.City}
                        {', '}
                        {suggestion.State}
                    </small>
                </ListGroup.Item>
            );
        }
        return (
            <ListGroup.Item>
                {suggestion.Name}
            </ListGroup.Item>
        );
    };

    // input properties for Autosuggest
    const inputProps = {
        placeholder: 'Enter high school name',
        value: highSchool.Name,
        onChange: (e, { newValue }) => {
            if (displayOtherHS) setDisplayOtherHS(false);
            if (typeof (newValue) === 'string') {
                if(newValue === '') {
                    setNewHighSchool({});
                }
                setHighSchool({ Name: newValue });
            } else {
                setHighSchool(newValue);
            }
        },
    };

    // what happens when a suggestion is asked to be fetched
    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value));
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    /**
     * Handles selection of high school from autosuggest box
     * @param {event} event
     * @param {Object} param1
     */
    const handleSelectHighSchool = (event, { suggestion }) => {
        if (suggestion.Name === 'Other - New School') {
            setNewHighSchool({});
            setDisplayOtherHS(true);
        } else {
            setNewHighSchool(suggestion);
        }
    };

    // display the edit profile form
    return (
        <div>
            {displayAutosuggest && (
                <Row>
                    <Col>
                        <Form.Group controlId="highSchool">
                            <Form.Label>
                                {'High School '}
                                <OverlayTrigger
                                    placement="right"
                                    overlay={(
                                        <Popover>
                                            <Popover.Title>High School</Popover.Title>
                                            <Popover.Content>
                                                Choose your high school from the list. If not found, click on "Other - New School" to enter your own school. Correct spelling is necessary.
                                            </Popover.Content>
                                        </Popover>
                                    )}
                                >
                                    <FontAwesomeIcon className="text-info" icon={faQuestionCircle} />
                                </OverlayTrigger>
                            </Form.Label>
                            <Autosuggest
                                suggestions={suggestions}
                                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                onSuggestionsClearRequested={onSuggestionsClearRequested}
                                getSuggestionValue={(suggestion) => suggestion}
                                renderSuggestion={renderSuggestion}
                                shouldRenderSuggestions={() => true}
                                inputProps={inputProps}
                                onSuggestionSelected={handleSelectHighSchool}
                                focusInputOnSuggestionClick={false}
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
                        </Form.Group>
                    </Col>
                </Row>
            )}
            {displayOtherHS && (
                <Row>
                    <Col>
                        <Form.Group controlId="Name">
                            <Form.Label>High School</Form.Label>
                            <Form.Control type="text" value={newHighSchool.Name || ''} placeholder="Name" onChange={(e) => { handleHighSchoolChange(e); }} autoComplete="on" required />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="City">
                            <Form.Label>City</Form.Label>
                            <Form.Control type="text" value={newHighSchool.City || ''} placeholder="City" onChange={(e) => { handleHighSchoolChange(e); }} autoComplete="on" required />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="State">
                            <Form.Label>State</Form.Label>
                            <Form.Control as="select" value={newHighSchool.State || ''} onChange={(e) => { handleHighSchoolChange(e); }} required>
                                <option value="" disabled>Select a State</option>
                                {generateStateOptions()}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default EditHighSchool;
