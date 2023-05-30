const jwt = require ("jsonwebtoken")
const dotenv = require('dotenv').config({path: "././.env"})




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