import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { API_PATH } from "../common";
import { QuizType, Endpoint } from "./../../server";

interface BasicInfoState {
  serverError: boolean;
}

interface BasicInfoProps {
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
      serverError: false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save = async (event: any) => {
    try {
      event.preventDefault();
      event.stopPropagation();

      const form = event.currentTarget;
      const quizEventName = form["quizEventName"].value;
      const numOfTeams = form["numOfTeams"].value;
      const numOfRounds = form["numOfRounds"].value;

      if (numOfTeams > 4) {
        throw "Number of teams cannot be more than 4";
      }

      // post new quiz
      const newQuiz: QuizType = {
        QuizEventName: quizEventName,
        NumberOfTeams: numOfTeams,
        NumberOfRounds: numOfRounds,
      };

      const apiEndpoint = API_PATH + Endpoint.create_quiz;
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuiz),
      });

      if (!response.ok) {
        throw `${apiEndpoint} responded ${response.statusText}; HTTP code: ${response.status}`;
      }

      const data = await response.json();
      const quizID = data.QuizID;

      this.props.nextStep(quizID, quizEventName, numOfRounds, numOfTeams);
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
              <p className="fs-3 d-inline">Provide Quiz Basic Information </p>
            </Col>
            <Col md="auto" className="d-inline">
              <p className="fs-4 d-inline">{"{ New Quiz }"}</p>
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
                    <Form.Select aria-label="Floating label">
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
                    <Form.Select aria-label="Floating label">
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
