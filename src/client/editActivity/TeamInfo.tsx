import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { API_PATH } from "../common";
import { TeamType, Endpoint } from "./../../server";

interface TeamInfoState {
  gotTeamsData: boolean;
  currentTeams: TeamType[];
  serverError: boolean;
}

interface TeamInfoProps {
  isNewQuiz: boolean;
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
      gotTeamsData: false,
      currentTeams: [],
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
        const team: TeamType = {};

        const inputTeamName = form[`team${i + 1}Name`].value;
        const inputMember1Name = form[`team${i + 1}Member1`].value;
        const inputMember2Name = form[`team${i + 1}Member2`].value;
        const inputMember3Name = form[`team${i + 1}Member3`].value;
        const inputMember4Name = form[`team${i + 1}Member4`].value;

        if (inputTeamName !== this.state.currentTeams[i]?.TeamName) {
          team.TeamName = inputTeamName;
        }
        if (inputMember1Name !== this.state.currentTeams[i]?.Member1Name) {
          team.Member1Name = inputMember1Name;
        }
        if (inputMember2Name !== this.state.currentTeams[i]?.Member2Name) {
          team.Member2Name = inputMember2Name;
        }
        if (inputMember3Name !== this.state.currentTeams[i]?.Member3Name) {
          team.Member3Name = inputMember3Name;
        }
        if (inputMember4Name !== this.state.currentTeams[i]?.Member4Name) {
          team.Member4Name = inputMember4Name;
        }

        if (this.props.isNewQuiz) {
          teams.push(team);
        } else if (Object.keys(team).length !== 0) {
          team.UUID = this.state.currentTeams[i]?.UUID;
          teams.push(team);
        }
      }

      if (teams.length > 0) {
        let apiEndpoint: string;
        let body: string;
        if (this.props.isNewQuiz) {
          apiEndpoint = API_PATH + Endpoint.create_quiz_teams;
          body = JSON.stringify({ QuizID: this.props.quizID, Teams: teams });
        } else {
          apiEndpoint = API_PATH + Endpoint.edit_quiz_teams;
          body = JSON.stringify({ Teams: teams });
        }
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body,
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

  getTeamsData = async () => {
    try {
      const teamsApiEndpoint =
        API_PATH + Endpoint.get_quiz_teams + "?quizID=" + this.props.quizID;
      const teamsResponse = await fetch(teamsApiEndpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!teamsResponse.ok) {
        throw "Failed to get teams data";
      }
      const teams: TeamType[] = (await teamsResponse.json()).Teams || [];

      this.setState({
        currentTeams: teams,
        gotTeamsData: true,
      });
    } catch (error) {
      console.error(error);
      this.setState({
        serverError: true,
      });
    }
  };

  async componentDidMount() {
    if (!this.props.isNewQuiz && !this.state.gotTeamsData) {
      await this.getTeamsData();
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
              <p className="fs-3 d-inline">Provide Teams Detail </p>
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
              const teams: any[] = [];
              for (let i = 0; i < this.props.numOfTeams; i++) {
                const currentTeam: TeamType = this.state.currentTeams[i];
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
                              defaultValue={
                                currentTeam?.TeamName
                                  ? currentTeam?.TeamName
                                  : ""
                              }
                              required
                            />
                          </FloatingLabel>
                        </Row>
                      </Col>
                    </Row>
                    {/* Member 1 and 2*/}
                    <Row className="mt-3 d-flex justify-content-left">
                      {/* Member 1 */}
                      <Col md={3}>
                        <Row>
                          <FloatingLabel
                            controlId={`team${i + 1}Member1`}
                            label={"Member 1 Name"}
                            className="px-1"
                          >
                            <Form.Control
                              type="text"
                              placeholder={"Member 1 Name"}
                              defaultValue={
                                currentTeam?.Member1Name
                                  ? currentTeam?.Member1Name
                                  : ""
                              }
                            />
                          </FloatingLabel>
                        </Row>
                      </Col>
                      {/* Member 2 */}
                      <Col md={3}>
                        <Row>
                          <FloatingLabel
                            controlId={`team${i + 1}Member2`}
                            label={"Member 2 Name"}
                            className="px-1"
                          >
                            <Form.Control
                              type="text"
                              placeholder={"Member 2 Name"}
                              defaultValue={
                                currentTeam?.Member2Name
                                  ? currentTeam?.Member2Name
                                  : ""
                              }
                            />
                          </FloatingLabel>
                        </Row>
                      </Col>
                      {/* Member 3 */}
                      <Col md={3}>
                        <Row>
                          <FloatingLabel
                            controlId={`team${i + 1}Member3`}
                            label={"Member 3 Name"}
                            className="px-1"
                          >
                            <Form.Control
                              type="text"
                              placeholder={"Member 3 Name"}
                              defaultValue={
                                currentTeam?.Member3Name
                                  ? currentTeam?.Member3Name
                                  : ""
                              }
                            />
                          </FloatingLabel>
                        </Row>
                      </Col>
                      {/* Member 4 */}
                      <Col md={3}>
                        <Row>
                          <FloatingLabel
                            controlId={`team${i + 1}Member4`}
                            label={"Member 4 Name"}
                            className="px-1"
                          >
                            <Form.Control
                              type="text"
                              placeholder={"Member 4 Name"}
                              defaultValue={
                                currentTeam?.Member4Name
                                  ? currentTeam?.Member4Name
                                  : ""
                              }
                            />
                          </FloatingLabel>
                        </Row>
                      </Col>
                    </Row>
                  </React.Fragment>
                );
              }
              return teams;
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
