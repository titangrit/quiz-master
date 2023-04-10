import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NewQuiz.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

/**
 * Fill quiz basic information
 */
export default class BasicInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;
        const quizEventName = form.quizEventName.value;
        const numOfTeams = form.numOfTeams.value;
        const numOfRounds = form.numOfRounds.value;
        let quizEventID;

        if (numOfTeams > 4) {
            throw "Number of teams cannot be more than 4";
        }

        // POST the data to server
        try {
            let basicInfo = {
                QuizEventName: quizEventName,
                NumberOfTeams: numOfTeams,
                NumberOfRounds: numOfRounds
            }

            const response = await fetch("/quiz/basic_info", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(basicInfo)
            });

            if (response.status !== 200) {
                throw "Failed to Create Quiz";
            };

            const _response = await response.json();

            quizEventID = _response.quizID;

            this.props.nextStep(quizEventID, quizEventName, numOfRounds, numOfTeams);

        } catch (err) {
            throw err;
        }
    };

    render() {
        return (
            <React.Fragment>
                <Container className="mt-4">
                    <Row className="d-inline">
                        <Col md="auto" className="d-inline">
                            <p className="fs-3 d-inline">Basic Detail </p>
                        </Col>
                        <Col md="auto" className="d-inline">
                            <p className="fs-4 d-inline">{`{ New Quiz }`}</p>
                        </Col>
                    </Row>

                    <Row className="mt-5 d-flex justify-content-center">
                        <Col md={3}>
                            <Form onSubmit={this.handleSubmit}>
                                <Row className="mb-4">
                                    <FloatingLabel controlId="quizEventName" label="Quiz Event Name *Required" className="px-1">
                                        <Form.Control type="text" placeholder="Quiz Event Name" required />
                                    </FloatingLabel>
                                </Row>
                                <Row className="mb-4">
                                    <FloatingLabel controlId="numOfTeams" label="Number of Teams" className="px-1">
                                        <Form.Select aria-label="Floating label">
                                            <option value="2">{`2 (Two)`}</option>
                                            <option value="3">{`3 (Three)`}</option>
                                            <option value="4">{`4 (Four)`}</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Row>
                                <Row className="mb-5">
                                    <FloatingLabel controlId="numOfRounds" label="Number of Quiz Rounds" className="px-1">
                                        <Form.Select aria-label="Floating label">
                                            <option value="1">{`1 (One)`}</option>
                                            <option value="2">{`2 (Two)`}</option>
                                            <option value="3">{`3 (Three)`}</option>
                                            <option value="4">{`4 (Four)`}</option>
                                            <option value="5">{`5 (Five)`}</option>
                                            <option value="6">{`6 (Six)`}</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Row>

                                <Row className="mb-4">
                                    <Button variant="primary" size="lg" type="submit">
                                        Save and Continue
                                    </Button>
                                </Row>

                                <Row className="mb-6">
                                    <Button variant="outline-danger" size="lg" type="button" onClick={() => { window.location.replace("/") }}>
                                        Cancel
                                    </Button>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Container >
            </React.Fragment>
        );
    }
}