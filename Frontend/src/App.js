import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from './components/header.component';
import Login from './components/login.component';
import Registration from './components/register.component';

import './styles/login.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
