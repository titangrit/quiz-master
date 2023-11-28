import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Image from "react-bootstrap/Image";
import "./common/style.css";
import { HomeNavbar, API_PATH } from "./common";
import {
  QuizType,
  TeamType,
  RoundType,
  QuestionType,
  Endpoint,
  QuizLifecycleStatusCode,
} from "../server";

interface QuizInstancePageState {
  quizNotFound: boolean;
  serverError: boolean;
  gotData: boolean;
}

/**
 * View all data of a quiz
 */
export default class QuizInstancePage extends React.Component<
  object,
  QuizInstancePageState
> {
  private quiz: QuizType;
  private teams: TeamType[];
  private rounds: RoundType[];
  private questionsMap: Map<number, QuestionType[]>;

  constructor(props: QuizInstancePageState) {
    super(props);
    this.state = {
      quizNotFound: false,
      serverError: false,
      gotData: false,
    };

    this.quiz = {};
    this.teams = [];
    this.rounds = [];
    this.questionsMap = new Map<number, QuestionType[]>();
  }

  getData = async () => {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const quizID = queryParams.get("quizID");

      // get quiz data
      const quizApiEndpoint =
        API_PATH + Endpoint.get_quiz + "?quizID=" + quizID;
      const quizResponse = await fetch(quizApiEndpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!quizResponse.ok) {
        throw "Failed to get quiz data";
      }
      this.quiz = (await quizResponse.json()).Quiz;
      if (!this.quiz) {
        this.setState({
          quizNotFound: true,
        });
        return;
      }

      // get teams data
      const teamsApiEndpoint =
        API_PATH + Endpoint.get_quiz_teams + "?quizID=" + quizID;
      const teamsResponse = await fetch(teamsApiEndpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!teamsResponse.ok) {
        throw "Failed to get teams data";
      }
      const allTeams = (await teamsResponse.json()).Teams || [];
      this.teams = allTeams.slice(0, this.quiz.NumberOfTeams!);

      // get rounds data
      const roundApiEndpoint =
        API_PATH + Endpoint.get_quiz_rounds + "?quizID=" + quizID;
      const roundsResponse = await fetch(roundApiEndpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!roundsResponse.ok) {
        throw "Failed to get rounds data";
      }
      const allRounds = (await roundsResponse.json()).Rounds || [];
      this.rounds = allRounds.slice(0, this.quiz.NumberOfRounds!);

      // get question data
      for (const round of this.rounds) {
        const questionApiEndpoint =
          API_PATH +
          Endpoint.get_quiz_round_questions +
          "?roundUUID=" +
          round.UUID;
        const questionResponse = await fetch(questionApiEndpoint, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!questionResponse.ok) {
          throw "Failed to get questions data";
        }
        const roundQuestions = (await questionResponse.json()).Questions || [];
        const totalNumQuestions =
          round.NumQuestionsEachTeam! * this.quiz.NumberOfTeams!;
        this.questionsMap.set(
          round.SequenceNumber!,
          roundQuestions.slice(0, totalNumQuestions)
        );
      }
    } catch (error) {
      console.error(error);
      this.setState({
        serverError: true,
      });
    }
  };

  async componentDidMount() {
    if (!this.state.gotData) {
      await this.getData();
      this.setState({
        gotData: true,
      });
    }
  }

  render() {
    if (this.state.serverError) {
      return (
        <React.Fragment>
          <HomeNavbar />
          <div className="border-bottom d-flex align-items-center justify-content-center text-center">
            <p style={{ color: "red" }}>A server error occurred</p>
          </div>
        </React.Fragment>
      );
    }

    if (!this.state.gotData) {
      return (
        <React.Fragment>
          <HomeNavbar />
          <Row className="d-flex align-items-center justify-content-center text-center">
            <p>Loading quiz data...</p>
          </Row>
          <Row className="d-flex align-items-center justify-content-center">
            <Spinner animation="grow" role="status" />
          </Row>
        </React.Fragment>
      );
    }

    if (this.state.quizNotFound) {
      return (
        <React.Fragment>
          <HomeNavbar />
          <Row className="border-bottom d-flex align-items-center justify-content-center text-center">
            <p>Quiz not found!</p>
          </Row>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <HomeNavbar />
        <Container className="mt-4">
          {/* Page title */}
          <Row className="d-inline">
            <Col md="auto" className="d-inline">
              <p className="fs-3 d-inline">Quiz Detail </p>
            </Col>
            <Col md="auto" className="d-inline">
              <p className="fs-4 d-inline">{`{ ${this.quiz.QuizEventName} }`}</p>
            </Col>
          </Row>

          {/* Basic data */}

          <Row className="d-flex justify-content-left mt-4">
            <p style={{ color: "grey" }}>
              {"Quiz event name: " + this.quiz.QuizEventName}
            </p>
          </Row>
          <Row className="d-flex justify-content-left">
            <Col md={3}>
              <Row>
                <p style={{ color: "grey" }}>
                  {"Number of teams: " + this.quiz.NumberOfTeams}
                </p>
              </Row>
            </Col>
            <Col md={3}>
              <Row>
                <p style={{ color: "grey" }}>
                  {"Number of quiz rounds: " + this.quiz.NumberOfRounds}
                </p>
              </Row>
            </Col>
            <Col md={3}>
              <Row>
                <p style={{ color: "grey" }}>
                  {"Status: " +
                    QuizLifecycleStatusCode[this.quiz.LifecycleStatusCode!]}
                </p>
              </Row>
            </Col>
          </Row>

          {/* Teams data */}
          <Row className="d-flex justify-content-left border-bottom mt-3">
            <h4 style={{ color: "grey" }}>{"Teams"}</h4>
          </Row>
          <Row>
            {(() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const teams: any[] = [];
              let teamCounter = 1;
              for (const team of this.teams) {
                teams.push(
                  <React.Fragment>
                    <Row className="mt-3 d-flex justify-content-left">
                      <p style={{ color: "grey" }}>
                        {`Team ${teamCounter} name: ${team.TeamName}`}
                      </p>
                    </Row>
                    <Row className="d-flex justify-content-left">
                      <Col md={3}>
                        <Row>
                          <p style={{ color: "grey" }}>
                            {`Member 1: ${team.Member1Name}`}
                          </p>
                        </Row>
                      </Col>
                      <Col md={3}>
                        <Row>
                          <p style={{ color: "grey" }}>
                            {`Member 2: ${team.Member2Name}`}
                          </p>
                        </Row>
                      </Col>
                      <Col md={3}>
                        <Row>
                          <p style={{ color: "grey" }}>
                            {`Member 3: ${team.Member3Name}`}
                          </p>
                        </Row>
                      </Col>
                      <Col md={3}>
                        <Row>
                          <p style={{ color: "grey" }}>
                            {`Member 4: ${team.Member4Name}`}
                          </p>
                        </Row>
                      </Col>
                    </Row>
                  </React.Fragment>
                );
                teamCounter++;
              }
              return teams;
            })()}
          </Row>

          {/* Rounds data */}
          <Row className="d-flex justify-content-left border-bottom mt-3">
            <h4 style={{ color: "grey" }}>{"Quiz Rounds"}</h4>
          </Row>
          <Row>
            {(() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const rounds: any[] = [];
              for (const round of this.rounds) {
                rounds.push(
                  <React.Fragment>
                    <Row className="mt-3 d-flex justify-content-left">
                      <p style={{ color: "grey" }}>
                        {`Round ${round.SequenceNumber} name: ${round.RoundName}`}
                      </p>
                    </Row>
                    <Row className="d-flex justify-content-left">
                      <Col md={3}>
                        <Row>
                          <p style={{ color: "grey" }}>
                            {`Number of questions for each team: ${round.NumQuestionsEachTeam}`}
                          </p>
                        </Row>
                      </Col>
                      <Col md={3}>
                        <Row>
                          <p style={{ color: "grey" }}>
                            {`Maximum mark of each question: ${round.FullMarkEachQuestion}`}
                          </p>
                        </Row>
                      </Col>
                      <Col md={3}>
                        <Row>
                          <p style={{ color: "grey" }}>
                            {`Time limit of each question: ${round.TimerSeconds} seconds`}
                          </p>
                        </Row>
                      </Col>
                    </Row>
                    <Row className="d-flex justify-content-left">
                      <Col md={3}>
                        <Row>
                          <p style={{ color: "grey" }}>
                            {`MCQ: ${round.IsMCQ ? "Yes" : "No"}`}
                          </p>
                        </Row>
                      </Col>
                      <Col md={3}>
                        <Row>
                          <p style={{ color: "grey" }}>
                            {`Audio/Visual: ${
                              round.IsAudioVisualRound ? "Yes" : "No"
                            }`}
                          </p>
                        </Row>
                      </Col>
                      <Col md={3}>
                        <Row>
                          <p style={{ color: "grey" }}>
                            {`Questions can be passed: ${
                              round.IsPassable ? "Yes" : "No"
                            }`}
                          </p>
                        </Row>
                      </Col>
                    </Row>
                  </React.Fragment>
                );
              }
              return rounds;
            })()}
          </Row>

          {/* Questions data */}
          <Row className="d-flex justify-content-left border-bottom mt-3">
            <h4 style={{ color: "grey" }}>{"Questions"}</h4>
          </Row>
          <Row>
            {(() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const questionsDiv: any[] = [];
              for (const [roundSequence, questions] of this.questionsMap) {
                const round = this.rounds[roundSequence - 1];
                questionsDiv.push(
                  <Row className="mt-3 d-flex justify-content-left">
                    <h5 style={{ color: "grey" }}>
                      {`Round ${roundSequence} (${round.RoundName}) Questions`}
                    </h5>
                  </Row>
                );
                for (const question of questions) {
                  const teamIndex =
                    question.SequenceNumber! % this.quiz.NumberOfTeams!
                      ? question.SequenceNumber! % this.quiz.NumberOfTeams!
                      : this.quiz.NumberOfTeams;
                  questionsDiv.push(
                    <React.Fragment>
                      <Row className="d-flex justify-content-left mt-3">
                        <p style={{ color: "grey" }}>
                          {`Question ${
                            question.SequenceNumber
                          } statement (for ${
                            this.teams[teamIndex! - 1].TeamName
                          }): ${question.Description}`}
                        </p>
                      </Row>
                      {round.IsAudioVisualRound === true && (
                        <Row className="d-flex justify-content-left">
                          <Col md={3}>
                            <Row>
                              <Image
                                src={`data:image/gif;base64,${question.MediaBase64}`}
                                fluid
                              />
                            </Row>
                          </Col>
                        </Row>
                      )}
                      {round.IsMCQ === true && (
                        <>
                          <Row className="d-flex justify-content-left">
                            <Col md={3}>
                              <Row>
                                <p style={{ color: "grey" }}>
                                  {`Option A: ${question.Option1}`}
                                </p>
                              </Row>
                            </Col>
                            <Col md={3}>
                              <Row>
                                <p style={{ color: "grey" }}>
                                  {`Option B: ${question.Option2}`}
                                </p>
                              </Row>
                            </Col>
                            <Col md={3}>
                              <Row>
                                <p style={{ color: "grey" }}>
                                  {`Option C: ${question.Option3}`}
                                </p>
                              </Row>
                            </Col>
                            <Col md={3}>
                              <Row>
                                <p style={{ color: "grey" }}>
                                  {`Option D: ${question.Option4}`}
                                </p>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="d-flex justify-content-left">
                            <Col md={3}>
                              <Row>
                                <p style={{ color: "grey" }}>
                                  {`Correct answer: ${question.Answer}`}
                                </p>
                              </Row>
                            </Col>
                          </Row>
                        </>
                      )}
                      {round.IsMCQ === false && (
                        <Row className="d-flex justify-content-left">
                          <Col md={3}>
                            <Row>
                              <p style={{ color: "grey" }}>
                                {`Answer: ${question.Answer}`}
                              </p>
                            </Row>
                          </Col>
                        </Row>
                      )}
                    </React.Fragment>
                  );
                }
              }
              return questionsDiv;
            })()}
          </Row>

          <Row className="d-flex justify-content-left border-bottom mt-3"></Row>

          {/* Buttons */}
          <Row className="mt-5 mb-5 d-flex justify-content-center">
            <Col md={3}>
              <Row className="mt-4 mb-4">
                <Button
                  variant="light"
                  size="lg"
                  type="button"
                  className="custom-button"
                  onClick={() => {
                    window.location.replace("/");
                  }}
                >
                  Close
                </Button>
              </Row>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<QuizInstancePage />);
