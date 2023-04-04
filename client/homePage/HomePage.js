import React from "react";
import { QuizStatus, QuizAction } from "./../common";
import "./HomePage.css";

/**
 * Renders the quiz event name as banner
 */
class Logo extends React.Component {

    constructor(props) {
        super(props);
    }

    appName = 'QuizMaster';

    render() {
        return (
            <div className="logo-homepage">
                <h1>{this.appName}</h1>
            </div>
        )
    }
}

/**
 * Renders the home page
 */
export default class HomePage extends React.Component {
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

    createQuiz() {
        ;
    }

    render() {

        return (
            <div>
                <Logo />

                <div className="home-main-content">
                    <button className="new-quiz-button" onClick={() => { document.location.href = "new_quiz.html"; }}>New Quiz Event</button>
                    <div className="available-quizzes">
                        <p className="quizzes-table-title">Quizzes</p>
                        {this.displayQuizzes()}
                    </div>

                </div>
            </div>
        );
    }
}