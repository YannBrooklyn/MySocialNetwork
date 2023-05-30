let express = require("express")
const router = express.Router()
const IndexController = require('../controller/index.js')
const verifytoken = require('../middleware/middleware.js')
const thedb = require('../config/dbconfig.js')
let jwt = require('jsonwebtoken')

router.get('/', (req, res) => {
    thedb.query('SELECT * FROM post INNER JOIN user USING(Iduser) ORDER BY datePost DESC', (error, result) => {
        if (error) {
            console.log(error)
            res.render('index')
        } else {
            console.log('yooo', result)
            res.render('index', {result})
        }
    })   
})

router.post ('/' , IndexController.Index)


// Route pour Login
router.get('/login', (req, res) => {res.render ('login')})
router.post('/login', IndexController.LogUser)

router.get("/comments", IndexController.IndexCom)

// Routes pour enregistrement utilisateur
router.get('/register', (req, res) => {res.render('register')})
router.post('/register', IndexController.RegUser);
router.get('/logout', (req,res) => {
    res.clearCookie("tokenUser")
    res.redirect('/')
})
module.exports = router