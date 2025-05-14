
function requireLogin(req, res, next) {
    if (req.session && req.session.user) {
        // Utilisateur connecté
        next();
    } else {
        res.status(401).json({ message: "Connexion requise" });
    }
}

module.exports = requireLogin;