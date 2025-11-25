const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
host: 'database',
user: 'root',
password: 'root',
database: 'devops_db'
});


db.connect(err => {
if (err) console.error(err);
else console.log('Conectado ao MySQL');
});


// GET
app.get('/usuarios', (req, res) => {
db.query('SELECT * FROM usuarios', (err, results) => {
if (err) return res.status(500).json(err);
res.json(results);
});
});


// POST
app.post('/usuarios', (req, res) => {
const { nome, email } = req.body;
db.query(
'INSERT INTO usuarios (nome, email) VALUES (?, ?)',
[nome, email],
(err) => {
if (err) return res.status(500).json(err);
res.json({ mensagem: 'Usuário inserido com sucesso' });
}
);
});


// PUT (extra)
app.put('/usuarios/:id', (req, res) => {
const { id } = req.params;
const { nome, email } = req.body;
db.query(
'UPDATE usuarios SET nome=?, email=? WHERE id=?',
[nome, email, id],
(err) => {
if (err) return res.status(500).json(err);
res.json({ mensagem: 'Usuário atualizado' });
}
);
});


// DELETE (extra)
app.delete('/usuarios/:id', (req, res) => {
db.query('DELETE FROM usuarios WHERE id=?', [req.params.id], err => {
if (err) return res.status(500).json(err);
res.json({ mensagem: 'Usuário removido' });
});
});


app.listen(3000, () => console.log('Backend rodando na porta 3000'));