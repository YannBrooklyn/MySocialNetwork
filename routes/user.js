let express = require('express');
const UserController = require ('../controller/user.js');
const router = express.Router();

const middleware = require('../middleware/middleware.js');

const IndexController = require('../controller/index.js')











// Routes pour supprimer un utilisateur
router.delete('/delete/:iduser',  UserController.DelUser)
// Routes pour modifier utilisateur
router.put('/edit/:iduser', UserController.EdiUser)
// Routes pour récupérer tout les utilisateurs
router.get('/all', UserController.AllUser)
// Routes pour récupérer un utilisateur
router.get('/get/:iduser', UserController.GetUser)
// Routes pour récupérer ces propres informations d'utilisateur
router.get('/me', UserController.MeUser)

router.get('/profil', middleware, (req,res) => {
    res.render('profil')
})





module.exports = router