const pool    = require('../config/db');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
require('dotenv').config();

const registro = async (req, res) => {
  const { nombre, apellido, email, password, telefono } = req.body;

  if (!nombre || !apellido || !email || !password) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const [rows] = await pool.query(
      'CALL sp_usuario_registrar(?, ?, ?, ?, ?)',
      [nombre, apellido, email, hash, telefono || null]
    );

    const usuario = rows[0][0];
    const token   = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({ mensaje: 'Usuario registrado correctamente', token, usuario });
  } catch (error) {
    if (error.sqlMessage) {
      return res.status(400).json({ mensaje: error.sqlMessage });
    }
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });
  }

  try {
    const [rows] = await pool.query('CALL sp_usuario_login(?)', [email]);
    const usuario = rows[0][0];

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    if (!usuario.activo) {
      return res.status(401).json({ mensaje: 'Usuario desactivado, contacta al administrador' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id:       usuario.id,
        nombre:   usuario.nombre,
        apellido: usuario.apellido,
        email:    usuario.email,
        rol:      usuario.rol,
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const perfil = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL sp_usuario_obtener(?)', [req.usuario.id]);
    res.json(rows[0][0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = { registro, login, perfil };