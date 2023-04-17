import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';

/**
 * Fill quiz basic information
 */
export default class BasicInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorOccured: false,
            basicDetailObtained: false,
            quizEventName: null,
            numOfRounds: null,
            numOfTeams: null
        }

        if (!this.props.quizEventID) {
            // New quiz
            this.state.basicDetailObtained = true
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;
        const quizEventName = form.quizEventName.value;
        const numOfTeams = parseInt(form.numOfTeams.value);
        const numOfRounds = parseInt(form.numOfRounds.value);
        let quizEventID;

        if (numOfTeams > 4) {
            throw "Number of teams cannot be more than 4";
        }

        // POST the data to server
        try {
            let sendModifyRequest = false;

            let basicInfo = {
                QuizEventID: this.props.quizEventID
            }

            if (this.state.quizEventName !== quizEventName) {
                basicInfo.QuizEventName = quizEventName;
                sendModifyRequest = true;
            }
            if (this.state.numOfTeams !== numOfTeams) {
                basicInfo.NumberOfTeams = numOfTeams;
                sendModifyRequest = true;
            }
            if (this.state.numOfRounds !== numOfRounds) {
                basicInfo.NumberOfRounds = numOfRounds;
                sendModifyRequest = true;
            }

            if (sendModifyRequest) {
                const response = await fetch("/quiz/basic_info", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(basicInfo)
                });

                if (response.status !== 200) {
                    this.setState({
                        errorOccured: true
                    });
                    throw "Failed to Edit Quiz Basic Detail";
                };

                const _response = await response.json();

                quizEventID = _response.QuizEventID;
            } else {
                // Edit quiz but nothing changed
                quizEventID = this.props.quizEventID;
            }

            this.props.nextStep(quizEventID, quizEventName, numOfRounds, numOfTeams);

        } catch (err) {
            throw err;
        }
    };

    getBasicDetail = async () => {
        try {
            const response = await fetch("/quiz/basic_info?quizID=" + this.props.quizEventID, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                const _response = await response.json();

                this.setState({
                    quizEventName: _response.QuizEventName,
                    numOfRounds: _response.NumberOfRounds,
                    numOfTeams: _response.NumberOfTeams
                });
            } else if (response.status === 404) {
                // Do nothing
            } else {
                this.setState({
                    errorOccured: true
                });
                throw "Failed to Load Quiz Basic Detail";
            }
        } catch (err) {
            throw err;
        }
    }

    async componentDidMount() {
        if (!this.state.quizDataObtained) {
            await this.getBasicDetail();
            this.setState({
                basicDetailObtained: true
            });

        }
    }

    render() {
        if (this.state.errorOccured) {
            return (
                <p style={{ color: 'red' }}>An error occurred. Check the server log.</p>
            );
        }

        if (!this.state.basicDetailObtained) {
            return (
                <h3><Spinner animation="border" role="status" />Loading Quiz Basic Detail...</h3>
            );
        }

        return (
            <React.Fragment>
                <Container className="mt-4">
                    <Row className="d-inline">
                        <Col md="auto" className="d-inline">
                            <p className="fs-3 d-inline">Basic Detail </p>
                        </Col>
                        <Col md="auto" className="d-inline">
                            <p className="fs-4 d-inline">{!!this.props.quizEventID ? `{ Edit Quiz }` : `{ New Quiz }`}</p>
                        </Col>
                    </Row>

                    <Row className="mt-5 d-flex justify-content-center">
                        <Col md={3}>
                            <Form onSubmit={this.handleSubmit}>
                                <Row className="mb-4">
                                    <FloatingLabel controlId="quizEventName" label="Quiz Event Name *Required" className="px-1">
                                        <Form.Control type="text" placeholder="Quiz Event Name" defaultValue={this.state.quizEventName} required />
                                    </FloatingLabel>
                                </Row>
                                <Row className="mb-4">
                                    <FloatingLabel controlId="numOfTeams" label="Number of Teams" className="px-1">
                                        <Form.Select aria-label="Floating label" defaultValue={this.state.numOfTeams}>
                                            <option value="2">{`2 (Two)`}</option>
                                            <option value="3">{`3 (Three)`}</option>
                                            <option value="4">{`4 (Four)`}</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Row>
                                <Row className="mb-5">
                                    <FloatingLabel controlId="numOfRounds" label="Number of Quiz Rounds" className="px-1">
                                        <Form.Select aria-label="Floating label" defaultValue={this.state.numOfRounds}>
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
                                    <Button
                                        variant="light"
                                        size="lg"
                                        type="submit"
                                        className="custom-button"
                                    >
                                        Save and Continue
                                    </Button>
                                </Row>

                                <Row className="mb-5">
                                    <Button
                                        variant="danger"
                                        size="lg"
                                        type="button"
                                        className="custom-button"
                                        onClick={() => { window.location.replace("/") }}
                                    >
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