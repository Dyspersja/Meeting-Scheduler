import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import AuthService from "../services/auth.service";
import EventBus from "../common/EventBus";

import '../styles/layouts.css';

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false,
      redirect: null,
      userReady: false,
      currentUser: undefined
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (currentUser)
      this.setState({ currentUser: currentUser, userReady: true });

    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({ currentUser: undefined, userReady: false })
  }

  render() {
    const { menuOpen, currentUser } = this.state;
    return (
      <nav>
        <button
          className={`menu-icon ${menuOpen ? 'open' : ''}`}
          onClick={this.toggleMenu}
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
              {currentUser ? (
                <li className='auth'><NavLink onClick={this.logOut}>Wyloguj się</NavLink></li>
              ) : (
                <>
                  <li className='auth'><NavLink to="/login">Zaloguj się</NavLink></li>
                  <li className='auth'><NavLink to="/register">Stwórz konto</NavLink></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
