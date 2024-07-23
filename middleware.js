// Middleware para verificar la autenticación del usuario
function verificarAutenticacion(req, res, next) {
    if (req.session && req.session.userId) {
        next(); // El usuario está autenticado, permite el acceso a la siguiente ruta
    } else {
        res.json({ autenticado: false }); // Cambiado a JSON para que el cliente pueda manejarlo
    }
}

// Aplicar el middleware a la ruta de comentarios
app.get('/comentario.html', verificarAutenticacion, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'comentario.html'));
});
