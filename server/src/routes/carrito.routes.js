const router = require('express').Router();
const { ver, agregar, eliminarItem, vaciar } = require('../controllers/carrito.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.get('/',                    authMiddleware, ver);
router.post('/',                   authMiddleware, agregar);
router.delete('/vaciar',           authMiddleware, vaciar);
router.delete('/item/:producto_id', authMiddleware, eliminarItem);

module.exports = router;