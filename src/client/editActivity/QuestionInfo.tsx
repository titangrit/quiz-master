import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FormLabel } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { API_PATH } from "../common";
import { RoundType, QuestionType, TeamType, Endpoint } from "./../../server";

interface QuestionInfoEachRoundState {
  serverError: boolean;
}

interface QuestionInfoEachRoundProps {
  quizEventName: string;
  numOfTeams: number;
  roundData: RoundType;
  teams: TeamType[];
  nextRound: () => void;
}

/**
 * Fill questions information of each round
 */
class QuestionInfoEachRound extends React.Component<
  QuestionInfoEachRoundProps,
  QuestionInfoEachRoundState
> {
  constructor(props: QuestionInfoEachRoundProps) {
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

      const formData: FormData = new FormData();
      const questions: QuestionType[] = [];

      const totalNumQuestions =
        this.props.numOfTeams * this.props.roundData.NumQuestionsEachTeam!;

      for (let i = 1; i <= totalNumQuestions; i++) {
        let answer: string;
        if (this.props.roundData.IsMCQ) {
          const correctOption = form[`correctOptionQuestion${i}`].value;
          answer = form[`option${correctOption}Question${i}`].value;
        } else {
          answer = form[`answerQuestion${i}`].value;
        }

        const question: QuestionType = {
          RoundUUID: this.props.roundData.UUID!,
          SequenceNumber: i,
          Description: form[`question${i}Statement`].value,
          Option1: form[`optionAQuestion${i}`].value,
          Option2: form[`optionBQuestion${i}`].value,
          Option3: form[`optionCQuestion${i}`].value,
          Option4: form[`optionDQuestion${i}`].value,
          Answer: answer,
          TargetTeamUUID: this.props.teams[i - 1]["UUID"],
        };

        questions.push(question);

        if (this.props.roundData.IsAudioVisualRound) {
          formData.append("Media", form[`mediaQuestion${i}`].files[0], `${i}`);
        }
      }

      formData.append("Questions", JSON.stringify(questions));

      // post new questions
      const apiEndpoint = API_PATH + Endpoint.create_quiz_round_questions;
      const response = await fetch(apiEndpoint, {
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: formData,
      });

      if (!response.ok) {
        throw `${apiEndpoint} responded ${response.statusText}; HTTP code: ${response.status}`;
      }

      this.props.nextRound();
    } catch (error) {
      console.error(error);
      this.setState({
        serverError: true,
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        <Container className="mt-4">
          <Row className="d-inline">
            <Col md="auto" className="d-inline">
              <p className="fs-3 d-inline">{`Provide Questions of Round ${this.props.roundData.SequenceNumber} - ${this.props.roundData.RoundName}`}</p>
            </Col>
            <Col md="auto" className="d-inline">
              <p className="fs-4 d-inline">{`{ New Quiz | ${this.props.quizEventName} }`}</p>
            </Col>
          </Row>

          <Form onSubmit={this.save}>
            {(() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const questions: any[] = [];
              const totalNumQuestions =
                this.props.numOfTeams *
                this.props.roundData.NumQuestionsEachTeam!;
              for (let i = 1; i <= totalNumQuestions; i++) {
                questions.push(
                  <React.Fragment key={i}>
                    {/* Question statement */}
                    <Row className="mt-5 d-flex">
                      <Col md={6}>
                        <Row>
                          <FormLabel
                            style={{ fontWeight: "bold" }}
                          >{`Question ${i}`}</FormLabel>
                          <FloatingLabel
                            controlId={`question${i}Statement`}
                            label={`To team ${
                              i % this.props.numOfTeams
                                ? i % this.props.numOfTeams
                                : this.props.numOfTeams
                            } (${this.props.teams[i - 1]["TeamName"]})`}
                            className="px-1"
                          >
                            <Form.Control
                              as="textarea"
                              placeholder={"Question statement"}
                              style={{ height: "100px" }}
                              defaultValue="temp"
                              required
                            />
                          </FloatingLabel>
                        </Row>
                      </Col>
                    </Row>

                    {/* Audio Visual Media */}
                    {(() => {
                      if (this.props.roundData.IsAudioVisualRound) {
                        return (
                          <Row className="mt-4 d-flex">
                            <Col md={3}>
                              <Form.Group controlId={`mediaQuestion${i}`}>
                                <Form.Label>Select Media File</Form.Label>
                                <Form.Control type="file" required />
                              </Form.Group>
                            </Col>
                          </Row>
                        );
                      } else {
                        return null;
                      }
                    })()}

                    {/* Answer */}
                    {(() => {
                      if (this.props.roundData.IsMCQ) {
                        return (
                          <React.Fragment>
                            <Row className="mt-4 d-flex">
                              <Col md={3}>
                                <FloatingLabel
                                  controlId={`optionAQuestion${i}`}
                                  label="Option A"
                                  className="px-1"
                                >
                                  <Form.Control
                                    type="text"
                                    placeholder="Option A"
                                    defaultValue="temp"
                                    required
                                  />
                                </FloatingLabel>
                              </Col>
                              <Col md={3}>
                                <FloatingLabel
                                  controlId={`optionBQuestion${i}`}
                                  label="Option B"
                                  className="px-1"
                                >
                                  <Form.Control
                                    type="text"
                                    placeholder="Option B"
                                    defaultValue="temp"
                                    required
                                  />
                                </FloatingLabel>
                              </Col>
                            </Row>
                            <Row className="mt-4 d-flex">
                              <Col md={3}>
                                <FloatingLabel
                                  controlId={`optionCQuestion${i}`}
                                  label="Option C"
                                  className="px-1"
                                >
                                  <Form.Control
                                    type="text"
                                    placeholder="Option C"
                                    defaultValue="temp"
                                    required
                                  />
                                </FloatingLabel>
                              </Col>
                              <Col md={3}>
                                <FloatingLabel
                                  controlId={`optionDQuestion${i}`}
                                  label="Option D"
                                  className="px-1"
                                >
                                  <Form.Control
                                    type="text"
                                    placeholder="Option D"
                                    defaultValue="temp"
                                    required
                                  />
                                </FloatingLabel>
                              </Col>
                            </Row>
                            <Row className="mt-4 d-flex">
                              <Col md={3}>
                                <FloatingLabel
                                  controlId={`correctOptionQuestion${i}`}
                                  label="Correct Option"
                                  className="px-1"
                                >
                                  <Form.Select aria-label="Floating label">
                                    <option value="A">{"Option A"}</option>
                                    <option value="B">{"Option B"}</option>
                                    <option value="C">{"Option C"}</option>
                                    <option value="D">{"Option D"}</option>
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
                              <FloatingLabel
                                controlId={`answerQuestion${i}`}
                                label="Answer"
                                className="px-1"
                              >
                                <Form.Control
                                  type="text"
                                  placeholder="Answer"
                                  defaultValue="temp"
                                  required
                                />
                              </FloatingLabel>
                            </Col>
                          </Row>
                        );
                      }
                    })()}
                  </React.Fragment>
                );
              }
              return questions;
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

interface QuestionInfoState {
  currentRound: number;
  gotRoundsData: boolean;
  serverError: boolean;
}

interface QuestionInfoProps {
  quizID: number;
  quizEventName: string;
  numOfTeams: number;
  numOfRounds: number;
  nextStep: () => void;
}

/**
 * Fill questions information
 */
export default class QuestionInfo extends React.Component<
  QuestionInfoProps,
  QuestionInfoState
> {
  private rounds: RoundType[];
  private teams: TeamType[];

  constructor(props: QuestionInfoProps) {
    super(props);

    this.state = {
      currentRound: 1,
      gotRoundsData: false,
      serverError: false,
    };

    this.rounds = [];
    this.teams = [];
  }

  getRoundsData = async () => {
    try {
      const roundsApiEndpoint =
        API_PATH + Endpoint.get_quiz_rounds + "?quizID=" + this.props.quizID;
      const roundsResponse = await fetch(roundsApiEndpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!roundsResponse.ok) {
        throw `${roundsApiEndpoint} responded ${roundsResponse.statusText}; HTTP code: ${roundsResponse.status}`;
      }

      const _roundsResponse = await roundsResponse.json();
      this.rounds = _roundsResponse?.Rounds || [];
      if (this.props.numOfRounds != this.rounds.length) {
        throw "Failed to get rounds data";
      }

      const teamsApiEndpoint =
        API_PATH + Endpoint.get_quiz_teams + "?quizID=" + this.props.quizID;
      const teamsResponse = await fetch(teamsApiEndpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!teamsResponse.ok) {
        throw `${teamsApiEndpoint} responded ${teamsResponse.statusText}; HTTP code: ${teamsResponse.status}`;
      }

      const _teamsResponse = await teamsResponse.json();
      this.teams = _teamsResponse?.Teams || [];
      if (this.props.numOfTeams != this.teams.length) {
        throw "Failed to get teams data";
      }
    } catch (error) {
      console.error(error);
      this.setState({
        serverError: true,
      });
    }
  };

  nextRound = () => {
    const currentRound = this.state.currentRound + 1;
    if (currentRound > this.props.numOfRounds) {
      this.props.nextStep();
    } else {
      this.setState({
        currentRound: currentRound,
      });
    }
  };

  async componentDidMount() {
    if (!this.state.gotRoundsData) {
      await this.getRoundsData();
      this.setState({
        gotRoundsData: true,
      });
    }
  }

  render() {
    if (this.state.serverError) {
      return <p style={{ color: "red" }}>A server error occurred</p>;
    }

    if (!this.state.gotRoundsData) {
      return (
        <React.Fragment>
          <p>Loading rounds data</p>
          <Spinner animation="grow" role="status" />
        </React.Fragment>
      );
    }

    return (
      <QuestionInfoEachRound
        quizEventName={this.props.quizEventName}
        numOfTeams={this.props.numOfTeams}
        roundData={this.rounds[this.state.currentRound - 1]}
        teams={this.teams}
        nextRound={this.nextRound}
      />
    );
  }
}
