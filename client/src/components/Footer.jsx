import { Container } from 'reactstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3" style={{ position: 'relative', bottom: 0, width: '100%' }}>
      <Container>
        <p className="mb-0">© 2024 Made with love</p>
      </Container>
    </footer>
  );
};

export default Footer;