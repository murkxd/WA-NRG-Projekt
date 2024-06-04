import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import icon from '../img/icon.png';

export function Headerbar({ isLoggedIn, onLogout }) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/home">
          <img
            alt=""
            src={icon}
            width="30"
            height="30"
            className="align-top"
          />{' '}
          <span style={{ marginTop: '3px', display: 'inline-block' }}>
            NO-REELGRAM
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            {!isLoggedIn && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
            {!isLoggedIn && <Nav.Link as={Link} to="/register">Register</Nav.Link>}
            {isLoggedIn && <Nav.Link as={Link} to="/profile">Profile</Nav.Link>}
            {isLoggedIn && <Nav.Link as={Link} to="/addpost">Add Post</Nav.Link>}
            {isLoggedIn && <Nav.Link as={Link} to="/home" onClick={onLogout}>Logout</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Headerbar;