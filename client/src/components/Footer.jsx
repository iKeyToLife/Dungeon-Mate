import { Container } from 'reactstrap';

const Footer = () => {
  return (
    <footer className="text-white text-center py-3" style={{ position: 'relative', bottom: 0, width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
      <Container>
        <img src="/images/otherImages/D20.png" alt="left D20" style={{ height: '62px', width: '80px', marginLeft: '10px', cursor: 'pointer' }} />

        <p className="mb-0" style={{ display: 'inline', margin: '20px' }}>Made with 💛 by
          <a href="https://github.com/iKeyToLife" target="_blank" rel="noopener noreferrer" style={{ color: 'gold', marginLeft: '10px' }}>Aleksandr</a>,
          <a href="https://github.com/ColinBurner" target="_blank" rel="noopener noreferrer" style={{ color: 'gold', marginLeft: '10px' }}>Colin</a>,
          <a href="https://github.com/ndoppler" target="_blank" rel="noopener noreferrer" style={{ color: 'gold', marginLeft: '10px' }}>Neil</a>,
          <a href="https://github.com/KitKatKernel" target="_blank" rel="noopener noreferrer" style={{ color: 'gold', marginLeft: '10px' }}> & James</a>
        </p>

        <img src="/images/otherImages/D20.png" alt="right D20" style={{ height: '62px', width: '80px', marginRight: '10px', cursor: 'pointer' }} />
      </Container>
    </footer>
  );
};

export default Footer;