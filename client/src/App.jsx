import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import LayoutPublico  from './components/layout/LayoutPublico';
import LayoutAdmin    from './components/layout/LayoutAdmin';

// Páginas públicas
import Home           from './pages/Home';
import Catalogo       from './pages/Catalogo';
import DetalleProducto from './pages/DetalleProducto';
import Login          from './pages/auth/Login';
import Registro       from './pages/auth/Registro';

// Páginas cliente
import Carrito        from './pages/cliente/Carrito';
import MisPedidos     from './pages/cliente/MisPedidos';
import DetallePedido  from './pages/cliente/DetallePedido';

// Páginas admin
import Dashboard      from './pages/admin/Dashboard';
import AdminProductos from './pages/admin/Productos';
import AdminCategorias from './pages/admin/Categorias';
import AdminPedidos   from './pages/admin/Pedidos';
import AdminInventario from './pages/admin/Inventario';
import AdminReportes  from './pages/admin/Reportes';
import AdminUsuarios from './pages/admin/Usuarios';

// Rutas protegidas
const RutaPrivada = ({ children }) => {
  const { usuario, cargando } = useAuth();
  if (cargando) return <div>Cargando...</div>;
  return usuario ? children : <Navigate to="/login" />;
};

const RutaAdmin = ({ children }) => {
  const { usuario, cargando } = useAuth();
  if (cargando) return <div>Cargando...</div>;
  if (!usuario) return <Navigate to="/login" />;
  if (usuario.rol !== 'admin') return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route element={<LayoutPublico />}>
        <Route path="/"            element={<Home />} />
        <Route path="/catalogo"    element={<Catalogo />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/registro"    element={<Registro />} />
      </Route>

      {/* Rutas cliente */}
      <Route element={<LayoutPublico />}>
        <Route path="/carrito" element={<RutaPrivada><Carrito /></RutaPrivada>} />
        <Route path="/mis-pedidos" element={<RutaPrivada><MisPedidos /></RutaPrivada>} />
        <Route path="/pedido/:id" element={<RutaPrivada><DetallePedido /></RutaPrivada>} />
      </Route>

      {/* Rutas admin */}
      <Route path="/admin" element={<RutaAdmin><LayoutAdmin /></RutaAdmin>}>
        <Route index                element={<Dashboard />} />
        <Route path="productos"     element={<AdminProductos />} />
        <Route path="categorias"    element={<AdminCategorias />} />
        <Route path="pedidos"       element={<AdminPedidos />} />
        <Route path="inventario"    element={<AdminInventario />} />
        <Route path="reportes"      element={<AdminReportes />} />
        <Route path="usuarios"      element={<AdminUsuarios />} />
      </Route>
    </Routes>
  );
}