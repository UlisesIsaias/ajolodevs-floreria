import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingBag, Warehouse, BarChart2, LogOut, Users} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin',            icono: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/admin/productos',  icono: <Package size={18} />,         label: 'Productos' },
  { to: '/admin/categorias', icono: <Tag size={18} />,             label: 'Categorías' },
  { to: '/admin/pedidos',    icono: <ShoppingBag size={18} />,     label: 'Pedidos' },
  { to: '/admin/inventario', icono: <Warehouse size={18} />,       label: 'Inventario' },
  { to: '/admin/reportes',   icono: <BarChart2 size={18} />,       label: 'Reportes' },
  { to: '/admin/usuarios',   icono: <Users size={18} />,           label: 'Usuarios' },
];

export default function LayoutAdmin() {
  const { usuario, logout } = useAuth();
  const navigate            = useNavigate();
  const location            = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (to) =>
    to === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(to);

  return (
    <div className="flex min-h-screen" style={{ background: '#F7F7F5' }}>

      {/* Sidebar */}
      <aside style={{ borderRight: '0.5px solid #C8EAD8', background: '#fff', width: '230px', minWidth: '230px' }}
        className="flex flex-col sticky top-0 h-screen">

      {/* Logo */}
      <div style={{ borderBottom: '1px solid #C8EAD8' }}
        className="flex items-center gap-3 px-5 py-5">
        <img src="/logo.png" alt="AjoloDevs"
        style={{ width: '36px', height: '36px', objectFit: 'contain', flexShrink: 0 }} />
      <div>
      <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>AjoloDevs</p>
      <p className="text-xs" style={{ color: '#888' }}>Panel Admin</p>
        </div>
      </div>

       {/* Links */}
        <nav className="flex flex-col flex-1 p-2 gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to}
              style={{
                background:     isActive(l.to) ? '#E8F5EE' : 'transparent',
                color:          isActive(l.to) ? '#2D6A4F' : '#666',
                fontWeight:     isActive(l.to) ? '500'      : '400',
                display:        'flex',
                alignItems:     'center',
                gap:            '14px',
                padding:        '18px 20px',
                borderRadius:   '12px',
                fontSize:       '15px',
                width:          '100%',
                textDecoration: 'none',
              }}
              className="hover:bg-[#E8F5EE] hover:text-[#2D6A4F] transition-colors">
              {l.icono}
              {l.label}
              {isActive(l.to) && (
                <div style={{ background: '#52B788', width: '8px', height: '8px', borderRadius: '50%', marginLeft: 'auto', flexShrink: 0 }} />
              )}
            </Link>
          ))}
        </nav>
        {/* Usuario */}
        <div style={{ borderTop: '0.5px solid #C8EAD8' }} className="p-3">
          <div style={{ background: '#F7F7F5' }} className="rounded-xl p-3 mb-2">
            <div className="flex items-center gap-2">
              <div style={{ background: '#52B788' }}
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-medium">
                  {usuario?.nombre?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium truncate" style={{ color: '#1A1A1A' }}>
                  {usuario?.nombre} {usuario?.apellido}
                </p>
                <p className="text-xs truncate" style={{ color: '#888' }}>{usuario?.email}</p>
              </div>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm w-full hover:bg-red-50 hover:text-red-400 transition-colors"
            style={{ color: '#888' }}>
            <LogOut size={15} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}