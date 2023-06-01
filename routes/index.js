let express = require("express")
const router = express.Router()
const IndexController = require('../controller/index.js')
const verifytoken = require('../middleware/middleware.js')
const thedb = require('../config/dbconfig.js')
let jwt = require('jsonwebtoken')

router.get('/', (req, res) => {
    thedb.query('SELECT * FROM post INNER JOIN user USING(Iduser) ORDER BY datePost DESC', (error, result) => {
        if (error) {

            res.render('index')
        } else {
            
            thedb.query('SELECT * FROM com INNER JOIN user USING(Iduser)', (errcom, resultcom) => {
                if (error) {
                    
                    res.render('index')
                } else {
                    
                    res.render('index', {result, resultcom})
                }
            })
        }
    })   
})

router.post ('/' , IndexController.Index)


// Route pour Login
router.get('/login', (req, res) => {res.render ('login')})
router.post('/login', IndexController.LogUser)

router.post('/like/com/:params1/post/:params2', IndexController.LikeCom)

router.post('/like/post/:paramsPost', IndexController.LikePost)

router.post("/com/post/:params", IndexController.IndexCom)

// Routes pour enregistrement utilisateur
router.get('/register', (req, res) => {res.render('register')})
router.post('/register', IndexController.RegUser);
router.get('/logout', (req,res) => {
    res.clearCookie("tokenUser")
    res.redirect('/')
})
module.exports = router