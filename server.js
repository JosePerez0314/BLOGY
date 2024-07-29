const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const { verificarAutenticacion } = require('./middleware');

const app = express();

// Base de datos SQLite en archivo
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Crear tablas
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL
)`, (err) => {
    if (err) {
        console.error('Error creando la tabla users:', err.message);
    } else {
        console.log('Tabla users creada o ya existente.');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
)`, (err) => {
    if (err) {
        console.error('Error creando la tabla comments:', err.message);
    } else {
        console.log('Tabla comments creada o ya existente.');
    }
});

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
    secret: 'mi_secreto',
    resave: false,
    saveUninitialized: true
}));

// Ruta para crear un usuario
app.post('/crear-usuario', (req, res) => {
    const { username } = req.body;
    console.log('Intentando crear usuario:', username);
    
    db.run('INSERT INTO users (username) VALUES (?)', [username], function (err) {
        if (err) {
            console.error('Error al crear usuario:', err.message);
            return res.status(500).send('Error al crear usuario');
        }
        // Simula una sesión de usuario después de crear el usuario
        req.session.userId = this.lastID; 
        console.log('Usuario creado con ID:', this.lastID);
        res.status(200).json({ message: 'Usuario creado exitosamente' });
    });
});

// Ruta para enviar un comentario
app.post('/enviar-comentario', (req, res) => {
    const { comment } = req.body;
    const userId = req.session.userId;

    if (!userId) {
        console.error('Usuario no autenticado');
        return res.status(401).send({ error: 'Usuario no autenticado' });
    }

    console.log('Intentando crear comentario:', comment);
    db.run('INSERT INTO comments (comment, user_id) VALUES (?, ?)', [comment, userId], function (err) {
        if (err) {
            console.error('Error al crear comentario:', err.message);
            return res.status(500).send({ error: 'Error al crear comentario' });
        }
        console.log('Comentario creado con ID:', this.lastID);
        res.status(200).json({ message: 'Comentario creado exitosamente' });
    });
});

// Ruta para obtener todos los comentarios
app.get('/obtener-comentarios', (req, res) => {
    db.all('SELECT comments.id, comments.comment, users.username FROM comments INNER JOIN users ON comments.user_id = users.id', [], (err, rows) => {
        if (err) {
            console.error('Error al obtener comentarios:', err.message);
            return res.status(500).send('Error al obtener comentarios');
        }
        res.json(rows);
    });
});

// Ruta protegida para comentarios
app.get('/comentario.html', verificarAutenticacion, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'comentario.html'));
});

// Ruta para verificar autenticación
app.get('/verificar-autenticacion', (req, res) => {
    res.json({ autenticado: !!req.session.userId });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
