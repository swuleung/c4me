import React, { useState, useEffect } from 'react';
import {
    Alert, Button, Container, Row, Col, Table, Form, ListGroup,
} from 'react-bootstrap';
import './EditProfile.scss';
import Autosuggest from 'react-autosuggest';
import studentAPI from '../../services/api/student';
import highSchoolAPI from '../../services/api/highSchool';
import CollegeDropdown from './CollegeDropdown';


const EditProfile = (props) => {
    // state variables
    const [student, setStudent] = useState({});
    const [studentApplications, setStudentApplications] = useState([]);
    const [highSchool, setHighSchool] = useState({ Name: '' });
    const [newHighSchool, setNewHighSchool] = useState({});
    const [highSchools, setHighSchools] = useState([]);
    const [displayOtherHS, setDisplayOtherHS] = useState(false);
    const [displayAutosuggest, setDisplayAutosuggest] = useState(true);
    const [suggestions, setSuggestions] = useState([]);
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { match } = props;
    const { username } = match.params;

    /**
     * Updates the student state with data from form
     * @param {event} e
     */
    const handleProfileChange = (e) => {
        let { value } = e.target;
        const { id } = e.target;
        if (value === '') value = null;
        setStudent({ ...student, [id]: value });
    };

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
     * Updates the applications state with data from form
     * @param {event} e
     */
    const handleApplicationChange = (e) => {
        const { value } = e.target;
        const index = e.target.getAttribute('index');
        const newApplications = [...studentApplications];
        newApplications[index].status = value;
        setStudentApplications(newApplications);
    };

    /**
     * Updates the application's college with data from form
     * @param {event} e
     */
    const handleApplicationCollegeChange = (e) => {
        const { value } = e.target;
        const index = e.target.getAttribute('index');
        const newApplications = [...studentApplications];
        newApplications[index].college = value;
        setStudentApplications(newApplications);
    };

    /**
     * Deletes the associated application by button click
     * @param {event} e
     */
    const handleDeleteApplication = (e) => {
        const index = e.target.getAttribute('index');
        const newApplications = [...studentApplications];
        newApplications.splice(index, 1);
        setStudentApplications(newApplications);
    };

    /**
     * Adds a new row for an application
     */
    const handleAddApplication = () => {
        const newApplications = [...studentApplications];
        newApplications.push({
            status: 'pending',
            college: null,
            username: username,
        });
        setStudentApplications(newApplications);
    };

    /**
     * Creates the options for state dropdown menu
     */
    const generateStateOptions = () => {
        const stateCode = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MH', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'PW', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'];
        const states = [];
        for (let i = 0; i < stateCode.length; i += 1) {
            states.push(<option key={i} value={stateCode[i]}>{stateCode[i]}</option>);
        }
        return states;
    };

    /**
     * Sends student data to backend after form submission
     */
    const handleEditSubmission = () => {
        studentAPI.editStudent(username, student, newHighSchool).then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
            }
        });
        studentAPI.editStudentApplications(username, studentApplications).then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
                props.history.push(`../${username}`);
            }
        });
    };

    /**
     * Creates the application components to be rendered
     */
    const generateStudentApplications = () => {
        const applications = [];
        for (let i = 0; i < studentApplications.length; i += 1) {
            applications.push(
                <tr className="application" key={`college-${i}`}>
                    <td>
                        <CollegeDropdown applications={studentApplications} selectedValue={studentApplications[i].college} index={`${i}`} onChange={(e) => { handleApplicationCollegeChange(e); }} />
                    </td>
                    <td>
                        <Form.Control as="select" index={`${i}`} className={studentApplications[i].status} value={studentApplications[i].status} onChange={(e) => { handleApplicationChange(e); }}>
                            <option value="accepted">accepted</option>
                            <option value="deferred">deferred</option>
                            <option value="denied">denied</option>
                            <option value="pending">pending</option>
                            <option value="waitlisted">waitlisted</option>
                            <option value="withdrawn">withdrawn</option>
                        </Form.Control>
                    </td>
                    <td className="delete-icon">
                        <span role="button" tabIndex={i} index={`${i}`} onClick={(e) => { handleDeleteApplication(e); }} onKeyDown={(e) => { handleDeleteApplication(e); }}>&#10005;</span>
                    </td>
                </tr>,
            );
        }
        return applications;
    };

    /**
     * Fetches student and high school data
     */
    useEffect(() => {
        studentAPI.getStudent(username).then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
                setStudent(result.student);
                if (result.student.HighSchool) {
                    setHighSchool(result.student.HighSchool);
                    setNewHighSchool(result.student.HighSchool);
                } else {
                    setHighSchool({
                        Name: '',
                        HighSchoolCity: '',
                        HighSchoolState: '',
                    });
                    setNewHighSchool({
                        Name: '',
                        HighSchoolCity: '',
                        HighSchoolState: '',
                    });
                }
            }
        });

        studentAPI.getStudentApplications(username).then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
                setStudentApplications(result.applications);
            }
        });

        highSchoolAPI.getAllHighSchools().then((result) => {
            if (result.error === 'No high schools in the db') {
                setDisplayAutosuggest(false);
                setDisplayOtherHS(true);
            } else if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
                result.highSchools.sort((a, b) => (a.Name.localeCompare(b.Name)));
                setHighSchools(result.highSchools);
            }
        });
    }, [username]);

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
        if (suggestion.Name && suggestion.HighSchoolCity && suggestion.HighSchoolState) {
            return (
                <ListGroup.Item>
                    {suggestion.Name}
                    {' '}
                    <small>
                        {suggestion.HighSchoolCity}
,
                        {' '}
                        {suggestion.HighSchoolState}
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
            {errorAlert && (
                <Alert variant="danger">
                    {errorMessage}
                </Alert>
            )}
            <div>
                <Form onSubmit={(e) => { e.preventDefault(); handleEditSubmission(); }}>
                    <Container>
                        <h1>{username}</h1>
                        {displayAutosuggest && (
                            <Row>
                                <Col>
                                    <Form.Group controlId="highSchool">
                                        <Form.Label>High School</Form.Label>
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
                                    <Form.Group controlId="HighSchoolCity">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control type="text" value={newHighSchool.HighSchoolCity || ''} placeholder="City" onChange={(e) => { handleHighSchoolChange(e); }} autoComplete="on" required />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="HighSchoolState">
                                        <Form.Label>State</Form.Label>
                                        <Form.Control as="select" value={newHighSchool.HighSchoolState || ''} onChange={(e) => { handleHighSchoolChange(e); }} required>
                                            <option value="" disabled>Select a State</option>
                                            {generateStateOptions()}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                        )}
                        <Row>
                            <Col>
                                <Form.Group controlId="collegeClass">
                                    <Form.Label>College Class Year</Form.Label>
                                    <Form.Control type="number" value={student.collegeClass || ''} placeholder="Enter college class year" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="GPA">
                                    <Form.Label>GPA</Form.Label>
                                    <Form.Control type="number" value={student.GPA || ''} min="0" max="4.00" step="0.01" placeholder="Enter GPA" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group controlId="residenceState">
                            <Form.Label>Residence State</Form.Label>
                            <Form.Control as="select" value={student.residenceState || ''} onChange={(e) => { handleProfileChange(e); }}>
                                <option value="" disabled>Select a State</option>
                                {generateStateOptions()}
                            </Form.Control>
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group controlId="major1">
                                    <Form.Label>First Major</Form.Label>
                                    <Form.Control type="text" value={student.major1 || ''} placeholder="Enter a major" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="major2">
                                    <Form.Label>Second Major</Form.Label>
                                    <Form.Control type="text" value={student.major2 || ''} placeholder="Enter a major" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>
                    <br />
                    <Container>
                        <h1>Standardized Exams </h1>
                        <Row>
                            <Col>
                                <h2>SAT</h2>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATEBRW">
                                            <Form.Label className="col">EBRW</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATEBRW || ''} min="200" max="800" placeholder="200-800" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATMath">
                                            <Form.Label className="col">Math</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATMath || ''} min="200" max="800" placeholder="200-800" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <br />
                                <h2>ACT</h2>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="ACTEnglish">
                                            <Form.Label className="col">English</Form.Label>
                                            <Form.Control className="col" type="number" value={student.ACTEnglish || ''} min="1" max="36" placeholder="1-36" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="ACTMath">
                                            <Form.Label className="col">Math</Form.Label>
                                            <Form.Control className="col" type="number" value={student.ACTMath || ''} min="1" max="36" placeholder="1-36" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="ACTReading">
                                            <Form.Label className="col">Reading</Form.Label>
                                            <Form.Control className="col" type="number" value={student.ACTReading || ''} min="1" max="36" placeholder="1-36" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="ACTScience">
                                            <Form.Label className="col">Science</Form.Label>
                                            <Form.Control className="col" type="number" value={student.ACTScience || ''} min="1" max="36" placeholder="1-36" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="ACTComposite">
                                            <Form.Label className="col">Composite</Form.Label>
                                            <Form.Control className="col" type="number" value={student.ACTComposite || ''} min="1" max="36" placeholder="1-36" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <h2>SAT Subject Tests</h2>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATLit">
                                            <Form.Label className="col">Literature</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATLit || ''} min="200" max="800" placeholder="200-800" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATUs">
                                            <Form.Label className="col">US History</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATUs || ''} min="200" max="800" placeholder="200-800" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATWorld">
                                            <Form.Label className="col">World History</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATWorld || ''} min="200" max="800" placeholder="200-800" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATMathI">
                                            <Form.Label className="col">Math I</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATMathI || ''} min="200" max="800" placeholder="200-800" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATMathII">
                                            <Form.Label className="col">Math II</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATMathII || ''} min="200" max="800" placeholder="200-800" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATEco">
                                            <Form.Label className="col">Ecological Biology</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATEco || ''} min="200" max="800" placeholder="200-800" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATMol">
                                            <Form.Label className="col">Molecular Biology</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATMol || ''} min="200" max="800" placeholder="200-800" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATChem">
                                            <Form.Label className="col">Chemistry</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATChem || ''} min="200" max="800" placeholder="200-800" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATPhys">
                                            <Form.Label className="col">Physics</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATPhys || ''} min="200" max="800" placeholder="200-800" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col>
                                <h2>Number of AP Exams Passed</h2>

                                <Form.Group className="row" controlId="APPassed">
                                    <Form.Label className="col-3">Total</Form.Label>
                                    <Form.Control className="col-3" type="number" value={student.APPassed || ''} placeholder="0-38" min="0" max="38" onChange={(e) => { handleProfileChange(e); }} autoComplete="on" />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>
                    <br />
                    <Container>
                        <h1>Applications</h1>
                        <Table className="table-striped">
                            <thead>
                                <tr>
                                    <th>School</th>
                                    <th>Status</th>
                                    <th>&nbsp; </th>
                                </tr>
                            </thead>
                            <tbody>
                                {generateStudentApplications()}
                            </tbody>
                        </Table>
                        <Button onClick={handleAddApplication}>Add Application</Button>
                    </Container>
                    <br />
                    <Container>
                        <Button className="btn-block" variant="success" type="submit">
                            Save Changes
                        </Button>
                    </Container>
                </Form>
            </div>
        </div>
    );
};

export default EditProfile;
