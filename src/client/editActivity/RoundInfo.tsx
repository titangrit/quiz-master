import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { API_PATH } from "../common";
import { RoundType, Endpoint } from "./../../server";

interface RoundInfoState {
  serverError: boolean;
}

interface RoundInfoProps {
  quizID: number;
  quizEventName: string;
  numOfRounds: number;
  nextStep: () => void;
}

/**
 * Fill quiz rounds information
 */
export default class RoundInfo extends React.Component<
  RoundInfoProps,
  RoundInfoState
> {
  constructor(props: RoundInfoProps) {
    super(props);

    this.state = {
      serverError: false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save = async (event: any) => {
    try {
      event.preventDefault();
      event.stopPropagation();

      const form = event.currentTarget;

      // extract the form data
      const rounds: RoundType[] = [];
      for (let i = 0; i < this.props.numOfRounds; i++) {
        const round: RoundType = {
          QuizID: this.props.quizID,
          RoundName: form[`round${i + 1}Name`].value,
          SequenceNumber: i + 1,
          NumQuestionsEachTeam: form[`round${i + 1}NumQuestions`].value,
          FullMarkEachQuestion: form[`round${i + 1}FullMarkEachQ`].value,
          IsMCQ: form[`round${i + 1}IsMCQ`].checked,
          IsAudioVisualRound: form[`round${i + 1}IsAVRound`].checked,
          IsPassable: form[`round${i + 1}IsPassable`].checked,
          TimerSeconds: form[`round${i + 1}TimerSeconds`].value,
        };

        rounds.push(round);
      }

      // post new rounds
      const apiEndpoint = API_PATH + Endpoint.create_quiz_teams;
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Rounds: rounds }),
      });

      if (!response.ok) {
        throw `${apiEndpoint} responded ${response.statusText}; HTTP code: ${response.status}`;
      }

      this.props.nextStep();
    } catch (error) {
      console.error(error);
      this.setState({
        serverError: true,
      });
    }
  };

  render() {
    if (this.state.serverError) {
      return <p style={{ color: "red" }}>A server error occurred</p>;
    }

    return (
      <React.Fragment>
        <Container className="mt-4">
          <Row className="d-inline">
            <Col md="auto" className="d-inline">
              <p className="fs-3 d-inline">Provide Quiz Rounds Detail </p>
            </Col>
            <Col md="auto" className="d-inline">
              <p className="fs-4 d-inline">{`{ New Quiz | ${this.props.quizEventName} }`}</p>
            </Col>
          </Row>

          <Form onSubmit={this.save}>
            {/* Render input group for each round */}
            {(() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const rounds: any[] = [];
              for (let i = 0; i < this.props.numOfRounds; i++) {
                rounds.push(
                  <React.Fragment key={i}>
                    <Row className="mt-5 d-flex">
                      <Col md={3}>
                        <p style={{ fontWeight: "bold" }}>{`Round ${i + 1}`}</p>
                      </Col>
                    </Row>
                    <Row className="mt-3 d-flex">
                      <Col md={3}>
                        <FloatingLabel
                          controlId={`round${i + 1}Name`}
                          label={`Round ${i + 1} Name *Required`}
                          className="px-1"
                        >
                          <Form.Control
                            type="text"
                            placeholder={`Round ${i + 1} Name *Required`}
                            required
                          />
                        </FloatingLabel>
                      </Col>
                    </Row>
                    <Row className="mt-3 d-flex">
                      <Col md={3}>
                        <FloatingLabel
                          controlId={`round${i + 1}NumQuestions`}
                          label="No. of Questions for Each Team"
                          className="px-1"
                        >
                          <Form.Select aria-label="Floating label">
                            <option value="1">{"1 (One)"}</option>
                            <option value="2">{"2 (Two)"}</option>
                            <option value="3">{"3 (Three)"}</option>
                            <option value="4">{"4 (Four)"}</option>
                            {/* <option value="5">{"5 (Five)"}</option>
                            <option value="6">{"6 (Six)"}</option> */}
                          </Form.Select>
                        </FloatingLabel>
                      </Col>
                      <Col md={3}>
                        <FloatingLabel
                          controlId={`round${i + 1}FullMarkEachQ`}
                          label="Full Mark of Each Question"
                          className="px-1"
                        >
                          <Form.Select aria-label="Floating label">
                            <option value="10">{"10 (Ten)"}</option>
                            <option value="5">{"5 (Five)"}</option>
                            <option value="15">{"15 (Fifteen)"}</option>
                            <option value="20">{"20 (Twenty)"}</option>
                          </Form.Select>
                        </FloatingLabel>
                      </Col>
                      <Col md={3}>
                        <FloatingLabel
                          controlId={`round${i + 1}TimerSeconds`}
                          label="Maximum Time for Each Question in Seconds"
                          className="px-1"
                        >
                          <Form.Select aria-label="Floating label">
                            <option value="60">{"60 (Sixty)"}</option>
                            <option value="15">{"15 (Fifteen)"}</option>
                            <option value="90">{"90 (Ninety)"}</option>
                            <option value="120">
                              {"120 (One Hundred Twenty)"}
                            </option>
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
                          label="Questions Pass to Next Team"
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
                );
              }
              return rounds;
            })()}
            {/* Buttons */}
            <Row className="mt-5 mb-5 d-flex justify-content-center">
              <Col md={3}>
                <Row className="mb-4">
                  <Button
                    variant="light"
                    size="lg"
                    type="submit"
                    className="custom-button"
                  >
                    Save and Continue
                  </Button>
                </Row>

                <Row className="mb-6">
                  <Button
                    variant="danger"
                    size="lg"
                    type="button"
                    className="custom-button"
                    onClick={() => {
                      window.location.replace("/");
                    }}
                  >
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
