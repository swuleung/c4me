import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import './CreateAccount.scss';

const CreateAccount = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFormSubmission = () => {
        fetch("http://localhost:9000/users/create", {
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
                props.history.push('/');
            }
        }).catch((error) => {
            console.log('Yikes!');
            console.log(error);
        });
    }

    return (
        <div>
            <div className="container">
                <h1>Create Student Account</h1>
                {errorAlert &&
                    <Alert variant="danger">
                        {errorMessage}
                    </Alert>
                }
                <Form onSubmit={e => { e.preventDefault(); handleFormSubmission() }}>
                    <Form.Group controlId="createAccountForm">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" onChange={e => setUsername(e.target.value)} autoComplete="on" />
                        <Form.Text className="text-muted" >
                            We'll never share your email with anyone else.
                    </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} autoComplete="on" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                 </Button>
                </Form>
            </div>
        </div >
    );
}

export default CreateAccount;
