const mysql = require ('mysql');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv').config({path: "././.env"});
const path = require('path');

const thedb = require('../config/dbconfig.js');
let cookieparser = require('cookie-parser');

const RegexSecureFLN = /^([A-Za-z\d]){3,50}([._-]){0,2}$/;
const RegexSecurePW = /^([A-Za-z\d]){3,255}|([._-]){3,255}$/;
const RegexSecureEmail = /^([-._A-Za-z\d]){3,100}@([a-zA-Z]){3,15}\.([a-zA-Z]){3}$/

const RegexSecureText = /^([A-Za-z\d]){3,100}([._-]){0,100}$/;

exports.Index = (req, res) => {
    console.log(req.body)
    const reqTextArea = req.body.textpost
    console.log(reqTextArea)
    const IdUser = jwt.decode(req.cookies.tokenUser)
    console.log(req.cookies.tokenUser)
    const textpost = {text: reqTextArea, Iduser: IdUser.Id}

    if (!RegexSecureText.test(reqTextArea)){
        return res.redirect('/')
    }
    else if (RegexSecureText.test(reqTextArea)) {
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

exports.LikePost = (req, res) => {
    const IdUser = jwt.decode(req.cookies.tokenUser)
    const LikePostInfo = {Iduser: IdUser.Id, idPost: parseInt(req.params.paramsPost)}
    thedb.query('SELECT * FROM likepost WHERE Iduser = ? AND idPost = ?', [IdUser.Id, parseInt(req.params.paramsPost)], (error, result) => {
        if (result.length > 0) {
            thedb.query('DELETE FROM likePost WHERE Iduser = ? AND idPost = ?', [IdUser.Id, req.params.paramsPost], (errordel, resultdel) => {
                if (errordel) {
                    console.log(error)
                    return res.redirect('/')
                }
                else if (!errordel) {
                    console.log(resultdel)
                    return res.redirect('/')
                }
            })
        }
        else if (result.length == 0) {
            thedb.query('INSERT INTO likepost SET ?', LikePostInfo, (errorinsert, resultinsert) => {
                if (errorinsert) {
                    console.log(errorinsert)
                    return res.redirect('/')
                }
                else if (!errorinsert) {
                    console.log(resultinsert)
                    return res.redirect('/')
                }
            })
        }
    })
}

exports.LikeCom = (req, res) => {
    
    const IdUser = jwt.decode(req.cookies.tokenUser)
    const LikeInfo = {idCom: parseInt(req.params.params1), Iduser: IdUser.Id, idPost: parseInt(req.params.params2)}
    console.log(req)
    thedb.query('SELECT idLikeCom FROM likecom WHERE idCom = ? AND Iduser = ? AND idPost = ?', [parseInt(req.params.params1), parseInt(IdUser.Id), parseInt(req.params.params2)], (error, resultverif) => {
        console.log("resultverif", resultverif)
        console.log("resultverif", error)
        if(resultverif.length < 1) {
            thedb.query('INSERT INTO likecom SET ?', LikeInfo, (errorliked, resultliked) =>{
                if (errorliked) {
                    console.log("erreur avec like", errorliked)
                    console.log('rrrrrrrrrrrrrrrrrrrr', resultliked)
                    console.log('reeeeeeeeeeeeeeerrefedfdfdf', resultverif)
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
                    console.log('loooooooooooook', errordellike)
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

    if (!RegexSecureFLN.test(req.body.firstname && req.body.lastname) || !RegexSecurePW.test(req.body.password && req.body.passwordconfirm) || !RegexSecureEmail.test(req.body.email)) {
        return res.redirect('/register')
    }
    else if (RegexSecureFLN.test(req.body.firstname && req.body.lastname) || RegexSecurePW.test(req.body.password && req.body.passwordconfirm) || RegexSecureEmail.test(req.body.email)) {
        thedb.query('SELECT Email From user WHERE Email = ?', [email], (error, results) => {
            if (error) {
                console.log('Error ' + error)
                return res.redirect('/register')
            }
            else if (results.length > 0) {
                console.log("email déjà utilisé")
                return res.redirect('/register')
            }
            else if (password !== passwordconfirm) {
                console.log('pas le même password')
                return res.redirect('/register')
            }
            else if (password === passwordconfirm && results.length == 0) {
                const salt = bcryptjs.genSaltSync(8)
                const hashedpassword = bcryptjs.hashSync(password, salt)
                console.log('Voici le mdp hasher ' + hashedpassword)
                
                const newUser = {Firstname: firstname, Lastname: lastname, Email: email, Password: hashedpassword}
                thedb.query('INSERT INTO user SET ?', newUser, (error, results) => {
                    if (error) {
                        console.log("Une erreur s'est produite "+ error)
                        return res.redirect('/register')
                    } else {
                        console.log("Enregistrement réussi ", results)
                        return res.redirect('/login')
                    }
                })
            }
        })
    } else {
        res.send('erreur général')
    }
}

exports.LogUser = (req, res) => {
    console.log(req.body)
    const email = req.body.email
    const password = req.body.password
    
    
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

