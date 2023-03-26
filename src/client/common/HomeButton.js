import React from "react";
import "./HomeButton.css";

export class HomeButton extends React.Component {
    constructor(props) {
        super(props);
    }

    appName = 'QuizMaster';

    render() {
        return (
            <div className="banner">
                <button className="home-button" onClick={() => { document.location.href = "/" }}>{this.appName}</button>
            </div>
        );
    }
}