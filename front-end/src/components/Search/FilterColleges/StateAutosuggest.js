/**
 * This component is the filter box for the Applications Tracker
 */
import React, { useState, useRef } from 'react';
import {
    ListGroup, Row, Col, OverlayTrigger, Popover,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import Autosuggest from 'react-autosuggest';
import './FilterColleges.scss';

const StateAutosuggest = (props) => {
    const [state, setUSState] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const { setSelectedStates, selectedStates } = props;

    /**
     * Handle the change in state list
     * @param {event} event
     * @param {string} suggestion
     */
    const handleAddState = (event, { suggestion }) => {
        const newStateList = [...selectedStates];
        newStateList.push(suggestion);
        setSelectedStates(newStateList);
        setUSState('');
    };

    /**
     *  Handle the changes in deleting a high school from list
     * @param {event} e
     */
    const handleDeleteState = (e) => {
        const index = e.target.getAttribute('index');
        const newStates = [...selectedStates];
        newStates.splice(index, 1);
        setSelectedStates(newStates);
    };

    /**
     * Generate html for the high school list to display under the autosuggest
     */
    const generateStateList = () => {
        const statesHTML = [];
        for (let i = 0; i < selectedStates.length; i += 1) {
            statesHTML.push(
                <span key={`${i}-${selectedStates[i]}`} className="pill">
                    {selectedStates[i]}
                    {'  '}
                    <span className="delete-pill" role="button" tabIndex={i} index={`${i}`} onClick={(e) => handleDeleteState(e)} onKeyDown={(e) => handleDeleteState(e)}>&#10005;</span>
                </span>,
            );
        }
        return statesHTML;
    };

    /**
     * The next several functions with suggestion in the name are to pass through to the Autosuggest box
     */
    // Get suggestions from text box
    const getSuggestions = (value) => {
        const inputValue = value.trim().toUpperCase();
        const inputLength = inputValue.length;
        const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT',
            'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN',
            'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA',
            'MI', 'MN', 'MO', 'MS', 'MT', 'NE', 'NV',
            'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH',
            'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN',
            'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
        return inputLength === 0
            ? states.filter((st) => !selectedStates.includes(st))
            : states.filter((st) => st.indexOf(inputValue) > -1 && !selectedStates.includes(st));
    };

    // get the value of a suggestion
    const getSuggestionValue = (suggestion) => suggestion;

    // display the suggestion
    const renderSuggestion = (suggestion) => (
        <ListGroup.Item>
            {suggestion}
        </ListGroup.Item>
    );

    // input properties for Autosuggest
    const inputProps = {
        placeholder: 'Enter a 2 letter state',
        value: state,
        onChange: (e, { newValue }) => {
            setUSState(newValue);
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

    // display the filter box
    return (
        <>
            <b>States&nbsp;</b>
            <OverlayTrigger
                placement="right"
                overlay={(
                    <Popover>
                        <Popover.Title>High Schools</Popover.Title>
                        <Popover.Content>
                                            Enter a 2 letter state to filter by states. For example, NY.
                        </Popover.Content>
                    </Popover>
                )}
            >
                <FontAwesomeIcon className="text-info" icon={faQuestionCircle} />
            </OverlayTrigger>
            <Row>
                <Col>
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        shouldRenderSuggestions={() => true}
                        inputProps={inputProps}
                        onSuggestionSelected={handleAddState}
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
                </Col>
            </Row>
            {selectedStates.length !== 0 && (
                <span>Selected States:</span>,
                <Row>
                    <Col>
                        {generateStateList()}
                    </Col>
                </Row>
            )}
        </>
    );
};

export default StateAutosuggest;
