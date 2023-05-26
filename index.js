let express = require ('express');
const path = require ('path');
const { brotliDecompress } = require('zlib');
const index = express();




index.use(express.urlencoded({extended: false}));
index.use(express.json());

index.set("view engine", "ejs")
index.use(express.static('static'))
// Routes pour enregistrement utilisateur
index.use('/user', require('./routes/user.js'));
index.use('/', require('./routes/index.js'));


index.listen(3102);


