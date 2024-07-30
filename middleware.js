// Middleware para verificar autenticación
function verificarAutenticacion(req, res, next) {
    if (req.session.user_id) {
        return next();
    } else {
        res.redirect('/usuario.html');
    }
}

module.exports = {
    verificarAutenticacion
};
