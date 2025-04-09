const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Criar a tabela Installers (se não existir)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Installers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      cep TEXT NOT NULL,
      address TEXT NOT NULL,
      deleteCode TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela Installers:', err.message);
    } else {
      console.log('Tabela Installers criada ou já existe.');
    }
  });
});

// Rota raiz para teste
app.get('/', (req, res) => {
  console.log('Requisição GET / recebida');
  res.status(200).json({ message: 'Servidor rodando corretamente' });
});

// Endpoint para buscar todos os instaladores
app.get('/installers', (req, res) => {
  console.log('Requisição GET /installers recebida');
  const query = `
    SELECT id, name, phone, cep, address, deleteCode, timestamp
    FROM Installers
    ORDER BY timestamp DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar instaladores:', err.message);
      return res.status(500).json({ message: 'Erro ao buscar instaladores', error: err.message });
    }
    console.log('Instaladores retornados:', rows.length);
    res.status(200).json({ message: 'Instaladores recuperados com sucesso', installers: rows });
  });
});

// Endpoint para adicionar instalador
app.post('/installers', (req, res) => {
  console.log('Requisição POST /installers recebida:', req.body);
  const { name, phone, cep, address, deleteCode } = req.body;
  if (!name || !phone || !cep || !address || !deleteCode) {
    console.log('Campos obrigatórios faltando');
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  const query = `
    INSERT INTO Installers (name, phone, cep, address, deleteCode)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.run(query, [name, phone, cep, address, deleteCode], function (err) {
    if (err) {
      console.error('Erro ao adicionar instalador:', err.message);
      return res.status(500).json({ message: 'Erro ao adicionar instalador', error: err.message });
    }
    console.log(`Instalador adicionado: ${name}, ID: ${this.lastID}`);
    res.status(201).json({ message: 'Instalador adicionado com sucesso', id: this.lastID });
  });
});

// Endpoint para atualizar instalador
app.put('/installers/:id', (req, res) => {
  console.log('Requisição PUT /installers/:id recebida:', req.params, req.body);
  const { id } = req.params;
  const { name, phone, cep, address, deleteCode } = req.body;

  if (!name || !phone || !cep || !address || !deleteCode) {
    console.log('Campos obrigatórios faltando');
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  const query = `
    UPDATE Installers
    SET name = ?, phone = ?, cep = ?, address = ?, deleteCode = ?, timestamp = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  db.run(query, [name, phone, cep, address, deleteCode, id], function (err) {
    if (err) {
      console.error('Erro ao atualizar instalador:', err.message);
      return res.status(500).json({ message: 'Erro ao atualizar instalador', error: err.message });
    }
    if (this.changes === 0) {
      console.log('Instalador não encontrado:', id);
      return res.status(404).json({ message: 'Instalador não encontrado' });
    }
    console.log(`Instalador atualizado: ID ${id}`);
    res.status(200).json({ message: 'Instalador atualizado com sucesso' });
  });
});

// Endpoint para deletar instalador
app.delete('/installers/:id', (req, res) => {
  console.log('Requisição DELETE /installers/:id recebida:', req.params, req.body);
  const { id } = req.params;
  const { deleteCode } = req.body;

  if (!deleteCode) {
    console.log('Código de exclusão não fornecido');
    return res.status(400).json({ message: 'Código de exclusão é obrigatório' });
  }

  db.get(`SELECT deleteCode FROM Installers WHERE id = ?`, [id], (err, row) => {
    if (err) {
      console.error('Erro ao verificar instalador:', err.message);
      return res.status(500).json({ message: 'Erro ao verificar instalador', error: err.message });
    }
    if (!row) {
      console.log('Instalador não encontrado:', id);
      return res.status(404).json({ message: 'Instalador não encontrado' });
    }
    if (row.deleteCode !== deleteCode) {
      console.log('Código de exclusão inválido');
      return res.status(400).json({ message: 'Código de exclusão inválido' });
    }

    const query = `DELETE FROM Installers WHERE id = ?`;
    db.run(query, [id], function (err) {
      if (err) {
        console.error('Erro ao deletar instalador:', err.message);
        return res.status(500).json({ message: 'Erro ao deletar instalador', error: err.message });
      }
      if (this.changes === 0) {
        console.log('Instalador não encontrado:', id);
        return res.status(404).json({ message: 'Instalador não encontrado' });
      }
      console.log(`Instalador deletado: ID ${id}`);
      res.status(200).json({ message: 'Instalador deletado com sucesso' });
    });
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  console.log(`Rota não encontrada: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Endpoint não encontrado' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Fechar o banco de dados ao encerrar o processo
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Erro ao fechar o banco de dados:', err.message);
    }
    console.log('Conexão com o banco de dados fechada.');
    process.exit(0);
  });
});