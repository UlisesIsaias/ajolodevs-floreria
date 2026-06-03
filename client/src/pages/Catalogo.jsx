import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart, ChevronDown, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function ProductoCard({ producto }) {
  const { usuario }          = useAuth();
  const { agregarAlCarrito } = useCart();
  const [agregando, setAgregando] = useState(false);

  const handleAgregar = async () => {
    if (!usuario) {
      toast.error('Inicia sesión para agregar al carrito');
      return;
    }
    setAgregando(true);
    const result = await agregarAlCarrito(producto.id, 1);
    if (result.ok) toast.success('Agregado al carrito');
    else toast.error(result.mensaje || 'Error al agregar');
    setAgregando(false);
  };

  return (
    <div style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', overflow: 'hidden' }}
      className="hover:shadow-sm transition-shadow group">

      {/* Imagen */}
      <Link to={`/producto/${producto.id}`}>
        <div style={{ background: '#E8F5EE', height: '192px', overflow: 'hidden' }}>
          {producto.imagen_url ? (
            <img src={producto.imagen_url} alt={producto.nombre}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="4" fill="#52B788"/>
                <ellipse cx="16" cy="9"  rx="3" ry="5" fill="#52B788" opacity="0.6"/>
                <ellipse cx="16" cy="23" rx="3" ry="5" fill="#52B788" opacity="0.6"/>
                <ellipse cx="9"  cy="16" rx="5" ry="3" fill="#52B788" opacity="0.6"/>
                <ellipse cx="23" cy="16" rx="5" ry="3" fill="#52B788" opacity="0.6"/>
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '16px' }}>
        <p className="text-xs" style={{ color: '#888', marginBottom: '4px' }}>{producto.categoria_nombre}</p>
        <Link to={`/producto/${producto.id}`}>
          <h3 className="font-medium text-sm hover:text-[#52B788] transition-colors"
            style={{ color: '#1A1A1A', marginBottom: '10px' }}>
            {producto.nombre}
          </h3>
        </Link>
        <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
          <span className="font-medium text-sm" style={{ color: '#52B788' }}>
            ${parseFloat(producto.precio).toFixed(2)}
          </span>
          <span className="text-xs" style={{ color: producto.stock_actual > 0 ? '#888' : '#e53e3e' }}>
            {producto.stock_actual > 0 ? `${producto.stock_actual} disponibles` : 'Sin stock'}
          </span>
        </div>
        <button onClick={handleAgregar} disabled={agregando || producto.stock_actual === 0}
          style={{
            background: producto.stock_actual === 0 ? '#e5e5e5' : '#52B788',
            width: '100%',
            padding: '9px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '500',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: producto.stock_actual === 0 ? 'not-allowed' : 'pointer'
          }}
          className="hover:opacity-90 transition-opacity">
          <ShoppingCart size={13} />
          {agregando ? 'Agregando...' : producto.stock_actual === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}

export default function Catalogo() {
  const [productos,    setProductos]   = useState([]);
  const [categorias,   setCategorias]  = useState([]);
  const [cargando,     setCargando]    = useState(true);
  const [busqueda,     setBusqueda]    = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaActiva = searchParams.get('categoria') || '';
  const dropdownRef = useRef(null);

  // Cerrar dropdown al click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const cargarCategorias = async () => {
      const { data } = await api.get('/categorias');
      setCategorias(data);
    };
    cargarCategorias();
  }, []);

  useEffect(() => {
    const cargarProductos = async () => {
      setCargando(true);
      try {
        let url = '/productos';
        if (busqueda.trim()) {
          url = `/productos/buscar?q=${busqueda}`;
        }
        const { data } = await api.get(url);
        let filtrados = data;
        if (categoriaActiva && !busqueda) {
          filtrados = data.filter(p => p.categoria_nombre === categoriaActiva);
        }
        setProductos(filtrados);
      } catch (error) {
        toast.error('Error al cargar productos');
      } finally {
        setCargando(false);
      }
    };
    const delay = setTimeout(cargarProductos, 300);
    return () => clearTimeout(delay);
  }, [busqueda, categoriaActiva]);

  const labelCategoria = categoriaActiva || 'Todas las categorías';

  return (
    <div className="max-w-6xl mx-auto" style={{ padding: '20px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>Catálogo</h1>
        <p className="text-sm" style={{ color: '#888', marginTop: '6px' }}>
          {productos.length} productos disponibles
        </p>
      </div>

      {/* Búsqueda + Filtro desplegable */}
      <div className="flex flex-col sm:flex-row" style={{ gap: '12px', marginBottom: '36px' }}>

        {/* Buscador */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#aaa' }} />
          <input
            type="text"
            placeholder="Buscar flores, arreglos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              border: '1px solid #C8EAD8',
              padding: '12px 16px 12px 40px',
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              width: '100%',
              background: '#fff',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Dropdown categorías */}
        <div className="relative" ref={dropdownRef} style={{ minWidth: '200px' }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              border: '1px solid #C8EAD8',
              background: categoriaActiva ? '#52B788' : '#fff',
              color: categoriaActiva ? '#fff' : '#555',
              padding: '12px 16px',
              borderRadius: '10px',
              fontSize: '14px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              cursor: 'pointer'
            }}>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <Filter size={14} />
              <span className="text-sm font-medium">{labelCategoria}</span>
            </div>
            <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>

          {/* Menu desplegable */}
          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: '#fff',
              border: '1px solid #C8EAD8',
              borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              zIndex: 50,
              overflow: 'hidden'
            }}>
              <button
                onClick={() => { setSearchParams({}); setDropdownOpen(false); }}
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  textAlign: 'left',
                  fontSize: '14px',
                  background: !categoriaActiva ? '#F0FAF4' : '#fff',
                  color: !categoriaActiva ? '#52B788' : '#555',
                  fontWeight: !categoriaActiva ? '500' : '400',
                  borderBottom: '1px solid #F0F0F0',
                  cursor: 'pointer'
                }}>
                Todas las categorías
              </button>
              {categorias.map((c) => (
                <button key={c.id}
                  onClick={() => { setSearchParams({ categoria: c.nombre }); setDropdownOpen(false); }}
                  style={{
                    width: '100%',
                    padding: '11px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    background: categoriaActiva === c.nombre ? '#F0FAF4' : '#fff',
                    color: categoriaActiva === c.nombre ? '#52B788' : '#555',
                    fontWeight: categoriaActiva === c.nombre ? '500' : '400',
                    borderBottom: '1px solid #F0F0F0',
                    cursor: 'pointer'
                  }}>
                  {c.nombre}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Grid de productos */}
      {cargando ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ gap: '16px' }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ background: '#E8F5EE', borderRadius: '12px', height: '256px' }}
              className="animate-pulse" />
          ))}
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center" style={{ padding: '80px 0' }}>
          <p className="text-lg font-medium" style={{ color: '#1A1A1A', marginBottom: '8px' }}>
            No se encontraron productos
          </p>
          <p className="text-sm" style={{ color: '#888' }}>
            Intenta con otra búsqueda o categoría
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ gap: '16px' }}>
          {productos.map((p) => (
            <ProductoCard key={p.id} producto={p} />
          ))}
        </div>
      )}

    </div>
  );
}