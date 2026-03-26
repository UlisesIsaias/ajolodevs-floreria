const express           = require('express');
const cors              = require('cors');
require('dotenv').config();

const authRoutes        = require('./routes/auth.routes');
const categoriasRoutes  = require('./routes/categorias.routes');
const productosRoutes   = require('./routes/productos.routes');
const inventarioRoutes  = require('./routes/inventario.routes');
const carritoRoutes     = require('./routes/carrito.routes');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth',        authRoutes);
app.use('/api/categorias',  categoriasRoutes);
app.use('/api/productos',   productosRoutes);
app.use('/api/inventario',  inventarioRoutes);
app.use('/api/carrito',     carritoRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: '🌸 AjoloDevs Florería API funcionando' });
});

module.exports = app;