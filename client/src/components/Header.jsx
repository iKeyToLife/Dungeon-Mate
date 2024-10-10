import { gsap } from 'gsap';
import { useEffect, useState } from 'react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar, NavbarBrand, NavItem } from 'reactstrap';
import AuthService from '../utils/auth';
import DMLogoTrans from '/images/otherImages/DungeonMateLogo2.png';

const Header = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogout, setIsLogout] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const loggedIn = await AuthService.loggedIn();
      setIsLoggedIn(loggedIn);
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    const logout = async () => {
      await AuthService.logout();
      setIsLoggedIn(false);
    };

    if (isLogout) {
      logout();
      setIsLogout(false);
    }
  }, [isLogout]);

  useEffect(() => {
    const allLinks = document.querySelectorAll('.custom-nav-link');
    const activeLink = document.querySelector('.nav-link.active');

    // Kill any existing animations on all links to prevent lingering effects
    gsap.killTweensOf(allLinks);

    // Reset the style for all links
    allLinks.forEach(link => {
      gsap.to(link, { textShadow: 'none', color: '', duration: 0.5 });
    });

    // Apply glowing effect to the active link
    if (activeLink) {
      gsap.to(activeLink, {
        textShadow: '1px 1px 15px gold',
        color: 'gold',
        duration: 0.9,
        repeat: -1,
        yoyo: true
      });
    }
  }, [location]);

  return (
    <Navbar dark expand="md" style={{ padding: '0 1rem', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
      <Container className="d-flex justify-content-between align-items-end">
        <NavbarBrand tag={RouterNavLink} to="/" className="d-flex align-items-center">
          <img src={DMLogoTrans} alt="Dungeon Mate Logo" style={{ height: '90px', marginRight: '20px', width: '125px' }} />
        </NavbarBrand>
        {isLoggedIn ? (
          <Nav className="ml-3 d-flex align-items-end" navbar style={{ fontSize: '1.25rem' }}>
            <NavItem>
              <RouterNavLink to="/characters" className="nav-link custom-nav-link" activeclassname="active" style={{ color: 'lightgray' }}>Characters</RouterNavLink>
            </NavItem>
            <NavItem>
              <RouterNavLink to="/campaigns" className="nav-link custom-nav-link" activeclassname="active" style={{ color: 'lightgray' }}>Campaigns</RouterNavLink>
            </NavItem>
            <NavItem>
              <RouterNavLink to="/dungeons" className="nav-link custom-nav-link" activeclassname="active" style={{ color: 'lightgray' }}>Dungeons</RouterNavLink>
            </NavItem>
            <NavItem>
              <RouterNavLink to="/encounters" className="nav-link custom-nav-link" activeclassname="active" style={{ color: 'lightgray' }}>Encounters</RouterNavLink>
            </NavItem>
            <NavItem>
              <RouterNavLink to="/quests" className="nav-link custom-nav-link" activeclassname="active" style={{ color: 'lightgray' }}>Quests</RouterNavLink>
            </NavItem>
            <NavItem>
              <RouterNavLink to="/bestiary" className="nav-link custom-nav-link" activeclassname="active" style={{ color: 'lightgray' }}>Bestiary</RouterNavLink>
            </NavItem>
            <NavItem>
              <RouterNavLink to="/" className="nav-link custom-nav-link" style={{ color: 'lightgray' }} activeclassname="active" onClick={() => setIsLogout(true)}>Logout</RouterNavLink>
            </NavItem>
          </Nav>
        ) : (
          <Nav className="ml-3 d-flex align-items-end" navbar style={{ fontSize: '1.25rem' }}>
            <NavItem>
              <RouterNavLink to="/login" className="nav-link custom-nav-link" activeclassname="active" style={{ color: 'lightgray' }}>Login/Signup</RouterNavLink>
            </NavItem>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;