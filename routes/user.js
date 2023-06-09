let express = require('express');
const UserController = require ('../controller/user.js');
const router = express.Router();

const middleware = require('../middleware/middleware.js');

const middlewareAdmin = require('../middleware/middleware.js')

let jwt = require('jsonwebtoken')

let thedb = require('../config/dbconfig.js')
const multer  = require('multer')
const upload = multer({ dest: 'static/images/' })



router.get('/shoutbox', UserController.ShoUser)


// Routes pour supprimer un utilisateur
router.post('/parameter/delete/:iduser',  UserController.DelUser)
// Routes pour modifier utilisateur
router.post('/parameter/edit/:iduser', upload.fields([{name: 'photoprofil', maxCount: 1}, {name: 'bannerprofil', maxCount: 1}]), UserController.EdiUser)
// Routes pour récupérer tout les utilisateurs
router.get('/members/all', UserController.AllUser)
// Routes pour récupérer un utilisateur
router.get('/get/:iduser', UserController.GetUser)
// Routes pour récupérer ces propres informations d'utilisateur
router.get('/me', UserController.MeUser)

router.get('/profil/:iduser', middleware, (req,res) => {
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
                        res.render('profil')
                    } else {
                        thedb.query('SELECT * FROM com INNER JOIN user USING(Iduser)', (errcom, resultcom) => {
                            if (error) {
                                res.render('profil')
                            } else {           
                                thedb.query('SELECT * FROM likepost', (errorlikepost, resultlikepost)=> {
                                    if (error)  {
                                        console.log(error)
                                        res.render('profil')
                                    } else {
                                        console.log("likeeee", resultlikepost)
                                        thedb.query('SELECT * FROM post INNER JOIN user USING(Iduser) WHERE Iduser =?', req.params.iduser, (errorProfilPost, resultProfilPost) => {
                                            if (errorProfilPost) {
                                                console.log('Error profil post');
                                            } else if (!errorProfilPost) {
                                                res.render('profil', {result, resultcom, tokencookie ,IDUserJSON, resultuser, resultlikepost, resultProfilPost})             
                                            } 
                                        })
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
                res.render('profil')
            } else {
                thedb.query('SELECT * FROM com INNER JOIN user USING(Iduser)', (errcom, resultcom) => {
                    if (error) {
                        res.render('profil')
                    } else {
                        res.render('profil' , {result, resultcom, tokencookie ,IDUserJSON})
                    }
                })
            }
        })
    }
})

router.get('/parameter', middleware, (req,res) => {
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
                        res.render('parameter')
                    } else {
                        thedb.query('SELECT * FROM com INNER JOIN user USING(Iduser)', (errcom, resultcom) => {
                            if (error) {
                                res.render('parameter')
                            } else {           
                                thedb.query('SELECT * FROM likepost', (errorlikepost, resultlikepost)=> {
                                    if (error)  {
                                        console.log(error)
                                        res.render('parameter')
                                    } else {
                                        console.log("likeeee", resultlikepost)
                                        const parameter = req.originalUrl;
                                        console.log(parameter)
                                        
                                        res.render('parameter' , {result, resultcom, tokencookie ,IDUserJSON, resultuser, resultlikepost, parameter})
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
                res.render('parameter')
            } else {
                thedb.query('SELECT * FROM com INNER JOIN user USING(Iduser)', (errcom, resultcom) => {
                    if (error) {
                        res.render('parameter')
                    } else {
                        const parameter = req.originalUrl
                        res.render('parameter' , {result, resultcom, tokencookie ,IDUserJSON, parameter})
                    }
                })
            }
        })
    }
})





module.exports = router