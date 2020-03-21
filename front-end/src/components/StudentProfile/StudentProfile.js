import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Container, Row, Col, Table } from 'react-bootstrap';
import './StudentProfile.scss';

const StudentProfile = (props) => {
    const [student, setStudent] = useState({});
    const [studentApplications, setStudentApplications] = useState([]);
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        console.log('it changed!');
        fetch(`http://localhost:9000/students/${props.match.params.username}`, {
            method: "GET",
            credentials: 'include',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
        }).then((response) => response.json()
        ).then((data) => {
            if (data.error) {
                setErrorAlert(true);
                setErrorMessage(data.error);
            }
            if (data.ok) {
                setErrorAlert(false);
                setStudent(data.student);
            }
        }).catch((error) => {
            setErrorAlert(true);
            setErrorMessage(error.message);
            console.log('Yikes!');
            console.log(error);
        });

        fetch(`http://localhost:9000/students/${props.match.params.username}/applications`, {
            method: "GET",
            credentials: 'include',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
        }).then((response) => response.json()
        ).then((data) => {
            if (data.error) {
                setErrorAlert(true);
                setErrorMessage(data.error);
            }
            if (data.ok) {
                const applications = data.applications.map((app) =>
                    <tr className='application' key={app.ApplicationId}>
                        <td>
                            {app.college}
                        </td>
                        <td className={app.status} >
                            {app.status}
                        </td>
                    </tr>
                );

                setStudentApplications(applications);
            }
        }).catch((error) => {
            console.log('Yikes!');
            console.log(error);
        });
    }, [props.match.params.username]);

    return (
        <div>
            {errorAlert
                ? <Alert variant="danger">
                    {errorMessage}
                </Alert>
                : <div>
                    <Container>
                        <Row>
                            <Col><h1>{props.match.params.username}</h1></Col>
                            {localStorage.getItem('username') === props.match.params.username && <Col><Button as={Link} to={`./${props.match.params.username}/edit`} className="float-right">Edit Profile</Button></Col>}
                        </Row>
                        <p>High School: {student.highschoolName ? student.highschoolName : 'No High School Found'}</p>
                        <p>State: {student.residenceState}</p>
                        <p>College Class of {student.collegeClass ? student.collegeClass : 'No Graduation Year Provided'}</p>
                        <p>GPA: {student.GPA ? student.GPA : 'No GPA provided'}</p>
                        <p>Major(s): {!student.major1 && !student.major2 ? 'No majors provided' : student.major1} {student.major2 && `& ${student.major2}`} </p>
                    </Container>
                    <br />
                    <Container>
                        <h1>Standardized Exams </h1>
                        <Row>
                            <Col>
                                <h2>SAT</h2>
                                <Row>
                                    <Col>EBRW</Col>
                                    <Col>{student.SATEBRW ? student.SATEBRW : '-'}</Col>
                                </Row>
                                <Row>
                                    <Col>Math</Col>
                                    <Col>{student.SATMath ? student.SATMath : '-'}</Col>
                                </Row>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>{student.SATEBRW && student.SATMath ? student.SATEBRW + student.SATMath : '-'}</Col>
                                </Row>
                                <br />
                                <h2>ACT</h2>
                                <Row>
                                    <Col>English</Col>
                                    <Col>{student.ACTEnglish ? student.ACTEnglish : '-'}</Col>
                                </Row>
                                <Row>
                                    <Col>Math</Col>
                                    <Col>{student.ACTMath ? student.ACTMath : '-'}</Col>
                                </Row>
                                <Row>
                                    <Col>Reading</Col>
                                    <Col>{student.ACTReading ? student.ACTReading : '-'}</Col>
                                </Row>
                                <Row>
                                    <Col>Science</Col>
                                    <Col>{student.ACTScience ? student.ACTScience : '-'}</Col>
                                </Row>
                                <Row>
                                    <Col>Composite</Col>
                                    <Col>{student.ACTComposite ? student.ACTComposite : '-'}</Col>
                                </Row>
                            </Col>
                            <Col>
                                <h2>SAT Subject Tests</h2>
                                <Row>
                                    <Col>Literature</Col>
                                    <Col>{student.SATLit ? student.SATLit : '-'}</Col>
                                </Row>
                                <Row>
                                    <Col>US History</Col>
                                    <Col>{student.SATUs ? student.SATUs : '-'}</Col>
                                </Row>
                                <Row>
                                    <Col>World History</Col>
                                    <Col>{student.SATWorld ? student.SATWorld : '-'}</Col>
                                </Row>
                                <Row>
                                    <Col>Math I</Col>
                                    <Col>{student.SATMathI ? student.SATMathI : '-'}</Col>
                                </Row>
                                <Row>
                                    <Col>Math II</Col>
                                    <Col>{student.SATMathII ? student.SATMathII : '-'}</Col>
                                </Row>
                                <Row>
                                    <Col>Ecological Biology</Col>
                                    <Col>{student.SATEco ? student.SATEco : '-'}</Col>
                                </Row>
                                <Row>
                                    <Col>Molecular Biology</Col>
                                    <Col>{student.SATMol ? student.SATMol : '-'}</Col>
                                </Row>
                                <Row>
                                    <Col>Chemistry</Col>
                                    <Col>{student.SATChem ? student.SATChem : '-'}</Col>
                                </Row>
                                <Row>
                                    <Col>Physics</Col>
                                    <Col>{student.SATPhys ? student.SATPhys : '-'}</Col>
                                </Row>
                                <br></br>
                                Number of AP Passed: {student.APPassed}
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
                                {studentApplications}
                            </tbody>
                        </Table>
                    </Container>
                </div>
            }
        </div>
    );
}

export default StudentProfile;
