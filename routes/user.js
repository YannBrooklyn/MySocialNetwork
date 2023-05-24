let express = require('express');
const UserController = require ('../controller/user.js');
const router = express.Router();

const verifytoken = require('../middleware/middleware.js');



router.get('/login', (req, res) => {res.render ('login')})
router.post('/login', UserController.LogUser)

router.get('/', (req, res) => {
    res.render('index')
})




// Routes pour enregistrement utilisateur
router.get('/register', (req, res) => {res.render('register')})
router.post('/register', UserController.RegUser);
// Routes pour supprimer un utilisateur
router.delete('/delete/:iduser',  UserController.DelUser)
// Routes pour modifier utilisateur
router.put('/edit/:iduser', UserController.EdiUser)
// Routes pour la deconnexion d'un utilisateur
// router.post('/logout', UserController.OutUser)
// Routes pour récupérer tout les utilisateurs
router.get('/all', UserController.AllUser)
// Routes pour récupérer un utilisateur
router.get('/get/:iduser', UserController.GetUser)
// Routes pour récupérer ces propres informations d'utilisateur
router.get('/me', UserController.MeUser)




module.exports = router