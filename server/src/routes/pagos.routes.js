const router = require('express').Router();
const { obtener, subirComprobante, verificar, listarPendientes } = require('../controllers/pagos.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const rolMiddleware  = require('../middlewares/rol.middleware');
const { upload }     = require('../helpers/upload');

// Cliente
router.get('/:pedido_id',                authMiddleware, obtener);
router.post('/:pedido_id/comprobante',   authMiddleware, upload.single('comprobante'), subirComprobante);

// Admin
router.get('/',                          authMiddleware, rolMiddleware('admin'), listarPendientes);
router.patch('/:pedido_id/verificar',    authMiddleware, rolMiddleware('admin'), verificar);

module.exports = router;