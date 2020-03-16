import React, { useState } from 'react';
import { Link } from '../../../node_modules/react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import Cookies from 'js-cookie';
import './Login.scss';

const Login = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFormSubmission = () => {
        fetch("http://localhost:9000/users/login", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then((response) => response.json()
        ).then((data) => {
            if (data.error) {
                setErrorAlert(true);
                setErrorMessage(data.error);
            }
            if (data.ok) {
                Cookies.set('access_token', data.access_token);
                localStorage.setItem('username', username);
                props.history.push('/');
                props.setUsername(username);
            }
        }).catch((error) => {
            console.log('Yikes!');
            console.log(error);
        });
    }

    return (
        <div>
            <div className="center-card">
                <div className="card-body">
                    <h1 className="card-title">Login</h1>
                    {errorAlert &&
                        <Alert variant="danger">
                            {errorMessage}
                        </Alert>
                    }
                    <Form style={{marginBottom: "1rem"}} onSubmit={e => { e.preventDefault(); handleFormSubmission() }}>
                        <Form.Group controlId="createAccountForm">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" onChange={e => setUsername(e.target.value)} autoComplete="on" required/>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" onChange={e => setPassword(e.target.value)} autoComplete="on" required/>
                        </Form.Group>
                        <Button className="btn-block" variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>

                    <Link className="card-link" to={`/create-account`} > Don't have an account? Create one here. </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
