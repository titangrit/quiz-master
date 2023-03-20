import React from "react";
import "./common.css";

export class HomeButton extends React.Component {
    constructor(props) {
        super(props);
    }

    appName = 'QuizMaster';

    render() {
        return (
            <div className="banner">
                <button className="home-button" onClick={this.props.home}>{this.appName}</button>
            </div>
        );
    }
}

export class ActivityTitle extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="activity-title">
                <p className="activity-title-itself">{this.props.activityTitle}</p>
                {this.props.activityTitleDesc ? <p className="activity-title-desc">{this.props.activityTitleDesc}</p> : null}
            </div>

        );
    }
}