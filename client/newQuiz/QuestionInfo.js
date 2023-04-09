import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FormLabel } from "react-bootstrap";

class QuestionInfoEachRound extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;

        // extract the form data
        const questionsInfo = {
            RoundUUID: this.props.roundDetail["UUID"],
            Questions: []
        };
        const totalNumQuestions = this.props.numOfTeams * this.props.roundDetail["NumQuestions"];
        for (let i = 1; i <= totalNumQuestions; i++) {
            const _question = {
                SequenceNumber: i,
                Description: form[`question${i}`].value,
            };

            if (this.props.roundDetail["IsAudioVisual"]) {
                _question.MediaUUID = form[`mediaQuestion${i}`].value;
            }

            if (this.props.roundDetail["IsMCQ"]) {
                _question.Option1 = form[`optionAQuestion${i}`].value;
                _question.Option2 = form[`optionBQuestion${i}`].value;
                _question.Option3 = form[`optionCQuestion${i}`].value;
                _question.Option4 = form[`optionDQuestion${i}`].value;

                const correctOption = form[`correctOptionQuestion${i}`].value;
                _question.Answer = form[`option${correctOption}Question${i}`].value;
            } else {
                _question.Answer = form[`answerQuestion${i}`].value;
            }

            questionsInfo.Questions.push(_question);
        }

        // POST the data to server
        try {
            const response = await fetch("/quiz/question_info", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(questionsInfo)
            });

            const _response = await response.json();
            assert(_response.status === 200);

            this.props.nextStep();

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
                            <p className="fs-3 d-inline">{`Round ${this.props.roundDetail["SeqNum"]} Questions | ${this.props.roundDetail["Name"]}`}</p>
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
                                    const totalNumQuestions = this.props.numOfTeams * this.props.roundDetail["NumQuestions"];
                                    for (let i = 1; i <= totalNumQuestions; i++) {
                                        content.push(
                                            <React.Fragment key={i} >
                                                {/* Question */}
                                                <Row className="mt-5 d-flex">
                                                    <Col md={6}>
                                                        <Row>
                                                            <FormLabel style={{ fontWeight: 'bold' }}>{`Question ${i}`}</FormLabel>
                                                            <FloatingLabel
                                                                controlId={`question${i}`}
                                                                label={`To Team ${i % this.props.numOfTeams ? (i % this.props.numOfTeams) : this.props.numOfTeams}`}
                                                                className="px-1"
                                                            >
                                                                <Form.Control as="textarea" placeholder={`To Team ${i % this.props.numOfTeams}`} style={{ height: '100px' }} value="temp" required />
                                                            </FloatingLabel>
                                                        </Row>
                                                    </Col>
                                                </Row>

                                                {/* Audio Visual Media */}
                                                {
                                                    (
                                                        () => {
                                                            if (this.props.roundDetail["IsAudioVisual"]) {
                                                                return (
                                                                    <Row className="mt-4 d-flex">
                                                                        <Col md={3}>
                                                                            <Form.Group controlId={`mediaQuestion${i}`}>
                                                                                <Form.Label>Select Media File</Form.Label>
                                                                                <Form.Control type="file" />
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
                                                            if (this.props.roundDetail["IsMCQ"]) {
                                                                return (
                                                                    <React.Fragment>
                                                                        <Row className="mt-4 d-flex">
                                                                            <Col md={3}>
                                                                                <FloatingLabel controlId={`optionAQuestion${i}`} label="Option A" className="px-1">
                                                                                    <Form.Control type="text" placeholder="Option A" value="temp" required />
                                                                                </FloatingLabel>
                                                                            </Col>
                                                                            <Col md={3}>
                                                                                <FloatingLabel controlId={`optionBQuestion${i}`} label="Option B" className="px-1">
                                                                                    <Form.Control type="text" placeholder="Option B" value="temp" required />
                                                                                </FloatingLabel>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row className="mt-4 d-flex">
                                                                            <Col md={3}>
                                                                                <FloatingLabel controlId={`optionCQuestion${i}`} label="Option C" className="px-1">
                                                                                    <Form.Control type="text" placeholder="Option C" value="temp" required />
                                                                                </FloatingLabel>
                                                                            </Col>
                                                                            <Col md={3}>
                                                                                <FloatingLabel controlId={`optionDQuestion${i}`} label="Option D" className="px-1">
                                                                                    <Form.Control type="text" placeholder="Option D" value="temp" required />
                                                                                </FloatingLabel>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row className="mt-4 d-flex">
                                                                            <Col md={3}>
                                                                                <FloatingLabel controlId={`correctOptionQuestion${i}`} label="Correct Option" className="px-1">
                                                                                    <Form.Select aria-label="Floating label">
                                                                                        <option value="A">{`Option A`}</option>
                                                                                        <option value="B">{`Option B`}</option>
                                                                                        <option value="C">{`Option C`}</option>
                                                                                        <option value="D">{`Option D`}</option>
                                                                                    </Form.Select>
                                                                                </FloatingLabel>
                                                                            </Col>
                                                                        </Row>
                                                                    </React.Fragment>
                                                                );
                                                            } else {
                                                                return (
                                                                    <Row className="mt-4 d-flex">
                                                                        <Col md={3}>
                                                                            <FloatingLabel controlId={`answerQuestion${i}`} label="Answer" className="px-1">
                                                                                <Form.Control type="text" placeholder="Answer" value="temp" required />
                                                                            </FloatingLabel>
                                                                        </Col>
                                                                    </Row>
                                                                );
                                                            }
                                                        }
                                                    )()
                                                }
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
                                    <Button variant="primary" size="lg" type="submit">
                                        Save and Continue
                                    </Button>
                                </Row>

                                <Row className="mb-6">
                                    <Button variant="outline-danger" size="lg" type="button" onClick={() => { window.location.replace("/") }}>
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

/**
 * Fill question information
 */
export default class QuestionInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roundCounter: 1,
        }

        this.roundDetails = [];
        this.getRoundDetails();
    }

    getRoundDetails = async () => {
        // @TODO get the round type details for the quiz
        // const roundDetails = [
        //     {
        //         UUID: '0',
        //         SeqNum: '2',
        //         ID: "ROUND_Y",
        //         Name: "Round Type Y",
        //         NumQuestions: 3,
        //         IsMCQ: true,
        //         IsAudioVisual: true
        //     },
        //     {
        //         UUID: '1',
        //         SeqNum: '4',
        //         ID: "ROUND_Z",
        //         Name: "Round Type Z+",
        //         NumQuestions: 4,
        //         IsMCQ: false,
        //         IsAudioVisual: false
        //     },
        //     {
        //         UUID: '2',
        //         SeqNum: '1',
        //         ID: "ROUND_X",
        //         Name: "Round Type X",
        //         NumQuestions: 2,
        //         IsMCQ: true,
        //         IsAudioVisual: false
        //     },
        //     {
        //         UUID: '3',
        //         SeqNum: '3',
        //         ID: "ROUND_Z",
        //         Name: "Round Type Z",
        //         NumQuestions: 2,
        //         IsMCQ: false,
        //         IsAudioVisual: true
        //     }
        // ]

        try {
            const response = await fetch("/quiz/quiz_round_details?quizID=" + this.props.quizEventID, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            const _response = await response.json();
            assert(_response.status === 200);

            for (let roundType of _response.QuizRoundTypes) {
                let _detail = {
                    UUID: roundType.UUID,
                    SeqNum: roundType.SequenceNumber,
                    ID: roundType.RoundTypeID,
                    Name: roundType.RoundTypeName,
                    NumQuestions: roundType.NumQuestionsEachTeam,
                    IsMCQ: roundType.IsMCQ,
                    IsAudioVisual: roundType.IsAVRound,
                }
                this.roundDetails.push(_detail);
            }
        } catch (err) {
            throw err;
        }

        // @TODO error handling if this.props.numOfRounds does not equal roundDetails.length
        assert(this.props.numOfRounds === this.roundDetails.length);

        // const roundDetailsSorted = roundDetails.sort((a, b) => {
        //     if (a.SeqNum > b.SeqNum) {
        //         return 1;
        //     } else {
        //         return -1;
        //     }
        // })
        // this.roundDetails.push(...roundDetailsSorted);
    };

    nextRound = () => {
        const currentRound = this.state.roundCounter + 1;

        if (currentRound > this.props.numOfRounds) {
            this.props.nextStep();
        }

        this.setState({
            roundCounter: currentRound
        })
    }

    render() {
        return (
            <QuestionInfoEachRound
                quizEventName={this.props.quizEventName}
                numOfTeams={this.props.numOfTeams}
                roundDetail={this.roundDetails[this.state.roundCounter - 1]}
                nextRound={() => this.nextRound()}
            />
        );
    }
}

