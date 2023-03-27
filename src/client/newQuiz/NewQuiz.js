import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NewQuiz.css";
import { HomeButton, ActivityTitle, ModifyQuizStep } from "../common";

/**
 * Fill question information
 */
class QuestionInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <HomeButton
                    home={this.props.home}
                />

                <ActivityTitle
                    activityTitle={'New Quiz Event'}
                    activityTitleDesc={'Quiz Championship 2023'}
                />

            </div>
        );
    }
}

/**
 * Control conditional rendering of QuestionInfo
 */
class QuestionInfoController extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

    }
}

/**
 * Fill round information
 */
class RoundInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <HomeButton
                    home={this.props.home}
                />

                <ActivityTitle
                    activityTitle={'New Quiz Event'}
                    activityTitleDesc={'Quiz Championship 2023'}
                />

            </div>
        );
    }
}

/**
 * Fill team information
 */
class TeamInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        //@TODO extract the form data and POST to backend
        for (let i = 0; i < this.props.numOfTeams; i++) {
            //@TODO error handling if data is not somehow supplied
        }

        this.props.nextStep();
    };

    render() {

        return (
            <>
                <Navbar sticky="top" bg="dark" variant="dark">
                    <Container>
                        {/* Without Container, the element stays extreme left! */}
                        <Navbar.Brand md={2} href="index.html">QuizMaster</Navbar.Brand>
                    </Container>
                </Navbar>

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
                                            <>
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
                                                {/* Member 1 */}
                                                <Row className="mt-4 d-flex justify-content-left">
                                                    <Col md={3}>
                                                        <Row>
                                                            <FloatingLabel controlId={`team${i + 1}+Member1Surname`} label={`Member 1 Surname`} className="px-1">
                                                                <Form.Control type="text" placeholder={`Member 1 Surname`} />
                                                            </FloatingLabel>
                                                        </Row>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Row>
                                                            <FloatingLabel controlId={`team${i + 1}+Member1Name`} label={`Member 1 Name *Required`} className="px-1">
                                                                <Form.Control type="text" placeholder={`Member 1 Name`} required />
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
                                                <Row className="mt-4 d-flex justify-content-left">
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
                                            </>
                                        )
                                    }
                                    return content;
                                }
                            )()
                        }
                        {/* Buttons */}
                        <Row className="mt-5 mb-5 d-flex">
                            <Col md={3}>
                                <Row className="mb-4">
                                    <Button variant="primary" size="lg" type="submit">
                                        Save and Continue
                                    </Button>
                                </Row>

                                <Row className="mb-6">
                                    <Button variant="outline-danger" size="lg" type="null" onClick={() => { window.location.replace("/") }}>
                                        Cancel
                                    </Button>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </>
        );
    }
}

/**
 * Fill quiz basic information
 */
class BasicInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        const quizEventName = form.quizEventName.value;
        const numOfTeams = form.numOfTeams.value;
        const numOfRounds = form.numOfRounds.value;

        //@TODO error handling if data is not somehow supplied

        //@TODO call POST the data to backend
        const quizID = '0';

        this.props.nextStep(quizID, quizEventName, numOfRounds, numOfTeams);

    };

    render() {
        return (
            <>
                <Navbar sticky="top" bg="dark" variant="dark">
                    <Container>
                        {/* Without Container, the element stays extreme left! */}
                        <Navbar.Brand md={2} href="index.html">QuizMaster</Navbar.Brand>
                    </Container>
                </Navbar>

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
                        <Col md={4}>
                            <Form onSubmit={this.handleSubmit}>
                                <Row className="mb-4">
                                    <FloatingLabel controlId="quizEventName" label="Quiz Event Name" className="px-1">
                                        <Form.Control type="text" placeholder="Quiz Event Name" required />
                                    </FloatingLabel>
                                </Row>
                                <Row className="mb-4">
                                    <FloatingLabel controlId="numOfTeams" label="Number of Teams" className="px-1">
                                        <Form.Select aria-label="Floating label select example">
                                            <option value="2">{`2 (Two)`}</option>
                                            <option value="3">{`3 (Three)`}</option>
                                            <option value="4">{`4 (Four)`}</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Row>
                                <Row className="mb-5">
                                    <FloatingLabel controlId="numOfRounds" label="Number of Quiz Rounds" className="px-1">
                                        <Form.Select aria-label="Floating label select example">
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
                                    <Button variant="outline-danger" size="lg" type="null" onClick={() => { window.location.replace("/") }}>
                                        Cancel
                                    </Button>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Container >
            </>
        );
    }
}

/**
 * Create quiz component
 */
export default class NewQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            createQuizStep: ModifyQuizStep.BasicInfo,
            quizEventID: null,
            quizEventName: null,
            numOfRounds: null,
            numOfTeams: null
        }
    }

    nextStep = () => {
        if (this.state.createQuizStep >= ModifyQuizStep.LastStep) {
            // if last step is reached, return home
            window.location.replace("/");
        }

        this.setState({
            createQuizStep: this.state.createQuizStep + 1
        })
    }

    nextAfterBasicInfo = (quizEventID, quizEventName, numOfRounds, numOfTeams) => {
        console.log(this.state.createQuizStep);
        const nextStep = this.state.createQuizStep + 1;
        this.setState({
            createQuizStep: nextStep,
            quizEventID: quizEventID,
            quizEventName: quizEventName,
            numOfRounds: numOfRounds,
            numOfTeams: numOfTeams
        })
    }

    render() {
        switch (this.state.createQuizStep) {
            case ModifyQuizStep.BasicInfo:
                return (
                    <BasicInfo
                        home={this.props.home}
                        nextStep={this.nextAfterBasicInfo}
                    />
                );

            case ModifyQuizStep.TeamInfo:
                return (
                    <TeamInfo
                        home={this.props.home}
                        quizEventName={this.state.quizEventName}
                        quizEventID={this.state.quizEventID}
                        numOfTeams={this.state.numOfTeams}
                        nextStep={this.nextStep}
                    />
                );

            case ModifyQuizStep.RoundInfo:
                return (
                    <RoundInfo
                        home={this.props.home}
                        quizEventName={this.state.quizEventName}
                        quizEventID={this.state.quizEventID}
                        numOfRounds={this.state.numOfRounds}
                        nextStep={() => this.nextStep()}
                    />
                );

            case ModifyQuizStep.QuestionInfo:
                return (
                    <QuestionInfoController
                        home={this.props.home}
                        quizEventName={this.state.quizEventName}
                        quizEventID={this.state.quizEventID}
                        nextStep={() => this.nextStep()}
                    />
                );
        }
    }
}