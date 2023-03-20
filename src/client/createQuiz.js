import React from "react";
import "./createQuiz.css";
import { HomeButton, ActivityTitle } from "./common";


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