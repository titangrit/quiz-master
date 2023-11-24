import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import { API_PATH } from "../common";
import { TeamType, Endpoint } from "./../../server";

interface TeamInfoState {
  serverError: boolean;
}

interface TeamInfoProps {
  quizID: number;
  quizEventName: string;
  numOfTeams: number;
  nextStep: () => void;
}

/**
 * Fill teams information
 */
export default class TeamInfo extends React.Component<
  TeamInfoProps,
  TeamInfoState
> {
  constructor(props: TeamInfoProps) {
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
      const teams: TeamType[] = [];
      for (let i = 0; i < this.props.numOfTeams; i++) {
        const team: TeamType = {
          TeamName: form[`team${i + 1}+Name`].value,
          Member1Name: form[`team${i + 1}+Member1`].value,
          Member2Name: form[`team${i + 1}+Member2`].value,
          Member3Name: form[`team${i + 1}+Member3`].value,
          Member4Name: form[`team${i + 1}+Member4`].value,
        };
        teams.push(team);
      }

      // post new teams
      const apiEndpoint = API_PATH + Endpoint.create_quiz_teams;
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ QuizID: this.props.quizID, Teams: teams }),
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
              <p className="fs-3 d-inline">Provide Teams Detail </p>
            </Col>
            <Col md="auto" className="d-inline">
              <p className="fs-4 d-inline">{`{ New Quiz | ${this.props.quizEventName} }`}</p>
            </Col>
          </Row>

          <Form onSubmit={this.save}>
            {(() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const teams: any[] = [];
              for (let i = 0; i < this.props.numOfTeams; i++) {
                teams.push(
                  <React.Fragment key={i}>
                    {/* Team name */}
                    <Row className="mt-5 d-flex justify-content-left">
                      <Col md={3}>
                        <Row>
                          <FloatingLabel
                            controlId={`team${i + 1}Name`}
                            label={`Team ${i + 1} Name *Required`}
                            className="px-1"
                          >
                            <Form.Control
                              type="text"
                              placeholder={`Team ${i + 1} Name`}
                              required
                            />
                          </FloatingLabel>
                        </Row>
                      </Col>
                    </Row>
                    <Accordion className="mt-4" alwaysOpen>
                      <Accordion.Item eventKey="i">
                        <Accordion.Header>Team Members</Accordion.Header>
                        <Accordion.Body>
                          {/* Member 1 and 2*/}
                          <Row className="mt-2 d-flex justify-content-left">
                            {/* Member 1 */}
                            <Col md={3}>
                              <Row>
                                <FloatingLabel
                                  controlId={`team${i + 1}+Member1`}
                                  label={"Member 1 Name"}
                                  className="px-1"
                                >
                                  <Form.Control
                                    type="text"
                                    placeholder={"Member 1 Name"}
                                  />
                                </FloatingLabel>
                              </Row>
                            </Col>
                            {/* Member 2 */}
                            <Col md={3}>
                              <Row>
                                <FloatingLabel
                                  controlId={`team${i + 1}+Member2`}
                                  label={"Member 2 Name"}
                                  className="px-1"
                                >
                                  <Form.Control
                                    type="text"
                                    placeholder={"Member 2 Name"}
                                  />
                                </FloatingLabel>
                              </Row>
                            </Col>
                          </Row>
                          {/* Member 3 and 4*/}
                          <Row className="mt-4 d-flex justify-content-left">
                            {/* Member 3 */}
                            <Col md={3}>
                              <Row>
                                <FloatingLabel
                                  controlId={`team${i + 1}+Member3`}
                                  label={"Member 3 Name"}
                                  className="px-1"
                                >
                                  <Form.Control
                                    type="text"
                                    placeholder={"Member 3 Name"}
                                  />
                                </FloatingLabel>
                              </Row>
                            </Col>
                            {/* Member 4 */}
                            <Col md={3}>
                              <Row>
                                <FloatingLabel
                                  controlId={`team${i + 1}+Member4`}
                                  label={"Member 4 Name"}
                                  className="px-1"
                                >
                                  <Form.Control
                                    type="text"
                                    placeholder={"Member 4 Name"}
                                  />
                                </FloatingLabel>
                              </Row>
                            </Col>
                          </Row>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </React.Fragment>
                );
              }
              return teams;
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

                <Row className="mb-4">
                  <Button
                    variant="secondary"
                    size="lg"
                    type="button"
                    className="custom-button"
                    onClick={() => {
                      this.props.nextStep();
                    }}
                  >
                    Skip
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
