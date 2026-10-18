import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          P2P Transfer
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default NavBar; 