import React, { useState, useEffect } from 'react';
import { Alert, Form } from 'react-bootstrap';
import './EditProfile.scss';
import { getAllColleges } from '../../services/api/college';

const CollegeDropdown = (props) => {
    const [colleges, setColleges] = useState([]);
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const getCollegeOptions = () => {
        let options = []
        for (let i = 0; i < colleges.length; i++) {
            let value = props.selectedValue ? props.selectedValue.toString() : '';
            if (value === colleges[i].CollegeId.toString()
                || !props.applications.some(app => app.college.toString() === colleges[i].CollegeId.toString())
            ) {
                options.push(
                    <option key={`${i}-${colleges[i].Name}`} value={colleges[i].CollegeId}>{colleges[i].Name}</option>
                )
            }
        }
        return options;
    }
    useEffect(() => {
        getAllColleges().then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
                setColleges(result.colleges);
            }
        });
    }, [])
    return (
        <div>
            {errorAlert
                ? <Alert variant="danger">{errorMessage}</Alert>
                : <Form.Control as="select" index={props.index} value={props.selectedValue ? props.selectedValue : '-1'} onChange={(e) => props.onChange(e)}>
                    <option value='-1' disabled>Select a college</option>
                    {getCollegeOptions()}
                </Form.Control>
            }
        </div >
    );
}

export default CollegeDropdown;
