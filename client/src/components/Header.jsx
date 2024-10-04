import gsap from 'gsap';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Nav, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
import DMLogoTrans from '../../DungeonMateLogo2.png';

const Header = () => {
  const location = useLocation(); // Get the current route

  useEffect(() => {
    const activeLink = document.querySelector(`.nav-link[href='${location.pathname}']`);
    if (activeLink) {
      gsap.to(activeLink, {
        textShadow: '0px 0px 15px gold',
        color: 'gold',
        duration: 0.75,
        repeat: -1,
        yoyo: true
      });
    }
  }, [location]);

  return (
    <Navbar color="dark" dark expand="md" style={{ padding: '0 1rem' }}>
      <Container className="d-flex justify-content-between align-items-end">
        <NavbarBrand href="/" className="d-flex align-items-center">
          <img src={DMLogoTrans} alt="Dungeon Mate Logo" style={{ height: '90px', marginRight: '20px', width: '125px' }} />
        </NavbarBrand>
        <Nav className="ml-3 d-flex align-items-end" navbar style={{ fontSize: '1.25rem' }}>
          <NavItem>
            <NavLink href="/characters" className={location.pathname === '/characters' ? 'active' : ''}>Characters</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/campaigns" className={location.pathname === '/campaigns' ? 'active' : ''}>Campaigns</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/encounters" className={location.pathname === '/encounters' ? 'active' : ''}>Encounters</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/bestiary" className={location.pathname === '/bestiary' ? 'active' : ''}>Bestiary</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/login" className={location.pathname === '/login' ? 'active' : ''}>Login/Signup</NavLink>
          </NavItem>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;