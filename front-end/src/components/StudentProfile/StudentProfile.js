import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Alert, Button, Container, Row, Col, Table,
} from 'react-bootstrap';
import { getStudent, getStudentApplications } from '../../services/api/student';
import { getCollegeByID } from '../../services/api/college';
import './StudentProfile.scss';

const StudentProfile = (props) => {
    const [student, setStudent] = useState({});
    const [studentApplications, setStudentApplications] = useState(null);
    const [highSchool, setHighSchool] = useState({});
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { match } = props;
    const { username } = match.params;

    const generateStudentApplications = () => {
        const applications = [];
        for (let i = 0; i < studentApplications.length; i += 1) {
            applications.push(
                <tr className="application" key={i}>
                    <td>
                        {studentApplications[i].collegeName}
                    </td>
                    <td className={studentApplications[i].status}>
                        {studentApplications[i].status}
                    </td>
                </tr>,
            );
        }
        return applications;
    };

    useEffect(() => {
        getStudent(username).then((result) => {
            if (result.error) {
                setErrorAlert(true);
                setErrorMessage(result.error);
            }
            if (result.ok) {
                setErrorAlert(false);
                setStudent(result.student);
                if(result.student.HighSchool) {
                    setHighSchool(result.student.HighSchool);
                } else {
                    setHighSchool({
                        Name: null,
                        HighSchoolCity: null,
                        HighSchoolState: null,
                    })
                }
            }
        });
        if (!studentApplications) {
            getStudentApplications(username).then((result) => {
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
        if (studentApplications && studentApplications.length !== 0 && !studentApplications[0].collegeName) {
            for (let i = 0; i < studentApplications.length; i += 1) {
                getCollegeByID(studentApplications[i].college).then((coll) => {
                    const apps = [...studentApplications];
                    apps[i].collegeName = coll.college.Name;
                    setStudentApplications(apps);
                });
            }
        }
    }, [username, studentApplications]);

    return (
        <div>
            {errorAlert
                ? <Alert variant="danger">{errorMessage}</Alert>
                : (
                    <div>
                        <Container>
                            <Row>
                                <Col><h1>{username}</h1></Col>
                                {localStorage.getItem('username') === username && <Col><Button as={Link} to={`/profile/${username}/edit`} className="float-right">Edit Profile</Button></Col>}
                            </Row>
                            <p>
                            High School:&nbsp;
                                {highSchool.Name ? highSchool.Name.toLowerCase().split(' ').map((s) => {
                                    if (s !== 'and' && s!== 'of') return s.charAt(0).toUpperCase() + s.substring(1);
                                    return s;
                                }).join(' ') : 'No high school provided'}
                            </p>
                            <p>
                            High School City:&nbsp;
                                {highSchool.HighSchoolCity ? highSchool.HighSchoolCity : 'No high school provided'}
                            </p>
                            <p>
                            High School State:&nbsp;
                                {highSchool.HighSchoolState ? highSchool.HighSchoolState : 'No high school provided'}
                            </p>
                            <p>
                            Residence State:&nbsp;
                                {student.residenceState ? student.residenceState : 'No state provided'}
                            </p>
                            <p>
                            College Class of&nbsp;
                                {student.collegeClass ? student.collegeClass : 'No graduation year provided'}
                            </p>
                            <p>
                            GPA:&nbsp;
                                {student.GPA ? student.GPA : 'No GPA provided'}
                            </p>
                            <p>
                            Major(s):&nbsp;
                                {!student.major1 && !student.major2 ? 'No majors provided' : student.major1}
                                {' '}
                                {student.major2 && `& ${student.major2}`}
                                {' '}
                            </p>
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
                                    <br />
                                Number of AP Passed:
                                    {' '}
                                    {student.APPassed}
                                </Col>
                            </Row>
                        </Container>
                        <br />
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
                                    {studentApplications ? generateStudentApplications() : null}
                                </tbody>
                            </Table>
                        </Container>
                    </div>
                )}
        </div>
    );
};

export default StudentProfile;
