import React, { useState, useEffect } from 'react';
import { FaUser, FaPhone, FaMap, FaLock } from 'react-icons/fa';

const InstallerRegister = ({ onAddOrUpdate }) => {
  const [newInstaller, setNewInstaller] = useState({ name: '', phone: '', cep: '', deleteCode: '', address: '' });
  const [editingInstaller, setEditingInstaller] = useState(null);

  useEffect(() => {
    const handleEdit = (e) => {
      setEditingInstaller(e.detail);
      setNewInstaller({ ...e.detail });
    };
    window.addEventListener('editInstaller', handleEdit);
    return () => window.removeEventListener('editInstaller', handleEdit);
  }, []);

  const handleInstallerChange = async (e) => {
    const { name, value } = e.target;
    setNewInstaller(prev => ({ ...prev, [name]: value }));

    if (name === 'cep' && value.length >= 8) {
      const cleanedCep = value.replace(/\D/g, '');
      const cepData = await fetchCepData(cleanedCep);
      if (cepData) {
        setNewInstaller(prev => ({
          ...prev,
          cep: cepData.cep,
          address: `${cepData.logradouro}, ${cepData.bairro}, ${cepData.localidade}/${cepData.uf}`,
        }));
      }
    }
  };

  const fetchCepData = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      const data = await response.json();
      if (data.erro) {
        alert('CEP inválido.');
        return null;
      }
      return data;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error.message);
      alert('Erro ao buscar CEP.');
      return null;
    }
  };

  const handleAddOrUpdateInstaller = async (e) => {
    e.preventDefault();
    if (!newInstaller.name || !newInstaller.phone || !newInstaller.cep || !newInstaller.deleteCode || !newInstaller.address) {
      alert('Preencha todos os campos do instalador.');
      return;
    }

    if (newInstaller.deleteCode.length < 4) {
      alert('O código de exclusão deve ter pelo menos 4 caracteres.');
      return;
    }

    const installerData = { ...newInstaller };
    try {
      const method = editingInstaller ? 'PUT' : 'POST';
      const url = editingInstaller ? `http://localhost:5000/installers/${editingInstaller.id}` : 'http://localhost:5000/installers';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(installerData),
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      onAddOrUpdate();
      setNewInstaller({ name: '', phone: '', cep: '', deleteCode: '', address: '' });
      setEditingInstaller(null);
    } catch (error) {
      console.error('Erro ao salvar instalador:', error.message);
      alert('Erro ao salvar instalador.');
    }
  };

  return (
    <div className="installer-register-container">
      <form onSubmit={handleAddOrUpdateInstaller} className="form-container">
        <div className="input-group">
          <label><FaUser /> Nome:</label>
          <input
            type="text"
            name="name"
            value={newInstaller.name}
            onChange={handleInstallerChange}
            placeholder="Nome do instalador"
            required
          />
        </div>
        <div className="input-group">
          <label><FaPhone /> Telefone:</label>
          <input
            type="tel"
            name="phone"
            value={newInstaller.phone}
            onChange={handleInstallerChange}
            placeholder="Ex: (11) 99999-9999"
            required
          />
        </div>
        <div className="input-group">
          <label><FaMap /> CEP:</label>
          <input
            type="text"
            name="cep"
            value={newInstaller.cep}
            onChange={handleInstallerChange}
            placeholder="Ex: 12345-678"
            required
          />
        </div>
        <div className="input-group">
          <label>Endereço:</label>
          <input
            type="text"
            name="address"
            value={newInstaller.address}
            readOnly
            placeholder="Preenchido automaticamente"
          />
        </div>
        <div className="input-group">
          <label><FaLock /> Código de Exclusão:</label>
          <input
            type="password"
            name="deleteCode"
            value={newInstaller.deleteCode}
            onChange={handleInstallerChange}
            placeholder="Mínimo 4 caracteres"
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="primary-btn">{editingInstaller ? 'Atualizar' : 'Adicionar'}</button>
          {editingInstaller && (
            <button
              type="button"
              onClick={() => {
                setNewInstaller({ name: '', phone: '', cep: '', deleteCode: '', address: '' });
                setEditingInstaller(null);
              }}
              className="secondary-btn"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default InstallerRegister;