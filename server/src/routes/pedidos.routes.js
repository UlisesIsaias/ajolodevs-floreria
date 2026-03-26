const router = require('express').Router();
const { crear, obtener, listarCliente, listarAdmin, cambiarEstatus } = require('../controllers/pedidos.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const rolMiddleware  = require('../middlewares/rol.middleware');

// Cliente
router.post('/',         authMiddleware, crear);
router.get('/mis-pedidos', authMiddleware, listarCliente);
router.get('/:id',       authMiddleware, obtener);

// Admin
router.get('/',          authMiddleware, rolMiddleware('admin'), listarAdmin);
router.patch('/:id/estatus', authMiddleware, rolMiddleware('admin'), cambiarEstatus);

module.exports = router;