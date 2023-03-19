import React from "react";
import { Activity, BackgroundColor } from "./constants";
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
 * ColorPicker component
 */
class ColorPicker extends React.Component {
    constructor(props) {
        super(props);
    }

    handleChange(color) {
        this.props.setBgColor(color)
    }

    /*for the lifecycle methods*/
    updateBackgroundColor() {
        let body = document.querySelector('body')
        body.style.background = this.props.bgColor
    }

    /*lifecycle methods*/
    componentDidMount() {
        this.updateBackgroundColor()
    }

    componentDidUpdate() {
        this.updateBackgroundColor()
    }

    render() {
        return (
            <div className="">
                <div className="bgCircle">
                    <div className="circle color1" onClick={() => this.handleChange(BackgroundColor.Color1)}></div>
                    <div className="circle color2" onClick={() => this.handleChange(BackgroundColor.Color2)}></div>
                    <div className="circle color3" onClick={() => this.handleChange(BackgroundColor.Color3)}></div>
                    <div className="circle color4" onClick={() => this.handleChange(BackgroundColor.Color4)}></div>
                    <div className="circle color5" onClick={() => this.handleChange(BackgroundColor.Color5)}></div>
                    <div className="circle color6" onClick={() => this.handleChange(BackgroundColor.Color6)}></div>
                </div>
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
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Banner />
                <div>This is the HomePage component</div>
                <button onClick={this.props.createQuiz}>Create Quiz</button>
                <label>
                    <ColorPicker
                        bgColor={this.props.bgColor}
                        setBgColor={(color) => this.props.setBgColor(color)}
                    />
                </label>
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
            activity: Activity.Home,
            bgColor: BackgroundColor.Color1
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

    setBgColor(color) {
        this.setState(
            {
                bgColor: color
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
                        bgColor={this.state.bgColor}
                        setBgColor={(color) => this.setBgColor(color)}
                    />
                )
        }

    }
}