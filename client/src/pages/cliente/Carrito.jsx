import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function Carrito() {
  const { carrito, eliminarItem, vaciarCarrito, obtenerCarrito } = useCart();
  const [metodoPago, setMetodoPago] = useState('transferencia');
  const [notas,      setNotas]      = useState('');
  const [creando,    setCreando]    = useState(false);
  const navigate                    = useNavigate();

  const handlePedido = async () => {
    if (carrito.items.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }
    setCreando(true);
    try {
      const { data } = await api.post('/pedidos', {
        metodo_pago: metodoPago,
        notas:       notas || null,
      });
      toast.success('¡Pedido creado correctamente!');
      await obtenerCarrito();
      navigate(`/pedido/${data.pedido_id}`);
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al crear pedido');
    } finally {
      setCreando(false);
    }
  };

  if (carrito.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div style={{ background: '#E8F5EE' }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={32} style={{ color: '#52B788' }} />
        </div>
        <h2 className="text-xl font-medium mb-2" style={{ color: '#1A1A1A' }}>
          Tu carrito está vacío
        </h2>
        <p className="text-sm mb-8" style={{ color: '#888' }}>
          Explora nuestro catálogo y agrega flores a tu carrito
        </p>
        <Link to="/catalogo"
          style={{ background: '#52B788' }}
          className="text-white px-8 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity inline-block">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/catalogo')}
          style={{ color: '#888' }}
          className="hover:text-[#52B788] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>Mi carrito</h1>
          <p className="text-sm" style={{ color: '#888' }}>{carrito.items.length} productos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {carrito.items.map((item) => (
            <div key={item.id}
              style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
              className="rounded-xl p-4 flex gap-4">

              {/* Imagen */}
              <div style={{ background: '#E8F5EE' }}
                className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                {item.imagen_url ? (
                  <img src={item.imagen_url} alt={item.nombre}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="4" fill="#52B788"/>
                      <ellipse cx="16" cy="9"  rx="3" ry="5" fill="#52B788" opacity="0.6"/>
                      <ellipse cx="16" cy="23" rx="3" ry="5" fill="#52B788" opacity="0.6"/>
                      <ellipse cx="9"  cy="16" rx="5" ry="3" fill="#52B788" opacity="0.6"/>
                      <ellipse cx="23" cy="16" rx="5" ry="3" fill="#52B788" opacity="0.6"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-medium text-sm mb-1" style={{ color: '#1A1A1A' }}>
                  {item.nombre}
                </h3>
                <p className="text-sm mb-2" style={{ color: '#52B788' }}>
                  ${parseFloat(item.precio).toFixed(2)} c/u
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs" style={{ color: '#888' }}>
                    Cantidad: <span className="font-medium" style={{ color: '#1A1A1A' }}>{item.cantidad}</span>
                  </p>
                  <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>
                    ${parseFloat(item.subtotal).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Eliminar */}
              <button onClick={() => eliminarItem(item.producto_id)}
                className="hover:text-red-400 transition-colors self-start"
                style={{ color: '#ccc' }}>
                <Trash2 size={16} />
              </button>

            </div>
          ))}

          {/* Vaciar */}
          <button onClick={vaciarCarrito}
            className="text-xs hover:text-red-400 transition-colors self-start"
            style={{ color: '#aaa' }}>
            Vaciar carrito
          </button>
        </div>

        {/* Resumen */}
        <div className="flex flex-col gap-4">
          <div style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
            className="rounded-xl p-6">
            <h2 className="font-medium text-base mb-5" style={{ color: '#1A1A1A' }}>
              Resumen del pedido
            </h2>

            {/* Items resumen */}
            <div className="flex flex-col gap-2 mb-4">
              {carrito.items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs" style={{ color: '#888' }}>
                  <span>{item.nombre} x{item.cantidad}</span>
                  <span>${parseFloat(item.subtotal).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '0.5px solid #C8EAD8' }} className="pt-4 mb-5">
              <div className="flex justify-between font-medium">
                <span className="text-sm" style={{ color: '#1A1A1A' }}>Total</span>
                <span className="text-lg" style={{ color: '#52B788' }}>
                  ${parseFloat(carrito.total).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Método de pago */}
            <div className="mb-4">
              <p className="text-xs font-medium mb-2" style={{ color: '#555' }}>
                Método de pago
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { value: 'transferencia',          label: '🏦 Transferencia bancaria' },
                  { value: 'efectivo_contra_entrega', label: '💵 Efectivo contra entrega' },
                ].map((m) => (
                  <label key={m.value}
                    style={{
                      border: `0.5px solid ${metodoPago === m.value ? '#52B788' : '#C8EAD8'}`,
                      background: metodoPago === m.value ? '#E8F5EE' : '#fff',
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors">
                    <input type="radio" name="metodo_pago"
                      value={m.value}
                      checked={metodoPago === m.value}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className="accent-[#52B788]" />
                    <span className="text-xs" style={{ color: '#555' }}>{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notas */}
            <div className="mb-5">
              <p className="text-xs font-medium mb-2" style={{ color: '#555' }}>
                Notas del pedido (opcional)
              </p>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Instrucciones de entrega, dedicatoria..."
                rows={3}
                style={{ border: '0.5px solid #C8EAD8' }}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none focus:border-[#52B788] transition-colors resize-none"
              />
            </div>

            {/* Botón */}
            <button onClick={handlePedido} disabled={creando}
              style={{ background: creando ? '#a0d4bc' : '#52B788' }}
              className="w-full text-white py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
              {creando ? 'Procesando...' : 'Confirmar pedido'}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}