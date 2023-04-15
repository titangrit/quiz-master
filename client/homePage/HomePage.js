import React from "react";
import { QuizStatus } from "./../common";
import "./../common/style.css";
import { HomeNavbar } from "../common";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';

/**
 * Renders the home page
 */
export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            availableQuizzesObtained: false,
            errorOccurred: false
        }

        this.quizzes = [];
    }

    getAllQuizzes = async () => {
        try {
            const response = await fetch("/quiz/all_quizzes", {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status !== 200) {
                this.setState({
                    errorOccured: true
                })
                throw "Failed to Get Quizzes";
            }

            this.quizzes = await response.json();

        } catch (err) {
            throw err;
        }

        this.quizzes.push({
            QuizEventName: "very very long text very very long text very very long text very very long text very very long text very very long text very very long text very very long text",
            LifecycleStatusCode: QuizStatus.Running
        })
        this.quizzes.push({
            QuizEventName: "quiz6",
            LifecycleStatusCode: QuizStatus.Running
        })
        this.quizzes.push({
            QuizEventName: "quiz7",
            CompletedOnDate: new Date().toLocaleDateString(),
            LifecycleStatusCode: QuizStatus.Completed
        })
        this.quizzes.push({
            QuizEventName: "quiz8",
            CompletedOnDate: new Date().toLocaleDateString(),
            date: new Date(),
            LifecycleStatusCode: QuizStatus.Completed
        })
    }

    getQuizCards = () => {
        if (this.quizzes.length > 0) {
            return (
                <React.Fragment>
                    {this.quizzes.map((quiz, index) => {
                        let status;
                        let theme = "light";
                        let buttons = [];
                        if (quiz.LifecycleStatusCode === QuizStatus.Draft) {
                            status = "In Draft";
                            theme = "light";
                            buttons.push(
                                <Row className="d-flex justify-content-left">
                                    <Col md={3} className="mx-3">
                                        <Row>
                                            <Button
                                                variant="light"
                                                className="custom-button"
                                                onClick={() => { document.location.href = "/edit_quiz.html?quizID=" + quiz.QuizID }}
                                            >
                                                Edit
                                            </Button>
                                        </Row>
                                    </Col>
                                    <Col md={3} className="mx-3">
                                        <Row>
                                            <Button
                                                variant="light"
                                                className="custom-button"
                                                onClick={() => { document.location.href = "/view_quiz.html?quizID=" + quiz.QuizID }}
                                            >
                                                View
                                            </Button>
                                        </Row>
                                    </Col>
                                </Row>
                            );
                        } else if (quiz.LifecycleStatusCode === QuizStatus.Ready) {
                            status = "Ready to Start";
                            theme = "info";
                            buttons.push(
                                <Row className="d-flex justify-content-left">
                                    <Col md={3} className="mx-3">
                                        <Row>
                                            <Button variant="light"
                                                className="custom-button"
                                            >
                                                Start
                                            </Button>
                                        </Row>
                                    </Col>
                                    <Col md={3} className="mx-3">
                                        <Row>
                                            <Button
                                                variant="light"
                                                className="custom-button"
                                                onClick={() => { document.location.href = "/edit_quiz.html?quizID=" + quiz.QuizID }}
                                            >
                                                Edit
                                            </Button>
                                        </Row>
                                    </Col>
                                    <Col md={3} className="mx-3">
                                        <Row>
                                            <Button
                                                variant="light"
                                                className="custom-button"
                                                onClick={() => { document.location.href = "/view_quiz.html?quizID=" + quiz.QuizID }}
                                            >
                                                View
                                            </Button>
                                        </Row>
                                    </Col>
                                </Row>
                            );
                        } else if (quiz.LifecycleStatusCode === QuizStatus.Running) {
                            status = "Started";
                            theme = "info";
                            buttons.push(
                                <Row className="d-flex justify-content-left">
                                    <Col md={3} className="mx-3">
                                        <Row>
                                            <Button
                                                variant="light"
                                                className="custom-button"
                                            >
                                                Resume
                                            </Button>
                                        </Row>
                                    </Col>
                                    <Col md={3} className="mx-3">
                                        <Row>
                                            <Button
                                                variant="light"
                                                className="custom-button"
                                                onClick={() => { document.location.href = "/view_quiz.html?quizID=" + quiz.QuizID }}
                                            >
                                                View
                                            </Button>
                                        </Row>
                                    </Col>
                                </Row>
                            );
                        } else if (quiz.LifecycleStatusCode === QuizStatus.Completed) {
                            status = "Completed";
                            theme = "primary";
                            buttons.push(
                                <Row className="d-flex justify-content-left">
                                    <Col md={3} className="mx-3">
                                        <Row>
                                            <Button
                                                variant="light"
                                                className="custom-button"
                                            >
                                                Result
                                            </Button>
                                        </Row>
                                    </Col>
                                    <Col md={3} className="mx-3">
                                        <Row>
                                            <Button
                                                variant="light"
                                                className="custom-button"
                                                onClick={() => { document.location.href = "/view_quiz.html?quizID=" + quiz.QuizID }}
                                            >
                                                View
                                            </Button>
                                        </Row>
                                    </Col>
                                    <Col md={3} className="mx-3">
                                        <Row>
                                            <Button
                                                variant="light"
                                                className="custom-button"
                                            >
                                                Delete</Button>
                                        </Row>
                                    </Col>
                                </Row>
                            );
                        }

                        return (
                            <Card key={index} className="mb-2" bg={theme} text={theme === 'light' ? 'dark' : 'white'}>
                                <Card.Header>{status}</Card.Header>
                                <Card.Body>
                                    <Card.Title>{quiz.QuizEventName}</Card.Title>
                                    <Card.Text>
                                        {!!quiz.CompletedOnDate && `Completed on ${quiz.CompletedOnDate}`}
                                    </Card.Text>

                                    {buttons}
                                </Card.Body>
                            </Card>
                        )
                    })}
                </React.Fragment>
            );

        } else {
            return (
                <p>No quiz found... Create one!</p>
            );
        }
    }

    async componentDidMount() {
        if (!this.state.availableQuizzesObtained) {
            await this.getAllQuizzes();
            this.setState({
                availableQuizzesObtained: true
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <HomeNavbar />
                <Container fluid>
                    {/* Logo */}
                    <Row className="mt-2 mb-2 d-flex justify-content-center">
                        <h1 style={{ color: '#333' }} className="d-flex justify-content-center">QuizMaster</h1>
                    </Row>

                    <Row className="d-flex justify-content-center">
                        <Col md={5}>
                            {/* New quiz button */}
                            <Button variant="light"
                                className="custom-button mt-4 mb-4"
                                size="lg"
                                type="button"
                                onClick={() => { document.location.href = "new_quiz.html" }}
                            >
                                New Quiz Event
                            </Button>

                            {/* Error occurred message */}
                            {this.state.errorOccurred &&
                                <p style={{ color: 'red' }}>An error occurred. Try refreshing the page or check the server log.</p>
                            }

                            {/* Loading message */}
                            {!this.state.availableQuizzesObtained &&
                                <h3><Spinner animation="border" role="status" /> Loading Available Quizzes...</h3>
                            }

                            {/* Available quizzes */}
                            {this.state.availableQuizzesObtained &&
                                <React.Fragment>
                                    <h4>Quizzes</h4>
                                    <Container className="quizzes-table-container mt-3 mb-3" fluid>
                                        {this.getQuizCards()}
                                    </Container>
                                </React.Fragment>
                            }
                        </Col>
                    </Row>
                </Container >
            </React.Fragment>
        );
    }
}