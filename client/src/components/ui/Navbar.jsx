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
    <nav style={{ borderBottom: '0.5px solid #C8EAD8' }} className="bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="AjoloDevs Florería"
            className="w-9 h-9 object-contain"
          />
          <span style={{ color: '#1A1A1A' }} className="font-medium text-sm hidden sm:block">
            AjoloDevs Florería
          </span>
        </Link>

        {/* Links centro — desktop */}
        <div className="hidden md:flex items-center gap-6">
          {[['/', 'Inicio'], ['/catalogo', 'Catálogo']].map(([to, label]) => (
            <Link key={to} to={to}
              style={{ color: '#555' }}
              className="text-sm hover:text-[#52B788] transition-colors">
              {label}
            </Link>
          ))}
        </div>

        {/* Acciones derecha */}
        <div className="flex items-center gap-3">
          {/* Carrito */}
          {usuario && (
            <Link to="/carrito" className="relative">
              <ShoppingCart size={20} style={{ color: '#555' }} className="hover:text-[#52B788] transition-colors" />
              {totalItems > 0 && (
                <span style={{ background: '#52B788' }}
                  className="absolute -top-2 -right-2 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Usuario autenticado */}
          {usuario ? (
            <div className="flex items-center gap-2">
              {usuario.rol === 'admin' && (
                <Link to="/admin"
                  style={{ background: '#E8F5EE', color: '#2D6A4F' }}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium hover:opacity-80 transition-opacity">
                  <LayoutDashboard size={13} />
                  Admin
                </Link>
              )}
              <Link to="/mis-pedidos"
                style={{ color: '#555' }}
                className="hidden sm:flex items-center gap-1 text-sm hover:text-[#52B788] transition-colors">
                <User size={16} />
                {usuario.nombre}
              </Link>
              <button onClick={handleLogout}
                style={{ color: '#555' }}
                className="hover:text-red-400 transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"
                style={{ color: '#555' }}
                className="text-sm hover:text-[#52B788] transition-colors">
                Entrar
              </Link>
              <Link to="/registro"
                style={{ background: '#52B788' }}
                className="text-white text-sm px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                Registro
              </Link>
            </div>
          )}

          {/* Hamburger mobile */}
          <button className="md:hidden" onClick={() => setMenu(!menuAbierto)}>
            {menuAbierto ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      {menuAbierto && (
        <div style={{ borderTop: '0.5px solid #C8EAD8' }} className="md:hidden bg-white px-4 pb-4">
          <div className="flex flex-col gap-3 pt-3">
            <Link to="/"         onClick={() => setMenu(false)} className="text-sm" style={{ color: '#555' }}>Inicio</Link>
            <Link to="/catalogo" onClick={() => setMenu(false)} className="text-sm" style={{ color: '#555' }}>Catálogo</Link>
            {usuario && (
              <Link to="/mis-pedidos" onClick={() => setMenu(false)} className="text-sm" style={{ color: '#555' }}>Mis pedidos</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}