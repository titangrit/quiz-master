import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

interface NavBarProps {}
export class HomeNavbar extends React.Component<NavBarProps> {
  constructor(props: NavBarProps) {
    super(props);
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
