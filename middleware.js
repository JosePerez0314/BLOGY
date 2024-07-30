// Función middleware para verificar la autenticación del usuario
function verificarAutenticacion(req, res, next) {
    if (req.session.userId) {
        // Si el usuario está autenticado (existe una sesión con userId), continuar con la siguiente función middleware o ruta
        next();
    } else {
        // Si el usuario no está autenticado, redirigir a la página de creación de usuario
        res.redirect('/usuario.html');
    }
}

// Exportar la función para usarla en otras partes de la aplicación
module.exports = {
    verificarAutenticacion
};
