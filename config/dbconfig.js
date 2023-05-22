const mysql = require('mysql');
const dotenv = require("dotenv").config({path: "././.env"});


const thedb = mysql.createConnection({
    host: process.env.THEDB_HOST,
    user: process.env.THEDB_USER,
    database: process.env.THEDB,
    password: process.env.THEDB_PW
});

thedb.connect ((error) => {
    if (error) {
        console.log("Une erreur s'est produite " + error);
    }
    else {
        console.log("Connecté");
    }
});

module.exports = thedb