import React from "react";
import "./NewQuiz.css";
import { HomeButton, ActivityTitle, ModifyQuizStep } from "../common";

/**
 * Fill question information
 */
class QuestionInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <HomeButton
                    home={this.props.home}
                />

                <ActivityTitle
                    activityTitle={'New Quiz Event'}
                    activityTitleDesc={'Quiz Championship 2023'}
                />

            </div>
        );
    }
}

/**
 * Control conditional rendering of QuestionInfo
 */
class QuestionInfoController extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

    }
}

/**
 * Fill round information
 */
class RoundInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <HomeButton
                    home={this.props.home}
                />

                <ActivityTitle
                    activityTitle={'New Quiz Event'}
                    activityTitleDesc={'Quiz Championship 2023'}
                />

            </div>
        );
    }
}

/**
 * Fill team information
 */
class TeamInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <HomeButton
                    home={this.props.home}
                />

                <ActivityTitle
                    activityTitle={'New Quiz Event'}
                    activityTitleDesc={'Quiz Championship 2023'}
                />

            </div>
        );
    }
}

/**
 * Fill quiz basic information
 */
class BasicInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <HomeButton
                    home={this.props.home}
                />

                <ActivityTitle
                    activityTitle={'New Quiz Event'}
                />

                <div className="basic-info-container">
                    <p className="create-content-desc">Basic Details</p>
                    <div className="basic-info-content">

                    </div>

                </div>

            </div>
        );
    }
}

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

    nextStep() {
        if (this.state.createQuizStep >= ModifyQuizStep.LastStep) {
            // if last step is reached, return home
            this.props.home();
        }

        this.setState({
            createQuizStep: this.state.createQuizStep + 1
        })
    }

    nextAfterBasicInfo(quizEventID, quizEventName, numOfRounds, numOfTeams) {
        this.setState({
            createQuizStep: this.state.createQuizStep + 1,
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
                    <BasicInfo
                        home={this.props.home}
                        nextStep={() => this.nextAfterBasicInfo()}
                    />
                );

            case ModifyQuizStep.TeamInfo:
                return (
                    <TeamInfo
                        home={this.props.home}
                        quizEventName={this.state.quizEventName}
                        quizEventID={this.state.quizEventID}
                        numOfTeams={this.state.numOfTeams}
                        nextStep={() => this.nextStep()}
                    />
                );

            case ModifyQuizStep.RoundInfo:
                return (
                    <RoundInfo
                        home={this.props.home}
                        quizEventName={this.state.quizEventName}
                        quizEventID={this.state.quizEventID}
                        numOfRounds={this.state.numOfRounds}
                        nextStep={() => this.nextStep()}
                    />
                );

            case ModifyQuizStep.QuestionInfo:
                return (
                    <QuestionInfoController
                        home={this.props.home}
                        quizEventName={this.state.quizEventName}
                        quizEventID={this.state.quizEventID}
                        nextStep={() => this.nextStep()}
                    />
                );
        }
    }
}