const router = require('express').Router();
const { dashboard, ventas, ventasPorDia, productosTop, porCategoria } = require('../controllers/reportes.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const rolMiddleware  = require('../middlewares/rol.middleware');

// Todas son solo admin
router.get('/dashboard',      authMiddleware, rolMiddleware('admin'), dashboard);
router.get('/ventas',         authMiddleware, rolMiddleware('admin'), ventas);
router.get('/ventas-por-dia', authMiddleware, rolMiddleware('admin'), ventasPorDia);
router.get('/productos-top',  authMiddleware, rolMiddleware('admin'), productosTop);
router.get('/por-categoria',  authMiddleware, rolMiddleware('admin'), porCategoria);

module.exports = router;