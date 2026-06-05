const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const listar = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, nombre, apellido, email, telefono, rol, activo, creado_en
       FROM usuarios ORDER BY creado_en DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const obtener = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, nombre, apellido, email, telefono, rol, activo, creado_en
       FROM usuarios WHERE id = ?`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const actualizar = async (req, res) => {
  const { nombre, apellido, email, telefono, rol, activo } = req.body;
  try {
    await pool.query(
      `UPDATE usuarios SET nombre=?, apellido=?, email=?, telefono=?, rol=?, activo=?
       WHERE id = ?`,
      [nombre, apellido, email, telefono || null, rol, activo, req.params.id]
    );
    res.json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (error) {
    if (error.sqlMessage) return res.status(400).json({ mensaje: error.sqlMessage });
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const eliminar = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    await pool.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const toggleActivo = async (req, res) => {
  try {
    await pool.query(
      'UPDATE usuarios SET activo = NOT activo WHERE id = ?',
      [req.params.id]
    );
    res.json({ mensaje: 'Estado del usuario actualizado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = { listar, obtener, actualizar, eliminar, toggleActivo };