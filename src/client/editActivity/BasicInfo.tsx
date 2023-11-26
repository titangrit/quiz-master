import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { API_PATH } from "../common";
import { QuizType, QuizLifecycleStatusCode, Endpoint } from "./../../server";

interface BasicInfoState {
  currentQuiz: QuizType;
  gotQuizData: boolean;
  editQuizNotFound: boolean;
  serverError: boolean;
}

interface BasicInfoProps {
  isNewQuiz: boolean;
  quizID: number;
  nextStep: (
    quizID: number,
    quizEventName: string,
    numOfRounds: number,
    numOfTeams: number
  ) => void;
}

/**
 * Fill quiz basic information
 */
export default class BasicInfo extends React.Component<
  BasicInfoProps,
  BasicInfoState
> {
  constructor(props: BasicInfoProps) {
    super(props);
    this.state = {
      currentQuiz: {},
      gotQuizData: false,
      editQuizNotFound: false,
      serverError: false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save = async (event: any) => {
    try {
      event.preventDefault();
      event.stopPropagation();

      const form = event.currentTarget;
      const inputQuizEventName: string = form["quizEventName"].value;
      const inputNumOfTeams: number = parseInt(form["numOfTeams"].value);
      const inputNumOfRounds: number = parseInt(form["numOfRounds"].value);

      if (inputNumOfTeams > 4 || inputNumOfTeams < 2) {
        throw "Number of teams must be 2, 3, or 4";
      }

      const quiz: QuizType = {};
      if (inputQuizEventName !== this.state.currentQuiz.QuizEventName) {
        quiz.QuizEventName = inputQuizEventName;
      }
      if (inputNumOfTeams !== this.state.currentQuiz.NumberOfTeams) {
        quiz.NumberOfTeams = inputNumOfTeams;
      }
      if (inputNumOfRounds !== this.state.currentQuiz.NumberOfRounds) {
        quiz.NumberOfRounds = inputNumOfRounds;
      }
      if (
        this.state.currentQuiz.LifecycleStatusCode !==
        QuizLifecycleStatusCode.Draft
      ) {
        quiz.LifecycleStatusCode = QuizLifecycleStatusCode.Draft;
      }

      let apiEndpoint: string;
      if (this.props.isNewQuiz) {
        apiEndpoint = API_PATH + Endpoint.create_quiz;
      } else {
        quiz.ID = this.props.quizID;
        apiEndpoint = API_PATH + Endpoint.edit_quiz;
      }

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Quiz: quiz }),
      });

      if (!response.ok) {
        throw `${apiEndpoint} responded ${response.statusText}; HTTP code: ${response.status}`;
      }

      let quizID: number;
      if (this.props.isNewQuiz) {
        const data = await response.json();
        quizID = data.QuizID;
      } else {
        quizID = this.props.quizID;
      }

      this.props.nextStep(
        quizID,
        inputQuizEventName,
        inputNumOfTeams,
        inputNumOfRounds
      );
    } catch (error) {
      console.error(error);
      this.setState({
        serverError: true,
      });
    }
  };

  getQuizData = async () => {
    try {
      const quizApiEndpoint =
        API_PATH + Endpoint.get_quiz + "?quizID=" + this.props.quizID;
      const quizResponse = await fetch(quizApiEndpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!quizResponse.ok) {
        throw "Failed to get quiz data";
      }
      const quiz: QuizType = (await quizResponse.json()).Quiz;
      if (!quiz) {
        this.setState({
          editQuizNotFound: true,
        });
        return;
      }

      this.setState({
        currentQuiz: quiz,
        gotQuizData: true,
      });
    } catch (error) {
      console.error(error);
      this.setState({
        serverError: true,
      });
    }
  };

  async componentDidMount() {
    if (!this.props.isNewQuiz && !this.state.gotQuizData) {
      await this.getQuizData();
    }
  }

  render() {
    if (this.state.serverError) {
      return <p style={{ color: "red" }}>A server error occurred</p>;
    }

    if (!this.props.isNewQuiz && !this.state.gotQuizData) {
      return (
        <React.Fragment>
          <Row className="d-flex align-items-center justify-content-center text-center">
            <p>Loading quiz data...</p>
          </Row>
          <Row className="d-flex align-items-center justify-content-center">
            <Spinner animation="grow" role="status" />
          </Row>
        </React.Fragment>
      );
    }

    if (!this.props.isNewQuiz && this.state.editQuizNotFound) {
      return (
        <React.Fragment>
          <Row className="border-bottom d-flex align-items-center justify-content-center text-center">
            <p>Quiz not found!</p>
          </Row>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Container className="mt-4">
          <Row className="d-inline">
            <Col md="auto" className="d-inline">
              <p className="fs-3 d-inline">Provide Quiz Basic Information </p>
            </Col>
            <Col md="auto" className="d-inline">
              <p className="fs-4 d-inline">
                {this.props.isNewQuiz ? "{ New Quiz }" : "{ Edit Quiz }"}
              </p>
            </Col>
          </Row>

          <Row className="mt-5 d-flex justify-content-center">
            <Col md={3}>
              <Form onSubmit={this.save}>
                <Row className="mb-4">
                  <FloatingLabel
                    controlId="quizEventName"
                    label="Quiz Event Name *Required"
                    className="px-1"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Quiz Event Name"
                      defaultValue={this.state.currentQuiz.QuizEventName}
                      required
                    />
                  </FloatingLabel>
                </Row>
                <Row className="mb-4">
                  <FloatingLabel
                    controlId="numOfTeams"
                    label="Number of Teams"
                    className="px-1"
                  >
                    <Form.Select
                      aria-label="Floating label"
                      defaultValue={this.state.currentQuiz.NumberOfTeams}
                    >
                      <option value="2">{"2 (Two)"}</option>
                      <option value="3">{"3 (Three)"}</option>
                      <option value="4">{"4 (Four)"}</option>
                    </Form.Select>
                  </FloatingLabel>
                </Row>
                <Row className="mb-5">
                  <FloatingLabel
                    controlId="numOfRounds"
                    label="Number of Quiz Rounds"
                    className="px-1"
                  >
                    <Form.Select
                      aria-label="Floating label"
                      defaultValue={this.state.currentQuiz.NumberOfRounds}
                    >
                      <option value="1">{"1 (One)"}</option>
                      <option value="2">{"2 (Two)"}</option>
                      <option value="3">{"3 (Three)"}</option>
                      <option value="4">{"4 (Four)"}</option>
                      <option value="5">{"5 (Five)"}</option>
                      <option value="6">{"6 (Six)"}</option>
                    </Form.Select>
                  </FloatingLabel>
                </Row>

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

                <Row className="mb-5">
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
              </Form>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}
