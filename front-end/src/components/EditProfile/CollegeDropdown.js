import React, { useState, useEffect } from 'react';
import { Alert, Form } from 'react-bootstrap';
import './EditProfile.scss';
import collegeAPI from '../../services/api/college';

const CollegeDropdown = (props) => {
    // state variables
    const [colleges, setColleges] = useState([]);
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { index, selectedValue, onChange } = props;

    /**
     * Creates the options for college dropdown menu
     */
    const getCollegeOptions = () => {
        const options = [];
        // removes the colleges that have already been added as an application
        for (let i = 0; i < colleges.length; i += 1) {
            const value = props.selectedValue ? props.selectedValue.toString() : '';
            if (value === colleges[i].CollegeId.toString()
                || !props.applications.some((app) => (app.college ? app.college.toString() : '') === colleges[i].CollegeId.toString())
            ) {
                options.push(
                    <option key={`${i}-${colleges[i].Name}`} value={colleges[i].CollegeId}>{colleges[i].Name}</option>,
                );
            }
        }
        return options;
    };

    // Gets all colleges
    useEffect(() => {
        collegeAPI.getAllColleges().then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
                setColleges(result.colleges);
            }
        });
    }, []);

    // display the college dropdown
    return (
        <div>
            {errorAlert
                ? <Alert variant="danger">{errorMessage}</Alert>
                : (
                    <Form.Control as="select" index={index} value={selectedValue || '-1'} onChange={(e) => onChange(e)}>
                        <option value="-1" disabled>Select a college</option>
                        {getCollegeOptions()}
                    </Form.Control>
                )}
        </div>
    );
};

export default CollegeDropdown;
