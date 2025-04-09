import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { FaCalculator, FaUsers } from 'react-icons/fa';
import CalculatorPage from './CalculatorPage';
import InstallersPage from './InstallersPage';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Calculadora de BTUs</h1>
        <nav className="app-nav">
          <Link to="/" className="nav-link"><FaCalculator /> Calculadora</Link>
          <Link to="/installers" className="nav-link"><FaUsers /> Instaladores</Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<CalculatorPage />} />
          <Route path="/installers" element={<InstallersPage />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>© 2025 Calculadora de BTUs - Desenvolvido por xAI</p>
      </footer>
    </div>
  );
};

export default App;