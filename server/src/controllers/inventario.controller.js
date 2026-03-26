const pool = require('../config/db');

// Ver stock actual de un producto
const stockProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('CALL sp_producto_obtener(?)', [id]);
    const producto = rows[0][0];
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({
      producto_id:   producto.id,
      nombre:        producto.nombre,
      stock_actual:  producto.stock_actual,
      stock_minimo:  producto.stock_minimo,
      alerta:        producto.stock_actual <= producto.stock_minimo,
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener stock' });
  }
};

// Entrada de stock (reabastecimiento)
const entrada = async (req, res) => {
  const { producto_id, cantidad, motivo } = req.body;

  if (!producto_id || !cantidad || cantidad <= 0) {
    return res.status(400).json({ mensaje: 'Producto y cantidad válida son obligatorios' });
  }

  try {
    const [rows] = await pool.query(
      'CALL sp_inventario_entrada(?, ?, ?, ?)',
      [producto_id, cantidad, motivo || 'Reabastecimiento', req.usuario.id]
    );
    res.json({
      mensaje:      'Stock actualizado correctamente',
      stock_actual: rows[0][0].stock_actual,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar stock' });
  }
};

// Ajuste manual de stock
const ajuste = async (req, res) => {
  const { producto_id, stock_nuevo, motivo } = req.body;

  if (!producto_id || stock_nuevo === undefined || stock_nuevo < 0) {
    return res.status(400).json({ mensaje: 'Producto y stock nuevo son obligatorios' });
  }

  try {
    const [rows] = await pool.query(
      'CALL sp_inventario_ajuste(?, ?, ?, ?)',
      [producto_id, stock_nuevo, motivo || 'Ajuste manual', req.usuario.id]
    );
    res.json({
      mensaje:      'Stock ajustado correctamente',
      stock_actual: rows[0][0].stock_actual,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al ajustar stock' });
  }
};

// Productos con stock bajo
const stockBajo = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_inventario_stock_bajo()');
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos con stock bajo' });
  }
};

// Historial de movimientos de un producto
const historial = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('CALL sp_inventario_historial(?)', [id]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener historial' });
  }
};

module.exports = { stockProducto, entrada, ajuste, stockBajo, historial };