const jwt = require ("jsonwebtoken")
const dotenv = require('dotenv').config({path: "././.env"})
const mysql = require('mysql');
const path = require('path');
const thedb = require('../config/dbconfig.js');



module.exports = function middleware (req, res, nex) {
    console.log("teetetetet", req.cookies.tokenUser)
    if (!req.cookies.tokenUser) {
        res.redirect('/register')
    } else {
        jwt.verify(req.cookies.tokenUser, process.env.J_SECRET, function (err, dec){
            if (err) {
                console.log("looke", err)
            } else {
                console.log("deode", dec)
                nex()
            }
        })
    }  
}

