const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const verifyAuth = require('./middleware'); // Asegúrate de que este archivo exporta el middleware adecuado

// Base de datos SQLite
const db = new sqlite3.Database(':memory:');

// Crear tablas
db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL
)`);

db.run(`CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
)`);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para crear un usuario
app.post('/crear-usuario', (req, res) => {
    const { username } = req.body;
    db.run('INSERT INTO users (username) VALUES (?)', [username], function (err) {
        if (err) {
            return res.status(500).send('Error al crear usuario');
        }
        res.redirect('/comentario.html');
    });
});

// Ruta para enviar un comentario
app.post('/enviar-comentario', verifyAuth, (req, res) => {
    const { user_id, comment } = req.body;
    db.run('INSERT INTO comments (comment, user_id) VALUES (?, ?)', [comment, user_id], function (err) {
        if (err) {
            return res.status(500).send('Error al enviar comentario');
        }
        res.redirect('/comentario.html');
    });
});

// Ruta para obtener todos los comentarios
app.get('/obtener-comentarios', (req, res) => {
    db.all('SELECT comments.id, comments.comment, users.username FROM comments INNER JOIN users ON comments.user_id = users.id', [], (err, rows) => {
        if (err) {
            return res.status(500).send('Error al obtener comentarios');
        }
        res.json(rows);
    });
});

// Ruta para verificar autenticación
app.get('/verificar-autenticacion', (req, res) => {
    // Aquí deberías implementar la lógica para verificar si el usuario está autenticado
    // Por ejemplo, podrías revisar cookies, sesiones, etc.
    // En este ejemplo, se asume que la autenticación siempre falla
    res.json({ autenticado: false }); // Cambia esto según tu lógica de autenticación
});

app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
