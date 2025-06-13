import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const InstallersList = ({ onEdit, onDelete, refreshTrigger }) => {
  const [installers, setInstallers] = useState([]);
  const [searchCep, setSearchCep] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInstallers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/installers', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      const data = await response.json();
      setInstallers(Array.isArray(data.installers) ? data.installers : []);
    } catch (error) {
      console.error('Erro ao buscar instaladores:', error.message);
      setError('Erro ao carregar instaladores. Verifique se o servidor está ativo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstallers();
  }, [refreshTrigger]);

  const calculateCepDistance = (cepA, cepB) => {
    if (!cepA || !cepB || typeof cepA !== 'string' || typeof cepB !== 'string') {
      return Infinity;
    }
    const cleanedCepA = cepA.replace(/\D/g, '');
    const cleanedCepB = cepB.replace(/\D/g, '');
    if (!cleanedCepA || !cleanedCepB) return Infinity;
    let distance = 0;
    for (let i = 0; i < Math.min(cleanedCepA.length, cleanedCepB.length); i++) {
      if (cleanedCepA[i] !== cleanedCepB[i]) {
        distance += Math.abs(parseInt(cleanedCepA[i], 10) - parseInt(cleanedCepB[i], 10)) * (8 - i);
      }
    }
    return distance;
  };

  const sortByCepProximity = (cepInput) => {
    if (!cepInput || cepInput.length < 5) return installers;
    const cleanedCep = cepInput.replace(/\D/g, '');
    if (!cleanedCep) return installers;
    return [...installers]
      .map(installer => ({
        ...installer,
        distance: calculateCepDistance(cleanedCep, installer.cep || ''),
      }))
      .sort((a, b) => a.distance - b.distance);
  };

  const filteredInstallers = searchCep ? sortByCepProximity(searchCep) : installers;

  return (
    <div className="installers-list-container">
      <div className="search-box">
        <label><FaSearch /> Pesquisar por proximidade (CEP):</label>
        <input
          type="text"
          value={searchCep}
          onChange={(e) => setSearchCep(e.target.value)}
          placeholder="Digite o CEP (Ex: 12345-678)"
          className="border rounded-md px-3 py-2 w-full"
        />
      </div>
      {isLoading && <p>Carregando instaladores...</p>}
      {error && <p className="no-results text-gray-500">{error}</p>}
      {!isLoading && !error && (
        <ul className="installers-list space-y-4 mt-4">
          {filteredInstallers.length > 0 ? (
            filteredInstallers.map(installer => (
              installer.id ? (
                <li key={installer.id} className="installer-card p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
                  <div className="installer-info">
                    <h4 className="font-bold text-lg">{installer.name || 'Sem nome'}</h4>
                    <p className="text-sm">Telefone: {installer.phone || 'N/A'}</p>
                    <p className="text-sm text-gray-600"><FaMapMarkerAlt className="inline mr-1" /> {installer.address || 'Sem endereço'} (CEP: {installer.cep || 'N/A'})</p>
                    <small className="text-gray-500">Adicionado em {installer.timestamp ? new Date(installer.timestamp).toLocaleString() : 'N/A'}</small>
                    {searchCep && Number.isFinite(installer.distance) && (
                      <small className="text-gray-500">Proximidade estimada: {installer.distance}</small>
                    )}
                  </div>
                  <div className="installer-actions flex space-x-2">
                    <button
                      onClick={() => onEdit(installer)}
                      className="edit-btn bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(installer.id)}
                      className="delete-btn bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ) : null
            ))
          ) : (
            <p className="no-results text-gray-500">Nenhum instalador encontrado.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default InstallersList;
