import React from "react";
import "./../common/style.css";
import { PlayQuizStep } from "../common";
import { HomeNavbar } from "../common";
import TeamInfo from "./TeamInfo";
import AboutQuiz from "./AboutQuiz";
import QuizRounds from "./QuizRounds";
import FinalResult from "./FinalResult";

/**
 * Play quiz main component
 */
export default class PlayQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playQuizStep: PlayQuizStep.TeamInfo,
            quizEventID: null,
            resume: false
        }

        const queryParams = new URLSearchParams(window.location.search)
        this.state.quizEventID = queryParams.get('quizID');
        const resume = queryParams.get('resume');

        if (resume === "true") {
            this.state.resume = true;
            this.state.playQuizStep = PlayQuizStep.Rounds;
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
        if (this.state.playQuizStep >= PlayQuizStep.LastStep) {
            // Now it will go to final result page.
            window.removeEventListener("beforeunload", this.confirmExit);
        }

        this.setState({
            playQuizStep: this.state.playQuizStep + 1
        })
    }

    render() {
        switch (this.state.playQuizStep) {
            case PlayQuizStep.TeamInfo:
                return (
                    <React.Fragment>
                        <HomeNavbar />
                        <TeamInfo
                            quizEventID={this.state.quizEventID}
                            nextStep={this.nextStep}
                        />
                    </React.Fragment>
                );

            case PlayQuizStep.AboutQuiz:
                return (
                    <React.Fragment>
                        <HomeNavbar />
                        <AboutQuiz
                            quizEventID={this.state.quizEventID}
                            nextStep={this.nextStep}
                        />
                    </React.Fragment>
                );

            case PlayQuizStep.Rounds:
                return (
                    <React.Fragment>
                        <HomeNavbar />
                        <QuizRounds
                            quizEventID={this.state.quizEventID}
                            resume={this.state.resume}
                            nextStep={() => this.nextStep()}
                        />
                    </React.Fragment>
                );

            case PlayQuizStep.FinalResult:
                return (
                    <React.Fragment>
                        <HomeNavbar />
                        <FinalResult
                            quizEventID={this.state.quizEventID}
                        />
                    </React.Fragment>
                );
        }
    }
}