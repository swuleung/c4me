import React, { useState } from '../../../node_modules/react';
import { Link } from '../../../node_modules/react-router-dom';
import { Form, Button, Alert } from '../../../node_modules/react-bootstrap';
import './CreateAccount.scss';
import userAPI from '../../services/api/user';

const CreateAccount = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFormSubmission = () => {
        userAPI.createAccount(username, password).then(results => {
            if (results.error) {
                setErrorAlert(true);
                setErrorMessage(results.error);
            }
            if (results.ok) {
                props.history.push('/login');
            }
        });
    };

    return (
        <div>
            <div className="center-card">
                <div className="card-body">
                    <h1 className="card-title">Create an Account</h1>
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
                    <Link className="card-link" to="/login">Already have an account? Login here. </Link>
                </div>
            </div>
        </div>
    );
};

export default CreateAccount;
