import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Characters from './pages/Characters';
import Campaigns from './pages/Campaigns';
import Encounters from './pages/Encounters';
import Bestiary from './pages/Bestiary';

const App = () => {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />  
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/encounters" element={<Encounters />} />
            <Route path="/bestiary" element={<Bestiary />} />
          </Routes>
        </div>
        <Footer /> 
      </div>
    </Router>
  );
};

export default App;