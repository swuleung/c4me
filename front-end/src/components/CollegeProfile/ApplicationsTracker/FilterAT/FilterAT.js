import React, { useState, useEffect } from 'react';
import {
    Container, Form, Col, OverlayTrigger, Popover, Table, Button,
} from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import Autocomplete from 'react-autocomplete';
import './FilterAT.scss';

const FilterAT = (props) => {
    const [lax, setLax] = useState('lax');
    const [collegeClass, setCollegeCLass] = useState({
        lowerCollegeClass: '',
        upperCollegeClass: '',
    });
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
    const { handleFilterChange } = props;

    const handleAddHighSchool = (hs) => {
        const newHighSchools = [...highSchoolList];
        newHighSchools.push(hs);
        setHighSchool('');
        setHighSchoolList(newHighSchools);
    };

    const handleDeleteHighSchool = (e) => {
        const index = e.target.getAttribute('index');
        const newHighSchools = [...highSchoolList];
        newHighSchools.splice(index, 1);
        setHighSchoolList(newHighSchools);
    };

    const generateHighSchoolList = () => {
        const highSchools = [];
        for (let i = 0; i < highSchoolList.length; i += 1) {
            highSchools.push(
                <tr className="mb-0" key={`hs-${i}`}>
                    <td>
                        {highSchoolList[i]}
                    </td>
                    <td>
                        <span role="button" className="text-right" tabIndex={i} index={`${i}`} onClick={(e) => handleDeleteHighSchool(e)} onKeyDown={(e) => handleDeleteHighSchool(e)}>&#10005;</span>
                    </td>
                </tr>,
            );
        }
        return highSchools;
    };

    const buildATQuery = () => {
        const filters = {};

        if (lax === 'lax') {
            filters.lax = true;
        } else {
            filters.lax = false;
        }
        if ((collegeClass.lowerCollegeClass).trim() != '' && parseInt(collegeClass.lowerCollegeClass, 10) > -1) {
            filters.lowerCollegeClass = parseInt(collegeClass.lowerCollegeClass, 10);
        }

        if ((collegeClass.upperCollegeClass).trim() != '' && parseInt(collegeClass.upperCollegeClass, 10) > -1) {
            filters.upperCollegeClass = parseInt(collegeClass.upperCollegeClass, 10);
        }

        const selectedStatues = [];
        const entries = Object.entries(statuses);
        for (let i = 0; i < entries.length; i++) {
            if (entries[i][1]) {
                selectedStatues.push(entries[i][0]);
            }
        }
        filters.statuses = selectedStatues;

        if (highSchoolList.length) {
            filters.highSchools = [...highSchoolList];
        }

        handleFilterChange(filters);
    };

    useEffect(() => {

    }, []);

    return (

        <Container id="filter-box">
            <h2>Filters</h2>
            <Form onSubmit={(e) => { e.preventDefault(); buildATQuery(); }}>
                <b>Type of Filtering</b>
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

                <b>Status</b>
                <Form.Group>
                    <Form.Check name="status" label="accepted" type="checkbox" checked={statuses.accepted} onChange={(e) => setStatuses({ ...statuses, accepted: e.target.checked })} />
                    <Form.Check name="status" label="deferred" type="checkbox" checked={statuses.deferred} onChange={(e) => setStatuses({ ...statuses, deferred: e.target.checked })} />
                    <Form.Check name="status" label="denied" type="checkbox" checked={statuses.denied} onChange={(e) => setStatuses({ ...statuses, denied: e.target.checked })} />
                    <Form.Check name="status" label="pending" type="checkbox" checked={statuses.pending} onChange={(e) => setStatuses({ ...statuses, pending: e.target.checked })} />
                    <Form.Check name="status" label="waitlisted" type="checkbox" checked={statuses.waitlisted} onChange={(e) => setStatuses({ ...statuses, waitlisted: e.target.checked })} />
                    <Form.Check name="status" label="withdrawn" type="checkbox" checked={statuses.withdrawn} onChange={(e) => setStatuses({ ...statuses, withdrawn: e.target.checked })} />
                </Form.Group>

                <b>High Schools</b>
                <br />
                <Autocomplete
                    className="form-control"
                    getItemValue={(item) => item.label}
                    wrapperStyle={{
                        display: 'block',
                    }}
                    inputProps={{ className: 'form-control' }}
                    items={[
                        { label: '1' },
                        { label: 'tempory hold until we have high schools' },
                        { label: 'change this later' },
                    ]}
                    shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                    renderItem={(item, isHighlighted) => (
                        <div key={item.label} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                            {item.label}
                        </div>
                    )}
                    value={highSchool}
                    onChange={(e) => setHighSchool(e.target.value)}
                    onSelect={(value) => handleAddHighSchool(value)}
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
