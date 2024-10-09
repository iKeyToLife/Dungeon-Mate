import { gsap } from 'gsap';
import { useEffect, useState } from 'react';
import { useLocation, NavLink as RouterNavLink } from 'react-router-dom'; 
import { Container, Nav, Navbar, NavbarBrand, NavItem } from 'reactstrap';
import DMLogoTrans from '/images/otherImages/DungeonMateLogo2.png';
import AuthService from '../utils/auth';

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
    const allLinks = document.querySelectorAll('.nav-link');
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
        textShadow: '0px 0px 15px gold',
        color: 'gold',
        duration: 0.9,
        repeat: -1,
        yoyo: true
      });
    }
  }, [location]); 

  return (
    <Navbar color="dark" dark expand="md" style={{ padding: '0 1rem' }}>
      <Container className="d-flex justify-content-between align-items-end">
        <NavbarBrand tag={RouterNavLink} to="/"className="d-flex align-items-center">
          <img src={DMLogoTrans} alt="Dungeon Mate Logo" style={{ height: '90px', marginRight: '20px', width: '125px' }} />
        </NavbarBrand>
        <Nav className="ml-3 d-flex align-items-end" navbar style={{ fontSize: '1.25rem' }}>
          <NavItem>
            <RouterNavLink to="/characters" className="nav-link" activeclassname="active">Characters</RouterNavLink>
          </NavItem>
          <NavItem>
            <RouterNavLink to="/campaigns" className="nav-link" activeclassname="active">Campaigns</RouterNavLink>
          </NavItem>
          <NavItem>
            <RouterNavLink to="/dungeons" className="nav-link" activeclassname="active">Dungeons</RouterNavLink>
          </NavItem>
          <NavItem>
            <RouterNavLink to="/encounters" className="nav-link" activeclassname="active">Encounters</RouterNavLink>
          </NavItem>
          <NavItem>
            <RouterNavLink to="/quests" className="nav-link" activeclassname="active">Quests</RouterNavLink>
          </NavItem>
          <NavItem>
            <RouterNavLink to="/bestiary" className="nav-link" activeclassname="active">Bestiary</RouterNavLink>
          </NavItem>
          <NavItem>
            {isLoggedIn ? (
              <RouterNavLink to="/" className="nav-link" onClick={() => setIsLogout(true)}>Logout</RouterNavLink>
            ) : (
              <RouterNavLink to="/login" className="nav-link" activeclassname="active">Login/Signup</RouterNavLink>
            )}
          </NavItem>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;