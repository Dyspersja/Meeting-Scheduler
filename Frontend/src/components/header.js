import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import '../styles/layouts.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav>
      <button
        className={`menu-icon ${menuOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        <FontAwesomeIcon icon={faBars} style={{ color: "white", fontSize: "20px" }} />
      </button>
      <div className={`navbar ${menuOpen ? 'open' : ''}`}>
        <div>
          <NavLink to="/"><h1>Meeting<span>Scheduler</span></h1></NavLink>
        </div>
        <div className='list'>
          <ul>
            <li><NavLink to="/">Informacje</NavLink></li>
            <li className='auth'><NavLink to="/login">Zaloguj się</NavLink></li>
            <li className='auth'><NavLink to="/register">Stwórz konto</NavLink></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
