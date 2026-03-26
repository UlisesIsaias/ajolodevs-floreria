const router = require('express').Router();
const { listar, crear, actualizar, eliminar } = require('../controllers/categorias.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const rolMiddleware  = require('../middlewares/rol.middleware');

// Pública — cualquiera puede ver las categorías
router.get('/', listar);

// Protegidas — solo admin
router.post('/',      authMiddleware, rolMiddleware('admin'), crear);
router.put('/:id',    authMiddleware, rolMiddleware('admin'), actualizar);
router.delete('/:id', authMiddleware, rolMiddleware('admin'), eliminar);

module.exports = router;