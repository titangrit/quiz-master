import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FormLabel } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';

class QuestionInfoEachRound extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentQuestionsObtained: false,
            errorOccured: false
        }

        if (!this.props.isEdit) {
            // New quiz, no need to try to obtain existing questions data
            this.state.currentQuestionsObtained = true;
        }

        this.totalNumQuestions = 0;
        this.currentQuestions = [];
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

        let sendModifyRequest = false;

        for (let i = 1; i <= this.totalNumQuestions; i++) {

            // if (this.props.isEdit) {
            let modified = false;
            const thisQuestion = this.currentQuestions.find(q => q.SequenceNumber == i);

            const _question = {
                UUID: thisQuestion?.UUID,
                SequenceNumber: i
            };

            const desc = form[`question${i}`].value;
            if (desc !== thisQuestion?.Description) {
                _question.Description = desc;
                modified = true;
            }

            if (this.props.roundDetail["IsAudioVisual"]) {
                // TODO actual implementation needed
                const media = form[`mediaQuestion${i}`].value;
                //     if (media !== thisQuestion?.MediaUUID) {
                //         _question.MediaUUID = media;
                //         modified = true;
                //     }
            }

            if (this.props.roundDetail["IsMCQ"]) {
                const option1 = form[`optionAQuestion${i}`].value;
                if (option1 !== thisQuestion?.Option1) {
                    _question.Option1 = option1;
                    modified = true;
                }

                const option2 = form[`optionBQuestion${i}`].value;
                if (option2 !== thisQuestion?.Option2) {
                    _question.Option2 = option2;
                    modified = true;
                }

                const option3 = form[`optionCQuestion${i}`].value;
                if (option3 !== thisQuestion?.Option3) {
                    _question.Option3 = option3;
                    modified = true;
                }

                const option4 = form[`optionDQuestion${i}`].value;
                if (option4 !== thisQuestion?.Option4) {
                    _question.Option4 = option4;
                    modified = true;
                }

                const correctOption = form[`correctOptionQuestion${i}`].value;
                if (correctOption !== thisQuestion?.CorrectOption) {
                    _question.CorrectOption = correctOption;

                    // must provide options also
                    // easier to determine the Answer from the options
                    _question.Option1 = option1;
                    _question.Option2 = option2;
                    _question.Option3 = option3;
                    _question.Option4 = option4;

                    modified = true;
                }
            } else {
                const answer = form[`answerQuestion${i}`].value;
                if (answer !== thisQuestion?.Answer) {
                    _question.Answer = answer;
                    modified = true;
                }
            }

            if (modified) {
                questionsInfo.Questions.push(_question);
                sendModifyRequest = true;
            }
        }

        // POST the data to server
        try {
            if (sendModifyRequest) {
                const response = await fetch("/quiz/question_info", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(questionsInfo)
                });

                if (response.status !== 200) {
                    throw "Failed to Set Question Info";
                };
            }

            this.setState({
                currentQuestionsObtained: false
            });
            this.totalNumQuestions = 0;
            this.currentQuestions = [];
            this.props.nextRound();

        } catch (err) {
            this.setState({
                errorOccured: true
            });
            throw err;
        }
    };

    getCurrentQuestions = async () => {
        try {
            const response = await fetch("/quiz/questions?roundUUID=" + this.props.roundDetail["UUID"], {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                this.currentQuestions = await response.json();
            } else if (response.status === 404) {
                // Do nothing
            } else {
                throw "Failed to Get Current Questions";
            };

        } catch (err) {
            this.setState({
                errorOccured: true
            });
            throw err;
        }
    }

    async componentDidMount() {
        if (!this.state.currentQuestionsObtained) {
            await this.getCurrentQuestions();
            this.setState({
                currentQuestionsObtained: true
            });
        }
    }

    async componentDidUpdate() {
        if (!this.state.currentQuestionsObtained) {
            await this.getCurrentQuestions();
            this.setState({
                currentQuestionsObtained: true
            });
        }

        if (this.state.currentQuestionsObtained) {
            for (let i = 0; i < this.totalNumQuestions; i++) {
                const question = this.currentQuestions.find(question => question.SequenceNumber == i + 1);
                if (!question) {
                    break;
                }

                const desc = document.getElementById(`question${i + 1}`);
                desc.value = question.Description;

                if (this.props.roundDetail["IsMCQ"]) {
                    const optionA = document.getElementById(`optionAQuestion${i + 1}`);
                    optionA.value = question.Option1;

                    const optionB = document.getElementById(`optionBQuestion${i + 1}`);
                    optionB.value = question.Option2;

                    const optionC = document.getElementById(`optionCQuestion${i + 1}`);
                    optionC.value = question.Option3;

                    const optionD = document.getElementById(`optionDQuestion${i + 1}`);
                    optionD.value = question.Option4;

                    const correctOption = document.getElementById(`correctOptionQuestion${i + 1}`);
                    correctOption.value = question.CorrectOption;

                } else {
                    const answer = document.getElementById(`answerQuestion${i + 1}`);
                    answer.value = question.Answer;
                }

                if (this.props.roundDetail["IsAudioVisual"]) {
                    // TODO display media
                }
            }
        }
    }

    render() {
        this.totalNumQuestions = this.props.numOfTeams * this.props.roundDetail["NumQuestions"];

        if (this.state.errorOccured) {
            return (
                <p style={{ color: 'red' }}>An error occurred. Check the server log.</p>
            );
        }

        if (!this.state.currentQuestionsObtained) {
            return (
                <h3><Spinner animation="border" role="status" /> Loading Questions...</h3>
            );
        }

        return (
            <React.Fragment>
                <Container className="mt-4">
                    <Row className="d-inline">
                        <Col md="auto" className="d-inline">
                            <p className="fs-3 d-inline">{`Round ${this.props.roundDetail["SeqNum"]} Questions | ${this.props.roundDetail["Name"]}`}</p>
                        </Col>
                        <Col md="auto" className="d-inline">
                            <p className="fs-4 d-inline">{!!this.props.isEdit ? `{ Edit Quiz | ${this.props.quizEventName} }` : `{ New Quiz | ${this.props.quizEventName} }`}</p>
                        </Col>
                    </Row>

                    <Form onSubmit={this.handleSubmit}>
                        {
                            (
                                () => {
                                    let content = [];
                                    for (let i = 1; i <= this.totalNumQuestions; i++) {
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
                                                                <Form.Control as="textarea" placeholder={`To Team ${i % this.props.numOfTeams}`} style={{ height: '100px' }} defaultValue="temp" required />
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
                                                                                    <Form.Control type="text" placeholder="Option A" defaultValue="temp" required />
                                                                                </FloatingLabel>
                                                                            </Col>
                                                                            <Col md={3}>
                                                                                <FloatingLabel controlId={`optionBQuestion${i}`} label="Option B" className="px-1">
                                                                                    <Form.Control type="text" placeholder="Option B" defaultValue="temp" required />
                                                                                </FloatingLabel>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row className="mt-4 d-flex">
                                                                            <Col md={3}>
                                                                                <FloatingLabel controlId={`optionCQuestion${i}`} label="Option C" className="px-1">
                                                                                    <Form.Control type="text" placeholder="Option C" defaultValue="temp" required />
                                                                                </FloatingLabel>
                                                                            </Col>
                                                                            <Col md={3}>
                                                                                <FloatingLabel controlId={`optionDQuestion${i}`} label="Option D" className="px-1">
                                                                                    <Form.Control type="text" placeholder="Option D" defaultValue="temp" required />
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
                                                                                <Form.Control type="text" placeholder="Answer" defaultValue="temp" required />
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
                                    <Button variant="light" size="lg" type="submit" className="custom-button">
                                        Save and Continue
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

/**
 * Fill question information
 */
export default class QuestionInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roundCounter: 1,
            roundDetailsObtained: false,
            errorOccured: false
        }

        this.roundDetails = [];
    }

    getRoundDetails = async () => {
        try {
            const response = await fetch("/quiz/quiz_round_details?quizID=" + this.props.quizEventID, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status !== 200) {
                throw "Failed to Get Round Details";
            };

            const _response = await response.json();

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
            this.setState({
                errorOccured: true
            });
            throw err;
        }
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

    async componentDidMount() {
        if (!this.state.roundDetailsObtained) {
            await this.getRoundDetails();
            this.setState({
                roundDetailsObtained: true
            });
        }
    }

    render() {
        if (this.state.errorOccured) {
            return (
                <p style={{ color: 'red' }}>An error occurred. Check the server log.</p>
            );
        }

        if (!this.state.roundDetailsObtained) {
            return (
                <h3><Spinner animation="border" role="status" />Loading Round Detail...</h3>
            );
        }

        return (
            <QuestionInfoEachRound
                isEdit={this.props.isEdit}
                quizEventName={this.props.quizEventName}
                numOfTeams={this.props.numOfTeams}
                roundDetail={this.roundDetails[this.state.roundCounter - 1]}
                nextRound={() => this.nextRound()}
            />
        );
    }
}

