const router   = require('express').Router();
const { registro, login, perfil } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/registro', registro);
router.post('/login',    login);
router.get('/perfil',    authMiddleware, perfil);

module.exports = router;