import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, Spinner, Card } from "react-bootstrap";
import "./../common/style.css";
import { HomeNavbar } from "./HomeNavbar";
import { server } from "./../../";

interface HomePageState {
  serverError: boolean;
  gotQuizzes: boolean;
}

/**
 * Renders the home page
 */
export default class HomePage extends React.Component<object, HomePageState> {
  private apiPath: string = "/api/";
  readonly Theme = {
    Light: "light",
    Info: "info",
    Primary: "primary",
    Dark: "dark",
    White: "white",
  };
  private quizzes: server.QuizType[];

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
      const response = await fetch(
        this.apiPath + server.Endpoint.get_all_quizzes,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        this.setState({
          serverError: true,
        });
      }

      this.quizzes = await response.json();

      this.quizzes.push({
        ID: 999,
        QuizEventName:
          "very very long text very very long text very very long text very very long text very very long text very very long text very very long text very very long text",
        LifecycleStatusCode: server.QuizLifecycleStatusCode.Running,
      });
      this.quizzes.push({
        ID: 9998,
        QuizEventName: "quiz6",
        LifecycleStatusCode: server.QuizLifecycleStatusCode.Running,
      });
      this.quizzes.push({
        ID: 9997,
        QuizEventName: "quiz7",
        EndDateTime: new Date(),
        LifecycleStatusCode: server.QuizLifecycleStatusCode.Completed,
      });
      this.quizzes.push({
        ID: 9996,
        QuizEventName: "quiz8",
        EndDateTime: new Date(),
        StartDateTime: new Date(),
        LifecycleStatusCode: server.QuizLifecycleStatusCode.Completed,
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
      <>
        {this.quizzes.map((quiz) => {
          let theme = "light";
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const buttons: any[] = [];
          if (
            quiz.LifecycleStatusCode === server.QuizLifecycleStatusCode.Draft
          ) {
            theme = this.Theme.Light;
            buttons.push(
              <Row key="A" className="d-flex justify-content-left">
                <Col md={3} className="mx-3">
                  <Row>
                    <Button
                      variant="light"
                      className="custom-button"
                      onClick={() => {
                        document.location.href =
                          "/edit_quiz.html?quizID=" + quiz.ID;
                      }}
                    >
                      Edit
                    </Button>
                  </Row>
                </Col>
                <Col md={3} className="mx-3">
                  <Row>
                    <Button
                      variant="light"
                      className="custom-button"
                      onClick={() => {
                        document.location.href =
                          "/view_quiz.html?quizID=" + quiz.ID;
                      }}
                    >
                      View
                    </Button>
                  </Row>
                </Col>
              </Row>
            );
          } else if (
            quiz.LifecycleStatusCode === server.QuizLifecycleStatusCode.Ready
          ) {
            theme = this.Theme.Info;
            buttons.push(
              <Row key="A" className="d-flex justify-content-left">
                <Col md={3} className="mx-3">
                  <Row>
                    <Button
                      variant="light"
                      className="custom-button"
                      onClick={() => {
                        document.location.href =
                          "/play_quiz.html?quizID=" + quiz.ID;
                      }}
                    >
                      Start
                    </Button>
                  </Row>
                </Col>
                <Col md={3} className="mx-3">
                  <Row>
                    <Button
                      variant="light"
                      className="custom-button"
                      onClick={() => {
                        document.location.href =
                          "/edit_quiz.html?quizID=" + quiz.ID;
                      }}
                    >
                      Edit
                    </Button>
                  </Row>
                </Col>
                <Col md={3} className="mx-3">
                  <Row>
                    <Button
                      variant="light"
                      className="custom-button"
                      onClick={() => {
                        document.location.href =
                          "/view_quiz.html?quizID=" + quiz.ID;
                      }}
                    >
                      View
                    </Button>
                  </Row>
                </Col>
              </Row>
            );
          } else if (
            quiz.LifecycleStatusCode === server.QuizLifecycleStatusCode.Running
          ) {
            theme = this.Theme.Info;
            buttons.push(
              <Row key="A" className="d-flex justify-content-left">
                <Col md={3} className="mx-3">
                  <Row>
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
                  </Row>
                </Col>
                <Col md={3} className="mx-3">
                  <Row>
                    <Button
                      variant="light"
                      className="custom-button"
                      onClick={() => {
                        document.location.href =
                          "/view_quiz.html?quizID=" + quiz.ID;
                      }}
                    >
                      View
                    </Button>
                  </Row>
                </Col>
              </Row>
            );
          } else if (
            quiz.LifecycleStatusCode ===
            server.QuizLifecycleStatusCode.Completed
          ) {
            theme = this.Theme.Primary;
            buttons.push(
              <Row key="A" className="d-flex justify-content-left">
                <Col md={3} className="mx-3">
                  <Row>
                    <Button variant="light" className="custom-button">
                      Result
                    </Button>
                  </Row>
                </Col>
                <Col md={3} className="mx-3">
                  <Row>
                    <Button
                      variant="light"
                      className="custom-button"
                      onClick={() => {
                        document.location.href =
                          "/view_quiz.html?quizID=" + quiz.ID;
                      }}
                    >
                      View
                    </Button>
                  </Row>
                </Col>
                <Col md={3} className="mx-3">
                  <Row>
                    <Button variant="light" className="custom-button">
                      Delete
                    </Button>
                  </Row>
                </Col>
              </Row>
            );
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
                {server.QuizLifecycleStatusCode[quiz.LifecycleStatusCode || 1]}
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
      </>
    );
    return cards;
  };

  getQuizCards = () => {
    if (this.quizzes.length > 0) {
      return this.makeQuizCards();
    } else {
      return <p>No quiz to show. Click New to create a new quiz.</p>;
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

          <Row className="d-flex justify-content-center">
            <Col md={5}>
              {/* New quiz button */}
              <Button
                variant="light"
                className="custom-button mt-4 mb-4"
                // size="lg"
                type="button"
                onClick={() => {
                  document.location.href = "/edit_quiz.html";
                }}
              >
                New Quiz
              </Button>

              {/* Error occurred message */}
              {this.state.serverError && (
                <p style={{ color: "red" }}>
                  An error occurred. Try refreshing the page or check the server
                  log.
                </p>
              )}

              {/* Loading message */}
              {!this.state.gotQuizzes && !this.state.serverError && (
                <h3>
                  <Spinner animation="border" role="status" /> Loading Available
                  Quizzes...
                </h3>
              )}

              {/* Available quizzes */}
              {this.state.gotQuizzes && (
                <React.Fragment>
                  <h4>Quizzes</h4>
                  <Container
                    className="quizzes-table-container mt-3 mb-3"
                    fluid
                  >
                    {this.getQuizCards()}
                  </Container>
                </React.Fragment>
              )}
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<HomePage />);
