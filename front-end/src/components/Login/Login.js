/**
 * Login page/component
 */
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from '../../../node_modules/react-router-dom';
import userAPI from '../../services/api/user';
import './Login.scss';

const Login = (props) => {
    // state variables
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * Handle the login form submission with call to API
     */
    const handleFormSubmission = () => {
        userAPI.login(username, password).then((results) => {
            if (results.error) {
                setErrorAlert(true);
                setErrorMessage(results.error);
            }
            if (results.ok) {
                localStorage.setItem('username', username);
                props.history.push('/');
                props.setUsername(username);
            }
        });
    };

    // display the login page
    return (
        <div>
            <div className="center-card">
                <div className="card-body">
                    <h1 className="card-title">Login</h1>
                    {errorAlert
                        && (
                            <Alert variant="danger">
                                {errorMessage}
                            </Alert>
                        )}
                    <Form style={{ marginBottom: '1rem' }} onSubmit={(e) => { e.preventDefault(); handleFormSubmission(); }}>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} autoComplete="on" required />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} autoComplete="on" required />
                        </Form.Group>
                        <Button className="btn-block" variant="primary" type="submit">
                        Submit
                        </Button>
                    </Form>

                    <Link className="card-link" to="/create-account"> Don&lsquo;t have an account? Create one here. </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
