const express           = require('express');
const cors              = require('cors');
require('dotenv').config();

const authRoutes        = require('./routes/auth.routes');
const categoriasRoutes  = require('./routes/categorias.routes');
const productosRoutes   = require('./routes/productos.routes');
const inventarioRoutes  = require('./routes/inventario.routes');
const carritoRoutes     = require('./routes/carrito.routes');
const pedidosRoutes     = require('./routes/pedidos.routes');
const pagosRoutes       = require('./routes/pagos.routes');
const reportesRoutes    = require('./routes/reportes.routes');

const app = express();

//app.use(cors({ origin: 'ajolodevs-floreria.vercel.app', credentials: true }));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://TU-APP.vercel.app'  // ← URL exacta de Vercel
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth',        authRoutes);
app.use('/api/categorias',  categoriasRoutes);
app.use('/api/productos',   productosRoutes);
app.use('/api/inventario',  inventarioRoutes);
app.use('/api/carrito',     carritoRoutes);
app.use('/api/pedidos',     pedidosRoutes);
app.use('/api/pagos',       pagosRoutes);
app.use('/api/reportes',    reportesRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: '🌸 AjoloDevs Florería API funcionando' });
});

module.exports = app;