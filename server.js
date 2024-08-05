const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const { verificarAutenticacion } = require('./middleware');

// Configuración de la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Middleware para el análisis del cuerpo de la solicitud
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: true
}));

// Servir archivos estáticos desde la raíz
app.use(express.static(path.join(__dirname)));

// Crear tablas si no existen
const createTables = () => {
    const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL
    )`;

    const createCommentsTable = `CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        comment TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`;

    const createContactTable = `CREATE TABLE IF NOT EXISTS contact (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        message TEXT NOT NULL
    )`;

    db.run(createUsersTable, (err) => {
        if (err) {
            console.error('Error creando la tabla users:', err.message);
        } else {
            console.log('Tabla users creada o ya existente.');
        }
    });

    db.run(createCommentsTable, (err) => {
        if (err) {
            console.error('Error creando la tabla comments:', err.message);
        } else {
            console.log('Tabla comments creada o ya existente.');
        }
    });

    db.run(createContactTable, (err) => {
        if (err) {
            console.error('Error creando la tabla contact:', err.message);
        } else {
            console.log('Tabla contact creada o ya existente.');
        }
    });
};

// Llamar a la función para crear tablas
createTables();

/**
 * Rutas de la aplicación
 */

// Ruta para enviar la información de contacto
app.post('/enviar-contacto', (req, res) => {
    const { username, message } = req.body;

    if (!username || !message) {
        return res.status(400).send({ error: 'Debe proporcionar un nombre de usuario y un mensaje' });
    }

    db.run('INSERT INTO contact (username, message) VALUES (?, ?)', [username, message], function (err) {
        if (err) {
            console.error('Error al crear el mensaje de contacto:', err.message);
            return res.status(500).send({ error: 'Error al crear el mensaje de contacto' });
        }
        console.log('Mensaje de contacto creado con ID:', this.lastID);
        res.status(200).json({ message: 'Mensaje de contacto enviado exitosamente' });
    });
});

// Ruta para verificar la autenticación del usuario
app.get('/verificar-autenticacion', (req, res) => {
    if (req.session.user_id) {
        res.json({ autenticado: true });
    } else {
        res.json({ autenticado: false });
    }
});

// Ruta para crear usuario
app.post('/crear-usuario', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).send({ error: 'Debe proporcionar un nombre de usuario' });
    }

    db.run('INSERT INTO users (username) VALUES (?)', [username], function(err) {
        if (err) {
            console.error('Error al crear usuario:', err.message);
            return res.status(500).send({ error: 'Error al crear usuario' });
        }

        req.session.user_id = this.lastID;
        req.session.username = username;

        res.redirect('/comentario.html');
    });
});

// Ruta para enviar comentario
app.post('/enviar-comentario', (req, res) => {
    const { comment } = req.body;

    if (!comment) {
        return res.status(400).send({ error: 'Debe proporcionar un comentario' });
    }

    const userId = req.session.user_id;

    db.run('INSERT INTO comments (comment, user_id) VALUES (?, ?)', [comment, userId], function(err) {
        if (err) {
            console.error('Error al enviar comentario:', err.message);
            return res.status(500).send({ error: 'Error al enviar comentario' });
        }

        res.sendStatus(200);
    });
});

// Ruta para obtener comentarios
app.get('/obtener-comentarios', (req, res) => {
    db.all('SELECT comments.comment, users.username FROM comments INNER JOIN users ON comments.user_id = users.id', (err, rows) => {
        if (err) {
            console.error('Error al obtener comentarios:', err.message);
            return res.status(500).send({ error: 'Error al obtener comentarios' });
        }

        res.json(rows);
    });
});

// Ruta para buscar comentarios por nombre de usuario
app.get('/buscar-comentarios', (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).send({ error: 'Debe proporcionar un nombre de usuario' });
    }

    db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            console.error('Error al buscar usuario:', err.message);
            return res.status(500).send({ error: 'Error al buscar usuario' });
        }

        if (!user) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }

        db.all('SELECT comments.comment, users.username FROM comments INNER JOIN users ON comments.user_id = users.id WHERE users.id = ?', [user.id], (err, comments) => {
            if (err) {
                console.error('Error al obtener comentarios:', err.message);
                return res.status(500).send({ error: 'Error al obtener comentarios' });
            }

            res.json(comments);
        });
    });
});

// Rutas para servir archivos HTML
app.get('/usuario.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'usuario.html'));
});

app.get('/comentario.html', verificarAutenticacion, (req, res) => {
    res.sendFile(path.join(__dirname, 'comentario.html'));
});

// Ruta para la URL raíz ("/")
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
