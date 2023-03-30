import React from "react";
import { ModifyQuizStep } from "../common";
import { HomeNavbar } from "../common";
import BasicInfo from "./BasicInfo";
import TeamInfo from "./TeamInfo";
import RoundInfo from "./RoundInfo";
import QuestionInfo from "./QuestionInfo";

/**
 * Create quiz component
 */
export default class NewQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            createQuizStep: ModifyQuizStep.BasicInfo,
            quizEventID: null,
            quizEventName: null,
            numOfRounds: null,
            numOfTeams: null
        }
    }

    nextStep = () => {
        if (this.state.createQuizStep >= ModifyQuizStep.LastStep) {
            // if last step is reached, return home
            window.location.replace("/");
        }

        this.setState({
            createQuizStep: this.state.createQuizStep + 1
        })
    }

    nextAfterBasicInfo = (quizEventID, quizEventName, numOfRounds, numOfTeams) => {
        const nextStep = this.state.createQuizStep + 1;
        this.setState({
            createQuizStep: nextStep,
            quizEventID: quizEventID,
            quizEventName: quizEventName,
            numOfRounds: numOfRounds,
            numOfTeams: numOfTeams
        })
    }

    render() {
        switch (this.state.createQuizStep) {
            case ModifyQuizStep.BasicInfo:
                return (
                    <React.Fragment>
                        <HomeNavbar />
                        <BasicInfo
                            nextStep={this.nextAfterBasicInfo}
                        />
                    </React.Fragment>
                );

            case ModifyQuizStep.TeamInfo:
                return (
                    <React.Fragment>
                        <HomeNavbar />
                        <TeamInfo
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