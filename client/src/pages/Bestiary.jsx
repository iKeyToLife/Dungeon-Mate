import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'reactstrap';

const Bestiary = () => {
  const [monsters, setMonsters] = useState([]);
  const [filteredMonsters, setFilteredMonsters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [challengeLow, setChallengeLow] = useState('');
  const [challengeHigh, setChallengeHigh] = useState('');
  const [size, setSize] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [monstersPerPage] = useState(15);
  const [loading, setLoading] = useState(true);
  const [tooltipOpen, setTooltipOpen] = useState(null);
  const [visiblePages, setVisiblePages] = useState([]);
  const navigate = useNavigate();

  // Fetch monsters on page load
  useEffect(() => {
    const fetchMonsters = async () => {
      setLoading(true); 
      try {
        const response = await fetch('https://www.dnd5eapi.co/api/monsters');
        const data = await response.json();

        const detailedMonsters = await Promise.all(
          data.results.map(async (monster) => {
            const res = await fetch(`https://www.dnd5eapi.co${monster.url}`);
            const details = await res.json();
            return details;
          })
        );

        setMonsters(detailedMonsters);
        setFilteredMonsters(detailedMonsters); 
      } catch (error) {
        console.error('Error fetching monsters:', error);
      } finally {
        setLoading(false); 
      }
    };
    fetchMonsters();
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(filteredMonsters.length / monstersPerPage);
    const pageGroupSize = 3; 
    const startIndex = Math.floor((currentPage - 1) / pageGroupSize) * pageGroupSize;
    setVisiblePages([...Array(pageGroupSize)].map((_, i) => startIndex + i + 1).filter(page => page <= totalPages));
  }, [currentPage, filteredMonsters, monstersPerPage]);

  // Handle filter form submission
  const handleFilter = (e) => {
    e.preventDefault();
    setLoading(true); 
    let filtered = monsters;

    // Filter by name
    if (searchTerm) {
      filtered = filtered.filter(monster =>
        monster.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by challenge range
    if (challengeLow || challengeHigh) {
      filtered = filtered.filter(monster => {
        const challengeRating = parseFloat(monster.challenge_rating);
        const low = challengeLow ? parseFloat(challengeLow) : 0;
        const high = challengeHigh ? parseFloat(challengeHigh) : 100;
        return challengeRating >= low && challengeRating <= high;
      });
    }

    // Filter by size
    if (size) {
      filtered = filtered.filter(monster => monster.size.toLowerCase() === size.toLowerCase());
    }

    setFilteredMonsters(filtered);
    setCurrentPage(1); 
    setLoading(false);
  };

  // Calculate monsters to display based on current page
  const indexOfLastMonster = currentPage * monstersPerPage;
  const indexOfFirstMonster = indexOfLastMonster - monstersPerPage;
  const currentMonsters = filteredMonsters.slice(indexOfFirstMonster, indexOfLastMonster)

  // Handle monster selection (on row click or search result click)
  const handleRowClick = (monster) => {
    navigate(`/creature/${monster.index}`);
  };

  // Handle pagination click
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  
    const pageGroupSize = 3;
    const startIndex = Math.floor((pageNumber - 1) / pageGroupSize) * pageGroupSize;
    const totalPages = Math.ceil(filteredMonsters.length / monstersPerPage);
    setVisiblePages([...Array(pageGroupSize)].map((_, i) => startIndex + i + 1).filter(page => page <= totalPages));
  };

  // Handle Next and Previous buttons
  const handleNextClick = () => {
    const pageGroupSize = 3; 
    const totalPages = Math.ceil(filteredMonsters.length / monstersPerPage);
    const newVisiblePages = visiblePages.map(page => page + pageGroupSize);
    if (newVisiblePages[0] <= totalPages) {
      setVisiblePages(newVisiblePages);
      setCurrentPage(newVisiblePages[0]);
    }
  };

  const handlePrevClick = () => {
    const pageGroupSize = 3; 
    const newVisiblePages = visiblePages.map(page => page - pageGroupSize);
    if (newVisiblePages[0] > 0) {
      setVisiblePages(newVisiblePages);
      setCurrentPage(newVisiblePages[0]);
    }
  };

  // Toggle the tooltip
  const toggleTooltip = (monsterIndex) => {
    setTooltipOpen((prevTooltipOpen) => (prevTooltipOpen === monsterIndex ? null : monsterIndex));
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredMonsters.length / monstersPerPage);

  return (
    <div className="bestiary-container">
      <div className="search-container">
        <form onSubmit={handleFilter} className="filter-form">
          <div>
            <label>Search</label>
            <input
              className="search-input"
              type="text"
              placeholder="Search Monster by Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
  
          <div>
            <label>Challenge Rating</label>
            <input
              type="number"
              placeholder="Min"
              value={challengeLow}
              onChange={(e) => setChallengeLow(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              value={challengeHigh}
              onChange={(e) => setChallengeHigh(e.target.value)}
            />
          </div>
  
          <div>
            <label>Size</label>
            <select className="bestiary-select" value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="">Any</option>
              <option value="tiny">Tiny</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="huge">Huge</option>
              <option value="gargantuan">Gargantuan</option>
            </select>
          </div>
  
          <button type="submit">Filter Creatures</button>
        </form>
      </div>
  
      <div className="monster-list">
        {loading ? ( 
          <p>Loading Creatures...</p>
        ) : currentMonsters.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>CR</th>
                <th>Type</th>
                <th>Size</th>
                <th>Alignment</th>
              </tr>
            </thead>
            <tbody>
              {currentMonsters.map((monster, index) => (
                <tr
                  key={monster.index}
                  onClick={() => handleRowClick(monster)}
                  className="clickable-row"
                  id={`tooltip-${index}`} 
                  onMouseEnter={() => toggleTooltip(index)}  
                  onMouseLeave={() => toggleTooltip(index)} 
                >
                  <td>{monster.name}</td>
                  <td>{monster.challenge_rating}</td>
                  <td>{monster.type}</td>
                  <td>{monster.size}</td>
                  <td>{monster.alignment}</td>
                  {/* Tooltip for each row */}
                  <Tooltip
                    placement="left"
                    isOpen={tooltipOpen === index}
                    target={`tooltip-${index}`}
                    toggle={() => toggleTooltip(index)}
                  >
                    Click to learn more
                  </Tooltip>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No creatures found.</p>
        )}
      </div>
  
      {/* Updated Pagination */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          {visiblePages[0] > 1 && (
            <button onClick={handlePrevClick}>Previous</button>
          )}
          {visiblePages.map((pageNumber) => (
            pageNumber <= totalPages && (
              <button key={pageNumber} onClick={() => handlePageClick(pageNumber)} className={currentPage === pageNumber ? 'active' : ''}>
                {pageNumber}
              </button>
            )
          ))}
          {visiblePages[visiblePages.length - 1] < totalPages && (
            <button onClick={handleNextClick}>Next</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Bestiary;