import React from "react";
import "./createQuiz.css";
import { Banner } from "./common";

/**
 * Create quiz component
 */
export default class CreateQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quizEventName: 'New Quiz Event'
        }
    }

    render() {
        return (
            <div>
                <Banner
                    bannerText={this.state.quizEventName}
                    home={this.props.home}
                />
                <div>This is the CreateQuiz component</div>
                <button onClick={this.props.home}>Go to home page</button>
            </div>
        );
    }
}