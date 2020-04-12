import React, { useState, useEffect } from 'react';
import {
    Alert, Col, Row, Card, CardDeck, Button, Form,
} from 'react-bootstrap';

import { getSearchResults } from '../../services/api/search';
import './Search.scss';

const Search = (props) => {
	const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [filters, setFilters] = useState({});
    const [searchResults, setSearchResults] = useState([]);
	const [name, setName] = useState('');
	
	useEffect( () => {
		getSearchResults( filters ).then( ( results ) => {
			if (results.error) {
                setErrorAlert(true);
                setErrorMessage(results.reason);
            }
            if (results.ok) {
                setErrorAlert(false);
                setSearchResults(results.searchResults.sort((a, b) => {
                    return a.College.status.localeCompare(b.College.status) ? 1 : -1;
                }));
                
            }
		});

	}, [ filters ]	);

	return (
		<div>
			<div className="center-card">
				<div className="card-body">
					<h1 className="card-title">Search For Colleges</h1>
					<Row>
						<Col xs="4">
							Settings Filters
						</Col>
						<Col xs="8">
							Results List
						</Col>
					</Row>
				</div>
			</div>
		</div>
		
	);
};

export default Search;