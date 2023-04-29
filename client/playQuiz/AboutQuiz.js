import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';

/**
 * Component to display information about the quiz.
*/
export default class AboutQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorOccured: false,
            basicDetailObtained: false
        }

        this.quizEventName = null;
        this.numOfTeams = null;
        this.numOfRounds = null;
        this.roundTypes = [];
    }

    getBasicDetail = async () => {
        try {
            const response = await fetch("/quiz/about_quiz?quizID=" + this.props.quizEventID, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                const _response = await response.json();

                this.quizEventName = _response.QuizEventName;
                this.numOfTeams = _response.NumberOfTeams;
                this.numOfRounds = _response.NumberOfRounds;
                this.roundTypes = _response.RoundTypes;

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
        if (!this.state.basicDetailObtained && !this.state.errorOccured) {
            await this.getBasicDetail();
            this.setState({
                basicDetailObtained: true
            });

        }
    }

    render() {
        if (this.state.errorOccured) {
            return (
                <div className="mt-5 d-flex justify-content-center">
                    <p style={{ color: 'red' }}>An error occurred. Check the server log.</p>
                </div>
            );
        }

        if (!this.state.basicDetailObtained) {
            return (
                <div className="mt-5 d-flex justify-content-center">
                    <h3><Spinner animation="border" role="status" /> Loading Quiz Basic Detail...</h3>
                </div>
            );
        }

        return (
            <React.Fragment>
                <Container className="mt-4">
                    <Row className="d-inline">
                        <Col md="auto" className="d-inline">
                            <p className="fs-3 d-inline">About Quiz</p>
                        </Col>
                        <Col md="auto" className="d-inline">
                            <p className="fs-4 d-inline">{`{ ${this.quizEventName} }`}</p>
                        </Col>
                    </Row>

                    <Row className="mt-5 d-flex">


                        <Row>
                            <p>Number of teams = <span style={{ fontWeight: 'bold' }}>{`${this.numOfTeams}`}</span></p>
                        </Row>
                        <Row className="mb-4">
                            <p>Number of rounds = <span style={{ fontWeight: 'bold' }}>{`${this.numOfRounds}`}</span></p>
                        </Row>

                        {
                            (
                                () => {
                                    let rounds = [];
                                    for (let i = 0; i < this.numOfRounds; i++) {
                                        rounds.push(
                                            <Row className="mb-4">
                                                <p><span style={{ fontWeight: 'bold' }}>{`Round ${i + 1}`}</span>, <span style={{ color: 'blue' }}>{`${this.roundTypes[i].RoundTypeName}`}</span>, has <span style={{ fontWeight: 'bold' }}>{`${this.roundTypes[i].NumQuestionsEachTeam}`}</span> question(s) for each team.</p>
                                                <p>🡆 {this.roundTypes[i].IsMCQ ? `Multiple choice questions.` : `Direct answer, no multiple choice options.`}</p>
                                                {this.roundTypes[i].IsAVRound ? <p>🡆 Visual round.</p> : null}
                                                <p>🡆 Each question carries <span style={{ fontWeight: 'bold' }}>{`${this.roundTypes[i].FullMarkEachQuestion}`}</span> full marks.</p>
                                                <p>🡆 {this.roundTypes[i].IsPassable ? `Questions are passable to next team.` : `Direct questions, not passable.`}</p>
                                                <p>🡆 Each question must be answered within <span style={{ fontWeight: 'bold' }}>{`${this.roundTypes[i].TimerSeconds}`}</span> seconds.</p>
                                            </Row>
                                        );
                                    }
                                    return rounds;
                                }
                            )()
                        }
                        <Col md={3}>
                            <Row className="mt-5 mb-5">
                                <Button
                                    variant="light"
                                    size="lg"
                                    type="button"
                                    className="custom-button"
                                    onClick={() => { this.props.nextStep() }}
                                >
                                    Start 〉
                                </Button>
                            </Row>

                        </Col>
                    </Row>
                </Container >
            </React.Fragment>
        );
    }
}