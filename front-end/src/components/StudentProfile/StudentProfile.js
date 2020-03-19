import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Table } from 'react-bootstrap';
import './StudentProfile.scss';

const StudentProfile = (props) => {
    const [student, setStudent] = useState({});
    const [studentApplications, setStudentApplications] = useState([]);
    const [errorAlert, setErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
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
                setStudent(data.student);
            }
        }).catch((error) => {
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
            {errorAlert ?
                <Alert variant="danger">
                    {errorMessage}
                </Alert> : <div>
                    <div className="container">
                        <h1>{props.match.params.username}</h1>
                        <p>High School: {student.highschoolName ? student.highschoolName : 'No High School Found'}</p>
                        <p>State: {student.residenceState}</p>
                        <p>College Class of {student.collegeClass ? student.collegeClass : 'No Graduation Year Provided'}</p>
                        <p>GPA: {student.GPA ? student.GPA : 'No GPA provided'}</p>
                        <p>Major(s): {!student.major1 && !student.major2 ? 'No majors provided' : student.major1} {student.major2 && `& ${student.major2}`} </p>
                    </div>
                    <br />
                    <div className="container">
                        <h1>Standardized Exams </h1>
                        <div className="row">
                            <div className='col'>
                                <h2>SAT</h2>
                                <div className="row">
                                    <div className="col">EBRW</div>
                                    <div className="col">{student.SATEBRW ? student.SATEBRW : '-'}</div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        Math
                            </div>
                                    <div className="col">
                                        {student.SATMath ? student.SATMath : '-'}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        EBRW
                            </div>
                                    <div className="col">
                                        {student.SATEBRW && student.SATMath ? student.SATEBRW + student.SATMath : '-'}
                                    </div>
                                </div>
                                <br />
                                <h2>ACT</h2>
                                <div className="row">
                                    <div className="col">
                                        English
                            </div>
                                    <div className="col">
                                        {student.ACTEnglish ? student.ACTEnglish : '-'}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        Math
                            </div>
                                    <div className="col">
                                        {student.ACTMath ? student.ACTMath : '-'}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        Reading
                            </div>
                                    <div className="col">
                                        {student.ACTReading ? student.ACTReading : '-'}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        Science
                            </div>
                                    <div className="col">
                                        {student.ACTScience ? student.ACTScience : '-'}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        Composite
                            </div>
                                    <div className="col">
                                        {student.ACTComposite ? student.ACTComposite : '-'}
                                    </div>
                                </div>
                            </div>
                            <div className='col'>
                                <h2>SAT Subject Tests</h2>
                                <div className="row">
                                    <div className="col">
                                        Literature
                            </div>
                                    <div className="col">
                                        {student.SATLit ? student.SATLit : '-'}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        US History
                            </div>
                                    <div className="col">
                                        {student.SATUs ? student.SATUs : '-'}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        World History
                            </div>
                                    <div className="col">
                                        {student.SATWorld ? student.SATWorld : '-'}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        Math I
                            </div>
                                    <div className="col">
                                        {student.SATMathI ? student.SATMathI : '-'}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        Math II
                            </div>
                                    <div className="col">
                                        {student.SATMathII ? student.SATMathII : '-'}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        Ecological Biology
                            </div>
                                    <div className="col">
                                        {student.SATEco ? student.SATEco : '-'}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        Molecular Biology
                                    </div>
                                    <div className="col">
                                        {student.SATMol ? student.SATMol : '-'}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        Chemistry
                                    </div>
                                    <div className="col">
                                        {student.SATChem ? student.SATChem : '-'}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        Physics
                                </div>
                                    <div className="col">
                                        {student.SATPhys ? student.SATPhys : '-'}
                                    </div>
                                </div>
                                <br></br>
                                Number of AP Passed: {student.APPassed}
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div className="container">
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

                    </div>
                </div>
            }

        </div>
    );
}

export default StudentProfile;
