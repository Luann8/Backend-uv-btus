import React, { useState } from 'react';
import { FaRuler, FaUser, FaPlug, FaShoppingCart } from 'react-icons/fa';

const CalculatorPage = () => {
  const [area, setArea] = useState('');
  const [people, setPeople] = useState('');
  const [appliance, setAppliance] = useState('');
  const [calculatedBTU, setCalculatedBTU] = useState(null);

  const calculateBTU = (area, people, appliance) => {
    return area * 600 + people * 500 + appliance * 1500;
  };

  const getPurchaseLinks = (btu) => {
    if (btu <= 9000) {
      return [
        { name: '9000 BTU - Magazine Luiza', url: 'https://www.magazineluiza.com.br/ar-condicionado-9000-btu' },
        { name: '9000 BTU - Amazon', url: 'https://www.amazon.com.br/ar-condicionado-9000-btu' },
        { name: '9000 BTU - Americanas', url: 'https://www.americanas.com.br/ar-condicionado-9000-btu' },
      ];
    } else if (btu <= 12000) {
      return [
        { name: '12000 BTU - Magazine Luiza', url: 'https://www.magazineluiza.com.br/ar-condicionado-12000-btu' },
        { name: '12000 BTU - Amazon', url: 'https://www.amazon.com.br/ar-condicionado-12000-btu' },
        { name: '12000 BTU - Americanas', url: 'https://www.americanas.com.br/ar-condicionado-12000-btu' },
      ];
    } else {
      return [
        { name: '18000 BTU - Magazine Luiza', url: 'https://www.magazineluiza.com.br/ar-condicionado-18000-btu' },
        { name: '18000 BTU - Amazon', url: 'https://www.amazon.com.br/ar-condicionado-18000-btu' },
        { name: '18000 BTU - Americanas', url: 'https://www.americanas.com.br/ar-condicionado-18000-btu' },
      ];
    }
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!area || !people || !appliance) {
      alert('Preencha todos os campos para calcular o BTU.');
      return;
    }
    const btu = calculateBTU(Number(area), Number(people), Number(appliance));
    setCalculatedBTU(btu);
  };

  return (
    <section className="page-section calculator-page">
      <h2> Calcular BTU</h2>
      <p className="subtitle">Descubra a potência ideal para o seu ar-condicionado.</p>
      <form onSubmit={handleCalculate} className="form-container">
        <div className="input-group">
          <label><FaRuler /> Área (m²):</label>
          <input
            type="number"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            min="1"
            placeholder="Ex: 20"
            required
          />
        </div>
        <div className="input-group">
          <label><FaUser /> Pessoas:</label>
          <input
            type="number"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            min="1"
            placeholder="Ex: 2"
            required
          />
        </div>
        <div className="input-group">
          <label><FaPlug /> Aparelhos:</label>
          <input
            type="number"
            value={appliance}
            onChange={(e) => setAppliance(e.target.value)}
            min="0"
            placeholder="Ex: 1"
            required
          />
        </div>
        <button type="submit" className="primary-btn">Calcular</button>
      </form>
      {calculatedBTU && (
        <div className="result-box">
          <h3>Resultado</h3>
          <p>BTU necessário: <span>{calculatedBTU}</span></p>
          <div className="purchase-links">
            <h4><FaShoppingCart /> Onde Comprar:</h4>
            <ul>
              {getPurchaseLinks(calculatedBTU).map((link, index) => (
                <li key={index}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default CalculatorPage;