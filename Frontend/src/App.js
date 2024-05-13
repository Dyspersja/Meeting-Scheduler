import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/header.component";
import PrivateRoute from './common/PrivateRoute';
import Login from "./components/login.component";
import Registration from "./components/register.component";
import Dashboard from "./components/dashboard.component";
import AuthService from "./services/auth.service";
import "./styles/login.css";
import "./styles/calendar.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
