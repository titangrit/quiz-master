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
    }


    handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        //@TODO extract the form data and POST to backend
        for (let i = 0; i < this.props.numOfRounds; i++) {
            //@TODO error handling if data is not somehow supplied
        }

        this.props.nextStep();
    };

    handleRoundTypeSelect = (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log("handleRoundTypeSelect");
    }

    render() {

        let roundTypes = [{
            UUID: "NEW",
            Name: "Define New Round Type",
            QFullMark: null,
            IsMCQ: null,
            IsAudioVisual: null,
            TimerSeconds: null,
            IsPassable: null
        }]

        //@TODO get the list of defined round types and append to roundTypes list
        roundTypes.push({
            UUID: "ROUND_X",
            Name: "Round Type X",
            QFullMark: 10,
            IsMCQ: true,
            IsAudioVisual: false,
            TimerSeconds: 30,
            IsPassable: true
        });
        roundTypes.push({
            UUID: "ROUND_X",
            Name: "Round Type Y",
            QFullMark: 10,
            IsMCQ: true,
            IsAudioVisual: true,
            TimerSeconds: 15,
            IsPassable: false
        });

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
                                                        <FloatingLabel controlId={`round${i + 1}`} label={`Round Type`} className="px-1">
                                                            <Form.Select aria-label="Floating label" onChange={this.handleRoundTypeSelect}>
                                                                {/* Show all the defined round types as options */}
                                                                {
                                                                    (
                                                                        () => {
                                                                            let content = [];
                                                                            for (let roundType of roundTypes) {
                                                                                content.push(<option key={roundType.UUID} value={roundType.UUID}>{`${roundType.UUID} (${roundType.Name})`}</option>);
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
                                                        <FloatingLabel controlId={`round${i + 1}TypeName`} label="Round Type Name *Required" className="px-1">
                                                            <Form.Control type="text" placeholder="Round Type Name" required />
                                                        </FloatingLabel>
                                                    </Col>
                                                </Row>
                                                <Row className="mt-3 d-flex">
                                                    <Col md={3}>
                                                        <FloatingLabel controlId={`round${i + 1}NumQuestions`} label="No. of Questions to Each Team" className="px-1">
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
                                                                <option value="120">{`120 (One Twenty)`}</option>
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
            </React.Fragment>
        );
    }
}
