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
    const [lax, setLax] = useState('lax');
    const [collegeClass, setCollegeCLass] = useState({
        lowerCollegeClass: '',
        upperCollegeClass: '',
    });
    // status list
    const [regions, setRegions] = useState({
        accepted: false,
        deferred: false,
        denied: false,
        pending: false,
        waitlisted: false,
        withdrawn: false,
    });
    // pass filter changes to main Applications Tracker
    const { handleFilterChange } = props;
    const [selectedStates, setSelectedStates] = useState([]);

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

        let selectedregions = [];
        // get the selected regions
        const entries = Object.entries(regions);
        for (let i = 0; i < entries.length; i += 1) {
            if (entries[i][1]) {
                selectedregions.push(entries[i][0]);
            }
        }

        if (selectedregions.length === 0) {
            selectedregions = ['accepted', 'deferred', 'denied', 'pending', 'waitlisted', 'withdrawn'];
        }
        filters.regions = selectedregions;

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
                        <Form.Control type="text" placeholder="Enter a name" onChange={(e) => setCollegeCLass({ ...collegeClass, lowerCollegeClass: e.target.value })} />
                    </Form.Group>
                </Form.Row>
                <b>First Major&nbsp;</b>
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
                        <Form.Control type="text" placeholder="Enter a major" onChange={(e) => setCollegeCLass({ ...collegeClass, lowerCollegeClass: e.target.value })} />
                    </Form.Group>
                </Form.Row>
                <b>Second Major&nbsp;</b>
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
                        <Form.Control type="text" placeholder="Enter a major" onChange={(e) => setCollegeCLass({ ...collegeClass, lowerCollegeClass: e.target.value })} />
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
                                onChange={(e) => setCollegeCLass({ ...collegeClass, lowerCollegeClass: e.target.value })}
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
                                onChange={(e) => setCollegeCLass({ ...collegeClass, lowerCollegeClass: e.target.value })}
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
                        <Form.Control type="number" placeholder="Min" min="0" max="2030" step="1" onChange={(e) => setCollegeCLass({ ...collegeClass, lowerCollegeClass: e.target.value })} />
                    </Form.Group>
                                -
                    <Form.Group as={Col}>
                        <Form.Control type="number" placeholder="Max" onChange={(e) => setCollegeCLass({ ...collegeClass, upperCollegeClass: e.target.value })} />
                    </Form.Group>
                </Form.Row>
                <b>SAT EBRW&nbsp;</b>
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
                        <Form.Control type="number" placeholder="Min" min="0" max="2030" step="1" onChange={(e) => setCollegeCLass({ ...collegeClass, lowerCollegeClass: e.target.value })} />
                    </Form.Group>
                                -
                    <Form.Group as={Col}>
                        <Form.Control type="number" placeholder="Max" onChange={(e) => setCollegeCLass({ ...collegeClass, upperCollegeClass: e.target.value })} />
                    </Form.Group>
                </Form.Row>
                <b>SAT Math&nbsp;</b>
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
                        <Form.Control type="number" placeholder="Min" min="0" max="2030" step="1" onChange={(e) => setCollegeCLass({ ...collegeClass, lowerCollegeClass: e.target.value })} />
                    </Form.Group>
                                -
                    <Form.Group as={Col}>
                        <Form.Control type="number" placeholder="Max" onChange={(e) => setCollegeCLass({ ...collegeClass, upperCollegeClass: e.target.value })} />
                    </Form.Group>
                </Form.Row>
                <b>ACT Composite&nbsp;</b>
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
                        <Form.Control type="number" placeholder="Min" min="0" max="2030" step="1" onChange={(e) => setCollegeCLass({ ...collegeClass, lowerCollegeClass: e.target.value })} />
                    </Form.Group>
                                -
                    <Form.Group as={Col}>
                        <Form.Control type="number" placeholder="Max" onChange={(e) => setCollegeCLass({ ...collegeClass, upperCollegeClass: e.target.value })} />
                    </Form.Group>
                </Form.Row>
                <b>Cost of Attendance&nbsp;</b>
                <OverlayTrigger
                    placement="right"
                    overlay={(
                        <Popover>
                            <Popover.Title>Admission Rate</Popover.Title>
                            <Popover.Content>
                                            Choose the upper boumd for cost of attendance. For example, 60,000.
                            </Popover.Content>
                        </Popover>
                    )}
                >
                    <FontAwesomeIcon className="text-info" icon={faQuestionCircle} />
                </OverlayTrigger>
                <Row>
                    <Col>Maximum Cost: 12312</Col>
                </Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Control type="range" />
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
                    <Form.Check name="region" label="Midwestern" type="checkbox" checked={regions.accepted} onChange={(e) => setRegions({ ...regions, accepted: e.target.checked })} />
                    <Form.Check name="status" label="Northeastern" type="checkbox" checked={regions.deferred} onChange={(e) => setRegions({ ...regions, deferred: e.target.checked })} />
                    <Form.Check name="status" label="Southern" type="checkbox" checked={regions.denied} onChange={(e) => setRegions({ ...regions, denied: e.target.checked })} />
                    <Form.Check name="status" label="Western" type="checkbox" checked={regions.pending} onChange={(e) => setRegions({ ...regions, pending: e.target.checked })} />
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
