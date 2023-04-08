import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NewQuiz.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FormLabel } from "react-bootstrap";

/**
 * Fill round information
 */
export default class RoundInfo extends React.Component {
    constructor(props) {
        super(props);

        this.newRoundTypeID = "NEW";
        this.newRoundTypeName = "Define New Round Type";

        this.roundTypes = [{
            ID: this.newRoundTypeID,
            Name: this.newRoundTypeName,
            NumQuestions: 1,
            QFullMark: 10,
            IsMCQ: true,
            IsAudioVisual: false,
            TimerSeconds: 60,
            IsPassable: true
        }];

        this.getRoundTypes();

    }

    handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;

        // extract the form data
        const roundsInfo = [];
        for (let i = 0; i < this.props.numOfRounds; i++) {
            const _roundInfo = {};
            const roundTypeID = form[`round${i + 1}`].value;
            if (roundTypeID === this.newRoundTypeID) {
                _roundInfo.RoundTypeID = form[`round${i + 1}TypeID`].value;
                _roundInfo.RoundTypeName = form[`round${i + 1}TypeName`].value;
                _roundInfo.NumQuestionsEachTeam = form[`round${i + 1}NumQuestions`].value;
                _roundInfo.FullMarkEachQuestion = form[`round${i + 1}FullMarkEachQ`].value;
                _roundInfo.IsMCQ = form[`round${i + 1}IsMCQ`].value;
                _roundInfo.IsAVRound = form[`round${i + 1}IsAVRound`].value;
                _roundInfo.IsPassable = form[`round${i + 1}IsPassable`].value;
                _roundInfo.TimerSeconds = form[`round${i + 1}TimerSeconds`].value;
            } else {
                _roundInfo.RoundTypeID = roundTypeID;
            }

            roundsInfo.push(_roundInfo);
        }

        // POST the data to server
        try {
            const response = await fetch("/quiz/round_info", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(roundsInfo)
            });

            const _response = await response.json();
            assert(_response.status === 200);

            this.props.nextStep();

        } catch (err) {
            console.error(err);
        }
    };

    handleRoundTypeSelect = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const select = event.currentTarget;
        const index = select.id[5]; // to get the X in controlId "roundX"
        const selectedRoundID = select.value;

        const round = this.roundTypes.find((round) => { if (round.ID === select.value) { return true; } });

        const numQuestions = document.getElementById(`round${index}NumQuestions`);
        numQuestions.value = round.NumQuestions;
        numQuestions.disabled = selectedRoundID == this.newRoundTypeID ? false : true;

        const fullMark = document.getElementById(`round${index}FullMarkEachQ`);
        fullMark.value = round.QFullMark;
        fullMark.disabled = selectedRoundID == this.newRoundTypeID ? false : true;

        const timerSeconds = document.getElementById(`round${index}TimerSeconds`);
        timerSeconds.value = round.TimerSeconds;
        timerSeconds.disabled = selectedRoundID == this.newRoundTypeID ? false : true;

        const isMCQ = document.getElementById(`round${index}IsMCQ`);
        isMCQ.checked = round.IsMCQ;
        isMCQ.disabled = selectedRoundID == this.newRoundTypeID ? false : true;

        const isPassable = document.getElementById(`round${index}IsPassable`);
        isPassable.checked = round.IsPassable;
        isPassable.disabled = selectedRoundID == this.newRoundTypeID ? false : true;

        const isAVRound = document.getElementById(`round${index}IsAVRound`);
        isAVRound.checked = round.IsAudioVisual;
        isAVRound.disabled = selectedRoundID == this.newRoundTypeID ? false : true;

        const roundTypeID = document.getElementById(`round${index}TypeID`);
        roundTypeID.value = round.ID;
        roundTypeID.disabled = selectedRoundID == this.newRoundTypeID ? false : true;

        const roundTypeName = document.getElementById(`round${index}TypeName`);
        roundTypeName.value = round.Name;
        roundTypeName.disabled = selectedRoundID == this.newRoundTypeID ? false : true;
    }

    //@TODO get the list of defined round types and append to this.roundTypes list
    getRoundTypes = () => {
        this.roundTypes.push({
            ID: "ROUND_X",
            Name: "Round Type X",
            NumQuestions: 3,
            QFullMark: 10,
            IsMCQ: true,
            IsAudioVisual: false,
            TimerSeconds: 60,
            IsPassable: true
        });
        this.roundTypes.push({
            ID: "ROUND_Y",
            Name: "Round Type Y",
            NumQuestions: 4,
            QFullMark: 10,
            IsMCQ: true,
            IsAudioVisual: true,
            TimerSeconds: 15,
            IsPassable: false
        });
    }

    render() {
        return (
            <React.Fragment>
                <Container className="mt-4">
                    <Row className="d-inline">
                        <Col md="auto" className="d-inline">
                            <p className="fs-3 d-inline">Quiz Rounds Detail </p>
                        </Col>
                        <Col md="auto" className="d-inline">
                            <p className="fs-4 d-inline">{`{ New Quiz | ${this.props.quizEventName} }`}</p>
                        </Col>
                    </Row>

                    <Form onSubmit={this.handleSubmit}>
                        {/* Render input group for each round */}
                        {
                            (
                                () => {
                                    let content = [];
                                    for (let i = 0; i < this.props.numOfRounds; i++) {
                                        content.push(
                                            <React.Fragment key={i}>
                                                <Row className="mt-5 d-flex">
                                                    <Col md={3}>
                                                        <FormLabel style={{ fontWeight: 'bold' }}>{`Round ${i + 1} Detail`}</FormLabel>
                                                        <FloatingLabel controlId={`round${i + 1}`} label={`Round Type ID (Round Type Name)`} className="px-1">
                                                            <Form.Select aria-label="Floating label" onChange={this.handleRoundTypeSelect}>
                                                                {/* Show all the defined round types as options */}
                                                                {
                                                                    (
                                                                        () => {
                                                                            let content = [];
                                                                            for (let roundType of this.roundTypes) {
                                                                                content.push(<option key={roundType.ID} value={roundType.ID}>{`${roundType.ID} (${roundType.Name})`}</option>);
                                                                            }
                                                                            return content;
                                                                        }
                                                                    )()
                                                                }
                                                            </Form.Select>
                                                        </FloatingLabel>
                                                    </Col>
                                                </Row>
                                                <Row className="mt-3 d-flex">
                                                    <Col md={3}>
                                                        <FloatingLabel controlId={`round${i + 1}TypeID`} label="Round Type ID *Required" className="px-1">
                                                            <Form.Control type="text" placeholder="Round Type ID" required />
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col md={3}>
                                                        <FloatingLabel controlId={`round${i + 1}TypeName`} label="Round Type Name *Required" className="px-1">
                                                            <Form.Control type="text" placeholder="Round Type Name" required />
                                                        </FloatingLabel>
                                                    </Col>
                                                </Row>
                                                <Row className="mt-3 d-flex">
                                                    <Col md={3}>
                                                        <FloatingLabel controlId={`round${i + 1}NumQuestions`} label="No. of Questions for Each Team" className="px-1">
                                                            <Form.Select aria-label="Floating label">
                                                                <option value="1">{`1 (One)`}</option>
                                                                <option value="2">{`2 (Two)`}</option>
                                                                <option value="3">{`3 (Three)`}</option>
                                                                <option value="4">{`4 (Four)`}</option>
                                                                <option value="5">{`5 (Five)`}</option>
                                                                <option value="6">{`6 (Six)`}</option>
                                                            </Form.Select>
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col md={3}>
                                                        <FloatingLabel controlId={`round${i + 1}FullMarkEachQ`} label="Full Mark for Each Question" className="px-1">
                                                            <Form.Select aria-label="Floating label">
                                                                <option value="10">{`10 (Ten)`}</option>
                                                                <option value="5">{`5 (Five)`}</option>
                                                                <option value="15">{`15 (Fifteen)`}</option>
                                                                <option value="20">{`20 (Twenty)`}</option>
                                                            </Form.Select>
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col md={3}>
                                                        <FloatingLabel controlId={`round${i + 1}TimerSeconds`} label="Allowed Time in Seconds" className="px-1">
                                                            <Form.Select aria-label="Floating label">
                                                                <option value="60">{`60 (Sixty)`}</option>
                                                                <option value="15">{`15 (Fifteen)`}</option>
                                                                <option value="90">{`90 (Ninety)`}</option>
                                                                <option value="120">{`120 (One Hundred Twenty)`}</option>
                                                            </Form.Select>
                                                        </FloatingLabel>
                                                    </Col>
                                                </Row>
                                                <Row className="mt-3 d-flex">
                                                    <Col md={3}>
                                                        <Form.Check
                                                            type="checkbox"
                                                            id={`round${i + 1}IsMCQ`}
                                                            label="Multiple Choice Questions"
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Check
                                                            type="checkbox"
                                                            id={`round${i + 1}IsPassable`}
                                                            label="Pass Questions"
                                                        />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Check
                                                            type="checkbox"
                                                            id={`round${i + 1}IsAVRound`}
                                                            label="Audio/Visual Round"
                                                        />
                                                    </Col>
                                                </Row>
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
