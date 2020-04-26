/**
 * This component is the filter box for the Applications Tracker
 */
import React, { useState } from 'react';
import {
    Container, Form, Row, Col, OverlayTrigger, Popover, Button, InputGroup,
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
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

    // size
    const [size, setSize] = useState({
        sizeMin: '',
        sizeMax: '',
    });

    // admission rate
    const [admissionRate, setAdmissionRate] = useState({
        admissionRateMin: '',
        admissionRateMax: '',
    });

    // college ranking
    const [collegeRanking, setCollegeRanking] = useState({
        rankingMin: '',
        rankingMax: '',
    });

    // SAT EBRW
    const [SATEBRW, setSATEBRW] = useState({
        SATEBRWMin: '',
        SATEBRWMax: '',
    });

    // SAT Math
    const [SATMath, setSATMath] = useState({
        SATMathMin: '',
        SATMathMax: '',
    });

    // ACT Composite
    const [ACTComposite, setACTComposite] = useState({
        ACTCompositeMin: '',
        ACTCompositeMax: '',
    });

    // Cost of Attendance
    const [costOfAttendance, setCostOfAttendance] = useState('100000');

    // region list
    const [regions, setRegions] = useState({
        midwest: false,
        northeast: false,
        south: false,
        west: false,
    });
    // pass filter changes to main  Applications Tracker
    const { handleFilterChange } = props;
    const [selectedStates, setSelectedStates] = useState([]);

    /**
     * Build the query for filters before passing it up to Search
     * All values are trimmed. If there is a missing min/max, then it is appropriately filled.
     */
    const buildATQuery = () => {
        const filters = {};

        if (lax === 'lax') {
            filters.lax = true;
        } else {
            filters.lax = false;
        }

        if (name !== '') {
            filters.name = name;
        }

        if (major1 !== '') {
            filters.major = major1;
        }

        if (major2 !== '') {
            filters.major2 = major2;
        }

        if (size.sizeMin !== '') {
            filters.sizeMin = parseInt(size.sizeMin, 10);
        } else {
            filters.sizeMin = 0;
        }

        if (size.sizeMax !== '') {
            filters.sizeMax = parseInt(size.sizeMax, 10);
        } else {
            filters.sizeMax = Number.MAX_SAFE_INTEGER;
        }

        if (admissionRate.admissionRateMin !== '') {
            filters.admissionRateMin = parseInt(admissionRate.admissionRateMin, 10);
        } else {
            filters.admissionRateMin = 0;
        }

        if (admissionRate.admissionRateMax !== '') {
            filters.admissionRateMax = parseInt(admissionRate.admissionRateMax, 10);
        } else {
            filters.addmissionRateMax = Number.MAX_SAFE_INTEGER;
        }

        if (collegeRanking.rankingMin !== '') {
            filters.rankingMin = parseInt(collegeRanking.rankingMin, 10);
        } else {
            filters.rankingMin = 0;
        }

        if (collegeRanking.rankingMax !== '') {
            filters.rankingMax = parseInt(collegeRanking.rankingMax, 10);
        } else {
            filters.rankingMax = Number.MAX_SAFE_INTEGER;
        }

        if (SATEBRW.SATEBRWMin !== '') {
            filters.SATEBRWMin = parseInt(SATEBRW.SATEBRWMin, 10);
        } else {
            filters.SATEBRWMin = 200;
        }

        if (SATEBRW.SATEBRWMax !== '') {
            filters.SATEBRWMax = parseInt(SATEBRW.SATEBRWMax, 10);
        } else {
            filters.SATEBRWMax = 800;
        }

        if (SATMath.SATMathMin !== '') {
            filters.SATMathMin = parseInt(SATMath.SATMathMin, 10);
        } else {
            filters.SATMathMin = 200;
        }

        if (SATMath.SATMathMax !== '') {
            filters.SATMathMax = parseInt(SATMath.SATMathMax, 10);
        } else {
            filters.SATMathMax = 800;
        }

        if (ACTComposite.ACTCompositeMin !== '') {
            filters.ACTCompositeMin = ACTComposite.ACTCompositeMin;
        } else {
            filters.ACTCompositeMin = 1;
        }

        if (ACTComposite.ACTCompositeMax !== '') {
            filters.ACTCompositeMax = ACTComposite.ACTCompositeMax;
        } else {
            filters.ACTCompositeMax = 36;
        }

        if (costOfAttendance !== '') {
            filters.costMax = costOfAttendance;
        }

        let selectedregions = [];

        // if no regions are selected, add all regions
        if (regions.length === 0 && selectedStates.length !== 0) {
            selectedregions = ['midwest', 'northeast', 'south', 'west'];
        } else {
            // get the selected regions
            const entries = Object.entries(regions);
            for (let i = 0; i < entries.length; i += 1) {
                if (entries[i][1]) {
                    selectedregions.push(entries[i][0]);
                }
            }
        }
        filters.regions = selectedregions;

        if (selectedStates.length !== 0) {
            filters.states = selectedStates;
        }

        // pass this up to ApplicationsTracker
        handleFilterChange(filters);
    };

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
                        <Form.Control type="text" placeholder="Enter a name" onChange={(e) => setName(e.target.value.trim())} />
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
                        <Form.Control type="text" placeholder="Enter a major" onChange={(e) => setMajor1(e.target.value.trim())} />
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
                        <Form.Control type="text" placeholder="Enter a major" onChange={(e) => setMajor2(e.target.value.trim())} />
                    </Form.Group>
                </Form.Row>
                <b>Size&nbsp;</b>
                <OverlayTrigger
                    placement="right"
                    overlay={(
                        <Popover>
                            <Popover.Title>Size</Popover.Title>
                            <Popover.Content>
                                Choose the range of range for number of undergraduate students to filter by. For example, 10000-20000.
                            </Popover.Content>
                        </Popover>
                    )}
                >
                    <FontAwesomeIcon className="text-info" icon={faQuestionCircle} />
                </OverlayTrigger>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Control type="number" placeholder="Min" onChange={(e) => setSize({ ...size, sizeMin: e.target.value.trim() })} />
                    </Form.Group>
                                -
                    <Form.Group as={Col}>
                        <Form.Control type="number" placeholder="Max" onChange={(e) => setSize({ ...size, sizeMax: e.target.value.trim() })} />
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
                                onChange={(e) => setAdmissionRate({ ...admissionRate, admissionRateMin: e.target.value.trim() })}
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
                                onChange={(e) => setAdmissionRate({ ...admissionRate, admissionRateMax: e.target.value.trim() })}
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
                        <Form.Control type="number" placeholder="Min" step="1" onChange={(e) => setCollegeRanking({ ...collegeRanking, rankingMin: e.target.value.trim() })} />
                    </Form.Group>
                                -
                    <Form.Group as={Col}>
                        <Form.Control type="number" placeholder="Max" onChange={(e) => setCollegeRanking({ ...collegeRanking, rankingMax: e.target.value.trim() })} />
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
                        <Form.Control type="number" placeholder="Min" min="200" max="800" onChange={(e) => setSATEBRW({ ...SATEBRW, SATEBRWMin: e.target.value.trim() })} />
                    </Form.Group>
                                -
                    <Form.Group as={Col}>
                        <Form.Control type="number" placeholder="Max" min="200" max="800" onChange={(e) => setSATEBRW({ ...SATEBRW, SATEBRWMax: e.target.value.trim() })} />
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
                        <Form.Control type="number" placeholder="Min" min="200" max="800" step="1" onChange={(e) => setSATMath({ ...SATMath, SATMathMin: e.target.value.trim() })} />
                    </Form.Group>
                                -
                    <Form.Group as={Col}>
                        <Form.Control type="number" placeholder="Max" min="200" max="800" step="1" onChange={(e) => setSATMath({ ...SATMath, SATMathMax: e.target.value.trim() })} />
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
                        <Form.Control type="number" placeholder="Min" min="1" max="36" step="1" onChange={(e) => setACTComposite({ ...ACTComposite, ACTCompositeMin: e.target.value.trim() })} />
                    </Form.Group>
                                -
                    <Form.Group as={Col}>
                        <Form.Control type="number" placeholder="Max" min="1" max="36" step="1" onChange={(e) => setACTComposite({ ...ACTComposite, ACTCompositeMax: e.target.value.trim() })} />
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
                    <Col>
                        {`Maximum Cost: ${costOfAttendance.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                    </Col>
                </Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Control min="10000" max="100000" step="500" type="range" value={costOfAttendance} onChange={(e) => setCostOfAttendance(e.target.value.trim())} />
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
                    <Form.Check name="region" label="Midwest" type="checkbox" checked={regions.midwest} onChange={(e) => setRegions({ ...regions, midwest: e.target.checked })} />
                    <Form.Check name="status" label="Northeast" type="checkbox" checked={regions.northeast} onChange={(e) => setRegions({ ...regions, northeast: e.target.checked })} />
                    <Form.Check name="status" label="South" type="checkbox" checked={regions.south} onChange={(e) => setRegions({ ...regions, south: e.target.checked })} />
                    <Form.Check name="status" label="West" type="checkbox" checked={regions.west} onChange={(e) => setRegions({ ...regions, west: e.target.checked })} />
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
