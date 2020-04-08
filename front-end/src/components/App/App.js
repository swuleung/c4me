import React, { useState } from '../../../node_modules/react';
import './App.css';
import '../../utils/styles/theme.scss';
import { Navbar, Nav, NavDropdown } from '../../../node_modules/react-bootstrap';
import {
    BrowserRouter as Router, Switch, Route, Link, Redirect,
} from '../../../node_modules/react-router-dom';
import Home from '../Home/Home';
import CreateAccount from '../CreateAccount/CreateAccount';
import Login from '../Login/Login';
import StudentProfile from '../StudentProfile/StudentProfile';
import EditProfile from '../EditProfile/EditProfile';
import Admin from '../Admin/Admin';
import CollegeProfile from '../CollegeProfile/CollegeProfile'

function App() {
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const handleLogout = () => {
        setUsername(null);
        localStorage.removeItem('username');
    };

    return (
        <Router>
            <div className="App" style={{ paddingBottom: '1rem' }}>
                <header className="App-header">
                    <Navbar bg="primary">
                        <Navbar.Brand id="logo" as={Link} to="/">C4Me</Navbar.Brand>
                        <Nav className="mr-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/search-colleges">Search Colleges</Nav.Link>
                            <Nav.Link as={Link} to="/find-similar-hs">Similar High Schools</Nav.Link>
                        </Nav>
                        <Nav className="ml-auto">
                            {username == null || username.trim() === ''
                                ? (
                                    <div style={{ display: 'flex' }}>
                                        <Nav.Link as={Link} to="/create-account" title="Create Account">Create an Account</Nav.Link>
                                        <Nav.Link as={Link} to="/login" title="Create Account">Login</Nav.Link>
                                    </div>
                                )
                                : (
                                    <NavDropdown title={username} alignRight id="basic-nav-dropdown">
                                        {username === 'admin'
                                            ? <NavDropdown.Item as={Link} to="/admin">Admin Controls</NavDropdown.Item>
                                            : <NavDropdown.Item as={Link} to={`/profile/${username}`}>View Profile</NavDropdown.Item>}
                                        <NavDropdown.Item href="#tbd">Settings</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item as={Link} to='/' onClick={handleLogout}>Logout</NavDropdown.Item>
                                    </NavDropdown>
                                )}
                        </Nav>
                    </Navbar>

                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/create-account" component={CreateAccount} />
                        <Route exact path="/login" render={(props) => <Login {...props} setUsername={setUsername} />} />
                        <Route exact path="/profile/:username" component={StudentProfile} />
                        <Route exact path="/profile/:username/edit" username={username} render={(props) => (props.match.params.username === username ? <EditProfile {...props} /> : <Redirect to="/" />)} />
                        <Route exact path="/colleges/:collegeID" component={CollegeProfile} />
                        <Route exact path="/admin" component={Admin} />
                        <Route render={function notFound() {
                            return <p>404 Not found</p>;
                        }}
                        />
                    </Switch>
                </header>
            </div>
        </Router>
    );
}

export default App;
