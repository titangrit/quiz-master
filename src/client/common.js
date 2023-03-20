import React from "react";
import "./common.css";PageTransitionEvent

export class Banner extends React.Component {
    constructor(props) {
        super(props);
    }

    appName = 'QuizMaster';

    render() {
        return (
            <div className="banner">
                <button className="app-name home-button" onClick={this.props.home}>{this.appName}</button>
                <h3 className="quiz-banner-text">{this.props.bannerText}</h3>
            </div>
        );
    }
}