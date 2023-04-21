import React from "react";
import { HomeNavbar } from "../common";
import "./../common/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import { GetEndpoint } from "./../common";
import Card from 'react-bootstrap/Card';

/**
 * View quiz component
 */
export default class ViewQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quizDataObtained: false,
            errorOccured: false,
        }

        this.quizData = null;
    }

    getQuizData = async () => {
        const queryParams = new URLSearchParams(window.location.search)
        const quizID = queryParams.get('quizID');

        if (!quizID) {
            this.setState({
                quizDataObtained: true,
                errorOccured: true
            });
            throw "Quiz ID Not Found";
        }

        try {
            const response = await fetch(GetEndpoint.ViewQuiz + "?quizID=" + quizID, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status !== 200) {
                this.setState({
                    errorOccured: true
                })
                throw "Failed to Get Quiz Data";
            }

            this.quizData = await response.json();
        }
        catch (err) {
            throw err;
        }
    }

    async componentDidMount() {
        if (!this.state.quizDataObtained) {
            await this.getQuizData();
            this.setState({
                quizDataObtained: true
            })
        }
    }

    render() {
        if (this.state.errorOccured) {
            return (
                <React.Fragment>
                    <HomeNavbar />
                    <p style={{ color: 'red' }}>An error occurred. Check the server log.</p>
                </React.Fragment>
            );
        }

        if (!this.state.quizDataObtained) {
            return (
                <React.Fragment>
                    <HomeNavbar />
                    <h3><Spinner animation="border" role="status" />Loading Quiz Details...</h3>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                <HomeNavbar />
                <Container className="mt-4">
                    <Row className="d-inline">
                        <Col md="auto" className="d-inline">
                            <p className="fs-3 d-inline">Quiz Detail </p>
                        </Col>
                        <Col md="auto" className="d-inline">
                            <p className="fs-4 d-inline">{`{ ${this.quizData.QuizEventName} }`}</p>
                        </Col>
                    </Row>

                    <Accordion className="mt-5" alwaysOpen defaultActiveKey="0">
                        {/* Basic Detail */}
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Basic Detail</Accordion.Header>
                            <Accordion.Body>
                                <Row className="mb-4 d-flex justify-content-left">
                                    <Col md={3}>
                                        <Row>
                                            <FloatingLabel controlId={`quizName`} label={`Quiz Event Name`} className="px-1">
                                                <Form.Control type="text" placeholder={`Quiz Event Name`} value={this.quizData.QuizEventName} disabled />
                                            </FloatingLabel>
                                        </Row>
                                    </Col>
                                    <Col md={3}>
                                        <Row>
                                            <FloatingLabel controlId={`numOfTeams`} label={`Number of Teams`} className="px-1">
                                                <Form.Control type="text" placeholder={`Number of Teams`} value={this.quizData.NumberOfTeams} disabled />
                                            </FloatingLabel>
                                        </Row>
                                    </Col>
                                    <Col md={3}>
                                        <Row>
                                            <FloatingLabel controlId={`numOfRounds`} label={`Number of Rounds`} className="px-1">
                                                <Form.Control type="text" placeholder={`Number of Rounds`} value={this.quizData.NumberOfRounds} disabled />
                                            </FloatingLabel>
                                        </Row>
                                    </Col>
                                </Row>
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* Team Info */}
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Teams Detail</Accordion.Header>
                            <Accordion.Body>
                                {
                                    (
                                        () => {
                                            let content = [];
                                            for (let i = 1; i <= this.quizData.Teams.length; i++) {
                                                const team = this.quizData.Teams[i - 1];

                                                content.push(
                                                    <Card key={i} className="mb-4" bg="light">
                                                        <Card.Header style={{ fontWeight: 'bold' }}>{`Team ${i}`}</Card.Header>
                                                        <Card.Body>
                                                            <div key={i} className="mb-4" >
                                                                {/* <Form.Label style={{ fontWeight: 'bold' }} className="d-flex justify-content-left">{`Team ${i}`}</Form.Label> */}
                                                                {/* Team name */}
                                                                <Row className="mt-2 d-flex justify-content-left">
                                                                    <Col md={3}>
                                                                        <Row>
                                                                            <FloatingLabel controlId={`team${i}+Name`} label={`Team ${i} Name`} className="px-1">
                                                                                <Form.Control type="text" placeholder={`Team ${i} Name`} value={team.TeamName} disabled />
                                                                            </FloatingLabel>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>

                                                                {/* Member 1 */}
                                                                {(!!team.Member1.Surname || !!team.Member1.Name || !!team.Member1.Lastname) &&
                                                                    <Row className="mt-2 d-flex justify-content-left">
                                                                        {!!team.Member1.Surname &&
                                                                            <Col md={3}>
                                                                                <Row>
                                                                                    <FloatingLabel controlId={`team${i}+Member1Surname`} label={`Member 1 Surname`} className="px-1">
                                                                                        <Form.Control type="text" placeholder={`Member 1 Surname`} value={team.Member1.Surname} disabled />
                                                                                    </FloatingLabel>
                                                                                </Row>
                                                                            </Col>
                                                                        }

                                                                        {!!team.Member1.Name &&
                                                                            <Col md={3}>
                                                                                <Row>
                                                                                    <FloatingLabel controlId={`team${i}+Member1Name`} label={`Member 1 Name`} className="px-1">
                                                                                        <Form.Control type="text" placeholder={`Member 1 Name`} value={team.Member1.Name} disabled />
                                                                                    </FloatingLabel>
                                                                                </Row>
                                                                            </Col>
                                                                        }

                                                                        {!!team.Member1.Lastname &&
                                                                            <Col md={3}>
                                                                                <Row>
                                                                                    <FloatingLabel controlId={`team${i}+Member1Lastname`} label={`Member 1 Lastname`} className="px-1">
                                                                                        <Form.Control type="text" placeholder={`Member 1 Lastname`} value={team.Member1.Lastname} disabled />
                                                                                    </FloatingLabel>
                                                                                </Row>
                                                                            </Col>
                                                                        }
                                                                    </Row>
                                                                }

                                                                {/* Member 2 */}
                                                                {(!!team.Member2.Surname || !!team.Member2.Name || !!team.Member2.Lastname) &&
                                                                    <Row className="mt-2 d-flex justify-content-left">
                                                                        {!!team.Member2.Surname &&
                                                                            <Col md={3}>
                                                                                <Row>
                                                                                    <FloatingLabel controlId={`team${i}+Member2Surname`} label={`Member 2 Surname`} className="px-1">
                                                                                        <Form.Control type="text" placeholder={`Member 2 Surname`} value={team.Member2.Surname} disabled />
                                                                                    </FloatingLabel>
                                                                                </Row>
                                                                            </Col>
                                                                        }

                                                                        {!!team.Member2.Name &&
                                                                            <Col md={3}>
                                                                                <Row>
                                                                                    <FloatingLabel controlId={`team${i}+Member2Name`} label={`Member 2 Name`} className="px-1">
                                                                                        <Form.Control type="text" placeholder={`Member 2 Name`} value={team.Member2.Name} disabled />
                                                                                    </FloatingLabel>
                                                                                </Row>
                                                                            </Col>
                                                                        }

                                                                        {!!team.Member2.Lastname &&
                                                                            <Col md={3}>
                                                                                <Row>
                                                                                    <FloatingLabel controlId={`team${i}+Member2Lastname`} label={`Member 2 Lastname`} className="px-1">
                                                                                        <Form.Control type="text" placeholder={`Member 2 Lastname`} value={team.Member2.Lastname} disabled />
                                                                                    </FloatingLabel>
                                                                                </Row>
                                                                            </Col>
                                                                        }
                                                                    </Row>
                                                                }

                                                                {/* Member 3 */}
                                                                {(!!team.Member3.Surname || !!team.Member3.Name || !!team.Member3.Lastname) &&
                                                                    <Row className="mt-2 d-flex justify-content-left">
                                                                        {!!team.Member3.Surname &&
                                                                            <Col md={3}>
                                                                                <Row>
                                                                                    <FloatingLabel controlId={`team${i}+Member3Surname`} label={`Member 3 Surname`} className="px-1">
                                                                                        <Form.Control type="text" placeholder={`Member 3 Surname`} value={team.Member3.Surname} disabled />
                                                                                    </FloatingLabel>
                                                                                </Row>
                                                                            </Col>
                                                                        }

                                                                        {!!team.Member3.Name &&
                                                                            <Col md={3}>
                                                                                <Row>
                                                                                    <FloatingLabel controlId={`team${i}+Member3Name`} label={`Member 3 Name`} className="px-1">
                                                                                        <Form.Control type="text" placeholder={`Member 3 Name`} value={team.Member3.Name} disabled />
                                                                                    </FloatingLabel>
                                                                                </Row>
                                                                            </Col>
                                                                        }

                                                                        {!!team.Member3.Lastname &&
                                                                            <Col md={3}>
                                                                                <Row>
                                                                                    <FloatingLabel controlId={`team${i}+Member3Lastname`} label={`Member 3 Lastname`} className="px-1">
                                                                                        <Form.Control type="text" placeholder={`Member 3 Lastname`} value={team.Member3.Lastname} disabled />
                                                                                    </FloatingLabel>
                                                                                </Row>
                                                                            </Col>
                                                                        }
                                                                    </Row>
                                                                }

                                                                {/* Member 4 */}
                                                                {(!!team.Member4.Surname || !!team.Member4.Name || !!team.Member4.Lastname) &&
                                                                    <Row className="mt-2 d-flex justify-content-left">
                                                                        {!!team.Member4.Surname &&
                                                                            <Col md={3}>
                                                                                <Row>
                                                                                    <FloatingLabel controlId={`team${i}+Member4Surname`} label={`Member 4 Surname`} className="px-1">
                                                                                        <Form.Control type="text" placeholder={`Member 4 Surname`} value={team.Member4.Surname} disabled />
                                                                                    </FloatingLabel>
                                                                                </Row>
                                                                            </Col>
                                                                        }

                                                                        {!!team.Member4.Name &&
                                                                            <Col md={3}>
                                                                                <Row>
                                                                                    <FloatingLabel controlId={`team${i}+Member4Name`} label={`Member 4 Name`} className="px-1">
                                                                                        <Form.Control type="text" placeholder={`Team ${i + 1} Member 4 Name`} value={team.Member4.Name} disabled />
                                                                                    </FloatingLabel>
                                                                                </Row>
                                                                            </Col>
                                                                        }

                                                                        {!!team.Member4.Lastname &&
                                                                            <Col md={3}>
                                                                                <Row>
                                                                                    <FloatingLabel controlId={`team${i}+Member4Lastname`} label={`Member 4 Lastname`} className="px-1">
                                                                                        <Form.Control type="text" placeholder={`Member 4 Lastname`} value={team.Member4.Lastname} disabled />
                                                                                    </FloatingLabel>
                                                                                </Row>
                                                                            </Col>
                                                                        }
                                                                    </Row>
                                                                }
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                );
                                            }
                                            return content;
                                        }
                                    )()
                                }
                            </Accordion.Body>
                        </Accordion.Item>

                        {/* Round Info */}
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Rounds Detail</Accordion.Header>
                            <Accordion.Body>
                                {
                                    (
                                        () => {
                                            let content = [];
                                            for (let i = 1; i <= this.quizData.Rounds.length; i++) {
                                                const round = this.quizData.Rounds[i - 1];

                                                let questionsContent = [];
                                                for (let j = 1; j <= round.Questions.length; j++) {
                                                    const question = round.Questions[j - 1];

                                                    questionsContent.push(
                                                        <Card key={j} className="mb-4" bg="light">
                                                            <Card.Header style={{ fontWeight: 'bold' }}>{`Question ${question.SequenceNumber}`}</Card.Header>
                                                            <Card.Body>
                                                                <div key={j} className="mb-4">
                                                                    <Row className="d-flex">
                                                                        <Col md={6}>
                                                                            <Row>
                                                                                <FloatingLabel
                                                                                    controlId={`question${j}`}
                                                                                    label={`To Team ${j % this.quizData.Teams.length ? (j % this.quizData.Teams.length) : this.quizData.Teams.length}`}
                                                                                    className="px-1"
                                                                                >
                                                                                    <Form.Control as="textarea" placeholder={`To Team ${j % this.quizData.Teams.length}`} style={{ height: '100px' }} value={question.Description} disabled />
                                                                                </FloatingLabel>
                                                                            </Row>
                                                                        </Col>
                                                                    </Row>

                                                                    {/* Audio Visual Media */}
                                                                    {
                                                                        (
                                                                            () => {
                                                                                if (round.IsAVRound) {
                                                                                    return (
                                                                                        <Row className="mt-2 d-flex">
                                                                                            <Col md={3}>
                                                                                                <Form.Group controlId={`mediaQuestion${i}`}>
                                                                                                    {/* TODO display media */}
                                                                                                </Form.Group>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    );
                                                                                } else {
                                                                                    return null;
                                                                                }
                                                                            }
                                                                        )()
                                                                    }

                                                                    {/* Answer */}
                                                                    {
                                                                        (
                                                                            () => {
                                                                                if (round.IsMCQ) {
                                                                                    return (
                                                                                        <React.Fragment>
                                                                                            <Row className="mt-2 d-flex">
                                                                                                <Col md={3}>
                                                                                                    <FloatingLabel controlId={`optionAQuestion${j}`} label="Option A" className="px-1">
                                                                                                        <Form.Control type="text" placeholder="Option A" value={question.Option1} disabled />
                                                                                                    </FloatingLabel>
                                                                                                </Col>
                                                                                                <Col md={3}>
                                                                                                    <FloatingLabel controlId={`optionBQuestion${j}`} label="Option B" className="px-1">
                                                                                                        <Form.Control type="text" placeholder="Option B" value={question.Option2} disabled />
                                                                                                    </FloatingLabel>
                                                                                                </Col>
                                                                                            </Row>
                                                                                            <Row className="mt-2 d-flex">
                                                                                                <Col md={3}>
                                                                                                    <FloatingLabel controlId={`optionCQuestion${j}`} label="Option C" className="px-1">
                                                                                                        <Form.Control type="text" placeholder="Option C" value={question.Option3} disabled />
                                                                                                    </FloatingLabel>
                                                                                                </Col>
                                                                                                <Col md={3}>
                                                                                                    <FloatingLabel controlId={`optionDQuestion${j}`} label="Option D" className="px-1">
                                                                                                        <Form.Control type="text" placeholder="Option D" value={question.Option4} disabled />
                                                                                                    </FloatingLabel>
                                                                                                </Col>
                                                                                            </Row>
                                                                                            <Row className="mt-2 d-flex">
                                                                                                <Col md={3}>
                                                                                                    <FloatingLabel controlId={`correctOptionQuestion${j}`} label="Correct Option" className="px-1">
                                                                                                        <Form.Control type="text" placeholder="Correct Option" value={question.CorrectOption} disabled />
                                                                                                    </FloatingLabel>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </React.Fragment>
                                                                                    );
                                                                                } else {
                                                                                    return (
                                                                                        <Row className="mt-2 d-flex">
                                                                                            <Col md={3}>
                                                                                                <FloatingLabel controlId={`answerQuestion${i}`} label="Answer" className="px-1">
                                                                                                    <Form.Control type="text" placeholder="Answer" value={question.Answer} disabled />
                                                                                                </FloatingLabel>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    );
                                                                                }
                                                                            }
                                                                        )()
                                                                    }
                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    );
                                                }

                                                content.push(
                                                    <Card key={i} className="mb-4" bg="light">
                                                        <Card.Header style={{ fontWeight: 'bold' }}>{`Round ${i}`}</Card.Header>
                                                        <Card.Body>
                                                            <div key={i} className="mb-4">
                                                                <Row className="mt-2 d-flex">
                                                                    <Col md={3}>
                                                                        <FloatingLabel controlId={`round${i + 1}TypeID`} label="Round Type ID" className="px-1">
                                                                            <Form.Control type="text" placeholder="Round Type ID" value={round.RoundTypeID} disabled />
                                                                        </FloatingLabel>
                                                                    </Col>
                                                                    <Col md={3}>
                                                                        <FloatingLabel controlId={`round${i + 1}TypeName`} label="Round Type Name" className="px-1">
                                                                            <Form.Control type="text" placeholder="Round Type Name" value={round.RoundTypeName} disabled />
                                                                        </FloatingLabel>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="mt-2 d-flex">
                                                                    <Col md={3}>
                                                                        <FloatingLabel controlId={`round${i + 1}NumQuestions`} label="No. of Questions for Each Team" className="px-1">
                                                                            <Form.Control type="text" placeholder="No. of Questions for Each Team" value={round.NumQuestionsEachTeam} disabled />
                                                                        </FloatingLabel>
                                                                    </Col>
                                                                    <Col md={3}>
                                                                        <FloatingLabel controlId={`round${i + 1}FullMarkEachQ`} label="Full Mark for Each Question" className="px-1">
                                                                            <Form.Control type="text" placeholder="Full Mark for Each Question" value={round.FullMarkEachQuestion} disabled />
                                                                        </FloatingLabel>
                                                                    </Col>
                                                                    <Col md={3}>
                                                                        <FloatingLabel controlId={`round${i + 1}TimerSeconds`} label="Allowed Time in Seconds" className="px-1">
                                                                            <Form.Control type="text" placeholder="Allowed Time in Seconds" value={round.TimerSeconds} disabled />
                                                                        </FloatingLabel>
                                                                    </Col>
                                                                </Row>
                                                                <Row className="mt-2 d-flex">
                                                                    <Col md={3}>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            id={`round${i + 1}IsMCQ`}
                                                                            label="Multiple Choice Questions"
                                                                            checked={round.IsMCQ}
                                                                            disabled
                                                                        />
                                                                    </Col>
                                                                    <Col md={3}>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            id={`round${i + 1}IsPassable`}
                                                                            label="Pass Questions"
                                                                            checked={round.IsPassable}
                                                                            disabled
                                                                        />
                                                                    </Col>
                                                                    <Col md={3}>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            id={`round${i + 1}IsAVRound`}
                                                                            label="Audio/Visual Round"
                                                                            checked={round.IsAVRound}
                                                                            disabled
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                                <Accordion className="mt-4">
                                                                    <Accordion.Item eventKey="0">
                                                                        <Accordion.Header>Questions</Accordion.Header>
                                                                        <Accordion.Body>
                                                                            {
                                                                                questionsContent
                                                                            }
                                                                        </Accordion.Body>
                                                                    </Accordion.Item>
                                                                </Accordion>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                );
                                            }
                                            return content;
                                        }
                                    )()
                                }
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    {/* Buttons */}
                    <Row className="mt-5 mb-5 d-flex justify-content-center">
                        <Col md={3}>
                            <Row className="mt-4 mb-4">
                                <Button variant="light" size="lg" type="button" className="custom-button" onClick={() => { window.location.replace("/") }}>
                                    Close
                                </Button>
                            </Row>
                        </Col>
                    </Row>

                </Container>
            </React.Fragment>
        );
    }
}