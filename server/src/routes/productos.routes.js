const router  = require('express').Router();
const { listar, obtener, buscar, crear, actualizar, eliminar } = require('../controllers/productos.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const rolMiddleware  = require('../middlewares/rol.middleware');
const { upload }     = require('../helpers/upload');

// Públicas
router.get('/',         listar);
router.get('/buscar',   buscar);
router.get('/:id',      obtener);

// Solo admin
router.post('/',      authMiddleware, rolMiddleware('admin'), upload.single('imagen'), crear);
router.put('/:id',    authMiddleware, rolMiddleware('admin'), upload.single('imagen'), actualizar);
router.delete('/:id', authMiddleware, rolMiddleware('admin'), eliminar);

module.exports = router;