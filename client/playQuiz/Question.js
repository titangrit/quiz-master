import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';

export default class Question extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            targetTeamIndex: this.props.targetTeamIndex,
            nextTeamIndex: null
        }
        this.answer = null;
        this.state.nextTeamIndex = this.props.targetTeamIndex + 1 === this.props.quizInfo.NumberOfTeams ? 0 : this.state.targetTeamIndex + 1;
    }

    optionSelected = (option) => {
        const eleOptionA = document.getElementById(`optionA`);
        eleOptionA.color = "#F0F8FF";
        const eleOptionB = document.getElementById(`optionB`);
        eleOptionB.variant = "#F0F8FF";
        const eleOptionC = document.getElementById(`optionC`);
        eleOptionC.variant = "#F0F8FF";
        const eleOptionD = document.getElementById(`optionD`);
        eleOptionD.variant = "#F0F8FF";

        switch (option) {
            case "A":
                this.answer = this.props.question.Option1;
                eleOptionA.color = "#00FFFF";
                break;

            case "B":
                this.answer = this.props.question.Option2;
                eleOptionB.color = "#00FFFF";
                break;

            case "C":
                this.answer = this.props.question.Option3;
                eleOptionC.color = "#00FFFF";
                break;

            case "D":
                this.answer = this.props.question.Option4;
                eleOptionD.color = "#00FFFF";
                break;
        }
    }

    render() {
        return (
            <React.Fragment>
                <Container className="mt-4">
                    <Row className="d-inline mb-4">
                        <Col md="auto" className="d-inline">
                            <p className="fs-3 d-inline">{`Round ${this.props.round.SequenceNumber} - ${this.props.roundTypeInfo.RoundTypeName}`}</p>
                        </Col>
                        <Col md="auto" className="d-inline">
                            <p className="fs-4 d-inline">{`{ ${this.props.quizInfo.QuizEventName} }`}</p>
                        </Col>
                    </Row>

                    <Row className="d-inline">
                        <Col md="auto" className="d-inline">
                            <p className="fs-3 d-inline">{`Question ${this.props.question.SequenceNumber} | For ${this.props.quizInfo.TeamNames[this.state.targetTeamIndex]}`}</p>
                        </Col>
                    </Row>

                    <Row className="mt-5 d-flex">
                        {/* Question pane */}
                        <Col md={4}>
                            <p><span style={{ fontWeight: 'bold' }}>{`${this.props.question.Description}`}</span></p>

                            {this.props.roundTypeInfo.IsMCQ &&
                                <React.Fragment>
                                    <Image
                                        src={`data:image/gif;base64,${this.props.question.MediaBase64}`}
                                    />
                                </React.Fragment>
                            }
                        </Col>

                        {/* Answer pane */}
                        <Col md={4}>
                            {/* Answer input */}
                            <Row>
                                {/* MCQ */}
                                {this.props.roundTypeInfo.IsMCQ &&
                                    <React.Fragment>
                                        {/* Option A */}
                                        <Button
                                            variant="light"
                                            size="lg"
                                            type="button"
                                            className="custom-button"
                                            controlId={`optionA`}
                                            onClick={() => { this.optionSelected("A") }}
                                        >
                                            {`A)  ${this.props.question.Option1}`}
                                        </Button>

                                        {/* Option B */}
                                        <Button
                                            variant="light"
                                            size="lg"
                                            type="button"
                                            className="custom-button"
                                            controlId={`optionB`}
                                            onClick={() => { this.optionSelected("B") }}
                                        >
                                            {`B)  ${this.props.question.Option2}`}
                                        </Button>

                                        {/* Option C */}
                                        <Button
                                            variant="light"
                                            size="lg"
                                            type="button"
                                            className="custom-button"
                                            controlId={`optionC`}
                                            onClick={() => { this.optionSelected("C") }}
                                        >
                                            {`C)  ${this.props.question.Option3}`}
                                        </Button>

                                        {/* Option D */}
                                        <Button
                                            variant="light"
                                            size="lg"
                                            type="button"
                                            className="custom-button"
                                            controlId={`optionD`}
                                            onClick={() => { this.optionSelected("D") }}
                                        >
                                            {`D)  ${this.props.question.Option4}`}
                                        </Button>
                                    </React.Fragment>
                                }
                                {/* Direct answer */}
                                {!this.props.roundTypeInfo.IsMCQ &&
                                    <React.Fragment>
                                        <p id="reveal-answer" hidden><span style={{ fontWeight: 'bold' }}>{`Answer: ${this.props.question.Answer}`}</span></p>
                                    </React.Fragment>
                                }
                            </Row>
                            {/* Action buttons */}
                            <Row>
                                {/* MCQ */}
                                {this.props.roundTypeInfo.IsMCQ &&
                                    <React.Fragment>
                                        <Col md={3}>
                                            <Row className="mt-5 mb-5">
                                                <Button
                                                    variant="light"
                                                    size="lg"
                                                    type="button"
                                                    className="custom-button"
                                                    controlId={`mcqButton`}
                                                    onClick={() => { this.props.nextStep() }}
                                                >
                                                    {`Submit Answer 〉`}
                                                </Button>
                                            </Row>
                                        </Col>
                                    </React.Fragment>
                                }

                                {/* Direct answer */}
                                {!this.props.roundTypeInfo.IsMCQ &&
                                    <React.Fragment>
                                        <Col md={3}>
                                            <Row className="mt-5 mb-5">
                                                <Button
                                                    variant="light"
                                                    size="lg"
                                                    type="button"
                                                    className="custom-button"
                                                    controlId={`directAnsButton1`}
                                                    onClick={() => { this.props.nextStep() }}
                                                >
                                                    {this.props.roundTypeInfo.IsPassable ? `Pass to team ${this.props.quizInfo.TeamNames[this.state.nextTeamIndex]}` : `Reveal Answer`}
                                                </Button>
                                            </Row>
                                            <Row className="mt-5 mb-5">
                                                <Button
                                                    variant="light"
                                                    size="lg"
                                                    type="button"
                                                    className="custom-button"
                                                    controlId={`directAnsButton2`}
                                                    onClick={() => { this.props.nextStep() }}
                                                >
                                                    {`Correctly Answered 〉`}
                                                </Button>
                                            </Row>
                                        </Col>
                                    </React.Fragment>
                                }

                            </Row>

                        </Col>

                        {/* Timer pane */}
                        <Col md={2}>

                        </Col>
                    </Row>
                </Container >
            </React.Fragment>
        );
    }
}