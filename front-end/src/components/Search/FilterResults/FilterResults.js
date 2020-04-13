import React, { useState, useEffect } from 'react';
import {
    Container, Form, Col, OverlayTrigger, Popover, Table, Button, ListGroup, Alert,
} from 'react-bootstrap';

import searchAPI from '../../../../services/api/search';

const FilterAT = (props) => {
	const [lax, setLax] = useState('lax');

	const [highSchool, setHighSchool] = useState('');
    const [highSchools, setHighSchools] = useState([]);
    const [highSchoolList, setHighSchoolList] = useState([]);
    
};

export default FilterResults;
