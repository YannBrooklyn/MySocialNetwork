let express = require('express');
const mysql = require ('mysql');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv').config({path: "././.env"});
const path = require('path');

let ls = require('local-storage')
const thedb = require('../config/dbconfig.js');

const index = express();
index.set("view engine", "ejs")
index.use(express.static('static'))



exports.RegUser = (req, res) => {

    const{firstname, lastname, email, password, passwordconfirm} = req.body
    thedb.query('SELECT Email From user WHERE Email = ?', [email], (error, results) => {
        if (error) {
            console.log('Error ' + error)
            return res.status(500).json ({Message: error + " Veuillez réssayez"})
        }
        else if (results.length > 0) {
            return res.status(401).json ({Message: "This Email is already registred"})
        }
        else if (password !== passwordconfirm) {
            return res.status(401).json ({Message: "Not the same password"})
        }
        else if (password === passwordconfirm && results.length == 0) {
            const salt = bcryptjs.genSaltSync(8)
            const hashedpassword = bcryptjs.hashSync(password, salt)
            console.log('Voici le mdp hasher ' + hashedpassword)
            
            const newUser = {Firstname: firstname, Lastname: lastname, Email: email, Password: hashedpassword}
            thedb.query('INSERT INTO user SET ?', newUser, (error, results) => {
                if (error) {
                    console.log("Une erreur s'est produite "+ error)
                    return res.status(400).json ({Message: error})
                } else {
                    console.log("Enregistrement réussi ", results)
                    return res.status(200).json({Message: results})
                }
            })
        }
    })
}

exports.LogUser = (req, res) => {
    console.log(req.body)
    const email = req.body.email
    const password = req.body.password
    // const {email, password} = req.body

    thedb.query('Select * From User Where Email = ?', [email], (error, results) => {
        if (error) {
            return res.status(500).json ({error: 'failed to login'})
        }
        else if (results.length === 0) {
            return res.status(401).json ({error: 'Invalid email'})
        }
        else {
            const bcryptjsverify = bcryptjs.compareSync(password, results[0].Password)
            if (bcryptjsverify == true) {
                console.log(results)
                
                const token = jwt.sign({Id: results[0].Iduser, Firstname: results[0].Firstname, Lastname: results[0].Lastname, Email: results[0].Email, Rang: results[0].Rang}, process.env.J_SECRET)
                
                ls.set('test', token)
                const truc = ls.get('test')
                console.log("test", truc)
                console.log('you loged')
                
                return res.redirect('/')
            }
            else if (bcryptjsverify == false) {
                res.status(400).json ({Message: "Wrong password"})
            }
            
        }
    })
}