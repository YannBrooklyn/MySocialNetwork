const mysql = require ('mysql');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv').config({path: "././.env"});
const path = require('path');

const thedb = require('../config/dbconfig.js');
let cookieparser = require('cookie-parser')




exports.Index = (req, res) => {

    
    console.log(req.body)
    const reqTextArea = req.body.textpost
    console.log(reqTextArea)
    const IdUser = jwt.decode(req.cookies.tokenUser)
    console.log(req.cookies.tokenUser)
    const textpost = {text: reqTextArea, Iduser: IdUser.Id}
    thedb.query('INSERT INTO post SET ?', textpost, (error, result) => {
        if (error) {
            return console.log("error", error)
        } else {
            thedb.query('SELECT * FROM post inner join user using(Iduser)', (error, result) => {
                if (error) {
                    return console.log("erreurrr", error)
                } else {
                    return res.redirect('/')
                    
                }
            })
            
        }
    })
}

exports.IndexCom = (req, res) => {
    console.log("commmeeee", req.params.params)
    const reqInputCom = req.body.inputcomments
    const IdUser = jwt.decode(req.cookies.tokenUser)
    const textComments = {textCom: reqInputCom, Iduser: IdUser.Id, idPost: req.params.params}
    thedb.query('INSERT INTO com SET ?', textComments, (error, result) => {
        if (error) {
            return console.log("error", error)
        } else {
            thedb.query('Select * FROM com', (error, result) => {
                if (error) {
                    console.log("erreur", error)
                } else {
                    res.redirect('/')
                    return console.log('resumt', result)
                }
            })
        }
    })
}

exports.LikeCom = (req, res) => {
    
    const IdUser = jwt.decode(req.cookies.tokenUser)
    const LikeInfo = {idCom: req.params.params1, Iduser: IdUser.Id, idPost: req.params.params2}

    thedb.query('Select * from likecom Where idCom AND Iduser AND idPost', LikeInfo, (error, resultverif) => {

        if(error) {
            thedb.query('INSERT INTO likecom SET ?', LikeInfo, (errorliked, resultliked) =>{
                if (errorliked) {
                    console.log("erreur avec like", errorliked)
                    return res.redirect('/')
                } else {
                    console.log(error)
                    console.log("tu like", resultliked)
                    return res.redirect('/')
                }
            })
        } else {
            thedb.query('DELETE FROM likecom Where idLikeCom = ?', resultverif[0].idLikeCom, (errordellike, resultdellike) => {
                console.log(resultverif)
                console.log(resultverif[0].idLikeCom)
                if (errordellike) {
                    console.log('loooooooooooook', error)
                    return res.redirect('/')
                } else {
                    console.log("retirer like", resultdellike)
                    return res.redirect('/')
                }
            })
        }

    })

    
}

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
                    return res.redirect('login')
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
                console.log("result login",results)
                
                const token = jwt.sign({Id: results[0].Iduser}, process.env.J_SECRET)
                
                console.log('you loged', token)
                res.cookie("tokenUser", token)
                
                return res.redirect('/')
            }
            else if (bcryptjsverify == false) {
                res.status(400).json ({Message: "Wrong password"})
            }
        }
    })
}

