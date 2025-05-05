// server.js
const express = require('express');
const cors = require('cors');
const utilisateurRoutes = require('./routes/utilisateurRoutes');
const produitsRoutes = require('./routes/produitsRoutes');
const fournisseursRoute = require('./routes/fournisseursRoutes');
const commandesRoute = require('./routes/commandesRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/utilisateurs', utilisateurRoutes);

app.use('/api/produits', produitsRoutes);


app.use('/api/fournisseurs', fournisseursRoute);


app.use('/api/commandes', commandesRoute);



app.listen(process.env.PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${process.env.PORT}`);
});
