import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/header.component";
import Login from "./components/login.component";
import Registration from "./components/register.component";
import AuthService from "./services/auth.service";
import "./styles/login.css";
import "./styles/calendar.css";
import "./App.css";
import Calendar from "./components/calendar.component";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/calendar" element={<Calendar />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
