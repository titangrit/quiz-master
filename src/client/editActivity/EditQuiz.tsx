import React from "react";
import ReactDOM from "react-dom/client";
import "./../common/style.css";
import { HomeNavbar, API_PATH } from "../common";
import { Endpoint, QuizLifecycleStatusCode } from "./../../server";
import BasicInfo from "./BasicInfo";
import TeamInfo from "./TeamInfo";
import RoundInfo from "./RoundInfo";
import QuestionInfo from "./QuestionInfo";

interface EditQuizState {
  currentEditStep: number;
  quizID: number;
  quizEventName: string;
  numOfRounds: number;
  numOfTeams: number;
  serverError: boolean;
}

/**
 * Create quiz component
 */
export default class EditQuiz extends React.Component<object, EditQuizState> {
  readonly EditQuizStep = {
    BasicInfo: 1,
    TeamInfo: 2,
    RoundInfo: 3,
    QuestionInfo: 4,
    End: 4,
  };

  constructor(props: object) {
    super(props);
    this.state = {
      currentEditStep: this.EditQuizStep.BasicInfo,
      quizID: 0,
      quizEventName: "",
      numOfRounds: 1,
      numOfTeams: 2,
      serverError: false,
    };

    this.confirmExit = this.confirmExit.bind(this);
    window.addEventListener("beforeunload", this.confirmExit);
  }

  confirmExit = () => {
    const confirmationMessage = "o/";
    // (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Webkit, Safari, Chrome
  };

  nextStep = async () => {
    if (this.state.currentEditStep >= this.EditQuizStep.End) {
      // if last step is reached:
      // 1. Set the quiz LifecycleStatusCode to Ready
      try {
        const apiEndpoint = API_PATH + Endpoint.set_quiz_status;
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            QuizID: this.state.quizID,
            QuizLifecycleStatusCode: QuizLifecycleStatusCode.Ready,
          }),
        });
        if (!response.ok) {
          throw `${apiEndpoint} responded ${response.statusText}; HTTP code: ${response.status}`;
        }
      } catch (error) {
        console.error(error);
        this.setState({
          serverError: true,
        });
      }

      // 2. Navigate to View Quiz
      window.removeEventListener("beforeunload", this.confirmExit);
      window.location.replace(`/view_quiz.html?quizID=${this.state.quizID}`);
    }

    this.setState({
      currentEditStep: this.state.currentEditStep + 1,
    });
  };

  nextAfterBasicInfo = (
    quizID: number,
    quizEventName: string,
    numOfRounds: number,
    numOfTeams: number
  ) => {
    const nextStep = this.state.currentEditStep + 1;
    this.setState({
      currentEditStep: nextStep,
      quizID: quizID,
      quizEventName: quizEventName,
      numOfRounds: numOfRounds,
      numOfTeams: numOfTeams,
    });
  };

  render() {
    if (this.state.serverError) {
      return (
        <React.Fragment>
          <HomeNavbar />
          <p style={{ color: "red" }}>A server error occurred</p>
        </React.Fragment>
      );
    }
    switch (this.state.currentEditStep) {
      case this.EditQuizStep.BasicInfo:
        return (
          <React.Fragment>
            <HomeNavbar />
            <BasicInfo nextStep={this.nextAfterBasicInfo} />
          </React.Fragment>
        );

      case this.EditQuizStep.TeamInfo:
        return (
          <React.Fragment>
            <HomeNavbar />
            <TeamInfo
              quizID={this.state.quizID}
              quizEventName={this.state.quizEventName}
              numOfTeams={this.state.numOfTeams}
              nextStep={this.nextStep}
            />
          </React.Fragment>
        );

      case this.EditQuizStep.RoundInfo:
        return (
          <React.Fragment>
            <HomeNavbar />
            <RoundInfo
              quizID={this.state.quizID}
              quizEventName={this.state.quizEventName}
              numOfRounds={this.state.numOfRounds}
              nextStep={this.nextStep}
            />
          </React.Fragment>
        );

      case this.EditQuizStep.QuestionInfo:
        return (
          <React.Fragment>
            <HomeNavbar />
            <QuestionInfo
              quizID={this.state.quizID}
              quizEventName={this.state.quizEventName}
              numOfRounds={this.state.numOfRounds}
              numOfTeams={this.state.numOfTeams}
              nextStep={this.nextStep}
            />
          </React.Fragment>
        );
    }
  }
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<EditQuiz />);
