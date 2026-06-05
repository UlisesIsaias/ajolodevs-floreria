const router          = require('express').Router();
const { listar, obtener, actualizar, eliminar, toggleActivo } = require('../controllers/usuarios.controller');
const authMiddleware  = require('../middlewares/auth.middleware');
const rolMiddleware   = require('../middlewares/rol.middleware');

router.get('/',              authMiddleware, rolMiddleware('admin'), listar);
router.get('/:id',           authMiddleware, rolMiddleware('admin'), obtener);
router.put('/:id',           authMiddleware, rolMiddleware('admin'), actualizar);
router.delete('/:id',        authMiddleware, rolMiddleware('admin'), eliminar);
router.patch('/:id/toggle',  authMiddleware, rolMiddleware('admin'), toggleActivo);

module.exports = router;