import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { FaCalculator, FaUsers, FaMoon, FaSun } from 'react-icons/fa';
import CalculatorPage from './CalculatorPage';
import InstallersPage from './InstallersPage';
import './App.css';

const App = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app-container" data-theme={theme}>
      <header className="app-header">
        <h1>Calculadora de BTUs</h1>
        <nav className="app-nav">
          <NavLink to="/" className="nav-link" activeClassName="active">
            <FaCalculator /> Calculadora
          </NavLink>
          <NavLink to="/installers" className="nav-link" activeClassName="active">
            <FaUsers /> Instaladores
          </NavLink>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? <FaMoon /> : <FaSun />} {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
          </button>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<CalculatorPage />} />
          <Route path="/installers" element={<InstallersPage />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>© 2025 Calculadora de BTUs - Desenvolvido por SubZero21</p>
      </footer>
    </div>
  );
};

export default App;
