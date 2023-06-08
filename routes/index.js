let express = require("express")
const router = express.Router()
const IndexController = require('../controller/index.js')
const verifytoken = require('../middleware/middleware.js')
const thedb = require('../config/dbconfig.js')
let jwt = require('jsonwebtoken')
let cookieparser = require('cookie-parser')



router.get('/', (req, res) => {
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
                        res.render('index')
                    } else {
                        thedb.query('SELECT * FROM com INNER JOIN user USING(Iduser)', (errcom, resultcom) => {
                            if (error) {
                                res.render('index')
                            } else {           
                                thedb.query('SELECT * FROM likepost', (errorlikepost, resultlikepost)=> {
                                    if (error)  {
                                        console.log(error)
                                        res.render('index')
                                    } else {
                                        console.log("likeeee", resultlikepost)
                                        res.render('index' , {result, resultcom, tokencookie ,IDUserJSON, resultuser, resultlikepost})
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
                res.render('index')
            } else {
                thedb.query('SELECT * FROM com INNER JOIN user USING(Iduser)', (errcom, resultcom) => {
                    if (error) {
                        res.render('index')
                    } else {
                        res.render('index' , {result, resultcom, tokencookie ,IDUserJSON})
                    }
                })
            }
        })
    }
})

router.post ('/' , IndexController.Index)


// Route pour Login
router.get('/login', (req, res) => {
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
                        res.render('login')
                    } else {
                        thedb.query('SELECT * FROM com INNER JOIN user USING(Iduser)', (errcom, resultcom) => {
                            if (error) {
                                res.render('login')
                            } else {           
                                thedb.query('SELECT * FROM likepost', (errorlikepost, resultlikepost)=> {
                                    if (error)  {
                                        console.log(error)
                                        res.render('login')
                                    } else {
                                        console.log("likeeee", resultlikepost)
                                        res.render('login' , {result, resultcom, tokencookie ,IDUserJSON, resultuser, resultlikepost})
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
                res.render('login')
            } else {
                thedb.query('SELECT * FROM com INNER JOIN user USING(Iduser)', (errcom, resultcom) => {
                    if (error) {
                        res.render('login')
                    } else {
                        res.render('login' , {result, resultcom, tokencookie ,IDUserJSON})
                    }
                })
            }
        })
    }
})

router.post('/login', IndexController.LogUser)

router.post('/like/com/:params1/post/:params2', IndexController.LikeCom)

router.post('/like/post/:paramsPost', IndexController.LikePost)

router.post("/com/post/:params", IndexController.IndexCom)

// Routes pour enregistrement utilisateur
router.get('/register', (req, res) => {
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
                        res.render('register')
                    } else {
                        thedb.query('SELECT * FROM com INNER JOIN user USING(Iduser)', (errcom, resultcom) => {
                            if (error) {
                                res.render('register')
                            } else {           
                                thedb.query('SELECT * FROM likepost', (errorlikepost, resultlikepost)=> {
                                    if (error)  {
                                        console.log(error)
                                        res.render('register')
                                    } else {
                                        console.log("likeeee", resultlikepost)
                                        res.render('register' , {result, resultcom, tokencookie ,IDUserJSON, resultuser, resultlikepost})
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
                res.render('register')
            } else {
                thedb.query('SELECT * FROM com INNER JOIN user USING(Iduser)', (errcom, resultcom) => {
                    if (error) {
                        res.render('register')
                    } else {
                        res.render('register' , {result, resultcom, tokencookie ,IDUserJSON})
                    }
                })
            }
        })
    }
})

// Route pour s'enregistrer sur le site
router.post('/register', IndexController.RegUser);

// Route pour se déconnecter
router.get('/logout', (req,res) => {
    res.clearCookie("tokenUser")
    res.redirect('/')
})

// Route pour page admin
router.get('/admin/panel', IndexController.Admin);

// Route pour tous les membres dans la page admin
router.get('/admin/panel/membres', IndexController.Admin);

// Route pour tous les posts dans la page admin
router.get('/admin/panel/posts', IndexController.Admin);

// Route pour tous les commentaires dans la page admin
router.get('/admin/panel/commentaires', IndexController.Admin);

// Route pour supprimer un post
router.get('/admin/panel/post/delete/:idPost', IndexController.AdminDelete)

// Route pour confirmer la suppression d'un post
router.post('/admin/panel/post/delete/:idPost/confirm', IndexController.AdminDeleteConfirm);

// Route pour supprimer un commentaire
router.get('/admin/panel/com/delete/:idCom', IndexController.AdminDelete)

// Route pour confirmer la suppression d'un commentaire
router.post('/admin/panel/com/delete/:idCom/confirm', IndexController.AdminDeleteConfirm);


module.exports = router