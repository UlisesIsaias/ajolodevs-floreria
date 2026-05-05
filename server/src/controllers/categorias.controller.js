const pool = require('../config/db');

// Listar categorías activas
const listar = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_categoria_listar()');
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener categorías' });
  }
};

// Crear categoría (solo admin)
const crear = async (req, res) => {
  const { nombre, descripcion, imagen_url } = req.body;

  if (!nombre) {
    return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
  }

  try {
    const [rows] = await pool.query(
      'CALL sp_categoria_crear(?, ?, ?)',
      [nombre, descripcion || null, imagen_url || null]
    );
    res.status(201).json({ 
      mensaje: 'Categoría creada correctamente', 
      id: rows[0][0].id 
    });
  } catch (error) {
    if (error.sqlMessage) {
      return res.status(400).json({ mensaje: error.sqlMessage });
    }
    res.status(500).json({ mensaje: 'Error al crear categoría' });
  }
};

const actualizar = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, imagen_url } = req.body;

  if (!nombre) {
    return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
  }

  try {
    const [rows] = await pool.query(
      'CALL sp_categoria_actualizar(?, ?, ?, ?)',
      [id, nombre, descripcion || null, imagen_url || null]
    );
    const afectadas = rows[0][0].filas_afectadas;
    if (afectadas === 0) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    res.json({ mensaje: 'Categoría actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar categoría' });
  }
};

const eliminar = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('CALL sp_categoria_eliminar(?)', [id]);
    const afectadas = rows[0][0].filas_afectadas;
    if (afectadas === 0) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar categoría' });
  }
};

module.exports = { listar, crear, actualizar, eliminar };