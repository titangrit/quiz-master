import React from "react";
import { Activity } from "./utility";
import "./quizMaster.css";

/**
 * Renders the quiz event name as banner
 */
class Banner extends React.Component {

    constructor(props) {
        super(props);

        // get quiz event name
        let quizEventName;
        if (this.props.eventId === undefined) {
            quizEventName = 'QuizMaster';
        } else {
            // TODO: API call to get the name of this event
            quizEventName = new Date();
        }

        this.state = {
            quizEventName: quizEventName
        }
    }

    render() {
        return (
            <div className="banner">
                <h1 className="title">{this.state.quizEventName}</h1>
            </div>
        )
    }
}

/**
 * Renders the quiz creation UI
 */
class CreateQuiz extends React.Component {
    render() {
        return (
            <div>
                <Banner />
                <div>This is the CreateQuiz component</div>
                <button onClick={this.props.homePage}>Go to home page</button>
            </div>
        )
    }
}

/**
 * Renders the home page
 */
class HomePage extends React.Component {
    render() {
        return (
            <div>
                <Banner />
                <div>This is the HomePage component</div>
                <button onClick={this.props.createQuiz}>Create Quiz</button>
            </div>
        )
    }
}

/**
 * Main
 */
export default class QuizMaster extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activity: Activity.Home
        }
    }

    homePage() {
        this.setState(
            {
                activity: Activity.Home
            }
        )
    }

    createQuiz() {
        this.setState(
            {
                activity: Activity.Create
            }
        )
    }

    copyQuiz() {
        this.setState(
            {
                activity: Activity.Copy
            }
        )
    }

    editQuiz() {
        this.setState(
            {
                activity: Activity.Edit
            }
        )
    }

    playQuiz() {
        this.setState(
            {
                activity: Activity.Play
            }
        )
    }

    render() {

        switch (this.state.activity) {
            case Activity.Create:
                return (
                    <CreateQuiz
                        homePage={() => this.homePage()}
                    />
                )

            default:
                return (
                    <HomePage
                        createQuiz={() => this.createQuiz()}
                        copyQuiz={() => this.copyQuiz()}
                        editQuiz={() => this.editQuiz()}
                        playQuiz={() => this.playQuiz()}
                    />
                )
        }

    }
}