/**
 * This component is the filter box for the Applications Tracker
 */
import React, { useState, useEffect } from 'react';
import {
    Container, Form, Row, Col, OverlayTrigger, Popover, Button, InputGroup,
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
// import Autosuggest from 'react-autosuggest';
import './FilterColleges.scss';
import StateAutosuggest from './StateAutosuggest';

const FilterColleges = (props) => {
    // state variables

    // lax filtering
    const [lax, setLax] = useState('lax');

    // college name 
    const [name, setName] = useState('');

    // first major
    const [major1, setMajor1] = useState('');

    // second major
    const [major2, setMajor2] = useState('');

    // admission rate
    const [admissionRate, setAdmissionRate] = useState({
        admissionRateMin: '',
        admissionRateMax: '',
    });

    // college ranking 
    const [collegeRanking, setCollegeRanking] = useState({
        rankingMin: '',
        rankingMax: ''
    });

    // SAT EBRW
    const [SATEBRW, setSATEBRW] = useState({
        SATEBRWMin: '',
        SATEBRWMax: ''
    });

    // SAT Math 
    const [SATMath, setSATMath] = useState({
        SATMathMin: '',
        SATMathMax: '',
    })

    // ACT Composite
    const [ACTComposite, setACTComposite] = useState({
        ACTCompositeMin: '',
        ACTCompositeMax: ''
    });

    // Cost of Attendance 
    const [costOfAttendance, setCostOfAttendance] = useState(null);

    // region list
    const [regions, setRegions] = useState({
        midwestern: false,
        northeastern: false,
        southern: false,
        western: false,
    });
    // pass filter changes to main  Applications Tracker
    const { handleFilterChange } = props;
    const [selectedStates, setSelectedStates] = useState([]);

    /**
     * Build the query for filters before passing it up to Applications Tracker
     */
    const buildATQuery = () => {
        const filters = {};

        // if (lax === 'lax') {
        //     filters.lax = true;
        // } else {
        //     filters.lax = false;
        // }
        // if ((collegeClass.lowerCollegeClass).trim() !== '' && parseInt(collegeClass.lowerCollegeClass, 10) > -1) {
        //     filters.lowerCollegeClass = parseInt(collegeClass.lowerCollegeClass, 10);
        // }

        // if ((collegeClass.upperCollegeClass).trim() !== '' && parseInt(collegeClass.upperCollegeClass, 10) > -1) {
        //     filters.upperCollegeClass = parseInt(collegeClass.upperCollegeClass, 10);
        // }

        // let selectedregions = [];
        // // get the selected regions
        // const entries = Object.entries(regions);
        // for (let i = 0; i < entries.length; i += 1) {
        //     if (entries[i][1]) {
        //         selectedregions.push(entries[i][0]);
        //     }
        // }

        // if (selectedregions.length === 0) {
        //     selectedregions = ['accepted', 'deferred', 'denied', 'pending', 'waitlisted', 'withdrawn'];
        // }
        // filters.regions = selectedregions;

        // if (stateList.length) {
        //     filters.highSchools = stateList.map((hs) => hs.HighSchoolId);
        // }
        // pass this up to ApplicationsTracker
        handleFilterChange(filters);
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
                        <Popover>
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
                <b>College Name&nbsp;</b>
                <OverlayTrigger
                    placement="right"
                    overlay={(
                        <Popover>
                            <Popover.Title>College Class</Popover.Title>
                            <Popover.Content>
                                Enter a partial or complete name for the college you want to search for. For example, Stony Brook University.
                            </Popover.Content>
                        </Popover>
                    )}
                >
                    <FontAwesomeIcon className="text-info" icon={faQuestionCircle} />
                </OverlayTrigger>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Control type="text" placeholder="Enter a name" onChange={(e) => setName(e.target.value)} />
                    </Form.Group>
                </Form.Row>
                <b>First Major&nbsp;</b>
                <OverlayTrigger
                    placement="right"
                    overlay={(
                        <Popover>
                            <Popover.Title>First Major</Popover.Title>
                            <Popover.Content>
                                Enter a partial or complete major you want to search for. For example, English.
                            </Popover.Content>
                        </Popover>
                    )}
                >
                    <FontAwesomeIcon className="text-info" icon={faQuestionCircle} />
                </OverlayTrigger>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Control type="text" placeholder="Enter a major" onChange={(e) => setMajor1(e.target.value)} />
                    </Form.Group>
                </Form.Row>
                <b>Second Major&nbsp;</b>
                <OverlayTrigger
                    placement="right"
                    overlay={(
                        <Popover>
                            <Popover.Title>College Class</Popover.Title>
                            <Popover.Content>
                                Enter a partial or complete major you want to search for. For example, English.
                            </Popover.Content>
                        </Popover>
                    )}
                >
                    <FontAwesomeIcon className="text-info" icon={faQuestionCircle} />
                </OverlayTrigger>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Control type="text" placeholder="Enter a major" onChange={(e) => setMajor2(e.target.value))} />
                    </Form.Group>
                </Form.Row>
                <b>Admission Rate&nbsp;</b>
                <OverlayTrigger
                    placement="right"
                    overlay={(
                        <Popover>
                            <Popover.Title>Admission Rate</Popover.Title>
                            <Popover.Content>
                                Choose the range for percentage of applicants admitted. For example, 20%-50%.
                            </Popover.Content>
                        </Popover>
                    )}
                >
                    <FontAwesomeIcon className="text-info" icon={faQuestionCircle} />
                </OverlayTrigger>
                <Form.Row>
                    <Form.Group as={Col}>
                        <InputGroup>
                            <Form.Control
                                type="number"
                                placeholder="Min"
                                min="0"
                                max="100"
                                step="1"
                                onChange={(e) => setAdmissionRate({ ...admissionRate, admissionRateMin: e.target.value })}
                            />
                            <InputGroup.Append>
                                <InputGroup.Text>%</InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                    {' - '}
                    <Form.Group as={Col}>
                        <InputGroup>
                            <Form.Control
                                type="number"
                                placeholder="Max"
                                min="0"
                                max="100"
                                step="1"
                                onChange={(e) => setAdmissionRate({ ...admissionRate, admissionRateMax: e.target.value })}
                            />
                            <InputGroup.Append>
                                <InputGroup.Text>%</InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                </Form.Row>
                <b>College Ranking&nbsp;</b>
                <OverlayTrigger
                    placement="right"
                    overlay={(
                        <Popover>
                            <Popover.Title>College Ranking</Popover.Title>
                            <Popover.Content>
                                Choose the range of rankings to filter by. For example, 100-200.
                            </Popover.Content>
                        </Popover>
                    )}
                >
                    <FontAwesomeIcon className="text-info" icon={faQuestionCircle} />
                </OverlayTrigger>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Control type="number" placeholder="Min" step="1" onChange={(e) => setCollegeRanking({ ...collegeRanking, rankingMin: e.target.value })} />
                    </Form.Group>
                                -
                    <Form.Group as={Col}>
                        <Form.Control type="number" placeholder="Max" onChange={(e) => setCollegeRanking({ ...collegeRanking, rankingMax: e.target.value })} />
                    </Form.Group>
                </Form.Row>
                <b>SAT EBRW&nbsp;</b>
                <OverlayTrigger
                    placement="right"
                    overlay={(
                        <Popover>
                            <Popover.Title>SAT EBRW</Popover.Title>
                            <Popover.Content>
                                Choose the range of SAT EBRW to filter by. For example, 600-700.
                            </Popover.Content>
                        </Popover>
                    )}
                >
                    <FontAwesomeIcon className="text-info" icon={faQuestionCircle} />
                </OverlayTrigger>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Control type="number" placeholder="Min" min="200" max="800" onChange={(e) => setSATEBRW({ ...SATEBRW, SATEBRWMin: e.target.value })} />
                    </Form.Group>
                                -
                    <Form.Group as={Col}>
                        <Form.Control type="number" placeholder="Max" min="200" max="800" onChange={(e) => setSATEBRW({ ...SATEBRW, SATEBRWMax: e.target.value })} />
                    </Form.Group>
                </Form.Row>
                <b>SAT Math&nbsp;</b>
                <OverlayTrigger
                    placement="right"
                    overlay={(
                        <Popover>
                            <Popover.Title>SAT Math</Popover.Title>
                            <Popover.Content>
                                Choose the range of SAT Math to filter by. For example, 600-700.
                            </Popover.Content>
                        </Popover>
                    )}
                >
                    <FontAwesomeIcon className="text-info" icon={faQuestionCircle} />
                </OverlayTrigger>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Control type="number" placeholder="Min" min="200" max="800" step="1" onChange={(e) => setSATMath({ ...SATMath, SATMathMin: e.target.value })} />
                    </Form.Group>
                                -
                    <Form.Group as={Col}>
                        <Form.Control type="number" placeholder="Max" min="200" max="800" step="1" onChange={(e) => setSATMath({ ...SATMath, SATMathMax: e.target.value })} />
                    </Form.Group>
                </Form.Row>
                <b>ACT Composite&nbsp;</b>
                <OverlayTrigger
                    placement="right"
                    overlay={(
                        <Popover>
                            <Popover.Title>ACT Composite</Popover.Title>
                            <Popover.Content>
                                Choose the range of ACT Composite to filter by. For example,28-32.
                            </Popover.Content>
                        </Popover>
                    )}
                >
                    <FontAwesomeIcon className="text-info" icon={faQuestionCircle} />
                </OverlayTrigger>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Control type="number" placeholder="Min" min="1" max="36" step="1" onChange={(e) => setACTComposite({ ...ACTComposite, ACTCompositeMin: e.target.value })} />
                    </Form.Group>
                                -
                    <Form.Group as={Col}>
                        <Form.Control type="number" placeholder="Max" min="1" max="36" step="1" onChange={(e) => setACTComposite({ ...ACTComposite, ACTCompositeMax: e.target.value })} />
                    </Form.Group>
                </Form.Row>
                <b>Cost of Attendance&nbsp;</b>
                <OverlayTrigger
                    placement="right"
                    overlay={(
                        <Popover>
                            <Popover.Title>Cost of Attendance</Popover.Title>
                            <Popover.Content>
                                Choose the upper bound for cost of attendance. For example, 60,000.
                            </Popover.Content>
                        </Popover>
                    )}
                >
                    <FontAwesomeIcon className="text-info" icon={faQuestionCircle} />
                </OverlayTrigger>
                <Row>
                    <Col>Maximum Cost: {costOfAttendance}</Col>
                </Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Control type="range" onChange={(e) => setCostOfAttendance(e.target.value)} />
                    </Form.Group>
                </Form.Row>

                <b>Region&nbsp;</b>
                <OverlayTrigger
                    placement="right"
                    overlay={(
                        <Popover>
                            <Popover.Title>Status</Popover.Title>
                            <Popover.Content>
                                Filter by a region. Choose one or more. If none is chosen, all regions will be shown.
                            </Popover.Content>
                        </Popover>
                    )}
                >
                    <FontAwesomeIcon className="text-info" icon={faQuestionCircle} />
                </OverlayTrigger>
                <Form.Group>
                    <Form.Check name="region" label="Midwestern" type="checkbox" checked={regions.midwestern} onChange={(e) => setRegions({ ...regions, midwestern: e.target.checked })} />
                    <Form.Check name="status" label="Northeastern" type="checkbox" checked={regions.northeastern} onChange={(e) => setRegions({ ...regions, northeastern: e.target.checked })} />
                    <Form.Check name="status" label="Southern" type="checkbox" checked={regions.southern} onChange={(e) => setRegions({ ...regions, southern: e.target.checked })} />
                    <Form.Check name="status" label="Western" type="checkbox" checked={regions.western} onChange={(e) => setRegions({ ...regions, western: e.target.checked })} />
                </Form.Group>
                <StateAutosuggest
                    selectedStates={selectedStates}
                    setSelectedStates={setSelectedStates}
                />
                <br />
                <Button className="btn-block" variant="primary" type="submit">
                    Apply Filters
                </Button>
            </Form>
        </Container>
    );
};

export default FilterColleges;
