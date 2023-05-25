let express = require("express")
const router = express.Router()
const IndexController = require('../controller/index.js')
const verifytoken = require('../middleware/middleware.js')

router.get('/', (req, res) => {res.render('index')})

// Route pour Login
router.get('/login', (req, res) => {res.render ('login')})
router.post('/login', IndexController.LogUser)



// Routes pour enregistrement utilisateur
router.get('/register', (req, res) => {res.render('register')})
router.post('/register', IndexController.RegUser);

module.exports = router