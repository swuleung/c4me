import React, { useState, useEffect } from 'react';
import {
    Container, Form, Col, OverlayTrigger, Popover, Table, Button, ListGroup, Alert,
} from 'react-bootstrap';

import searchAPI from '../../../../services/api/search';

const FilterAT = (props) => {

	const [result, setResult] = useState('');
    const [results, setResults] = useState([]);
    const [ResultList, setResultList] = useState([]);
    
    const [region, setRegion] = useState('');
	const [SATEBRWMin, setSATEBRWMin] = useState(0);
	const [SATEBRWMax, setSATEBRWMax] = useState(800);
	const [SATMathMin, setSATMathMin] = useState(0);
	const [SATMathMax, setSATMathMax] = useState(800);
	const [ACTCompositeMin, setACTCompositeMin] = useState(0);
	const [ACTCompositeMax, setACTCompositeMax] = useState(36);
	const [costInStateMax, setCostInStateMax] = useState(100000);
	const [costOutOfStateMax, setCostOutOfStateMax] = useState(100000);
	const [major, setMajor] = useState('');
	const [major2, setMajor2] = useState('');
	const [sortAttribute, setSortAttribute] = useState('');
	const [sortDirection, setSortDirection] = useState('');
	const [lax, setLax] = useState('');
	
	
    const generateResultsList = () => {
        const ResultsHTML = [];
        for (let i = 0; i < ResultList.length; i += 1) {
            ResultsHTML.push(
                <tr className="mb-0" key={`hs-${i}`}>
                    <td>
                        {ResultList[i].Name.toLowerCase().split(' ').map((s) => {
                            if (s !== 'and' && s !== 'of') return s.charAt(0).toUpperCase() + s.substring(1);
                            return s;
                        }).join(' ')}
                    </td>
                </tr>,
            );
        }
        return ResultsHTML;
    };

    const buildSearchQuery = () => {
    	const filters = {};
    	if (lax === 'lax')
            filters.lax = true;

    };

};

export default FilterResults;
