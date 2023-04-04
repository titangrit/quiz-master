import React from "react";
import "./ActivityTitle.css";

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