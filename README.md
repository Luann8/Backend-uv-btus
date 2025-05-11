# 🧮 Calculadora de BTUs

Uma aplicação web para calcular a potência ideal de ar-condicionado (em BTUs) com base na área, número de pessoas e aparelhos eletrônicos, além de buscar instaladores pelo CEP.

## ✨ Funcionalidades

- **Cálculo de BTUs** 🌀  
  Insira a área (m²), número de pessoas e aparelhos eletrônicos para determinar a potência necessária do ar-condicionado.

- **Autenticação Segura** 🔒  
  Sistema de login com senha protegida por criptografia.

- **Design Responsivo** 📱💻  
  Interface adaptável para desktops e dispositivos móveis, garantindo uma experiência fluida.

- **Busca de Instaladores** 📍  
  Localize instaladores de ar-condicionado próximos ao seu CEP.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: ⚛️ React.js, 🎨 CSS  
- **Backend**: 🖥️ Node.js (ajustar conforme o servidor utilizado)  
- **API**: 🌐 Fetch nativo para comunicação com o servidor  
- **Estilização**: 🖌️ CSS customizado com transições suaves e sombras  

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 14 ou superior) 🟢  
- [npm](https://www.npmjs.com/) (incluso com o Node.js) 📦  
- Um servidor backend configurado em `http://localhost:5000` com os endpoints:  
  `/login`, `/register`, `/history`, `/logout`, entre outros.

## 📦 Dependências

As bibliotecas abaixo são instaladas automaticamente com o comando `npm install`:

| Biblioteca       | Versão   | Descrição                                      |
|------------------|----------|------------------------------------------------|
| `react`          | ^18.2.0  | Biblioteca para construção de interfaces       |
| `react-dom`      | ^18.2.0  | Renderização de componentes React no DOM       |
| `react-scripts`  | ^5.0.1   | Scripts e configurações para o React (CRA)     |

### Exemplo do `package.json`

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  }
}
```

## 🚀 Como Iniciar

1. **Clone o repositório**:  
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd calculadora-btus
   ```

2. **Instale as dependências**:  
   ```bash
   npm install
   ```

3. **Inicie o servidor backend** (se necessário):  
   Configure o servidor em `http://localhost:5000`.

4. **Inicie a aplicação**:  
   ```bash
   npm start
   ```

   Acesse a aplicação em `http://localhost:3000`.

## 📝 Notas

- Localmente ele pode demorar alguns segundos para carregar o banco de daods e iniciar.
- Certifique-se de que o backend está configurado corretamente para os endpoints mencionados.  
- Para personalizar a estilização, edite os arquivos CSS no diretório `src`.  
