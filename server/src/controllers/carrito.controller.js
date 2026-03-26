const pool = require('../config/db');

// Ver carrito del usuario autenticado
const ver = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_carrito_ver(?)', [req.usuario.id]);
    const items = rows[0];

    // Calcular total del carrito
    const total = items.reduce((acc, item) => acc + parseFloat(item.subtotal), 0);

    res.json({ items, total: total.toFixed(2) });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener carrito' });
  }
};

// Agregar producto al carrito
const agregar = async (req, res) => {
  const { producto_id, cantidad } = req.body;

  if (!producto_id || !cantidad || cantidad <= 0) {
    return res.status(400).json({ mensaje: 'Producto y cantidad válida son obligatorios' });
  }

  try {
    const [rows] = await pool.query(
      'CALL sp_carrito_agregar(?, ?, ?)',
      [req.usuario.id, producto_id, cantidad]
    );
    res.json({ mensaje: rows[0][0].mensaje });
  } catch (error) {
    if (error.sqlMessage) {
      return res.status(400).json({ mensaje: error.sqlMessage });
    }
    res.status(500).json({ mensaje: 'Error al agregar al carrito' });
  }
};

// Eliminar un item del carrito
const eliminarItem = async (req, res) => {
  const { producto_id } = req.params;
  try {
    await pool.query(
      'CALL sp_carrito_eliminar_item(?, ?)',
      [req.usuario.id, producto_id]
    );
    res.json({ mensaje: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar item del carrito' });
  }
};

// Vaciar carrito completo
const vaciar = async (req, res) => {
  try {
    await pool.query('CALL sp_carrito_vaciar(?)', [req.usuario.id]);
    res.json({ mensaje: 'Carrito vaciado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al vaciar carrito' });
  }
};

module.exports = { ver, agregar, eliminarItem, vaciar };