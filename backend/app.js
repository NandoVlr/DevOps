const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'database', 
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'devops_db',
    waitForConnections: true, 
    connectionLimit: 10, 
    queueLimit: 0
}).promise();

async function testDbConnection() {
    try {
        await pool.getConnection();
        console.log('Pool de Conexões criado. Conectado ao MySQL.');
    } catch (err) {
        console.error('Erro ao conectar ao MySQL:', err);
    }
}
testDbConnection();


// GET
app.get('/usuarios', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM usuarios');
        res.json(results);
    } catch (err) {
        return res.status(500).json({ mensagem: 'Erro ao listar usuários', detalhes: err.message });
    }
});


// POST
app.post('/usuarios', async (req, res) => {
    const { nome, email } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO usuarios (nome, email) VALUES (?, ?)',
            [nome, email]
        );
        
        res.json({ mensagem: 'Usuário inserido com sucesso', id: result.insertId });
    } catch (err) {
        return res.status(500).json({ mensagem: 'Erro ao inserir usuário', detalhes: err.message });
    }
});


// PUT
app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email } = req.body;
    try {
        await pool.query(
            'UPDATE usuarios SET nome=?, email=? WHERE id=?',
            [nome, email, id]
        );
        res.json({ mensagem: 'Usuário atualizado com sucesso' });
    } catch (err) {
        return res.status(500).json({ mensagem: 'Erro ao atualizar usuário', detalhes: err.message });
    }
});


// DELETE
app.delete('/usuarios/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM usuarios WHERE id=?', [req.params.id]);
        res.json({ mensagem: 'Usuário removido com sucesso' });
    } catch (err) {
        return res.status(500).json({ mensagem: 'Erro ao remover usuário', detalhes: err.message });
    }
});


app.listen(3000, () => console.log('Backend rodando na porta 3000'));