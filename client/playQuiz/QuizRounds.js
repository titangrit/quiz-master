import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';
import { PlayQuizEachRoundStep } from "../common";

class Question extends React.Component {
    constructor(props) {
        super(props);
    }
}

class RoundInfo extends React.Component {
    constructor(props) {
        super(props);
    }
}

class RoundResult extends React.Component {
    constructor(props) {
        super(props);
    }
}

class Round extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roundStep: PlayQuizEachRoundStep.RoundInfo,
            currentQuestionNumber: 1,
            currentQuestion: null,
            targetTeamIndex: null,
            roundType: null,
            errorOccured: false,
            roundInfoObtained: false,
        }

        if (this.props.resume) {
            this.state.roundStep = PlayQuizEachRoundStep.Questions;
            this.state.currentQuestionNumber = this.props.currentQuestionNumber;
        }

        this.roundDetail = {
            RoundTypeInfo: {},
            Questions: []
        };
    }

    nextStep = () => {
        if (this.state.roundStep >= PlayQuizEachRoundStep.LastStep) {
            this.props.nextRound();
        }

        this.setState({
            roundStep: this.state.roundStep + 1
        });
    }

    nextQuestion = () => {
        if (this.roundDetail.RoundTypeInfo.NumQuestionsEachTeam * this.props.quizInfo.NumberOfTeams >= this.state.currentQuestionNumber) {
            this.setState({
                roundStep: this.state.roundStep + 1
            });
        }

        const currentQuestionNumber = this.state.currentQuestionNumber + 1;

        // determine current question
        const currentQuestion = this.roundDetail.Questions.find(q => q.SequenceNumber == currentQuestionNumber);

        //  determine current target team
        const _n = currentQuestionNumber;
        const _t = this.props.quizInfo.NumberOfTeams;
        const targetTeamIndex = (_n % _t ? _n % t : t) - 1;

        this.setState({
            currentQuestionNumber: currentQuestionNumber,
            currentQuestion: currentQuestion,
            targetTeamIndex: targetTeamIndex
        });
    }

    getRoundAndQuestionsDetail = async () => {
        try {

            // Get round type info
            let response = await fetch("/quiz/round_types?roundTypeID=" + this.props.round.RoundTypeID, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                const _response = await response.json();

                this.roundDetail.RoundTypeInfo = _response.RoundType;
            } else {
                this.setState({
                    errorOccured: true
                });
                throw `Failed to Load Round ${this.props.round.SequenceNumber} - ${this.props.round.RoundTypeID}`;
            }

            // Get questions of this round
            response = await fetch("/quiz/questions?roundUUID=" + this.props.round.UUID, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                const _response = await response.json();

                this.roundDetail.Questions = _response;
            } else {
                this.setState({
                    errorOccured: true
                });
                throw `Failed to Load Questions of Round ${this.props.round.SequenceNumber} - ${this.props.round.RoundTypeID}`;
            }

            // determine current question
            this.state.currentQuestion = this.roundDetail.Questions.find(q => q.SequenceNumber == this.state.currentQuestionNumber);

            //  determine current target team
            const _n = this.state.currentQuestionNumber;
            const _t = this.props.quizInfo.NumberOfTeams;
            this.state.targetTeamIndex = (_n % _t ? _n % t : t) - 1;

        } catch (err) {
            throw err;
        }
    }

    async componentDidMount() {
        if (!this.state.roundInfoObtained) {
            await this.getRoundAndQuestionsDetail();
            this.setState({
                roundInfoObtained: true
            });
        }
    }

    render() {

        if (this.state.errorOccured) {
            return (
                <div className="mt-5 d-flex justify-content-center">
                    <p style={{ color: 'red' }}>An error occurred. Check the server log.</p>
                </div>
            );
        }

        if (!this.state.roundInfoObtained) {
            return (
                <div className="mt-5 d-flex justify-content-center">
                    <h3><Spinner animation="border" role="status" /> Loading Round {this.props.round.SequenceNumber} - {this.props.round.RoundTypeID}...</h3>
                </div>
            );
        }

        switch (this.state.roundStep) {
            case PlayQuizEachRoundStep.RoundInfo:
                return (
                    <RoundInfo

                    />
                );

            case PlayQuizEachRoundStep.Questions:
                return (
                    <Question
                        quizEventID={this.props.quizEventID}
                        roundTypeInfo={this.roundDetail.RoundTypeInfo}
                        question={this.state.currentQuestion}
                        targetTeamIndex={this.state.targetTeamIndex}
                        quizInfo={this.props.quizInfo}
                        nextQuestion={this.nextQuestion}
                    />
                );

            case PlayQuizEachRoundStep.RoundResult:
                return (
                    <RoundResult

                    />
                );
        }
    }
}

export default class QuizRounds extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quizEventID: this.props.quizEventID,
            resume: this.props.resume,
            roundIndex: 1,
            currentQuestionNumber: null,
            quizRounds: [],
            quizInfo: {
                QuizEventName: null,
                NumberOfTeams: null,
                TeamUUIDs: [],
                TeamNames: []
            },
            errorOccured: false,
            roundsInfoObtained: false,
        }
    }

    nextRound = async () => {
        if (this.state.roundIndex > this.state.quizRounds.length) {
            this.props.nextStep();
        }

        this.setState({
            resume: false, // reset resume flag
            roundIndex: this.state.roundIndex + 1
        });
    }

    getQuizAndRoundsDetail = async () => {
        try {

            // Get quiz basic info
            let response = await fetch("/quiz/basic_info?quizID=" + this.props.quizEventID, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                const _response = await response.json();

                this.state.quizInfo.QuizEventName = _response.QuizEventName;
                this.state.quizInfo.NumberOfTeams = _response.NumberOfTeams;
                this.state.quizInfo.TeamUUIDs = _response.TeamUUIDs;

                if (this.state.resume) {
                    this.state.roundIndex = _response.CurrentRound;
                    this.state.currentQuestionNumber = _response.CurrentQuestion;
                }

            } else {
                this.setState({
                    errorOccured: true
                });
                throw "Failed to Load Quiz Basic Detail";
            }

            // Get quiz team info
            response = await fetch("/quiz/team_info?quizID=" + this.props.quizEventID, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                this.state.quizInfo.TeamNames = await response.json();
            } else {
                this.setState({
                    errorOccured: true
                });
                throw "Failed to Load Teams Detail";
            };

            // Get quiz rounds info
            response = await fetch("/quiz/rounds?quizID=" + this.props.quizEventID, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                this.state.quizRounds = await response.json();
            } else {
                this.setState({
                    errorOccured: true
                });
                throw "Failed to Load Rounds Detail";
            };

        } catch (err) {
            throw err;
        }
    }

    async componentDidMount() {
        if (!this.state.roundsInfoObtained) {
            await this.getQuizAndRoundsDetail();
            this.setState({
                roundsInfoObtained: true
            });
        }
    }

    render() {

        if (this.state.errorOccured) {
            return (
                <div className="mt-5 d-flex justify-content-center">
                    <p style={{ color: 'red' }}>An error occurred. Check the server log.</p>
                </div>
            );
        }

        if (!this.state.roundsInfoObtained) {
            return (
                <div className="mt-5 d-flex justify-content-center">
                    <h3><Spinner animation="border" role="status" /> Loading Rounds...</h3>
                </div>
            );
        }

        const round = this.state.quizRounds.find(r => r.SequenceNumber == this.state.roundIndex);

        return (
            <Round
                quizEventID={this.props.quizEventID}
                resume={this.state.resume}
                currentQuestionNumber={this.state.currentQuestionNumber}
                quizInfo={this.state.quizInfo}
                round={round}
                nextRound={this.nextRound}
            />
        );
    }
}