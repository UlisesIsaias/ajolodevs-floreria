const router = require('express').Router();
const { stockProducto, entrada, ajuste, stockBajo, historial } = require('../controllers/inventario.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const rolMiddleware  = require('../middlewares/rol.middleware');

// Todas son de admin
router.get('/stock-bajo',        authMiddleware, rolMiddleware('admin'), stockBajo);
router.get('/stock/:id',         authMiddleware, rolMiddleware('admin'), stockProducto);
router.get('/historial/:id',     authMiddleware, rolMiddleware('admin'), historial);
router.post('/entrada',          authMiddleware, rolMiddleware('admin'), entrada);
router.post('/ajuste',           authMiddleware, rolMiddleware('admin'), ajuste);

module.exports = router;