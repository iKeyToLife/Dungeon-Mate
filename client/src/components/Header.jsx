import { useEffect, useState } from 'react';
import { Container, Nav, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
import AuthService from '../utils/auth';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const loggedIn = await AuthService.loggedIn();
      setIsLoggedIn(loggedIn);
    };

    checkAuthStatus();
  }, []);

  return (
    <Navbar color="dark" dark expand="md">
      <Container>
        <NavbarBrand href="/">Dungeon Mate</NavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink href="/characters">Characters</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/campaigns">Campaigns</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/encounters">Encounters</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/bestiary">Bestiary</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/login">Login/Signup</NavLink>
          </NavItem>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;