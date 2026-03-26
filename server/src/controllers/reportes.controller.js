const pool = require('../config/db');

// Resumen del dashboard
const dashboard = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_dashboard_resumen()');
    res.json({
      pedidos_hoy:          rows[0][0],
      pedidos_pendientes:   rows[1][0],
      productos_stock_bajo: rows[2][0],
      total_clientes:       rows[3][0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener resumen del dashboard' });
  }
};

// Reporte de ventas por periodo
const ventas = async (req, res) => {
  const { fecha_inicio, fecha_fin } = req.query;

  if (!fecha_inicio || !fecha_fin) {
    return res.status(400).json({ mensaje: 'fecha_inicio y fecha_fin son obligatorios' });
  }

  try {
    const [rows] = await pool.query(
      'CALL sp_reporte_ventas(?, ?)',
      [fecha_inicio, fecha_fin]
    );
    res.json(rows[0][0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener reporte de ventas' });
  }
};

// Ventas por día (para gráfica)
const ventasPorDia = async (req, res) => {
  const { fecha_inicio, fecha_fin } = req.query;

  if (!fecha_inicio || !fecha_fin) {
    return res.status(400).json({ mensaje: 'fecha_inicio y fecha_fin son obligatorios' });
  }

  try {
    const [rows] = await pool.query(
      'CALL sp_reporte_ventas_por_dia(?, ?)',
      [fecha_inicio, fecha_fin]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ventas por día' });
  }
};

// Productos más vendidos
const productosTop = async (req, res) => {
  const limite = parseInt(req.query.limite) || 10;
  try {
    const [rows] = await pool.query('CALL sp_reporte_productos_top(?)', [limite]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos top' });
  }
};

// Ventas por categoría
const porCategoria = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_reporte_por_categoria()');
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener reporte por categoría' });
  }
};

module.exports = { dashboard, ventas, ventasPorDia, productosTop, porCategoria };