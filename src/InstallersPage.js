 import React, { useState } from 'react';
import InstallersList from './InstallersList';
import InstallerRegister from './InstallerRegister';
import { FaUsers, FaPlus, FaSearch } from 'react-icons/fa';

const InstallersPage = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [deleteCodeInput, setDeleteCodeInput] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEditInstaller = (installer) => {
    setActiveTab('register');
    // Garante que o formulário fique visível ao editar
    const formElement = document.querySelector('.installer-register-container form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('editInstaller', { detail: installer }));
    }, 100);
  };

  const handleDeleteInstaller = (id) => {
    setShowDeleteModal({ id });
  };

  const confirmDelete = async (id) => {
    if (!deleteCodeInput) {
      alert('Digite o código de exclusão.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/installers/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteCode: deleteCodeInput }),
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      
      setRefreshTrigger(prev => prev + 1);
      setShowDeleteModal(null);
      setDeleteCodeInput('');
    } catch (error) {
      console.error('Erro ao deletar instalador:', error.message);
      alert('Erro ao deletar instalador.');
    }
  };

  const handleAddOrUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <section className="page-section installers-page">
      <h2><FaUsers /> Instaladores</h2>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
          type="button"
        >
          <FaPlus /> Registrar Instalador
        </button>
        <button
          className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
          type="button"
        >
          <FaSearch /> Buscar Instaladores
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'register' && <InstallerRegister onAddOrUpdate={handleAddOrUpdate} />}
        {activeTab === 'search' && (
          <InstallersList
            onEdit={handleEditInstaller}
            onDelete={handleDeleteInstaller}
            refreshTrigger={refreshTrigger}
          />
        )}
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmação de Exclusão</h3>
            <p>Digite o código de exclusão:</p>
            <input
              type="password"
              value={deleteCodeInput}
              onChange={(e) => setDeleteCodeInput(e.target.value)}
              placeholder="Código de exclusão"
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={() => confirmDelete(showDeleteModal.id)} className="primary-btn" type="button">
                Confirmar
              </button>
              <button onClick={() => setShowDeleteModal(null)} className="secondary-btn" type="button">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default InstallersPage;
