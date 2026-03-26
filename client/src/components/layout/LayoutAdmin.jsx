import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingBag, Warehouse, BarChart2, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin',            icono: <LayoutDashboard size={16} />, label: 'Dashboard' },
  { to: '/admin/productos',  icono: <Package size={16} />,         label: 'Productos' },
  { to: '/admin/categorias', icono: <Tag size={16} />,             label: 'Categorías' },
  { to: '/admin/pedidos',    icono: <ShoppingBag size={16} />,     label: 'Pedidos' },
  { to: '/admin/inventario', icono: <Warehouse size={16} />,       label: 'Inventario' },
  { to: '/admin/reportes',   icono: <BarChart2 size={16} />,       label: 'Reportes' },
];

export default function LayoutAdmin() {
  const { usuario, logout } = useAuth();
  const navigate            = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#F7F7F5' }}>

      {/* Sidebar */}
      <aside style={{ borderRight: '0.5px solid #C8EAD8', background: '#fff', width: '220px' }}
        className="flex flex-col py-6 px-4 sticky top-0 h-screen">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <div style={{ background: '#52B788' }} className="w-8 h-8 rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="4" fill="white"/>
              <ellipse cx="16" cy="9"  rx="3" ry="5" fill="white" opacity="0.9"/>
              <ellipse cx="16" cy="23" rx="3" ry="5" fill="white" opacity="0.9"/>
              <ellipse cx="9"  cy="16" rx="5" ry="3" fill="white" opacity="0.9"/>
              <ellipse cx="23" cy="16" rx="5" ry="3" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <span className="text-sm font-medium" style={{ color: '#1A1A1A' }}>Admin</span>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-1 flex-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to}
              style={{ color: '#555' }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-[#E8F5EE] hover:text-[#2D6A4F] transition-colors">
              {l.icono}
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Usuario */}
        <div style={{ borderTop: '0.5px solid #C8EAD8' }} className="pt-4 mt-4">
          <p className="text-xs px-3 mb-1" style={{ color: '#888' }}>{usuario?.nombre}</p>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full hover:bg-red-50 hover:text-red-400 transition-colors"
            style={{ color: '#888' }}>
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}