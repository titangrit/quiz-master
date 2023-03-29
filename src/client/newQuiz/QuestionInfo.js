import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { HomeButton, ActivityTitle, ModifyQuizStep } from "../common";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FormLabel } from "react-bootstrap";

/**
 * Control conditional rendering of QuestionInfo
 */
class QuestionInfoController extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

    }
}

/**
 * Fill question information
 */
export default class QuestionInfo extends React.Component {
    constructor(props) {
        super(props);
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

