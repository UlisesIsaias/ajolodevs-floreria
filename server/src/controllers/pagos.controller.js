const pool                            = require('../config/db');
const { subirImagen }                 = require('../helpers/upload');

// Ver pago de un pedido
const obtener = async (req, res) => {
  const { pedido_id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT p.*, u.nombre AS verificado_por_nombre FROM pagos p LEFT JOIN usuarios u ON u.id = p.verificado_por WHERE p.pedido_id = ?',
      [pedido_id]
    );
    const pago = rows[0];
    if (!pago) {
      return res.status(404).json({ mensaje: 'Pago no encontrado' });
    }
    res.json(pago);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pago' });
  }
};

// Cliente sube comprobante de transferencia
const subirComprobante = async (req, res) => {
  const { pedido_id } = req.params;
  const { referencia } = req.body;

  if (!referencia) {
    return res.status(400).json({ mensaje: 'El número de referencia es obligatorio' });
  }

  try {
    // Verificar que el pedido pertenece al cliente
    const [pedidoRows] = await pool.query(
      'SELECT usuario_id, metodo_pago FROM pedidos WHERE id = ?',
      [pedido_id]
    );
    const pedido = pedidoRows[0];

    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    if (pedido.usuario_id !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No tienes permiso para este pedido' });
    }

    if (pedido.metodo_pago !== 'transferencia') {
      return res.status(400).json({ mensaje: 'Este pedido es de pago en efectivo, no requiere comprobante' });
    }

    // Subir comprobante a Cloudinary
    let comprobante_url = null;
    if (req.file) {
      comprobante_url = await subirImagen(req.file.buffer, 'comprobantes');
    }

    await pool.query(
      'CALL sp_pago_registrar_comprobante(?, ?, ?)',
      [pedido_id, referencia, comprobante_url]
    );

    res.json({ mensaje: 'Comprobante enviado correctamente, en espera de verificación' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al subir comprobante' });
  }
};

// Admin verifica o rechaza el pago
const verificar = async (req, res) => {
  const { pedido_id } = req.params;
  const { estatus } = req.body;

  if (!estatus || !['confirmado', 'rechazado'].includes(estatus)) {
    return res.status(400).json({ mensaje: 'Estatus inválido, usa: confirmado o rechazado' });
  }

  try {
    await pool.query(
      'CALL sp_pago_verificar(?, ?, ?)',
      [pedido_id, estatus, req.usuario.id]
    );

    const mensaje = estatus === 'confirmado'
      ? 'Pago confirmado, pedido actualizado a en proceso'
      : 'Pago rechazado, cliente debe volver a enviar comprobante';

    res.json({ mensaje });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al verificar pago' });
  }
};

// Listar pagos pendientes de verificar (admin)
const listarPendientes = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT pa.*, p.total, p.metodo_pago,
             u.nombre AS cliente_nombre, u.email AS cliente_email
      FROM pagos pa
      JOIN pedidos p ON p.id = pa.pedido_id
      JOIN usuarios u ON u.id = p.usuario_id
      WHERE pa.estatus = 'verificando'
      ORDER BY pa.creado_en ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pagos pendientes' });
  }
};

module.exports = { obtener, subirComprobante, verificar, listarPendientes };