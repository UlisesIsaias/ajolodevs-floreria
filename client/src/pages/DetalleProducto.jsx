import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { agregarAlCarrito } = useCart();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [agregando, setAgregando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await api.get(`/productos/${id}`);
        setProducto(data);
      } catch {
        toast.error('Producto no encontrado');
        navigate('/catalogo');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id, navigate]);

  const handleAgregar = async () => {
    if (!usuario) {
      toast.error('Inicia sesión para agregar al carrito');
      navigate('/login');
      return;
    }

    setAgregando(true);
    const result = await agregarAlCarrito(producto.id, cantidad);

    if (result.ok) toast.success('Agregado al carrito');
    else toast.error(result.mensaje || 'Error al agregar');

    setAgregando(false);
  };

  if (cargando) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div style={{ background: '#E8F5EE' }} className="rounded-2xl h-96 animate-pulse" />
          <div className="flex flex-col gap-4">
            <div style={{ background: '#E8F5EE' }} className="h-8 rounded-lg animate-pulse w-3/4" />
            <div style={{ background: '#E8F5EE' }} className="h-4 rounded-lg animate-pulse w-1/2" />
            <div style={{ background: '#E8F5EE' }} className="h-24 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!producto) return null;

  const stock = Number(producto?.stock_actual || 0);
  const precio = Number(producto?.precio || 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Volver */}
      <button
        onClick={() => navigate('/catalogo')}
        className="flex items-center gap-2 text-sm mb-8 hover:text-[#52B788] transition-colors"
        style={{ color: '#888' }}
      >
        <ArrowLeft size={16} />
        Volver al catálogo
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Imagen */}
        <div
          style={{ background: '#E8F5EE', border: '0.5px solid #C8EAD8' }}
          className="rounded-2xl overflow-hidden h-96"
        >
          {producto.imagen_url ? (
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg width="80" height="80" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="4" fill="#52B788"/>
                <ellipse cx="16" cy="9" rx="3" ry="5" fill="#52B788" opacity="0.6"/>
                <ellipse cx="16" cy="23" rx="3" ry="5" fill="#52B788" opacity="0.6"/>
                <ellipse cx="9" cy="16" rx="5" ry="3" fill="#52B788" opacity="0.6"/>
                <ellipse cx="23" cy="16" rx="5" ry="3" fill="#52B788" opacity="0.6"/>
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">

          {/* Categoría + nombre */}
          <div>
            <span
              style={{ background: '#E8F5EE', color: '#2D6A4F' }}
              className="text-xs font-medium px-3 py-1 rounded-full inline-block mb-3"
            >
              {producto.categoria_nombre}
            </span>

            <h1 className="text-2xl font-medium mb-2" style={{ color: '#1A1A1A' }}>
              {producto.nombre}
            </h1>

            <p className="text-3xl font-medium" style={{ color: '#52B788' }}>
              ${precio.toFixed(2)}
            </p>
          </div>

          {/* Descripción */}
          {producto.descripcion && (
            <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
              {producto.descripcion}
            </p>
          )}

          {/* Stock */}
          <div
            style={{ border: '0.5px solid #C8EAD8', background: '#F7F7F5' }}
            className="rounded-xl p-4 flex items-center gap-3"
          >
            <Package size={18} style={{ color: '#52B788' }} />
            <div>
              <p className="text-xs font-medium" style={{ color: '#1A1A1A' }}>
                {stock > 0 ? `${stock} unidades disponibles` : 'Sin stock'}
              </p>
              <p className="text-xs" style={{ color: '#888' }}>
                {stock > 5
                  ? 'Disponibilidad alta'
                  : stock > 0
                  ? '¡Pocas unidades!'
                  : 'Agotado por el momento'}
              </p>
            </div>
          </div>

          {/* Cantidad */}
          {stock > 0 && (
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: '#555' }}>
                Cantidad
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-lg hover:bg-[#E8F5EE] transition-colors"
                  style={{ color: '#555', border: '0.5px solid #C8EAD8' }}
                >
                  −
                </button>

                <span
                  className="text-base font-medium w-8 text-center"
                  style={{ color: '#1A1A1A' }}
                >
                  {cantidad}
                </span>

                <button
                  onClick={() =>
                    setCantidad(Math.min(stock, cantidad + 1))
                  }
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-lg hover:bg-[#E8F5EE] transition-colors"
                  style={{ color: '#555', border: '0.5px solid #C8EAD8' }}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Botón agregar */}
          <button
            onClick={handleAgregar}
            disabled={agregando || stock === 0}
            style={{
              background: stock === 0 ? '#e5e5e5' : '#52B788',
            }}
            className="w-full text-white py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
            {agregando
              ? 'Agregando...'
              : stock === 0
              ? 'Sin stock'
              : 'Agregar al carrito'}
          </button>

          {/* Info extra */}
          <div
            style={{ borderTop: '0.5px solid #C8EAD8' }}
            className="pt-4 flex flex-col gap-2"
          >
            {[
              '🚚 Envío mismo día en pedidos antes de las 2pm',
              '🌸 Flores frescas garantizadas',
              '💳 Pago por transferencia o efectivo',
            ].map((item, i) => (
              <p key={i} className="text-xs" style={{ color: '#888' }}>
                {item}
              </p>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}