import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const InstallersList = ({ onEdit, onDelete, refreshTrigger }) => {
  const [installers, setInstallers] = useState([]);
  const [searchCep, setSearchCep] = useState('');

  const fetchInstallers = async () => {
    try {
      const response = await fetch('http://localhost:5000/installers', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      const data = await response.json();
      setInstallers(data.installers || []);
    } catch (error) {
      console.error('Erro ao buscar instaladores:', error.message);
      alert('Erro ao carregar instaladores.');
    }
  };

  useEffect(() => {
    fetchInstallers();
  }, [refreshTrigger]);

  const calculateCepDistance = (cepA, cepB) => {
    const cleanedCepA = cepA.replace(/\D/g, '');
    const cleanedCepB = cepB.replace(/\D/g, '');
    let distance = 0;
    for (let i = 0; i < Math.min(cleanedCepA.length, cleanedCepB.length); i++) {
      if (cleanedCepA[i] !== cleanedCepB[i]) {
        distance += Math.abs(parseInt(cleanedCepA[i]) - parseInt(cleanedCepB[i])) * (8 - i);
      }
    }
    return distance;
  };

  const sortByCepProximity = (cepInput) => {
    if (!cepInput || cepInput.length < 5) return installers;
    const cleanedCep = cepInput.replace(/\D/g, '');
    return [...installers]
      .map(installer => ({
        ...installer,
        distance: calculateCepDistance(cleanedCep, installer.cep),
      }))
      .sort((a, b) => a.distance - b.distance);
  };

  const filteredInstallers = sortByCepProximity(searchCep);

  return (
    <div className="installers-list-container">
      <div className="search-box">
        <label><FaSearch /> Pesquisar por proximidade (CEP):</label>
        <input
          type="text"
          value={searchCep}
          onChange={(e) => setSearchCep(e.target.value)}
          placeholder="Digite o CEP (Ex: 12345-678)"
        />
      </div>
      <ul className="installers-list">
        {filteredInstallers.length > 0 ? (
          filteredInstallers.map(installer => (
            <li key={installer.id} className="installer-card">
              <div className="installer-info">
                <h4>{installer.name}</h4>
                <p>Telefone: {installer.phone}</p>
                <p><FaMapMarkerAlt /> {installer.address} (CEP: {installer.cep})</p>
                <small>Adicionado em {new Date(installer.timestamp).toLocaleString()}</small>
                {searchCep && <small>Proximidade estimada: {installer.distance}</small>}
              </div>
              <div className="installer-actions">
                <button onClick={() => onEdit(installer)} className="edit-btn">Editar</button>
                <button onClick={() => onDelete(installer.id)} className="delete-btn">Excluir</button>
              </div>
            </li>
          ))
        ) : (
          <p className="no-results">Nenhum instalador encontrado.</p>
        )}
      </ul>
    </div>
  );
};

export default InstallersList;