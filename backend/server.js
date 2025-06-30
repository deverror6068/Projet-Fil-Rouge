// // server.js
// const express = require('express');
// const cors = require('cors');
// const utilisateurRoutes = require('./routes/utilisateurRoutes');
// const produitsRoutes = require('./routes/produitsRoutes');
// const fournisseursRoute = require('./routes/fournisseursRoutes');
// const processus_commandeRoute =  require('./routes/processus-commandeRoute')
// const produitfournisseur = require('./routes/produitsFournisseursRoute')
// const authRoutes = require("./routes/authRoutes")
// const commandesRoute = require('./routes/commandesRoutes');
// const notificationsRoutes = require('./routes/notifications');
// contenuRoutes = require("./routes/contenuRoutes");
// const stock = require('./routes/stock');
// const magasin = require('./routes/magasin');
// //const commandesRoute = require('./routes/commandesRoutes');
// require('dotenv').config();

// const app = express();

// const session = require('express-session');

// app.use(cors({
//     origin: 'http://localhost:3000', // ou ton frontend
//     credentials: true // autorise les cookies de session côté client
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(session({
//     secret: '3430203a8808167eaeaf7b85749e557bb5d50f206a2476fb79b6b7b3606cc863', // 🔒 Change-la en prod
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         httpOnly: true,
//         secure: false, // à true si HTTPS
//         maxAge: 1000 * 60 * 60 // 1h
//     }
// }));

// app.use("/api/notifications", notificationsRoutes);


// app.use(express.json());
// app.use('/produits-fournisseurs', require('./routes/produitsFournisseursRoute'));

// app.use('/api/utilisateurs', utilisateurRoutes);

// app.use('/api/produits', produitsRoutes);


// app.use('/api/fournisseurs', fournisseursRoute);

// app.use('/api/produits-fournisseurs', produitfournisseur);

// app.use('/api/stocks', stock);

// app.use('/api/magasins', magasin);

// //app.use('/api/commandes', commandesRoute); déprécié

// app.use('/api/commandes', commandesRoute);
// //routes produits
// app.use('/api/produits', produitsRoutes);

// app.use('/api/auth', authRoutes);
// app.use("/api/contenus", contenuRoutes);


// app.listen(process.env.PORT, () => {
//     console.log(`Serveur démarré sur http://localhost:${process.env.PORT}`);
// });

// server.js
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

//const commandesRoute = require('./routes/commandesRoutes');

const app = express();



const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000'

];

app.use(cors({
    origin: function(origin, callback){
        console.log("Origin:", origin);
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



app.listen(process.env.PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${process.env.PORT}`);
});

