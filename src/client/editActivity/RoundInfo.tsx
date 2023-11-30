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
  gotRoundsData: boolean;
  currentRounds: RoundType[];
  serverError: boolean;
}

interface RoundInfoProps {
  isNewQuiz: boolean;
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
      gotRoundsData: false,
      currentRounds: [],
      serverError: false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save = async (event: any) => {
    try {
      event.preventDefault();
      event.stopPropagation();

      const form = event.currentTarget;

      // process update of existing rounds
      const updateRounds: RoundType[] = [];
      let count: number = 0;
      for (
        let i = 0;
        i < this.state.currentRounds.length && i < this.props.numOfRounds;
        i++
      ) {
        const round: RoundType = {};

        const inputRoundName = form[`round${i + 1}Name`].value;
        const inputSequenceNumber = i + 1;
        const inputNumQuestionsEachTeam = parseInt(
          form[`round${i + 1}NumQuestions`].value
        );
        const inputFullMarkEachQuestion = parseInt(
          form[`round${i + 1}FullMarkEachQ`].value
        );
        const inputIsMCQ = form[`round${i + 1}IsMCQ`].checked;
        const inputIsAudioVisualRound = form[`round${i + 1}IsAVRound`].checked;
        const inputIsPassable = form[`round${i + 1}IsPassable`].checked;
        const inputTimerSeconds = parseInt(
          form[`round${i + 1}TimerSeconds`].value
        );

        if (inputRoundName !== this.state.currentRounds[i]?.RoundName) {
          round.RoundName = inputRoundName;
        }
        if (
          inputSequenceNumber !== this.state.currentRounds[i]?.SequenceNumber
        ) {
          round.SequenceNumber = inputSequenceNumber;
        }
        if (
          inputNumQuestionsEachTeam !==
          this.state.currentRounds[i]?.NumQuestionsEachTeam
        ) {
          round.NumQuestionsEachTeam = inputNumQuestionsEachTeam;
        }
        if (
          inputFullMarkEachQuestion !==
          this.state.currentRounds[i]?.FullMarkEachQuestion
        ) {
          round.FullMarkEachQuestion = inputFullMarkEachQuestion;
        }
        if (inputIsMCQ !== this.state.currentRounds[i]?.IsMCQ) {
          round.IsMCQ = inputIsMCQ;
        }
        if (
          inputIsAudioVisualRound !==
          this.state.currentRounds[i]?.IsAudioVisualRound
        ) {
          round.IsAudioVisualRound = inputIsAudioVisualRound;
        }
        if (inputIsPassable !== this.state.currentRounds[i]?.IsPassable) {
          round.IsPassable = inputIsPassable;
        }
        if (inputTimerSeconds !== this.state.currentRounds[i]?.TimerSeconds) {
          round.TimerSeconds = inputTimerSeconds;
        }

        if (Object.keys(round).length !== 0) {
          round.UUID = this.state.currentRounds[i].UUID;
          updateRounds.push(round);
        }

        count++;
      }

      // process creation of new rounds
      const createRounds: RoundType[] = [];
      for (let i = count; i < this.props.numOfRounds; i++) {
        const inputRoundName = form[`round${i + 1}Name`].value;
        const inputNumQuestionsEachTeam = parseInt(
          form[`round${i + 1}NumQuestions`].value
        );
        const inputFullMarkEachQuestion = parseInt(
          form[`round${i + 1}FullMarkEachQ`].value
        );
        const inputIsMCQ = form[`round${i + 1}IsMCQ`].checked;
        const inputIsAudioVisualRound = form[`round${i + 1}IsAVRound`].checked;
        const inputIsPassable = form[`round${i + 1}IsPassable`].checked;
        const inputTimerSeconds = parseInt(
          form[`round${i + 1}TimerSeconds`].value
        );

        const round: RoundType = {
          QuizID: this.props.quizID,
          SequenceNumber: i + 1,
          RoundName: inputRoundName,
          NumQuestionsEachTeam: inputNumQuestionsEachTeam,
          FullMarkEachQuestion: inputFullMarkEachQuestion,
          IsMCQ: inputIsMCQ,
          IsAudioVisualRound: inputIsAudioVisualRound,
          IsPassable: inputIsPassable,
          TimerSeconds: inputTimerSeconds,
        };

        createRounds.push(round);
      }

      if (updateRounds.length) {
        const apiEndpoint: string = API_PATH + Endpoint.edit_quiz_rounds;
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Rounds: updateRounds }),
        });
        if (!response.ok) {
          throw `${apiEndpoint} responded ${response.statusText}; HTTP code: ${response.status}`;
        }
      }

      if (createRounds.length) {
        const apiEndpoint: string = API_PATH + Endpoint.create_quiz_rounds;
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Rounds: createRounds }),
        });
        if (!response.ok) {
          throw `${apiEndpoint} responded ${response.statusText}; HTTP code: ${response.status}`;
        }
      }

      this.props.nextStep();
    } catch (error) {
      console.error(error);
      this.setState({
        serverError: true,
      });
    }
  };

  getRoundsData = async () => {
    try {
      const roundApiEndpoint =
        API_PATH + Endpoint.get_quiz_rounds + "?quizID=" + this.props.quizID;
      const roundsResponse = await fetch(roundApiEndpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!roundsResponse.ok) {
        throw `${roundApiEndpoint} responded ${roundsResponse.statusText}; HTTP code: ${roundsResponse.status}`;
      }
      const allRounds: RoundType[] = (await roundsResponse.json()).Rounds || [];
      // in case there are more rounds created earlier, consider only the number specified in Quiz table
      const rounds = allRounds.slice(0, this.props.numOfRounds);

      this.setState({
        currentRounds: rounds,
        gotRoundsData: true,
      });
    } catch (error) {
      console.error(error);
      this.setState({
        serverError: true,
      });
    }
  };

  async componentDidMount() {
    if (!this.props.isNewQuiz && !this.state.gotRoundsData) {
      await this.getRoundsData();
    }
  }

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
              <p className="fs-4 d-inline">
                {this.props.isNewQuiz
                  ? `{ New Quiz | ${this.props.quizEventName} }`
                  : `{ Edit Quiz | ${this.props.quizEventName} }`}
              </p>
            </Col>
          </Row>

          <Form onSubmit={this.save}>
            {/* Render input group for each round */}
            {(() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const rounds: any[] = [];
              for (let i = 0; i < this.props.numOfRounds; i++) {
                const currentRound: RoundType = this.state.currentRounds[i];
                rounds.push(
                  <React.Fragment key={i}>
                    <Row className="mt-5 d-flex">
                      <h5 style={{ color: "grey" }}>{`Round ${
                        i + 1
                      } definition`}</h5>
                    </Row>
                    <Row className="mt-3 d-flex">
                      <Col md={3}>
                        <FloatingLabel
                          controlId={`round${i + 1}Name`}
                          label={"Round Name *Required"}
                          className="px-1"
                        >
                          <Form.Control
                            type="text"
                            placeholder={`Round ${i + 1} Name *Required`}
                            defaultValue={
                              currentRound?.RoundName
                                ? currentRound?.RoundName
                                : ""
                            }
                            required
                          />
                        </FloatingLabel>
                      </Col>
                    </Row>
                    <Row className="mt-3 d-flex">
                      <Col md={3}>
                        <FloatingLabel
                          controlId={`round${i + 1}NumQuestions`}
                          label="No. of questions for each team"
                          className="px-1"
                        >
                          <Form.Select
                            aria-label="Floating label"
                            defaultValue={currentRound?.NumQuestionsEachTeam}
                          >
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
                          label="Maximum mark of each question"
                          className="px-1"
                        >
                          <Form.Select
                            aria-label="Floating label"
                            defaultValue={currentRound?.FullMarkEachQuestion}
                          >
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
                          label="Time limit of each question in seconds"
                          className="px-1"
                        >
                          <Form.Select
                            aria-label="Floating label"
                            defaultValue={currentRound?.TimerSeconds}
                          >
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
                          label="MCQ"
                          defaultChecked={currentRound?.IsMCQ}
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Check
                          type="checkbox"
                          id={`round${i + 1}IsPassable`}
                          label="Questions can be passed"
                          defaultChecked={currentRound?.IsPassable}
                        />
                      </Col>
                      <Col md={3}>
                        <Form.Check
                          type="checkbox"
                          id={`round${i + 1}IsAVRound`}
                          label="Audio/Visual"
                          defaultChecked={currentRound?.IsAudioVisualRound}
                        />
                      </Col>
                    </Row>
                  </React.Fragment>
                );
              }
              return rounds;
            })()}

            <Row className="d-flex justify-content-left border-bottom mt-5"></Row>

            {/* Buttons */}
            <Row className="mt-5 mb-5 d-flex justify-content-center">
              <Col md={3}>
                <Row className="mt-4 mb-4">
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
