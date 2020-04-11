import React, { useState, useEffect, useRef } from 'react';
import {
    // Alert,
    Container,
    Form,
} from 'react-bootstrap';
import Chart from 'chart.js';
import { getStudent } from '../../../../services/api/student';

const ATScatterplot = (props) => {
    // const [errorAlert, setErrorAlert] = useState(false);
    // const [errorMessage, setErrorMessage] = useState('');
    const [student, setStudent] = useState(null);
    const canvasRef = useRef(null);
    const [selectedHorizontalAxis, setSelectedHorizontalAxis] = useState('SAT');
    const [scatterplot, setScatterplot] = useState(null);

    const { averages, applications } = props;
    /**
     * Calculate the weighted percentile of a person. In this case, it is mainly for the current student.
     * @param {} person
     */
    const getWeight = (person) => {
        const app = person;
        let percent = 0;
        let weight = 0;

        if (app.SATLit) {
            percent += 5;
            weight += (app.SATLit / 800.0) * 5;
        }

        if (app.SATUs) {
            percent += 5;
            weight += (app.SATUs / 800.0) * 5;
        }

        if (app.SATWorld) {
            percent += 5;
            weight += (app.SATWorld / 800.0) * 5;
        }

        if (app.SATMathI) {
            percent += 5;
            weight += (app.SATMathI / 800.0) * 5;
        }

        if (app.SATMathII) {
            percent += 5;
            weight += (app.SATMathII / 800.0) * 5;
        }

        if (app.SATEco) {
            percent += 5;
            weight += (app.SATEco / 800.0) * 5;
        }

        if (app.SATMol) {
            percent += 5;
            weight += (app.SATMol / 800.0) * 5;
        }

        if (app.SATChem) {
            percent += 5;
            weight += (app.SATChem / 800.0) * 5;
        }
        if (app.SATPhys) {
            percent += 5;
            weight += (app.SATPhys / 800.0) * 5;
        }

        // mainTests are the SATEBRW, SATMath, and ACTComposite
        let mainTests = 0;
        if (app.ACTComposite) {
            mainTests += 1;
        }
        if (app.SATMath) {
            mainTests += 1;
        }
        if (app.SATEBRW) {
            mainTests += 1;
        }

        if (mainTests) {
            weight += (app.ACTComposite / 36) * ((100 - percent) / mainTests);
            weight += (app.SATMath / 800) * ((100 - percent) / mainTests);
            weight += (app.SATEBRW / 800) * ((100 - percent) / mainTests);
        }

        return weight;
    };


    useEffect(() => {
        /**
     * The vertical axis is always GPA.
     * The user can choose between SAT (Math+EBRW), ACT Composite, or
     * weighted average of percentile scores for standardized tests (except AP tests).
     * The weights used in the weighted average are: 5% for each SAT subject test
     * taken, and the remainder for SAT or ACT Composite (or split evenly between
     * SAT and ACT Composite, if the student took both).
     */
        const transformApplicationsData = () => {
            const accepted = [];
            const denied = [];
            const other = [];
            let backgroundColor = '#1091b3';

            for (let applicationIndex = 0; applicationIndex < applications.length; applicationIndex += 1) {
                const app = applications[applicationIndex];
                if (localStorage.getItem('username') === app.username) {
                    if (app.Application.status === 'accepted') {
                        backgroundColor = 'green';
                    } else if (app.Application.status === 'denied') {
                        backgroundColor = 'red';
                    } else {
                        backgroundColor = 'gold';
                    }
                    // eslint-disable-next-line no-continue
                    continue;
                }
                const GPA = parseFloat(app.GPA);
                if (app.Application.status === 'accepted') {
                    if (selectedHorizontalAxis === 'SAT') {
                        accepted.push({
                            x: app.SATMath + app.SATEBRW,
                            y: GPA,
                        });
                    } else if (selectedHorizontalAxis === 'ACT') {
                        accepted.push({
                            x: app.ACTComposite,
                            y: GPA,
                        });
                    } else if (selectedHorizontalAxis === 'weighted') {
                        accepted.push({
                            x: app.weight,
                            y: GPA,
                        });
                    }
                } else if (app.Application.status === 'denied') {
                    if (selectedHorizontalAxis === 'SAT') {
                        denied.push({
                            x: app.SATMath + app.SATEBRW,
                            y: GPA,
                        });
                    } else if (selectedHorizontalAxis === 'ACT') {
                        denied.push({
                            x: app.ACTComposite,
                            y: GPA,
                        });
                    } else if (selectedHorizontalAxis === 'weighted') {
                        denied.push({
                            x: app.weight,
                            y: GPA,
                        });
                    }
                } else if (selectedHorizontalAxis === 'SAT') {
                    other.push({
                        x: app.SATMath + app.SATEBRW,
                        y: GPA,
                    });
                } else if (selectedHorizontalAxis === 'ACT') {
                    other.push({
                        x: app.ACTComposite,
                        y: GPA,
                    });
                } else if (selectedHorizontalAxis === 'weighted') {
                    other.push({
                        x: app.weight,
                        y: GPA,
                    });
                }
            }

            const you = { y: parseFloat(student.GPA) };
            const average = { y: averages.avgGPA };
            if (selectedHorizontalAxis === 'SAT') {
                you.x = student.SATMath + student.SATEBRW;
                average.x = averages.avgSATMath + averages.avgSATEBRW;
            } else if (selectedHorizontalAxis === 'ACT') {
                you.x = student.ACTComposite;
                average.x = averages.avgACTComposite;
            } else if (selectedHorizontalAxis === 'weighted') {
                you.x = getWeight(student);
                average.x = averages.avgWeight;
            }

            return {
                accepted: accepted,
                denied: denied,
                other: other,
                you: you,
                average: average,
                backgroundColor: backgroundColor,
            };
        };

        const getChartConfiguration = (data) => {
            let xAxisStepSize = 1;
            let xAxisSuggestedMin = 0;
            let xAxisSuggestedMax = 100;
            if (selectedHorizontalAxis === 'SAT') {
                xAxisStepSize = 100;
                xAxisSuggestedMin = 400;
                xAxisSuggestedMax = 1600;
            } else if (selectedHorizontalAxis === 'ACT') {
                xAxisSuggestedMax = 36;
            }
            const options = {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'Average',
                        borderColor: 'orange',
                        backgroundColor: 'orange',
                        data: [data.average],
                    }, {
                        label: 'Accepted',
                        borderColor: 'green',
                        backgroundColor: 'green',
                        data: data.accepted,
                    }, {
                        label: 'Denied',
                        borderColor: 'red',
                        backgroundColor: 'red',
                        data: data.denied,
                    }, {
                        label: 'Other',
                        borderColor: 'gold',
                        backgroundColor: 'gold',
                        data: data.other,
                    }, {
                        label: 'You',
                        borderColor: 'black',
                        backgroundColor: data.backgroundColor,
                        pointStyle: 'triangle',
                        pointRadius: 7,
                        data: [data.you],
                    },
                    ],
                },
                options: {
                    scales: {
                        xAxes: [{
                            type: 'linear',
                            position: 'bottom',
                            ticks: {
                                stepSize: xAxisStepSize,
                                suggestedMin: xAxisSuggestedMin,
                                suggestedMax: xAxisSuggestedMax,
                            },
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'GPA',
                            },
                            ticks: {
                                stepSize: 0.2,
                                suggestedMin: 0,
                                suggestedMax: 4,
                            },
                        }],
                    },
                    aspectRatio: 1.25,
                    legend: {
                        position: 'right',
                        align: 'start',
                    },
                },
                plugins: {
                    afterDatasetsDraw: function drawAverageLine(chart) {
                        // draw horizontal & vertical line to Average point
                        const { ctx } = chart;
                        if (chart.getDatasetMeta(0) && chart.getDatasetMeta(0).data[0]) {
                            const yAxis = chart.scales['y-axis-1'];
                            const bottomY = yAxis.bottom;
                            // eslint-disable-next-line no-underscore-dangle
                            const { x } = chart.getDatasetMeta(0).data[0]._model;
                            // eslint-disable-next-line no-underscore-dangle
                            const { y } = chart.getDatasetMeta(0).data[0]._model;
                            ctx.save();
                            ctx.beginPath();
                            ctx.moveTo(x, bottomY);
                            ctx.setLineDash([5, 3]);
                            ctx.lineTo(x, y);
                            ctx.lineTo(30, y);
                            ctx.lineWidth = 1;
                            ctx.strokeStyle = 'orange';
                            ctx.stroke();
                            ctx.restore();
                        }
                    },
                },
            };
            return options;
        };

        const updateChart = () => {
            const configuration = getChartConfiguration(transformApplicationsData());

            scatterplot.data = configuration.data;
            scatterplot.options = configuration.options;
            scatterplot.update();
        };

        if (!student) {
            getStudent(localStorage.getItem('username')).then((result) => {
                if (result.error) {
                    setStudent({});
                }
                if (result.ok) {
                    setStudent(result.student);
                }
            });
        } else if (!scatterplot && canvasRef && canvasRef.current) {
            const chartJS = new Chart(canvasRef.current, getChartConfiguration(transformApplicationsData()));
            setScatterplot(chartJS);
        } else if (scatterplot) {
            updateChart();
        }
    }, [canvasRef, applications, averages, student, selectedHorizontalAxis, scatterplot]);

    return (
        <>
            {/* {' '}
            {errorAlert
                ? <Alert variant="danger">{errorMessage}</Alert>
                : ( */}
            <Container>
                <div className="chart-container">
                    <canvas id="chart-canvas" ref={canvasRef} />
                </div>
                <Form className="text-center">
                    <Form.Control size="sm" as="select" value={selectedHorizontalAxis} onChange={(e) => setSelectedHorizontalAxis(e.target.value)}>
                        <option value="disabled" disabled>Select Horizontal Axis</option>
                        <option value="SAT">SAT EBRW + SAT Math</option>
                        <option value="ACT">ACT Composite</option>
                        <option value="weighted">Weighted Tests</option>
                    </Form.Control>
                </Form>
            </Container>
            {/* )} */}
        </>
    );
};

export default ATScatterplot;
