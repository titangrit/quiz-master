import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Image from "react-bootstrap/Image";
import { API_PATH } from "../common";
import {
  RoundType,
  QuestionType,
  TeamType,
  Endpoint,
  MediaType,
} from "./../../server";

interface QuestionInfoEachRoundState {
  gotRoundQuestionsData: boolean;
  currentRoundQuestions: QuestionType[];
  serverError: boolean;
}

interface QuestionInfoEachRoundProps {
  isNewQuiz: boolean;
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
      gotRoundQuestionsData: false,
      currentRoundQuestions: [],
      serverError: false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save = async (event: any) => {
    try {
      event.preventDefault();
      event.stopPropagation();

      const form = event.currentTarget;

      const totalNumQuestions =
        this.props.numOfTeams * this.props.roundData.NumQuestionsEachTeam!;

      // process update of existing questions
      const updateFormData: FormData = new FormData();
      const updateQuestions: QuestionType[] = [];
      let count: number = 1;
      for (
        let i = 1;
        i <= this.state.currentRoundQuestions.length && i <= totalNumQuestions;
        i++
      ) {
        const question: QuestionType = {};

        const teamIndex =
          i % this.props.numOfTeams
            ? i % this.props.numOfTeams
            : this.props.numOfTeams;
        const targetTeamUUID = this.props.teams[teamIndex - 1]["UUID"];
        if (
          targetTeamUUID !==
          this.state.currentRoundQuestions[i - 1]?.TargetTeamUUID
        ) {
          question.TargetTeamUUID = targetTeamUUID;
        }

        const inputDesc = form[`question${i}Statement`].value;
        if (
          inputDesc !== this.state.currentRoundQuestions[i - 1]?.Description
        ) {
          question.Description = inputDesc;
        }

        if (this.props.roundData.IsMCQ) {
          const inputOption1 = form[`optionAQuestion${i}`].value;
          const inputOption2 = form[`optionBQuestion${i}`].value;
          const inputOption3 = form[`optionCQuestion${i}`].value;
          const inputOption4 = form[`optionDQuestion${i}`].value;

          const correctOption = form[`correctOptionQuestion${i}`].value;
          const inputAnswer = form[`option${correctOption}Question${i}`].value;

          if (
            inputOption1 !== this.state.currentRoundQuestions[i - 1]?.Option1
          ) {
            question.Option1 = inputOption1;
          }
          if (
            inputOption2 !== this.state.currentRoundQuestions[i - 1]?.Option2
          ) {
            question.Option2 = inputOption2;
          }
          if (
            inputOption3 !== this.state.currentRoundQuestions[i - 1]?.Option3
          ) {
            question.Option3 = inputOption3;
          }
          if (
            inputOption4 !== this.state.currentRoundQuestions[i - 1]?.Option4
          ) {
            question.Option4 = inputOption4;
          }
          if (inputAnswer !== this.state.currentRoundQuestions[i - 1]?.Answer) {
            question.Answer = inputAnswer;
          }
        } else {
          const inputAnswer = form[`answerQuestion${i}`].value;
          if (inputAnswer !== this.state.currentRoundQuestions[i - 1]?.Answer) {
            question.Answer = inputAnswer;
          }
        }

        const inputFile = form[`mediaQuestion${i}`].files[0];
        let mediaUpdated = false;
        if (this.props.roundData.IsAudioVisualRound && inputFile) {
          const imageBase64: string = await this.toBase64(inputFile);
          const inputMedia = imageBase64?.split(",")[1]; // to remove the first part from "data:image/jpeg;base64,/contentblahblahblah"
          if (
            inputMedia !==
            this.state.currentRoundQuestions[i - 1].MediaBase64?.toString()
          ) {
            updateFormData.append(
              "Media",
              form[`mediaQuestion${i}`].files[0],
              `${i}`
            );
            mediaUpdated = true;
          }
        }

        if (Object.keys(question).length !== 0 || mediaUpdated) {
          question.UUID = this.state.currentRoundQuestions[i - 1].UUID;
          question.SequenceNumber = i; // if media is updated, sequence number is required to find the corresponding media
          updateQuestions.push(question);
        }

        count++;
      }

      updateFormData.append("Questions", JSON.stringify(updateQuestions));

      // process creation of new questions
      const createQuestions: QuestionType[] = [];
      const createFormData: FormData = new FormData();
      for (let i = count; i <= totalNumQuestions; i++) {
        const question: QuestionType = {
          RoundUUID: this.props.roundData.UUID,
          SequenceNumber: i,
        };
        const teamIndex =
          i % this.props.numOfTeams
            ? i % this.props.numOfTeams
            : this.props.numOfTeams;
        const targetTeamUUID = this.props.teams[teamIndex - 1]["UUID"];
        question.TargetTeamUUID = targetTeamUUID;

        const inputDesc = form[`question${i}Statement`].value;
        question.Description = inputDesc;

        if (this.props.roundData.IsMCQ) {
          const inputOption1 = form[`optionAQuestion${i}`].value;
          const inputOption2 = form[`optionBQuestion${i}`].value;
          const inputOption3 = form[`optionCQuestion${i}`].value;
          const inputOption4 = form[`optionDQuestion${i}`].value;
          const correctOption = form[`correctOptionQuestion${i}`].value;
          const inputAnswer = form[`option${correctOption}Question${i}`].value;

          question.Option1 = inputOption1;
          question.Option2 = inputOption2;
          question.Option3 = inputOption3;
          question.Option4 = inputOption4;
          question.Answer = inputAnswer;
        } else {
          const inputAnswer = form[`answerQuestion${i}`].value;
          question.Answer = inputAnswer;
        }

        createQuestions.push(question);
        if (this.props.roundData.IsAudioVisualRound) {
          createFormData.append(
            "Media",
            form[`mediaQuestion${i}`].files[0],
            `${i}`
          );
        }
      }

      createFormData.append("Questions", JSON.stringify(createQuestions));

      if (updateQuestions.length !== 0) {
        const apiEndpoint: string =
          API_PATH + Endpoint.edit_quiz_round_questions;
        const response = await fetch(apiEndpoint, {
          method: "POST",
          // headers: { "Content-Type": "application/json" },
          body: updateFormData,
        });
        if (!response.ok) {
          throw `${apiEndpoint} responded ${response.statusText}; HTTP code: ${response.status}`;
        }
      }

      if (createQuestions.length !== 0) {
        const apiEndpoint: string =
          API_PATH + Endpoint.create_quiz_round_questions;
        const response = await fetch(apiEndpoint, {
          method: "POST",
          // headers: { "Content-Type": "application/json" },
          body: createFormData,
        });
        if (!response.ok) {
          throw `${apiEndpoint} responded ${response.statusText}; HTTP code: ${response.status}`;
        }
      }

      this.props.nextRound();
    } catch (error) {
      console.error(error);
      this.setState({
        serverError: true,
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toBase64 = (file: any): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  previewImage = async (eventCurrentTarget: any) => {
    const elementId = eventCurrentTarget.id;
    const file = eventCurrentTarget.files[0];
    const base64 = await this.toBase64(file);

    const imageComp = document.getElementById(elementId + "ImagePreview");
    const videoComp = document.getElementById(elementId + "VideoPreview");
    const audioComp = document.getElementById(elementId + "AudioPreview");
    const mediaType = file.type.split("/")[0];
    if (mediaType === MediaType.Image) {
      imageComp!.removeAttribute("hidden");
      imageComp!.setAttribute("src", `${base64}`);

      videoComp!.setAttribute("hidden", "true");
      audioComp!.setAttribute("hidden", "true");
    } else if (mediaType === MediaType.Video) {
      videoComp!.removeAttribute("hidden");
      videoComp!.setAttribute("src", `${base64}`);

      imageComp!.setAttribute("hidden", "true");
      audioComp!.setAttribute("hidden", "true");
    } else if (mediaType === MediaType.Audio) {
      audioComp!.removeAttribute("hidden");
      audioComp!.setAttribute("src", `${base64}`);

      imageComp!.setAttribute("hidden", "true");
      videoComp!.setAttribute("hidden", "true");
    }
  };

  getRoundQuestionsData = async () => {
    try {
      const questionApiEndpoint =
        API_PATH +
        Endpoint.get_quiz_round_questions +
        "?roundUUID=" +
        this.props.roundData.UUID;
      const questionsResponse = await fetch(questionApiEndpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!questionsResponse.ok) {
        throw `${questionApiEndpoint} responded ${questionsResponse.statusText}; HTTP code: ${questionsResponse.status}`;
      }
      const allQuestions: QuestionType[] =
        (await questionsResponse.json()).Questions || [];

      const numOfQuestions =
        this.props.roundData.NumQuestionsEachTeam! * this.props.numOfTeams;

      // in case there are more round questions created earlier, consider only up to the required
      const questions = allQuestions.slice(0, numOfQuestions);

      this.setState({
        currentRoundQuestions: questions,
        gotRoundQuestionsData: true,
      });
    } catch (error) {
      console.error(error);
      this.setState({
        serverError: true,
      });
    }
  };

  async componentDidMount() {
    if (!this.props.isNewQuiz && !this.state.gotRoundQuestionsData) {
      await this.getRoundQuestionsData();
    }
  }

  render() {
    if (this.state.serverError) {
      return <p style={{ color: "red" }}>A server error occurred</p>;
    }

    if (!this.props.isNewQuiz && !this.state.gotRoundQuestionsData) {
      return (
        <React.Fragment>
          <Row className="d-flex align-items-center justify-content-center text-center">
            <p>Loading question...</p>
          </Row>
          <Row className="d-flex align-items-center justify-content-center">
            <Spinner animation="grow" role="status" />
          </Row>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Container className="mt-4">
          <Row className="d-inline">
            <Col md="auto" className="d-inline">
              <p className="fs-3 d-inline">{`Provide Questions of Round ${this.props.roundData.SequenceNumber} - ${this.props.roundData.RoundName}`}</p>
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
            {(() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const questions: any[] = [];
              const totalNumQuestions =
                this.props.numOfTeams *
                this.props.roundData.NumQuestionsEachTeam!;
              for (let i = 1; i <= totalNumQuestions; i++) {
                const currentQuestion: QuestionType =
                  this.state.currentRoundQuestions[i - 1];

                const teamIndex =
                  i % this.props.numOfTeams
                    ? i % this.props.numOfTeams
                    : this.props.numOfTeams;

                questions.push(
                  <React.Fragment key={i}>
                    {/* Question statement */}
                    <Row className="mt-5 d-flex border-bottom">
                      <h5 style={{ color: "grey" }}>{`Question ${i}`}</h5>
                    </Row>
                    <Row className="mt-3 d-flex">
                      <Col md={6}>
                        <FloatingLabel
                          // https://stackoverflow.com/questions/30146105/react-input-defaultvalue-doesnt-update-with-state/41717743#41717743
                          key={`${this.props.roundData.UUID}question${i}Statement`}
                          controlId={`question${i}Statement`}
                          label={`Question statement (for team ${teamIndex} - ${
                            this.props.teams[teamIndex - 1]["TeamName"]
                          })`}
                          className="px-1"
                        >
                          <Form.Control
                            as="textarea"
                            placeholder={"Question statement"}
                            style={{ height: "100px" }}
                            defaultValue={
                              currentQuestion?.Description
                                ? currentQuestion.Description
                                : "temp"
                            }
                            required
                          />
                        </FloatingLabel>
                      </Col>
                    </Row>

                    {/* Audio Visual Media */}
                    {(() => {
                      if (this.props.roundData.IsAudioVisualRound) {
                        let mediaType = MediaType.Image;
                        const type =
                          currentQuestion?.MimeType_Transient?.split("/")[0];
                        if (type === MediaType.Image) {
                          mediaType = MediaType.Image;
                        } else if (type === MediaType.Video) {
                          mediaType = MediaType.Video;
                        } else if (type === MediaType.Audio) {
                          mediaType = MediaType.Audio;
                        }
                        return (
                          <Row className="mt-3 d-flex">
                            <Col md={3}>
                              <Form.Group controlId={`mediaQuestion${i}`}>
                                <Form.Label>Select Media File</Form.Label>
                                <Form.Control
                                  key={`${this.props.roundData.UUID}mediaQuestion${i}`}
                                  type="file"
                                  onChange={(e) =>
                                    this.previewImage(e.currentTarget)
                                  }
                                  required={this.props.isNewQuiz ? true : false}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Image
                                id={`mediaQuestion${i}ImagePreview`}
                                src={
                                  currentQuestion?.MediaBase64
                                    ? `data:${currentQuestion.MimeType_Transient};base64,${currentQuestion.MediaBase64}`
                                    : ""
                                }
                                fluid
                                hidden={mediaType !== MediaType.Image}
                              />
                              <video
                                width={"100%"}
                                controls
                                id={`mediaQuestion${i}VideoPreview`}
                                src={
                                  currentQuestion?.MediaBase64
                                    ? `data:${currentQuestion.MimeType_Transient};base64,${currentQuestion.MediaBase64}`
                                    : ""
                                }
                                hidden={mediaType !== MediaType.Video}
                              />
                              <video
                                width={"100%"}
                                controls
                                id={`mediaQuestion${i}AudioPreview`}
                                src={
                                  currentQuestion?.MediaBase64
                                    ? `data:${currentQuestion.MimeType_Transient};base64,${currentQuestion.MediaBase64}`
                                    : ""
                                }
                                hidden={mediaType !== MediaType.Audio}
                              />
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
                        let correctOption: string;
                        if (
                          currentQuestion?.Answer === currentQuestion?.Option2
                        ) {
                          correctOption = "B";
                        } else if (
                          currentQuestion?.Answer === currentQuestion?.Option3
                        ) {
                          correctOption = "C";
                        } else if (
                          currentQuestion?.Answer === currentQuestion?.Option4
                        ) {
                          correctOption = "D";
                        } else {
                          correctOption = "A";
                        }
                        return (
                          <React.Fragment>
                            <Row className="mt-3 d-flex">
                              <Col md={3}>
                                <FloatingLabel
                                  key={`${this.props.roundData.UUID}optionAQuestion${i}`}
                                  controlId={`optionAQuestion${i}`}
                                  label="Option A"
                                  className="px-1"
                                >
                                  <Form.Control
                                    type="text"
                                    placeholder="Option A"
                                    defaultValue={
                                      currentQuestion?.Option1
                                        ? currentQuestion.Option1
                                        : "temp"
                                    }
                                    required
                                  />
                                </FloatingLabel>
                              </Col>
                              <Col md={3}>
                                <FloatingLabel
                                  key={`${this.props.roundData.UUID}optionBQuestion${i}`}
                                  controlId={`optionBQuestion${i}`}
                                  label="Option B"
                                  className="px-1"
                                >
                                  <Form.Control
                                    type="text"
                                    placeholder="Option B"
                                    defaultValue={
                                      currentQuestion?.Option2
                                        ? currentQuestion.Option2
                                        : "temp"
                                    }
                                    required
                                  />
                                </FloatingLabel>
                              </Col>
                            </Row>
                            <Row className="mt-4 d-flex">
                              <Col md={3}>
                                <FloatingLabel
                                  key={`${this.props.roundData.UUID}optionCQuestion${i}`}
                                  controlId={`optionCQuestion${i}`}
                                  label="Option C"
                                  className="px-1"
                                >
                                  <Form.Control
                                    type="text"
                                    placeholder="Option C"
                                    defaultValue={
                                      currentQuestion?.Option3
                                        ? currentQuestion.Option3
                                        : "temp"
                                    }
                                    required
                                  />
                                </FloatingLabel>
                              </Col>
                              <Col md={3}>
                                <FloatingLabel
                                  key={`${this.props.roundData.UUID}optionDQuestion${i}`}
                                  controlId={`optionDQuestion${i}`}
                                  label="Option D"
                                  className="px-1"
                                >
                                  <Form.Control
                                    type="text"
                                    placeholder="Option D"
                                    defaultValue={
                                      currentQuestion?.Option4
                                        ? currentQuestion.Option4
                                        : "temp"
                                    }
                                    required
                                  />
                                </FloatingLabel>
                              </Col>
                            </Row>
                            <Row className="mt-4 d-flex">
                              <Col md={3}>
                                <FloatingLabel
                                  key={`${this.props.roundData.UUID}correctOptionQuestion${i}`}
                                  controlId={`correctOptionQuestion${i}`}
                                  label="Correct Option"
                                  className="px-1"
                                >
                                  <Form.Select
                                    aria-label="Floating label"
                                    defaultValue={correctOption}
                                  >
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
                          <Row className="mt-3 d-flex">
                            <Col md={3}>
                              <FloatingLabel
                                key={`${this.props.roundData.UUID}answerQuestion${i}`}
                                controlId={`answerQuestion${i}`}
                                label="Answer"
                                className="px-1"
                              >
                                <Form.Control
                                  type="text"
                                  placeholder="Answer"
                                  defaultValue={
                                    currentQuestion?.Answer
                                      ? currentQuestion.Answer
                                      : "temp"
                                  }
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

            <Row className="d-flex justify-content-left border-bottom mt-3"></Row>

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
  isNewQuiz: boolean;
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

      const allRounds = (await roundsResponse.json())?.Rounds || [];
      // at this point it is expected that at least number of rounds specified in Quiz table was created
      if (allRounds.length < this.props.numOfRounds) {
        throw "Failed to get rounds data";
      }
      this.rounds = allRounds.slice(0, this.props.numOfRounds);

      const teamsApiEndpoint =
        API_PATH + Endpoint.get_quiz_teams + "?quizID=" + this.props.quizID;
      const teamsResponse = await fetch(teamsApiEndpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!teamsResponse.ok) {
        throw `${teamsApiEndpoint} responded ${teamsResponse.statusText}; HTTP code: ${teamsResponse.status}`;
      }

      const allTeams = (await teamsResponse.json())?.Teams || [];
      // at this point it is expected that at least number of teams specified in Quiz table was created
      if (allTeams.length < this.props.numOfTeams) {
        throw "Failed to get teams data";
      }
      this.teams = allTeams.slice(0, this.props.numOfTeams);
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
        isNewQuiz={this.props.isNewQuiz}
        quizEventName={this.props.quizEventName}
        numOfTeams={this.props.numOfTeams}
        roundData={this.rounds[this.state.currentRound - 1]}
        teams={this.teams}
        nextRound={this.nextRound}
      />
    );
  }
}
