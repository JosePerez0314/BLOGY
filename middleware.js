function verificarAutenticacion(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/usuario.html');
    }
}

module.exports = {
    verificarAutenticacion
};
