// Middleware para verificar la autenticación del usuario
function verificarAutenticacion(req, res, next) {
    // Verificar si el usuario está autenticado mediante la sesión
    if (req.session.user_id) {
        // Si está autenticado, continuar con la siguiente función de middleware o ruta
        return next();
    } else {
        // Si no está autenticado, redirigir a la página de creación de usuario
        res.redirect('/usuario.html');
    }
}

// Exportar la función de middleware para que pueda ser utilizada en otras partes de la aplicación
module.exports = {
    verificarAutenticacion
};
