import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';

/**
 * Fill round information
 */
export default class RoundInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roundTypesObtained: false,
            currentRoundsObtained: false,
            errorOccured: false
        }

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

        this.currentRounds = [];

        if (!this.props.isEdit) {
            // New quiz, no need to try to obtain existing round data
            this.state.currentRoundsObtained = true;
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;

        // extract the form data
        const roundsInfo = {
            QuizID: this.props.quizEventID,
            Rounds: []
        };

        let sendModifyRequest = false;

        for (let i = 0; i < this.props.numOfRounds; i++) {

            const roundTypeID = form[`round${i + 1}`].value;

            const currentRound = this.currentRounds.find(round => round.SequenceNumber == i + 1);
            if (this.props.isEdit && roundTypeID === currentRound?.RoundTypeID) {
                // No change in round type for this round
                continue;
            }

            const _roundInfo = {};
            if (this.props.isEdit) {
                // Existing round will come with its UUID
                _roundInfo.UUID = currentRound?.UUID;
            }

            if (roundTypeID === this.newRoundTypeID) {
                _roundInfo.SequenceNumber = i + 1;
                _roundInfo.RoundTypeID = form[`round${i + 1}TypeID`].value;
                _roundInfo.RoundTypeName = form[`round${i + 1}TypeName`].value;
                _roundInfo.NumQuestionsEachTeam = form[`round${i + 1}NumQuestions`].value;
                _roundInfo.FullMarkEachQuestion = form[`round${i + 1}FullMarkEachQ`].value;
                _roundInfo.IsMCQ = form[`round${i + 1}IsMCQ`].checked;
                _roundInfo.IsAVRound = form[`round${i + 1}IsAVRound`].checked;
                _roundInfo.IsPassable = form[`round${i + 1}IsPassable`].checked;
                _roundInfo.TimerSeconds = form[`round${i + 1}TimerSeconds`].value;
            } else {
                _roundInfo.SequenceNumber = i + 1;
                _roundInfo.RoundTypeID = roundTypeID;
            }

            roundsInfo.Rounds.push(_roundInfo);
            sendModifyRequest = true;
        }

        // POST the data to server
        try {
            if (sendModifyRequest) {
                const response = await fetch("/quiz/round_info", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(roundsInfo)
                });

                if (response.status !== 200) {
                    this.setState({
                        errorOccured: true
                    });
                    throw "Failed to Set Round Info";
                };
            }

            this.props.nextStep();

        } catch (err) {
            this.setState({
                errorOccured: true
            });
            throw err;
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
        roundTypeID.value = selectedRoundID == this.newRoundTypeID ? '' : round.ID;
        roundTypeID.disabled = selectedRoundID == this.newRoundTypeID ? false : true;

        const roundTypeName = document.getElementById(`round${index}TypeName`);
        roundTypeName.value = selectedRoundID == this.newRoundTypeID ? '' : round.Name;
        roundTypeName.disabled = selectedRoundID == this.newRoundTypeID ? false : true;
    }

    /**
     * Get the list of defined round types and append to this.roundTypes list
     */
    getRoundTypes = async () => {
        try {
            const response = await fetch("/quiz/round_types", {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status !== 200) {
                throw "Failed to Get Available Round Types";
            };

            const _response = await response.json();

            for (let roundType of _response.RoundTypes) {
                let _type = {
                    ID: roundType.RoundTypeID,
                    Name: roundType.RoundTypeName,
                    NumQuestions: roundType.NumQuestionsEachTeam,
                    QFullMark: roundType.FullMarkEachQuestion,
                    IsMCQ: roundType.IsMCQ,
                    IsAudioVisual: roundType.IsAVRound,
                    TimerSeconds: roundType.TimerSeconds,
                    IsPassable: roundType.IsPassable
                }
                this.roundTypes.push(_type);
            }
        } catch (err) {
            this.setState({
                errorOccured: true
            });
            throw err;
        }
    }

    /**
     * In case of edit, get the current rounds of quiz
     */
    getCurrentRounds = async () => {
        try {
            const response = await fetch("/quiz/rounds?quizID=" + this.props.quizEventID, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                this.currentRounds = await response.json();
            } else if (response.status === 404) {
                // Do nothing
            } else {
                throw "Failed to Get Current Rounds";
            };

        } catch (err) {
            this.setState({
                errorOccured: true
            });
            throw err;
        }
    }

    async componentDidMount() {
        if (!this.state.currentRoundsObtained) {
            await this.getCurrentRounds();
        }

        if (!this.state.roundTypesObtained) {
            await this.getRoundTypes();
        }

        this.setState({
            currentRoundsObtained: true,
            roundTypesObtained: true
        })
    }

    componentDidUpdate() {
        if (this.props.isEdit && this.state.roundTypesObtained && this.state.currentRoundsObtained) {
            for (let i = 0; i < this.props.numOfRounds; i++) {
                const round = this.currentRounds.find(round => round.SequenceNumber == i + 1);
                if (!round) {
                    break;
                }
                const selection = document.getElementById(`round${i + 1}`);
                selection.value = round.RoundTypeID;

                const e = new Event("change", { bubbles: true });
                selection.dispatchEvent(e);
            }
        }
    }

    render() {
        if (this.state.errorOccured) {
            return (
                <p style={{ color: 'red' }}>An error occurred. Check the server log.</p>
            );
        }

        if (!this.state.roundTypesObtained || !this.state.currentRoundsObtained) {
            return (
                <h3><Spinner animation="border" role="status" /> Loading Rounds...</h3>
            );
        }

        return (
            <React.Fragment>
                <Container className="mt-4">
                    <Row className="d-flex mb-5">
                        <Col md="auto" className="d-inline">
                            <p className="fs-3 d-inline">Quiz Rounds Detail </p>
                        </Col>
                        <Col md="auto" className="d-inline">
                            <p className="fs-4 d-inline">{!!this.props.isEdit ? `{ Edit Quiz | ${this.props.quizEventName} }` : `{ New Quiz | ${this.props.quizEventName} }`}</p>
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
                                                <Card key={i} className="mb-4" bg="light">
                                                    <Card.Header style={{ fontWeight: 'bold' }}>{`Round ${i + 1}`}</Card.Header>
                                                    <Card.Body>
                                                        <Row className="d-flex">
                                                            <Col md={3}>
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
                                                    </Card.Body>
                                                </Card>
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

                                <Row className="mb-4">
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
