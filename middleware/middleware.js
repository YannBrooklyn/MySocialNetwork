const jwt = require ("jsonwebtoken")

const dotenv = require('dotenv').config({path: "././.env"})
const token = require ('../controller/user.js')
let ls = require('local-storage')


module.exports = function verifytoken (req, res, nex) {
    const truc = ls.get('test')
    console.log(truc)
    const tokenheaders= ls.get("test")

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

