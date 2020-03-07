import React, { useState, useEffect } from '../../../node_modules/react';
import './App.css';
import '../../utils/styles/theme.scss';
import { Navbar, Nav, NavDropdown } from '../../../node_modules/react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link } from '../../../node_modules/react-router-dom';
import Home from '../Home/Home.js';
import CreateAccount from '../CreateAccount/CreateAccount.js';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <Navbar bg="primary">
                        <Navbar.Brand id="logo" as={Link} to="/">C4Me</Navbar.Brand>
                        <Nav className="mr-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/search-colleges">Search Colleges</Nav.Link>
                            <Nav.Link as={Link} to="/find-similar-hs">Find Similar High Schools</Nav.Link>
                        </Nav>
                        <Nav className="ml-auto">
                            <Nav.Link as={Link} to="/create-account">Create an Account</Nav.Link>
                            {/* // until session is made,
                            // please keep this here so that we can switch between seeing create accoun the profile */}
                            {/* <NavDropdown title="John Doe" alignRight id="basic-nav-dropdown">
                                <NavDropdown.Item href="#tbd">View Profile</NavDropdown.Item>
                                <NavDropdown.Item href="#tbd">Settings</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#tbd">Logout</NavDropdown.Item>
                            </NavDropdown> */}
                        </Nav>
                    </Navbar>

                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/create-account' component={CreateAccount} />
                        <Route render={function () {
                            return <p>404 Not found</p>
                        }} />
                    </Switch>
                </header>
            </div>
        </Router >
    );
}

export default App;
