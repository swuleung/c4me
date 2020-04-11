import React, { useState, useEffect } from 'react';
import {
    Alert, Col, Row, Card, CardDeck, Button
} from 'react-bootstrap';

import { getSearchResults } from '../../services/api/searchCollege';

const Search(props) => {
	const [name, setName] = useState('');
	useEffect( () => {}

	);

	return (
		<div>
			<div className="center-card">
				<div className="card-body">
					<h1 className="card-title">Search For Colleges</h1>
					<Form>
						<Form.Group controlId="name">
                            <Form.Label>College Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" onChange={(e) => setName(e.target.value)} autoComplete="on" required />
                        </Form.Group>
					</Form>
				</div>
			</div>
		</div>
		
	);
};

export default Search;