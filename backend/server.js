// server.js
const express = require('express');
const cors = require('cors');
const utilisateurRoutes = require('./routes/utilisateurRoutes');
const produitsRoutes = require('./routes/produitsRoutes');
const fournisseursRoute = require('./routes/fournisseursRoutes');
const processus_commandeRoute =  require('./routes/processus-commandeRoute')
const produitfournisseur = require('./routes/produitsFournisseursRoute')
const authRoute = require("./routes/authRoutes")
//const commandesRoute = require('./routes/commandesRoutes');
require('dotenv').config();

const app = express();

const session = require('express-session');

app.use(cors({
    origin: 'http://localhost:3000', // ou ton frontend
    credentials: true // autorise les cookies de session côté client
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: '3430203a8808167eaeaf7b85749e557bb5d50f206a2476fb79b6b7b3606cc863', // 🔒 Change-la en prod
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // à true si HTTPS
        maxAge: 1000 * 60 * 60 // 1h
    }
}));




app.use(express.json());
app.use('/produits-fournisseurs', require('./routes/produitsFournisseursRoute'));

app.use('/api/utilisateurs', utilisateurRoutes);

app.use('/api/produits', produitsRoutes);


app.use('/api/fournisseurs', fournisseursRoute);

app.use('/api/produits-fournisseurs', produitfournisseur);



//app.use('/api/commandes', commandesRoute); déprécié

app.use('/api/commandes', processus_commandeRoute)

app.use('/api/auth',authRoute)

app.listen(process.env.PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${process.env.PORT}`);
});
