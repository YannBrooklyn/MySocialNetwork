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
const multer  = require('multer')
const upload = multer({ dest: 'static/images/' })
const RegexSecureFLN = /^([A-Za-z\d]){3,50}([._-]){0,2}$/;
const RegexSecurePW = /^([A-Za-z\d\s]){3,255}|([._-]){3,255}$/;
const RegexSecureEmail = /^([-._A-Za-z\d]){3,100}@([a-zA-Z]){3,15}\.([a-zA-Z]){3}$/
const RegexSecureText = /^([A-Za-z\d\s\']){3,100}([!?,:._-]){0,100}$/;
const RegexSecureDate = /^([-\d']){10}$/;
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

exports.EdiUser =  (req, res) => {
    const IdUser = jwt.decode(req.cookies.tokenUser)
    console.log("test", IdUser)
    
    
    
    thedb.query('Select * FROM user WHERE Iduser = ?', IdUser.Id, (errorEdiUser, resultEdiUser) => {
        let hashedpassword = ""
        let {firstname, lastname, email, password, ville, enpostedepuis, fonction, datenaissance} = req.body
        console.log("o",req.body)
        let test  = password
        let bannerprofil = ""
        let photoprofil = ""
        if (req.files.bannerprofil) {
            bannerprofil = req.files.bannerprofil[0].filename
        }
        if (req.files.photoprofil) {
            photoprofil = req.files.photoprofil[0].filename
        }
        
        
        
        console.log("ttttttttttttttttttt", hashedpassword)

        if (password != " " || password != "" || password != undefined || password != null || RegexSecurePW.test(password)) {
        password = req.body.password
        let salt = bcryptjs.genSaltSync(8)
        hashedpassword = bcryptjs.hashSync(password, salt)
        } 
        else if (password == " " || password == "" || password == undefined || password == null || !RegexSecurePW.test(password)) {
            password = resultEdiUser[0].Password
            let salt = bcryptjs.genSaltSync(8)
         hashedpassword = bcryptjs.hashSync(password, salt)
        }

        if (firstname == " " || firstname == "" || firstname == undefined || firstname == null || !RegexSecureFLN.test(firstname)) {
            firstname = resultEdiUser[0].Firstname
        }

        if (lastname == " " || lastname == "" || lastname == undefined || lastname == null || !RegexSecureFLN.test(lastname)) {
            lastname = resultEdiUser[0].Lastname
        }

        if (email == " " || email == "" || email == undefined || email == null || !RegexSecureEmail.test(email)) {
            email = resultEdiUser[0].Email
        }

        

        if (fonction == " " || fonction == "" || fonction == undefined || fonction == null || !RegexSecureFLN.test(fonction)) {
            fonction = resultEdiUser[0].Fonction
        }

        if (ville == " " || ville == "" || ville == undefined || ville == null || !RegexSecureFLN.test(ville)) {
            ville = resultEdiUser[0].Ville
        }

        if (datenaissance == " " || datenaissance == "" || datenaissance == undefined || datenaissance == null || !RegexSecureDate.test(datenaissance)) {
            datenaissance = resultEdiUser[0].Datenaissance
        }

        if (enpostedepuis == " " || enpostedepuis == "" || enpostedepuis == undefined || enpostedepuis == null || !RegexSecureDate.test(enpostedepuis)) {
            enpostedepuis = resultEdiUser[0].Enpostedepuis
        }
        
        if (bannerprofil == " " || bannerprofil == "" || bannerprofil == undefined || bannerprofil == null || !RegexSecureFLN.test(bannerprofil)) {
            bannerprofil = resultEdiUser[0].Bannerprofil
        }

        if (photoprofil == " " || photoprofil == "" || photoprofil == undefined || photoprofil == null || !RegexSecureFLN.test(photoprofil)) {
            photoprofil = resultEdiUser[0].Photoprofil
        }

        console.log(hashedpassword)
        console.log("tttt", firstname)
        thedb.query('UPDATE user SET ? WHERE IdUser = ?',  [{Firstname: firstname, Lastname: lastname, Email: email, Password:  hashedpassword, Fonction: fonction, Ville: ville, Datenaissance: datenaissance, Enpostedepuis: enpostedepuis, Bannerprofil: bannerprofil, Photoprofil: photoprofil}, IdUser.Id], (error, results)  =>  {
            if (error) {
                console.log(error)
                return res.status(400).json ({Message: "Message d'erreur"})
            } else {
                
                return res.redirect('/user/parameter' )
            }
        })
    
        // else if (firstname != " " || firstname != "" || firstname != undefined || firstname != null || RegexSecureFLN.test(firstname)) {
        //     console.log("coucou")
        //     thedb.query('UPDATE user SET ? WHERE IdUser = ?',  [{Firstname: firstname}, IdUser.Id], (error, results) => {
        //         if (error) {
        //             return res.status(400).json ({Message: "Message d'erreur"})
        //         } else {
                    
        //             return res.redirect('/user/parameter' )
        //         }
        //     })
        // }
        
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

exports.ShoUser = (req, res) => {
    const IDUserJSON = jwt.decode(req.cookies.tokenUser)
    const tokencookie = req.cookies.tokenUser
    if (tokencookie) {
        thedb.query('SELECT * FROM user WHERE Iduser = ?', IDUserJSON.Id, (erroruser, resultuser) => {
            if (erroruser) {
                console.log(erroruser)
            }
            else if (!erroruser) {
                console.log(resultuser)
                thedb.query('SELECT * FROM post INNER JOIN user USING(Iduser) ORDER BY datePost DESC', (error, result) => {
                    if (error) {
                        res.render('shoutbox')
                    } else {
                        thedb.query('SELECT * FROM com INNER JOIN user USING(Iduser)', (errcom, resultcom) => {
                            if (error) {
                                res.render('shoutbox')
                            } else {           
                                thedb.query('SELECT * FROM likepost', (errorlikepost, resultlikepost)=> {
                                    if (error)  {
                                        console.log(error)
                                        res.render('shoutbox')
                                    } else {
                                        console.log("likeeee", resultlikepost)
                                        res.render('shoutbox' , {result, resultcom, tokencookie ,IDUserJSON, resultuser, resultlikepost})
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
                res.render('shoutbox')
            } else {
                thedb.query('SELECT * FROM com INNER JOIN user USING(Iduser)', (errcom, resultcom) => {
                    if (error) {
                        res.render('shoutbox')
                    } else {
                        res.render('shoutbox' , {result, resultcom, tokencookie ,IDUserJSON})
                    }
                })
            }
        })
    }
}