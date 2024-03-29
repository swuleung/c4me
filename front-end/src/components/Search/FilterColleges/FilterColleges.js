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
    const [costOfAttendance, setCostOfAttendance] = useState({
        cost: '100000',
        changed: false,
    });

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
    const buildQuery = () => {
        let filters = {};

        let changed = false;
        if (lax === 'lax') {
            filters.lax = true;
        } else {
            filters.lax = false;
        }

        if (name !== '') {
            changed = true;
            filters.name = name;
        }

        if (major1 !== '') {
            changed = true;
            filters.major = major1;
        }

        if (major2 !== '') {
            changed = true;
            filters.major2 = major2;
        }

        if (size.sizeMin !== '') {
            changed = true;
            filters.sizeMin = parseInt(size.sizeMin, 10);
            if (size.sizeMax === '') filters.sizeMax = Number.MAX_SAFE_INTEGER;
        }

        if (size.sizeMax !== '') {
            changed = true;
            filters.sizeMax = parseInt(size.sizeMax, 10);
            if (size.sizeMin === '') filters.sizeMin = 0;
        }

        if (admissionRate.admissionRateMin !== '') {
            changed = true;
            filters.admissionRateMin = parseInt(admissionRate.admissionRateMin, 10);
            if (admissionRate.admissionRateMax === '') filters.admissionRateMax = Number.MAX_SAFE_INTEGER;
        }

        if (admissionRate.admissionRateMax !== '') {
            changed = true;
            filters.admissionRateMax = parseInt(admissionRate.admissionRateMax, 10);
            if (admissionRate.admissionRateMin === '') filters.admissionRateMin = 0;
        }

        if (collegeRanking.rankingMin !== '') {
            changed = true;
            filters.rankingMin = parseInt(collegeRanking.rankingMin, 10);
            if (collegeRanking.rankingMax === '') filters.rankingMax = Number.MAX_SAFE_INTEGER;
        }

        if (collegeRanking.rankingMax !== '') {
            changed = true;
            filters.rankingMax = parseInt(collegeRanking.rankingMax, 10);
            if (collegeRanking.rankingMin === '') filters.rankingMin = 0;
        }

        if (SATEBRW.SATEBRWMin !== '') {
            changed = true;
            filters.SATEBRWMin = parseInt(SATEBRW.SATEBRWMin, 10);
            if (SATEBRW.SATEBRWMax === '') filters.SATEBRWMax = 800;
        }

        if (SATEBRW.SATEBRWMax !== '') {
            changed = true;
            filters.SATEBRWMax = parseInt(SATEBRW.SATEBRWMax, 10);
            if (SATEBRW.SATEBRWMin === '') filters.SATEBRWMin = 200;
        }

        if (SATMath.SATMathMin !== '') {
            changed = true;
            filters.SATMathMin = parseInt(SATMath.SATMathMin, 10);
            if (SATMath.SATMathMax === '') filters.SATMathMax = 800;
        }

        if (SATMath.SATMathMax !== '') {
            changed = true;
            filters.SATMathMax = parseInt(SATMath.SATMathMax, 10);
            if (SATMath.SATMathMin === '') filters.SATMathMin = 200;
        }

        if (ACTComposite.ACTCompositeMin !== '') {
            changed = true;
            filters.ACTCompositeMin = ACTComposite.ACTCompositeMin;
            if (ACTComposite.ACTCompositeMax === '') filters.ACTCompositeMax = 36;
        }

        if (ACTComposite.ACTCompositeMax !== '') {
            changed = true;
            filters.ACTCompositeMax = ACTComposite.ACTCompositeMax;
            if (ACTComposite.ACTCompositeMin === '') filters.ACTCompositeMin = 1;
        }

        if (costOfAttendance.changed) {
            changed = true;
            filters.costMax = costOfAttendance.cost;
        }

        let selectedregions = [];

        // get the selected regions
        const entries = Object.entries(regions);
        for (let i = 0; i < entries.length; i += 1) {
            if (entries[i][1]) {
                selectedregions.push(entries[i][0]);
            }
        }

        if (selectedStates.length !== 0) {
            changed = true;
            filters.states = selectedStates;
        }

        // if no regions or states are selected, add all regions
        if (selectedregions.length === 0 && selectedStates.length === 0) {
            selectedregions = ['midwest', 'northeast', 'south', 'west'];
        }

        filters.regions = selectedregions;

        if (!changed) {
            filters = {};
        }
        // pass this up to ApplicationsTracker
        handleFilterChange(filters);
    };

    // display the filter box
    return (

        <Container id="filter-box">
            <h2>Filters</h2>
            <Form onSubmit={(e) => { e.preventDefault(); buildQuery(); }}>
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
                            <Popover.Title>College Name</Popover.Title>
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
                            <Popover.Title>Second Major</Popover.Title>
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
                                Choose the range of ACT Composite to filter by. For example, 28-32.
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
                        {`Maximum Cost: ${costOfAttendance.cost.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
                    </Col>
                </Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Control min="10000" max="100000" step="500" type="range" value={costOfAttendance.cost} onChange={(e) => setCostOfAttendance({ cost: e.target.value.trim(), changed: true })} />
                    </Form.Group>
                </Form.Row>

                <b>Region&nbsp;</b>
                <OverlayTrigger
                    placement="right"
                    overlay={(
                        <Popover>
                            <Popover.Title>Region</Popover.Title>
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
