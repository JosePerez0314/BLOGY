// middleware.js

const path = require('path');

// Middleware para verificar la autenticación del usuario
function verificarAutenticacion(req, res, next) {
    if (req.session && req.session.userId) {
        next(); // El usuario está autenticado, permite el acceso a la siguiente ruta
    } else {
        res.json({ autenticado: false }); // Cambiado a JSON para que el cliente pueda manejarlo
    }
}

module.exports = { verificarAutenticacion };
