import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Container } from 'reactstrap';

const Header = () => {
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