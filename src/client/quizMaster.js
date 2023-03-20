import React from "react";
import { Activity, QuizStatus, QuizAction, BackgroundColor } from "./constants";
import CreateQuiz from "./createQuiz";
import "./quizMaster.css";

/**
 * Renders the quiz event name as banner
 */
class HomeBanner extends React.Component {

    constructor(props) {
        super(props);
    }

    appName = 'QuizMaster';

    render() {
        return (
            <div className="banner-homepage">
                <h1 className="title">{this.appName}</h1>
            </div>
        )
    }
}

/**
 * ColorPicker component
 */
class ColorPicker extends React.Component {
    constructor(props) {
        super(props);
    }

    handleChange(color) {
        this.props.setBgColor(color);
    }

    /*for the lifecycle methods*/
    updateBackgroundColor() {
        let body = document.querySelector('body');
        body.style.background = this.props.bgColor;
    }

    /*lifecycle methods*/
    componentDidMount() {
        this.updateBackgroundColor();
    }

    componentDidUpdate() {
        this.updateBackgroundColor();
    }

    render() {
        return (
            <div className="bgCircle">
                <div className="circle color1" onClick={() => this.handleChange(BackgroundColor.Color1)}></div>
                <div className="circle color2" onClick={() => this.handleChange(BackgroundColor.Color2)}></div>
                <div className="circle color3" onClick={() => this.handleChange(BackgroundColor.Color3)}></div>
                <div className="circle color4" onClick={() => this.handleChange(BackgroundColor.Color4)}></div>
                <div className="circle color5" onClick={() => this.handleChange(BackgroundColor.Color5)}></div>
                <div className="circle color6" onClick={() => this.handleChange(BackgroundColor.Color6)}></div>
            </div>
        );
    }
}

/**
 * Renders the home page
 */
export class HomePage extends React.Component {
    constructor(props) {
        super(props);
    }

    getAllQuizzes() {
        // TODO: API call to get the list of available quizzes
        let quizzes = [];
        quizzes.push({
            name: "quiz1",
            date: new Date(),
            status: QuizStatus.Draft,
            action1: QuizAction.Start,
            action2: QuizAction.Edit
        })
        quizzes.push({
            name: "quiz2",
            date: new Date(),
            status: QuizStatus.Draft,
            action1: QuizAction.Start,
            action2: QuizAction.Edit
        })
        quizzes.push({
            name: "quiz3",
            date: new Date(),
            status: QuizStatus.Ready,
            action1: QuizAction.Edit
        })
        quizzes.push({
            name: "quiz4",
            date: new Date(),
            status: QuizStatus.Ready,
            action1: QuizAction.Resume
        })
        quizzes.push({
            name: "very very long text very very long text very very long text very very long text very very long text very very long text very very long text very very long text",
            date: new Date(),
            status: QuizStatus.Running,
            action1: QuizAction.Resume
        })
        quizzes.push({
            name: "quiz6",
            date: new Date(),
            status: QuizStatus.Running,
            action1: QuizAction.Resume
        })
        quizzes.push({
            name: "quiz7",
            date: new Date(),
            status: QuizStatus.Completed,
            action1: QuizAction.ViewResult
        })
        quizzes.push({
            name: "quiz8",
            date: new Date(),
            status: QuizStatus.Completed,
            action1: QuizAction.ViewResult
        })

        return quizzes;
    }

    displayQuizzes() {
        let quizzes = this.getAllQuizzes();
        if (quizzes.length > 0) {
            return (
                <div className="quizzes-table-container">
                    {quizzes.map((item, index) => {
                        return (
                            <div className="quiz-row">
                                <p className="quiz-description">
                                    {item.date.toLocaleDateString() + " | " + item.name}
                                </p>
                                <div className="quiz-action">{item.action1}</div>
                                {item.action2 ? <div className="quiz-action">{item.action2}</div> : null}
                            </div>
                        )
                    })}
                </div>
            );
        } else {
            return (
                <p className="quiz-name">No items to display</p>
            );
        }
    }

    render() {

        return (
            <div>
                <HomeBanner />

                <div className="home-main-content">
                    <button className="new-quiz-button" onClick={this.props.createQuiz}>New Quiz Event</button>
                    <div className="available-quizzes">
                        <p className="quizzes-table-title">Quizzes</p>
                        {this.displayQuizzes()}
                    </div>

                </div>

                <label>
                    <ColorPicker
                        bgColor={this.props.bgColor}
                        setBgColor={(color) => this.props.setBgColor(color)}
                    />
                </label>
            </div>
        );
    }
}

/**
 * Main
 */
export default class QuizMaster extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activity: Activity.Home,
            bgColor: BackgroundColor.Color1
        }
    }

    homePage() {
        this.setState(
            {
                activity: Activity.Home
            }
        );
    }

    createQuiz() {
        this.setState(
            {
                activity: Activity.Create
            }
        );
    }

    copyQuiz() {
        this.setState(
            {
                activity: Activity.Copy
            }
        );
    }

    editQuiz() {
        this.setState(
            {
                activity: Activity.Edit
            }
        );
    }

    playQuiz() {
        this.setState(
            {
                activity: Activity.Play
            }
        );
    }

    setBgColor(color) {
        this.setState(
            {
                bgColor: color
            }
        );
    }

    render() {

        switch (this.state.activity) {
            case Activity.Create:
                return (
                    <CreateQuiz
                        home={() => this.homePage()}
                    />
                );

            default:
                return (
                    <HomePage
                        createQuiz={() => this.createQuiz()}
                        copyQuiz={() => this.copyQuiz()}
                        editQuiz={() => this.editQuiz()}
                        playQuiz={() => this.playQuiz()}
                        bgColor={this.state.bgColor}
                        setBgColor={(color) => this.setBgColor(color)}
                    />
                );
        }

    }
}