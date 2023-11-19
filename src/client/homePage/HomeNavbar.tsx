import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

export class HomeNavbar extends React.Component {
  constructor() {
    super({});
  }

  render() {
    return (
      <Navbar sticky="top" bg="dark" variant="dark">
        <Container>
          {/* Without Container, the element stays extreme left! */}
          <Navbar.Brand href="index.html">QuizMaster</Navbar.Brand>
        </Container>
      </Navbar>
    );
  }
}
