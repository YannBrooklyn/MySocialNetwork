let express = require('express');
const mysql = require ('mysql');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv').config({path: "././.env"});
const path = require('path');


const thedb = require('../config/dbconfig.js');

const index = express();
index.set("view engine", "ejs")
index.use(express.static('static'))




exports.DelUser = (req, res) => {
    const IDuserme = jwt.decode(req.cookies.tokenUser)
    
    thedb.query('DELETE FROM user WHERE Iduser = ?', IDuserme.Id, (error, results) => {
        if (error) {
            return res.status(400).json ({Message: error})
        }
        else {
            res.clearCookie('tokenUser')
            return res.redirect('/')
        }
    })
}

exports.EdiUser = (req, res) => {
    const IdUser = jwt.decode(req.cookies.tokenUser)
    console.log("test", IdUser)
    console.log('erreur')
    const {firstname, lastname, email, password, photoprofil, bannerprofil, datenaissance, enpostedepuis, habitea, fonction} = req.body
    const salt = bcryptjs.genSaltSync(8)
    const hashedpassword = bcryptjs.hashSync(password, salt)
    thedb.query('UPDATE user SET ? WHERE IdUser = ?', [{Firstname: firstname, Lastname: lastname, Email: email, Password: hashedpassword, Photoprofil: photoprofil, Bannerprofil: bannerprofil, Datenaissance: datenaissance, Enpostedepuis: enpostedepuis, Habitea: habitea, Fonction: fonction}, IdUser.Id], (error, results) => {
        if (error) {
            return res.status(400).json ({Message: "Message d'erreur"})
        } else {
            return res.redirect('/user/parameter')
        }
    })
}



exports.AllUser = (req, res) => {
    
    thedb.query('Select * From User', (error, resultallusers) => {
        if (error) {
            return res.statu(400).json ({Message: error})
        } else {
            const IDUserJSON = jwt.decode(req.cookies.tokenUser)
            const tokencookie = req.cookies.tokenUser

            if (tokencookie) {
                thedb.query('SELECT * FROM user WHERE Iduser = ?', IDUserJSON.Id, (erroruser, resultuser) => {
                    if (erroruser) {
                        console.log(erroruser)
                    }
                    else if (!erroruser) {
                        thedb.query('SELECT * FROM post INNER JOIN user USING(Iduser) ORDER BY datePost DESC', (error, result) => {
                            if (error) {
                                res.render('member')
                            } else {
                                thedb.query('SELECT * FROM com INNER JOIN user USING(Iduser)', (errcom, resultcom) => {
                                    if (error) {
                                        res.render('member')
                                    } else {           
                                        thedb.query('SELECT * FROM likepost', (errorlikepost, resultlikepost)=> {
                                            if (error)  {
                                                console.log(error)
                                                res.render('member')
                                            } else {
                                                console.log("likeeee", resultlikepost)
                                                res.render('member' , {result, resultcom, tokencookie ,IDUserJSON, resultuser, resultlikepost, resultallusers})
                                            }
                                        })        
                                    }
                                })
                            }
                        })   
                    }
                })
            }
            else if (!tokencookie) {
                thedb.query('SELECT * FROM post INNER JOIN user USING(Iduser) ORDER BY datePost DESC', (error, result) => {
                    if (error) {
                        res.render('member')
                    } else {
                        thedb.query('SELECT * FROM com INNER JOIN user USING(Iduser)', (errcom, resultcom) => {
                            if (error) {
                                res.render('member')
                            } else {
                                res.render('member' , {result, resultcom, tokencookie ,IDUserJSON, resultallusers})
                            }
                        })
                    }
                })
            }
        }
    })
}

exports.GetUser = (req, res) => {
    const iduser = req.params.iduser

    thedb.query('Select IdUser, Firstname, Lastname, Email From User WHERE IDUser = ?', iduser, (error, results) => {
        if (error) {
            return res.status(400).json ({Message: "error getuser" + error})
        } else {
            return res.status(200).json ({Message: "GetUser" + results})
        }
    })
}

exports.MeUser = (req, res) => {
    
    const tokenheaders = req.headers.authorization
    jwt.verify(tokenheaders, process.env.J_SECRET, (error, decode) => {
        console.log(decode)
        if (error) {
            return res.status(400).json ({message: "test" + error})
        }
        else {
            
            return res.status(200).json ({IdUser: decode.Id, Firstname: decode.Firstname, Lastname: decode.Lastname, Email: decode.Email, Rang: decode.Rang})
        }
    })
    
}

