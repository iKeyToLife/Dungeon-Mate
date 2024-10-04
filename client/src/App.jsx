import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Characters from './pages/Characters';
import Campaigns from './pages/Campaigns';
import Encounters from './pages/Encounters';
import Bestiary from './pages/Bestiary';
import SingleCreature from './pages/SingleCreature';
import SingleEncounter from './pages/SingleEncounter';

const App = () => {
  const [encounters, setEncounters] = useState([]);

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
            <Route path="/encounters" element={<Encounters encounters={encounters} setEncounters={setEncounters} />} />
            <Route path="/bestiary" element={<Bestiary />} />
            <Route path="/creature/:id" element={<SingleCreature />} />
            <Route path="/encounter/:id" element={<SingleEncounter encounters={encounters} setEncounters={setEncounters} />} />
          </Routes>
        </div>
        <Footer /> 
      </div>
    </Router>
  );
};

export default App;