const jwt = require ("jsonwebtoken")

const dotenv = require('dotenv').config({path: "././.env"})
const token = require ('../controller/user.js')


module.exports = function verifytoken (req, res, nex) {
    const tokenheaders= req.headers.authorization

    if (!tokenheaders) {
        return res.status(400).json ({Error: "Vous n'etes pas connecté"})
    }

    else if (tokenheaders) {
        jwt.verify(tokenheaders, process.env.J_SECRET, function (error, decoded) {
            if (error) {
                console.log(error + token)
                console.log(token)
                return res.status(400).json ({error: 'Invalid Token'})
            }
            else {
                
                nex()
            }
        })

    }
}

