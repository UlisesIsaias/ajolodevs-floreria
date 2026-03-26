import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart, Filter } from 'lucide-react';
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
    <div style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
      className="rounded-xl overflow-hidden hover:shadow-sm transition-shadow group">

      {/* Imagen */}
      <Link to={`/producto/${producto.id}`}>
        <div style={{ background: '#E8F5EE' }} className="h-48 overflow-hidden">
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
      <div className="p-4">
        <p className="text-xs mb-1" style={{ color: '#888' }}>{producto.categoria_nombre}</p>
        <Link to={`/producto/${producto.id}`}>
          <h3 className="font-medium text-sm mb-2 hover:text-[#52B788] transition-colors"
            style={{ color: '#1A1A1A' }}>
            {producto.nombre}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm" style={{ color: '#52B788' }}>
            ${parseFloat(producto.precio).toFixed(2)}
          </span>
          <span className="text-xs" style={{ color: producto.stock_actual > 0 ? '#888' : '#e53e3e' }}>
            {producto.stock_actual > 0 ? `${producto.stock_actual} disponibles` : 'Sin stock'}
          </span>
        </div>
        <button onClick={handleAgregar} disabled={agregando || producto.stock_actual === 0}
          style={{ background: producto.stock_actual === 0 ? '#e5e5e5' : '#52B788' }}
          className="w-full mt-3 text-white py-2 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:cursor-not-allowed">
          <ShoppingCart size={13} />
          {agregando ? 'Agregando...' : producto.stock_actual === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}

export default function Catalogo() {
  const [productos,   setProductos]   = useState([]);
  const [categorias,  setCategorias]  = useState([]);
  const [cargando,    setCargando]    = useState(true);
  const [busqueda,    setBusqueda]    = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaActiva = searchParams.get('categoria') || '';

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-medium mb-1" style={{ color: '#1A1A1A' }}>Catálogo</h1>
        <p className="text-sm" style={{ color: '#888' }}>
          {productos.length} productos disponibles
        </p>
      </div>

      {/* Búsqueda + Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#aaa' }} />
          <input
            type="text"
            placeholder="Buscar flores, arreglos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ border: '0.5px solid #C8EAD8' }}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#52B788] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSearchParams({})}
            style={{
              background: !categoriaActiva ? '#52B788' : '#fff',
              color:      !categoriaActiva ? '#fff'    : '#555',
              border:     '0.5px solid #C8EAD8'
            }}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-colors">
            Todas
          </button>
          {categorias.map((c) => (
            <button key={c.id}
              onClick={() => setSearchParams({ categoria: c.nombre })}
              style={{
                background: categoriaActiva === c.nombre ? '#52B788' : '#fff',
                color:      categoriaActiva === c.nombre ? '#fff'    : '#555',
                border:     '0.5px solid #C8EAD8'
              }}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-colors">
              {c.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de productos */}
      {cargando ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ background: '#E8F5EE' }}
              className="rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg font-medium mb-2" style={{ color: '#1A1A1A' }}>
            No se encontraron productos
          </p>
          <p className="text-sm" style={{ color: '#888' }}>
            Intenta con otra búsqueda o categoría
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productos.map((p) => (
            <ProductoCard key={p.id} producto={p} />
          ))}
        </div>
      )}

    </div>
  );
}