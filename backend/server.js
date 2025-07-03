
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
require('dotenv').config();
const session = require('express-session');


const utilisateurRoutes = require('./routes/utilisateurRoutes');
const produitsRoutes = require('./routes/produitsRoutes');
const fournisseursRoute = require('./routes/fournisseursRoutes');
const processus_commandeRoute =  require('./routes/processus-commandeRoute')
const produitfournisseur = require('./routes/produitsFournisseursRoute')
const authRoute = require("./routes/authRoutes")
const alertRoutes = require("./routes/alertRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes");
const searchRoute = require('./routes/searchRoute'); 

//const commandesRoute = require('./routes/commandesRoutes');

const app = express();



const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000'

];

app.use(cors({
    origin: function(origin, callback){

        if(!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))){
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
/*app.use('api/produits-fournisseurs', require('./routes/produitsFournisseursRoute'));*/
app.use("/api/dashboard", dashboardRoutes);

app.use('/api/utilisateurs', utilisateurRoutes);

app.use('/api/produits', produitsRoutes);


app.use('/api/fournisseurs', fournisseursRoute);

app.use('/api/produits-fournisseurs', produitfournisseur);



//app.use('/api/commandes', commandesRoute); déprécié

app.use('/api/commandes', processus_commandeRoute)

app.use('/api/auth',authRoute)

app.use('/api/alert/',alertRoutes)

app.use('/api/search', searchRoute); 


app.listen(process.env.PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${process.env.PORT}`);
});

