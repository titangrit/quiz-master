import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";
import "./../common/style.css";
import { HomeNavbar, API_PATH } from "../common";
import { QuizType, Endpoint, QuizLifecycleStatusCode } from "./../../server";

interface HomePageState {
  serverError: boolean;
  gotQuizzes: boolean;
}

/**
 * Renders the home page
 */
export default class HomePage extends React.Component<object, HomePageState> {
  readonly Theme = {
    Light: "light",
    Info: "info",
    Primary: "primary",
    Dark: "dark",
    White: "white",
  };
  private quizzes: QuizType[];

  constructor(props: object) {
    super(props);
    this.state = {
      serverError: false,
      gotQuizzes: false,
    };

    this.quizzes = [];
  }

  getAllQuizzes = async () => {
    try {
      const apiEndpoint = API_PATH + Endpoint.get_all_quizzes;
      const response = await fetch(apiEndpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw `${apiEndpoint} responded ${response.statusText}; HTTP code: ${response.status}`;
      }

      this.quizzes = (await response.json()).Quizzes || [];

      this.quizzes.push({
        ID: 999,
        QuizEventName:
          "very very long text very very long text very very long text very very long text very very long text very very long text very very long text very very long text",
        LifecycleStatusCode: QuizLifecycleStatusCode.Running,
      });
      this.quizzes.push({
        ID: 9998,
        QuizEventName: "quiz6",
        LifecycleStatusCode: QuizLifecycleStatusCode.Running,
      });
      this.quizzes.push({
        ID: 9997,
        QuizEventName: "quiz7",
        EndDateTime: new Date(),
        LifecycleStatusCode: QuizLifecycleStatusCode.Completed,
      });
      this.quizzes.push({
        ID: 9996,
        QuizEventName: "quiz8",
        EndDateTime: new Date(),
        StartDateTime: new Date(),
        LifecycleStatusCode: QuizLifecycleStatusCode.Completed,
      });
    } catch (error) {
      console.error(error);
      this.setState({
        serverError: true,
      });
    }
  };

  makeQuizCards = () => {
    const cards = (
      <React.Fragment>
        {this.quizzes.map((quiz) => {
          const editButton = (
            <Button
              variant="light"
              className="custom-button"
              onClick={() => {
                document.location.href = "/edit_quiz.html?quizID=" + quiz.ID;
              }}
            >
              Edit
            </Button>
          );

          const viewButton = (
            <Button
              variant="light"
              className="custom-button"
              onClick={() => {
                document.location.href = "/view_quiz.html?quizID=" + quiz.ID;
              }}
            >
              View
            </Button>
          );

          const startButton = (
            <Button
              variant="light"
              className="custom-button"
              onClick={() => {
                document.location.href = "/play_quiz.html?quizID=" + quiz.ID;
              }}
            >
              Start
            </Button>
          );

          const resumeButton = (
            <Button
              variant="light"
              className="custom-button"
              onClick={() => {
                document.location.href =
                  "/play_quiz.html?quizID=" + quiz.ID + "&resume=true";
              }}
            >
              Resume
            </Button>
          );

          const resultButton = (
            <Button variant="light" className="custom-button">
              Result
            </Button>
          );

          const deleteButton = (
            <Button variant="light" className="custom-button">
              Delete
            </Button>
          );

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const buttons: any[] = [];
          let theme = this.Theme.Light;

          switch (quiz.LifecycleStatusCode) {
            case QuizLifecycleStatusCode.Draft: {
              theme = this.Theme.Light;
              buttons.push(
                <Row key="A" className="d-flex justify-content-left">
                  <Col md={3} className="mx-3">
                    <Row>{editButton}</Row>
                  </Col>
                  <Col md={3} className="mx-3">
                    <Row>{viewButton}</Row>
                  </Col>
                </Row>
              );
              break;
            }
            case QuizLifecycleStatusCode.Ready: {
              theme = this.Theme.Info;
              buttons.push(
                <Row key="A" className="d-flex justify-content-left">
                  <Col md={3} className="mx-3">
                    <Row>{startButton}</Row>
                  </Col>
                  <Col md={3} className="mx-3">
                    <Row>{editButton}</Row>
                  </Col>
                  <Col md={3} className="mx-3">
                    <Row>{viewButton}</Row>
                  </Col>
                </Row>
              );
              break;
            }
            case QuizLifecycleStatusCode.Running: {
              theme = this.Theme.Info;
              buttons.push(
                <Row key="A" className="d-flex justify-content-left">
                  <Col md={3} className="mx-3">
                    <Row>{resumeButton}</Row>
                  </Col>
                  <Col md={3} className="mx-3">
                    <Row>{viewButton}</Row>
                  </Col>
                </Row>
              );
              break;
            }
            case QuizLifecycleStatusCode.Completed: {
              theme = this.Theme.Primary;
              buttons.push(
                <Row key="A" className="d-flex justify-content-left">
                  <Col md={3} className="mx-3">
                    <Row>{resultButton}</Row>
                  </Col>
                  <Col md={3} className="mx-3">
                    <Row>{viewButton}</Row>
                  </Col>
                  <Col md={3} className="mx-3">
                    <Row>{deleteButton}</Row>
                  </Col>
                </Row>
              );
              break;
            }
          }

          return (
            <Card
              key={quiz.ID}
              className="mb-2"
              bg={theme}
              text={
                theme === this.Theme.Light ? this.Theme.Dark : this.Theme.White
              }
            >
              <Card.Header>
                {QuizLifecycleStatusCode[quiz.LifecycleStatusCode || 1]}
              </Card.Header>
              <Card.Body>
                <Card.Title>{quiz.QuizEventName}</Card.Title>
                <Card.Text>
                  {!!quiz.EndDateTime &&
                    `Completed on ${quiz.EndDateTime.toLocaleString()}`}
                </Card.Text>
                {buttons}
              </Card.Body>
            </Card>
          );
        })}
      </React.Fragment>
    );
    return cards;
  };

  getQuizList = () => {
    if (this.quizzes.length > 0) {
      return this.makeQuizCards();
    } else {
      return <p>No quiz to show. Click New Quiz to create a new quiz.</p>;
    }
  };

  async componentDidMount() {
    if (!this.state.gotQuizzes) {
      await this.getAllQuizzes();
      this.setState({
        gotQuizzes: true,
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <HomeNavbar />
        <Container fluid>
          {/* Logo */}
          <Row className="mt-2 mb-2 d-flex justify-content-center">
            <h1
              style={{ color: "#333" }}
              className="d-flex justify-content-center"
            >
              QuizMaster
            </h1>
          </Row>

          {/* New Quiz button */}
          <Row className="d-flex justify-content-center">
            <Col md={5}>
              <Button
                variant="light"
                className="custom-button mt-4 mb-4 float-end"
                // size="lg"
                // type="button"
                onClick={() => {
                  document.location.href = "/edit_quiz.html";
                }}
              >
                New Quiz
              </Button>
            </Col>
          </Row>

          {/* Available quizzes */}
          <Row className="d-flex justify-content-center">
            <Col md={5}>
              <React.Fragment>
                <h4>Quizzes</h4>
                <Container className="quizzes-table-container mt-3 mb-3" fluid>
                  {/* Server error */}
                  {this.state.serverError && (
                    <p style={{ color: "red" }}>A server error occurred</p>
                  )}

                  {/* Loading message */}
                  {!this.state.gotQuizzes && !this.state.serverError && (
                    <React.Fragment>
                      <p>Loading Available Quizzes</p>
                      <Spinner animation="grow" role="status" />
                    </React.Fragment>
                  )}

                  {/* List available quizzes */}
                  {this.state.gotQuizzes &&
                    !this.state.serverError &&
                    this.getQuizList()}
                </Container>
              </React.Fragment>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<HomePage />);
