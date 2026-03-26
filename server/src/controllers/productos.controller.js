const pool                              = require('../config/db');
const { subirImagen, eliminarImagen }   = require('../helpers/upload');

// Listar productos (público)
const listar = async (req, res) => {
  const { categoria_id } = req.query;
  try {
    const [rows] = await pool.query(
      'CALL sp_producto_listar(?)',
      [categoria_id || null]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
};

// Obtener producto por ID (público)
const obtener = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('CALL sp_producto_obtener(?)', [id]);
    const producto = rows[0][0];
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener producto' });
  }
};

// Buscar productos (público)
const buscar = async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ mensaje: 'Término de búsqueda requerido' });
  }
  try {
    const [rows] = await pool.query('CALL sp_producto_buscar(?)', [q]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar productos' });
  }
};

// Crear producto con imagen (solo admin)
const crear = async (req, res) => {
  const { categoria_id, nombre, descripcion, precio, stock_inicial, stock_minimo, destacado } = req.body || {};

  if (!categoria_id || !nombre || !precio) {
    return res.status(400).json({ mensaje: 'Categoría, nombre y precio son obligatorios' });
  }

  try {
    let imagen_url = null;

    if (req.file) {
      imagen_url = await subirImagen(req.file.buffer, 'productos');
    }

    // Convertir destacado a 1 o 0
    const destacadoInt = (destacado === 'true' || destacado === true) ? 1 : 0;

    const [rows] = await pool.query(
      'CALL sp_producto_crear(?, ?, ?, ?, ?, ?, ?, ?)',
      [
        categoria_id,
        nombre,
        descripcion   || null,
        precio,
        imagen_url,
        stock_inicial || 0,
        stock_minimo  || 5,
        destacadoInt,
      ]
    );

    res.status(201).json({
      mensaje: 'Producto creado correctamente',
      id:      rows[0][0].id,
      nombre:  rows[0][0].nombre,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear producto' });
  }
};

// Actualizar producto (solo admin)
const actualizar = async (req, res) => {
  const { id } = req.params;
  const { categoria_id, nombre, descripcion, precio, destacado } = req.body;

  if (!categoria_id || !nombre || !precio) {
    return res.status(400).json({ mensaje: 'Categoría, nombre y precio son obligatorios' });
  }

  try {
    // Obtener imagen actual
    const [productoActual] = await pool.query('CALL sp_producto_obtener(?)', [id]);
    const producto = productoActual[0][0];

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    let imagen_url = producto.imagen_url;

    // Si viene nueva imagen, subir y eliminar la anterior
    if (req.file) {
      if (imagen_url) await eliminarImagen(imagen_url);
      imagen_url = await subirImagen(req.file.buffer, 'productos');
    }

    const [rows] = await pool.query(
      'CALL sp_producto_actualizar(?, ?, ?, ?, ?, ?, ?)',
      [id, categoria_id, nombre, descripcion || null, precio, imagen_url, destacado || false]
    );

    const afectadas = rows[0][0].filas_afectadas;
    if (afectadas === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar producto' });
  }
};

// Eliminar producto (solo admin)
const eliminar = async (req, res) => {
  const { id } = req.params;
  try {
    const [productoActual] = await pool.query('CALL sp_producto_obtener(?)', [id]);
    const producto = productoActual[0][0];

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    if (producto.imagen_url) await eliminarImagen(producto.imagen_url);

    const [rows] = await pool.query('CALL sp_producto_eliminar(?)', [id]);
    const afectadas = rows[0][0].filas_afectadas;

    if (afectadas === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto' });
  }
};

module.exports = { listar, obtener, buscar, crear, actualizar, eliminar };