let express = require ('express');
const path = require ('path');
const index = express();




index.use(express.urlencoded({extended: false}));
index.use(express.json());

// Routes pour enregistrement utilisateur
index.use('/user', require('./routes/user.js'));


index.listen(3102);


