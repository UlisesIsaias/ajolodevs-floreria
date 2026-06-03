import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { usuario, logout }    = useAuth();
  const { carrito }            = useCart();
  const navigate               = useNavigate();
  const [menuAbierto, setMenu] = useState(false);
  const totalItems             = carrito.items.reduce((acc, i) => acc + i.cantidad, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ borderBottom: '1px solid #C8EAD8', background: '#fff' }} className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto" style={{ padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img
            src="/logo.png"
            alt="AjoloDevs Florería"
            style={{ width: '36px', height: '36px', objectFit: 'contain' }}
          />
          <span style={{ color: '#1A1A1A', fontWeight: '500', fontSize: '15px' }} className="hidden sm:block">
            AjoloDevs Florería
          </span>
        </Link>

        {/* Links centro — desktop */}
        <div className="hidden md:flex items-center" style={{ gap: '32px' }}>
          {[['/', 'Inicio'], ['/catalogo', 'Catálogo']].map(([to, label]) => (
            <Link key={to} to={to}
              style={{ color: '#555', fontSize: '14px', textDecoration: 'none' }}
              className="hover:text-[#52B788] transition-colors">
              {label}
            </Link>
          ))}
        </div>

        {/* Acciones derecha */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

          {/* Carrito */}
          {usuario && (
            <Link to="/carrito" style={{ position: 'relative', display: 'flex' }}>
              <ShoppingCart size={20} style={{ color: '#555' }} className="hover:text-[#52B788] transition-colors" />
              {totalItems > 0 && (
                <span style={{
                  background: '#52B788',
                  color: '#fff',
                  fontSize: '10px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px'
                }}>
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Usuario autenticado */}
          {usuario ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {usuario.rol === 'admin' && (
                <Link to="/admin"
                  style={{ background: '#E8F5EE', color: '#2D6A4F', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 14px', borderRadius: '8px', fontWeight: '500', textDecoration: 'none' }}
                  className="hover:opacity-80 transition-opacity">
                  <LayoutDashboard size={13} />
                  Admin
                </Link>
              )}
              <Link to="/mis-pedidos"
                style={{ color: '#555', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', textDecoration: 'none' }}
                className="hidden sm:flex hover:text-[#52B788] transition-colors">
                <User size={16} />
                {usuario.nombre}
              </Link>
              <button onClick={handleLogout}
                style={{ color: '#555', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                className="hover:text-red-400 transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/login"
                style={{ color: '#555', fontSize: '14px', textDecoration: 'none' }}
                className="hover:text-[#52B788] transition-colors">
                Entrar
              </Link>
              <Link to="/registro"
                style={{ background: '#52B788', color: '#fff', fontSize: '14px', padding: '8px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '500' }}
                className="hover:opacity-90 transition-opacity">
                Registro
              </Link>
            </div>
          )}

          {/* Hamburger mobile */}
          <button className="md:hidden" onClick={() => setMenu(!menuAbierto)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
            {menuAbierto ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      {menuAbierto && (
        <div style={{ borderTop: '1px solid #C8EAD8', background: '#fff', padding: '16px 32px 20px' }} className="md:hidden">
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <Link to="/"         onClick={() => setMenu(false)} style={{ color: '#555', fontSize: '14px', textDecoration: 'none' }}>Inicio</Link>
            <Link to="/catalogo" onClick={() => setMenu(false)} style={{ color: '#555', fontSize: '14px', textDecoration: 'none' }}>Catálogo</Link>
            {usuario && (
              <Link to="/mis-pedidos" onClick={() => setMenu(false)} style={{ color: '#555', fontSize: '14px', textDecoration: 'none' }}>Mis pedidos</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}