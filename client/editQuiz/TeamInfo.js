import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Accordion from 'react-bootstrap/Accordion';

/**
 * Fill team information
 */
export default class TeamInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorOccured: false
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;

        // extract the form data
        const teamsInfo = {
            QuizID: this.props.quizEventID,
            Teams: []
        };
        for (let i = 0; i < this.props.numOfTeams; i++) {
            const _teamInfo = {
                TeamName: form[`team${i + 1}+Name`].value,
                Members: [
                    {
                        Surname: form[`team${i + 1}+Member1Surname`].value,
                        Name: form[`team${i + 1}+Member1Name`].value,
                        Lastname: form[`team${i + 1}+Member1Lastname`].value
                    },
                    {
                        Surname: form[`team${i + 1}+Member2Surname`].value,
                        Name: form[`team${i + 1}+Member2Name`].value,
                        Lastname: form[`team${i + 1}+Member2Lastname`].value
                    },
                    {
                        Surname: form[`team${i + 1}+Member3Surname`].value,
                        Name: form[`team${i + 1}+Member3Name`].value,
                        Lastname: form[`team${i + 1}+Member3Lastname`].value
                    },
                    {
                        Surname: form[`team${i + 1}+Member4Surname`].value,
                        Name: form[`team${i + 1}+Member4Name`].value,
                        Lastname: form[`team${i + 1}+Member4Lastname`].value
                    }
                ]
            }
            teamsInfo.Teams.push(_teamInfo);
        }

        // POST the data to server
        try {
            const response = await fetch("/quiz/team_info", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(teamsInfo)
            });

            if (response.status !== 200) {
                this.setState({
                    errorOccured: true
                });
                throw "Failed to Set Team Info";
            };

            this.props.nextStep();

        } catch (err) {
            throw err;
        }
    };

    render() {
        if (this.state.errorOccured) {
            return (
                <React.Fragment>
                    <p style={{ color: 'red' }}>An error occurred. Check the server log.</p>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <Container className="mt-4">
                    <Row className="d-inline">
                        <Col md="auto" className="d-inline">
                            <p className="fs-3 d-inline">Teams Detail </p>
                        </Col>
                        <Col md="auto" className="d-inline">
                            <p className="fs-4 d-inline">{`{ New Quiz | ${this.props.quizEventName} }`}</p>
                        </Col>
                    </Row>

                    <Form onSubmit={this.handleSubmit}>
                        {
                            (
                                () => {
                                    let content = [];
                                    for (let i = 0; i < this.props.numOfTeams; i++) {
                                        content.push(
                                            <React.Fragment key={i} >
                                                {/* Team name */}
                                                <Row className="mt-5 d-flex justify-content-left">
                                                    <Col md={3}>
                                                        <Row>
                                                            <FloatingLabel controlId={`team${i + 1}+Name`} label={`Team ${i + 1} Name *Required`} className="px-1">
                                                                <Form.Control type="text" placeholder={`Team ${i + 1} Name`} required />
                                                            </FloatingLabel>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                <Accordion className="mt-4" alwaysOpen>
                                                    <Accordion.Item eventKey="i">
                                                        <Accordion.Header>Members Detail</Accordion.Header>
                                                        <Accordion.Body>
                                                            {/* Member 1 */}
                                                            <Row className="mt-2 d-flex justify-content-left">
                                                                <Col md={3}>
                                                                    <Row>
                                                                        <FloatingLabel controlId={`team${i + 1}+Member1Surname`} label={`Member 1 Surname`} className="px-1">
                                                                            <Form.Control type="text" placeholder={`Member 1 Surname`} />
                                                                        </FloatingLabel>
                                                                    </Row>
                                                                </Col>
                                                                <Col md={3}>
                                                                    <Row>
                                                                        <FloatingLabel controlId={`team${i + 1}+Member1Name`} label={`Member 1 Name`} className="px-1">
                                                                            <Form.Control type="text" placeholder={`Member 1 Name`} />
                                                                        </FloatingLabel>
                                                                    </Row>
                                                                </Col>
                                                                <Col md={3}>
                                                                    <Row>
                                                                        <FloatingLabel controlId={`team${i + 1}+Member1Lastname`} label={`Member 1 Lastname`} className="px-1">
                                                                            <Form.Control type="text" placeholder={`Member 1 Lastname`} />
                                                                        </FloatingLabel>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                            {/* Member 2 */}
                                                            <Row className="mt-4 d-flex justify-content-left">
                                                                <Col md={3}>
                                                                    <Row>
                                                                        <FloatingLabel controlId={`team${i + 1}+Member2Surname`} label={`Member 2 Surname`} className="px-1">
                                                                            <Form.Control type="text" placeholder={`Member 2 Surname`} />
                                                                        </FloatingLabel>
                                                                    </Row>
                                                                </Col>
                                                                <Col md={3}>
                                                                    <Row>
                                                                        <FloatingLabel controlId={`team${i + 1}+Member2Name`} label={`Member 2 Name`} className="px-1">
                                                                            <Form.Control type="text" placeholder={`Member 2 Name`} />
                                                                        </FloatingLabel>
                                                                    </Row>
                                                                </Col>
                                                                <Col md={3}>
                                                                    <Row>
                                                                        <FloatingLabel controlId={`team${i + 1}+Member2Lastname`} label={`Member 2 Lastname`} className="px-1">
                                                                            <Form.Control type="text" placeholder={`Member 2 Lastname`} />
                                                                        </FloatingLabel>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                            {/* Member 3 */}
                                                            <Row className="mt-4 d-flex justify-content-left">
                                                                <Col md={3}>
                                                                    <Row>
                                                                        <FloatingLabel controlId={`team${i + 1}+Member3Surname`} label={`Member 3 Surname`} className="px-1">
                                                                            <Form.Control type="text" placeholder={`Member 3 Surname`} />
                                                                        </FloatingLabel>
                                                                    </Row>
                                                                </Col>
                                                                <Col md={3}>
                                                                    <Row>
                                                                        <FloatingLabel controlId={`team${i + 1}+Member3Name`} label={`Member 3 Name`} className="px-1">
                                                                            <Form.Control type="text" placeholder={`Member 3 Name`} />
                                                                        </FloatingLabel>
                                                                    </Row>
                                                                </Col>
                                                                <Col md={3}>
                                                                    <Row>
                                                                        <FloatingLabel controlId={`team${i + 1}+Member3Lastname`} label={`Member 3 Lastname`} className="px-1">
                                                                            <Form.Control type="text" placeholder={`Member 3 Lastname`} />
                                                                        </FloatingLabel>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                            {/* Member 4 */}
                                                            <Row className="mt-4">
                                                                <Col md={3}>
                                                                    <Row>
                                                                        <FloatingLabel controlId={`team${i + 1}+Member4Surname`} label={`Member 4 Surname`} className="px-1">
                                                                            <Form.Control type="text" placeholder={`Member 4 Surname`} />
                                                                        </FloatingLabel>
                                                                    </Row>
                                                                </Col>
                                                                <Col md={3}>
                                                                    <Row>
                                                                        <FloatingLabel controlId={`team${i + 1}+Member4Name`} label={`Member 4 Name`} className="px-1">
                                                                            <Form.Control type="text" placeholder={`Team ${i + 1} Member 4 Name`} />
                                                                        </FloatingLabel>
                                                                    </Row>
                                                                </Col>
                                                                <Col md={3}>
                                                                    <Row>
                                                                        <FloatingLabel controlId={`team${i + 1}+Member4Lastname`} label={`Member 4 Lastname`} className="px-1">
                                                                            <Form.Control type="text" placeholder={`Member 4 Lastname`} />
                                                                        </FloatingLabel>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                </Accordion>
                                            </React.Fragment>
                                        )
                                    }
                                    return content;
                                }
                            )()
                        }
                        {/* Buttons */}
                        <Row className="mt-5 mb-5 d-flex justify-content-center">
                            <Col md={3}>
                                <Row className="mb-4">
                                    <Button variant="light" size="lg" type="submit" className="custom-button">
                                        Save and Continue
                                    </Button>
                                </Row>

                                <Row className="mb-4">
                                    <Button variant="secondary" size="lg" type="button" className="custom-button" onClick={() => { this.props.nextStep() }}>
                                        Skip
                                    </Button>
                                </Row>

                                <Row className="mb-6">
                                    <Button variant="danger" size="lg" type="button" className="custom-button" onClick={() => { window.location.replace("/") }}>
                                        Cancel
                                    </Button>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </React.Fragment>
        );
    }
}
