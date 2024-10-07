import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Characters from './pages/Characters';
import Campaigns from './pages/Campaigns';
import Dungeons from './pages/Dungeons';
import SingleDungeon from './pages/SingleDungeon';
import Encounters from './pages/Encounters';
import Quests from './pages/Quests';
import Bestiary from './pages/Bestiary';
import SingleCreature from './pages/SingleCreature';
import SingleEncounter from './pages/SingleEncounter';
import SingleQuest from './pages/SingleQuest';

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
            <Route path="/dungeons" element={<Dungeons />} />
            <Route path="/dungeon/:dungeonId" element={<SingleDungeon />} />
            <Route path="/encounters" element={<Encounters />} />
            <Route path="/encounter/:id" element={<SingleEncounter />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/quest/:questId" element={<SingleQuest />} />
            <Route path="/bestiary" element={<Bestiary />} />
            <Route path="/creature/:id" element={<SingleCreature />} />
          </Routes>
        </div>
        <Footer /> 
      </div>
    </Router>
  );
};

export default App;