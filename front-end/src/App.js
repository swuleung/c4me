import React, { useState, useEffect } from 'react';
import './App.css';
import './theme.scss';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './Home/Home.js';

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
                            <NavDropdown title="John Doe" alignRight id="basic-nav-dropdown">
                                <NavDropdown.Item href="#tbd">View Profile</NavDropdown.Item>
                                <NavDropdown.Item href="#tbd">Settings</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#tbd">Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar>

                    <Switch>
                        <Route exact path='/' component={Home} />
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
