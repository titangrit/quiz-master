import React from "react";
import "./../common/style.css";
import { ModifyQuizStep } from "../common";
import { HomeNavbar } from "../common";
import BasicInfo from "./BasicInfo";
import TeamInfo from "./TeamInfo";
import RoundInfo from "./RoundInfo";
import QuestionInfo from "./QuestionInfo";

/**
 * Edit quiz component
 */
export default class EditQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editQuizStep: ModifyQuizStep.BasicInfo,
            quizEventID: null,
            quizEventName: null,
            numOfRounds: null,
            numOfTeams: null,
            isEdit: false,
        }

        const queryParams = new URLSearchParams(window.location.search)
        this.state.quizEventID = queryParams.get('quizID');
        if (!!this.state.quizEventID) {
            this.state.isEdit = true;
        }

        this.confirmExit = this.confirmExit.bind(this);
        window.addEventListener("beforeunload", this.confirmExit);
    }

    confirmExit = (e) => {
        var confirmationMessage = "\o/";

        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return confirmationMessage;                            //Webkit, Safari, Chrome
    }

    nextStep = async () => {
        if (this.state.editQuizStep >= ModifyQuizStep.LastStep) {
            // if last step is reached:
            // 1. Set the quiz LifecycleStatusCode to Ready
            // 2. Navigate to View Quiz

            // Set the quiz LifecycleStatus to Ready
            try {
                const response = await fetch("/quiz/ready", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        quizID: this.state.quizEventID
                    })
                });
            } catch (err) {
                console.log(err);
            }

            // Navigate to View Quiz
            window.removeEventListener("beforeunload", this.confirmExit);
            window.location.replace(`/view_quiz.html?quizID=${this.state.quizEventID}`);
        }

        this.setState({
            editQuizStep: this.state.editQuizStep + 1
        })
    }

    nextAfterBasicInfo = (quizEventID, quizEventName, numOfRounds, numOfTeams) => {
        const nextStep = this.state.editQuizStep + 1;
        this.setState({
            editQuizStep: nextStep,
            quizEventID: quizEventID,
            quizEventName: quizEventName,
            numOfRounds: numOfRounds,
            numOfTeams: numOfTeams
        })
    }

    render() {
        switch (this.state.editQuizStep) {
            case ModifyQuizStep.BasicInfo:
                return (
                    <React.Fragment>
                        <HomeNavbar />
                        <BasicInfo
                            isEdit={this.state.isEdit}
                            quizEventID={this.state.quizEventID}
                            nextStep={this.nextAfterBasicInfo}
                        />
                    </React.Fragment>
                );

            case ModifyQuizStep.TeamInfo:
                return (
                    <React.Fragment>
                        <HomeNavbar />
                        <TeamInfo
                            isEdit={this.state.isEdit}
                            quizEventName={this.state.quizEventName}
                            quizEventID={this.state.quizEventID}
                            numOfTeams={this.state.numOfTeams}
                            nextStep={this.nextStep}
                        />
                    </React.Fragment>
                );

            case ModifyQuizStep.RoundInfo:
                return (
                    <React.Fragment>
                        <HomeNavbar />
                        <RoundInfo
                            isEdit={this.state.isEdit}
                            quizEventName={this.state.quizEventName}
                            quizEventID={this.state.quizEventID}
                            numOfRounds={this.state.numOfRounds}
                            nextStep={() => this.nextStep()}
                        />
                    </React.Fragment>
                );

            case ModifyQuizStep.QuestionInfo:
                return (
                    <React.Fragment>
                        <HomeNavbar />
                        <QuestionInfo
                            isEdit={this.state.isEdit}
                            quizEventName={this.state.quizEventName}
                            quizEventID={this.state.quizEventID}
                            numOfRounds={this.state.numOfRounds}
                            numOfTeams={this.state.numOfTeams}
                            nextStep={() => this.nextStep()}
                        />
                    </React.Fragment>
                );
        }
    }
}