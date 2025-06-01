import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import DashboardPage from './pages/DashboardPage';

function App() {
  const navigate = useNavigate ? useNavigate() : null;
  const handleLogout = () => {
    localStorage.removeItem('token');
    if (navigate) navigate('/signin');
    else window.location.href = '/signin';
  };

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Router>
      <nav style={{ display: 'flex', gap: 16, padding: 16 }}>
        {!isLoggedIn && <Link to="/signin">Sign In</Link>}
        {!isLoggedIn && <Link to="/signup">Sign Up</Link>}
        {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        <Link to="/">Dashboard</Link>
      </nav>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
