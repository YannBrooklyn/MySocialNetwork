const jwt = require ("jsonwebtoken")
const dotenv = require('dotenv').config({path: "././.env"})
let token = require ('../controller/index.js')



module.exports = function middleware (req, res, nex) {
    console.log("regarde sa marche", token)
    console.log("teetetetet", req.cookies.tokenUser)
    if (!req.cookies) {
        res.send("vous n'etes pas connecter")
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