const pool = require('../config/db');

// Crear pedido desde el carrito
const crear = async (req, res) => {
  const { direccion_id, metodo_pago, notas } = req.body;

  if (!metodo_pago) {
    return res.status(400).json({ mensaje: 'El método de pago es obligatorio' });
  }

  if (!['transferencia', 'efectivo_contra_entrega'].includes(metodo_pago)) {
    return res.status(400).json({ mensaje: 'Método de pago inválido' });
  }

  try {
    const [rows] = await pool.query(
      'CALL sp_pedido_crear(?, ?, ?, ?)',
      [req.usuario.id, direccion_id || null, metodo_pago, notas || null]
    );
    const resultado = rows[0][0];
    res.status(201).json({
      mensaje:   resultado.mensaje,
      pedido_id: resultado.pedido_id,
      total:     resultado.total,
    });
  } catch (error) {
    if (error.sqlMessage) {
      return res.status(400).json({ mensaje: error.sqlMessage });
    }
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear pedido' });
  }
};

// Ver detalle de un pedido
const obtener = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('CALL sp_pedido_obtener(?)', [id]);

    // Verificar que el pedido pertenece al usuario o es admin
    const pedido = rows[0][0];
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    if (req.usuario.rol !== 'admin' && pedido.usuario_id !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver este pedido' });
    }

    res.json({
      pedido:    rows[0][0],
      items:     rows[1],
      historial: rows[2],
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pedido' });
  }
};

// Listar pedidos del cliente autenticado
const listarCliente = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'CALL sp_pedido_listar_cliente(?)',
      [req.usuario.id]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pedidos' });
  }
};

// Listar todos los pedidos (admin)
const listarAdmin = async (req, res) => {
  const { estatus } = req.query;
  try {
    const [rows] = await pool.query(
      'CALL sp_pedido_listar_admin(?)',
      [estatus || null]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pedidos' });
  }
};

// Cambiar estatus de pedido (admin)
const cambiarEstatus = async (req, res) => {
  const { id } = req.params;
  const { estatus, comentario } = req.body;

  const estatusValidos = ['pendiente', 'en_proceso', 'enviado', 'entregado', 'cancelado'];
  if (!estatus || !estatusValidos.includes(estatus)) {
    return res.status(400).json({ mensaje: 'Estatus inválido' });
  }

  try {
    await pool.query(
      'CALL sp_pedido_cambiar_estatus(?, ?, ?, ?)',
      [id, estatus, comentario || null, req.usuario.id]
    );
    res.json({ mensaje: `Pedido actualizado a: ${estatus}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al cambiar estatus del pedido' });
  }
};

module.exports = { crear, obtener, listarCliente, listarAdmin, cambiarEstatus };