import React, { useState, useEffect } from 'react';
import { Alert, Button, Container, Row, Col, Table, Form } from 'react-bootstrap';
import './EditProfile.scss';
import { getStudent, editStudent, getStudentApplications, editStudentApplications } from '../../services/api/student';
import CollegeDropdown from './CollegeDropdown';

const EditProfile = (props) => {
    const [student, setStudent] = useState({});
    const [studentApplications, setStudentApplications] = useState([]);
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const handleProfileChange = (e) => {
        const { value, id } = e.target;
        setStudent({ ...student, [id]: value });
    }

    const handleApplicationChange = (e) => {
        const value = e.target.value;
        const index = e.target.getAttribute('index');
        let newApplications = [...studentApplications];
        newApplications[index].status = value;
        setStudentApplications(newApplications);
    }

    const handleApplicationCollegeChange = (e) => {
        const value = e.target.value;
        const index = e.target.getAttribute('index');
        let newApplications = [...studentApplications];
        newApplications[index].college = value;
        setStudentApplications(newApplications);
    }

    const handleAddApplication = () => {
        let newApplications = [...studentApplications];
        newApplications.push({
            status: "pending",
            college: null,
            username: props.match.params.username,
            collegeName: null
        })
        setStudentApplications(newApplications);
    }

    const generateStateOptions = () => {
        let stateCode = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MH', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'PW', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'];
        let states = [];
        for (let i = 0; i < stateCode.length; i++) {
            states.push(<option key={i} value={stateCode[i]}>{stateCode[i]}</option>);
        }
        return states;
    }

    const handleEditSubmission = () => {
        editStudent(props.match.params.username, student).then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
                props.history.push('./')
            }
        });
        editStudentApplications(props.match.params.username, studentApplications).then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
            }
        })
    }

    const generateStudentApplications = () => {
        let applications = [];
        for (let i = 0; i < studentApplications.length; i++) {
            applications.push(
                <tr className='application' key={`college-${i}`} >
                    <td>
                        <CollegeDropdown selectedValue={studentApplications[i].college} index={`${i}`} onChange={e => { handleApplicationCollegeChange(e) }}></CollegeDropdown>
                    </td>
                    <td>
                        <Form.Control as="select" index={`${i}`} className={studentApplications[i].status} value={studentApplications[i].status} onChange={e => { handleApplicationChange(e) }}>
                            <option value='accepted'>accepted</option>
                            <option value='deferred'>deferred</option>
                            <option value='denied'>denied</option>
                            <option value='pending'>pending</option>
                            <option value='waitlisted'>waitlisted</option>
                            <option value='withdrawn'>withdrawn</option>
                        </Form.Control>
                    </td>
                </tr>);
        }
        return applications;
    }

    useEffect(() => {
        getStudent(props.match.params.username).then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
                setStudent(result.student);
            }
        });

        if (!studentApplications.length) {
            getStudentApplications(props.match.params.username).then((result) => {
                if (result.error) {
                    setErrorAlert(true);
                    setErrorMessage(result.error);
                }
                if (result.ok) {
                    setErrorAlert(false);
                    setStudentApplications(result.applications);
                }
            });
        }
    }, [props.match.params.username, studentApplications]);

    return (
        <div>
            {errorAlert && <Alert variant="danger">
                {errorMessage}
            </Alert>}
            <div>
                <Form onSubmit={(e) => { e.preventDefault(); handleEditSubmission() }}>
                    <Container>
                        <h1>{props.match.params.username}</h1>

                        <Form.Group controlId="highschoolName">
                            <Form.Label>High School</Form.Label>
                            <Form.Control type="text" value={student.highschoolName || ""} placeholder="Enter high school" onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group controlId="collegeClass">
                                    <Form.Label>College Class Year</Form.Label>
                                    <Form.Control type="number" value={student.collegeClass || ''} onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="GPA">
                                    <Form.Label>GPA</Form.Label>
                                    <Form.Control type="number" value={student.GPA || ''} step="0.01" onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group controlId="residenceState">
                            <Form.Label>Residence State</Form.Label>
                            <Form.Control as="select" value={student.residenceState || ''} onChange={e => { handleProfileChange(e) }}>
                                {generateStateOptions()}
                            </Form.Control>
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group controlId="major1">
                                    <Form.Label>First Major</Form.Label>
                                    <Form.Control type="text" value={student.major1 || ""} placeholder="Enter a major" onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="major2">
                                    <Form.Label>Second Major</Form.Label>
                                    <Form.Control type="text" value={student.major2 || ""} placeholder="Enter a major" onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>
                    <br />
                    <Container>
                        <h1>Standardized Exams </h1>
                        <Row>
                            <Col>
                                <h2>SAT</h2>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATEBRW">
                                            <Form.Label className="col" >EBRW</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATEBRW || ''} onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATMath">
                                            <Form.Label className="col" >Math</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATMath || ''} onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <br />
                                <h2>ACT</h2>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="ACTEnglish">
                                            <Form.Label className="col" >English</Form.Label>
                                            <Form.Control className="col" type="number" value={student.ACTEnglish || ''} onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="ACTMath">
                                            <Form.Label className="col" >Math</Form.Label>
                                            <Form.Control className="col" type="number" value={student.ACTMath || ''} onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="ACTReading">
                                            <Form.Label className="col" >Reading</Form.Label>
                                            <Form.Control className="col" type="number" value={student.ACTReading || ''} onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="ACTScience">
                                            <Form.Label className="col" >Science</Form.Label>
                                            <Form.Control className="col" type="number" value={student.ACTScience || ''} onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="ACTComposite">
                                            <Form.Label className="col" >Composite</Form.Label>
                                            <Form.Control className="col" type="number" value={student.ACTComposite || ''} onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <h2>SAT Subject Tests</h2>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATLit">
                                            <Form.Label className="col" >Literature</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATLit || ''} onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATUs">
                                            <Form.Label className="col" >US History</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATUs || ''} onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATWorld">
                                            <Form.Label className="col" >World History</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATWorld || ''} onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATMathI">
                                            <Form.Label className="col" >Math I</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATMathI || ''} onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATMathII">
                                            <Form.Label className="col" >Math II</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATMathII || ''} onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATEco">
                                            <Form.Label className="col" >Ecological Biology</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATEco || ''} onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATMol">
                                            <Form.Label className="col" >Molecular Biology</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATMol || ''} onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="row" controlId="SATChem">
                                            <Form.Label className="col" >Chemistry</Form.Label>
                                            <Form.Control className="col" type="number" value={student.SATChem || ''} onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <br></br>
                        <Row>
                            <Col>
                                <h2>Number of AP Exams Passed</h2>

                                <Form.Group className="row" controlId="APPassed">
                                    <Form.Label className="col-3" >Total</Form.Label>
                                    <Form.Control className="col-3" type="number" value={student.APPassed || ''} onChange={e => { handleProfileChange(e) }} autoComplete="on" />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>
                    <br></br>
                    <Container>
                        <h1>Applications</h1>
                        <Table className="table-striped">
                            <thead>
                                <tr>
                                    <th>School</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {generateStudentApplications()}
                            </tbody>
                        </Table>
                        <Button onClick={handleAddApplication}>Add Application</Button>
                    </Container>
                    <br></br>
                    <Container>
                        <Button className="btn-block" variant="success" type="submit">
                            Save Changes
                            </Button>
                    </Container>
                </Form>
            </div>
        </div>
    );
}

export default EditProfile;
