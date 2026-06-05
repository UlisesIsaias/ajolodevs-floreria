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
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ background: '#E8F5EE', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <ShoppingBag size={32} style={{ color: '#52B788' }} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px' }}>
          Tu carrito está vacío
        </h2>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '32px' }}>
          Explora nuestro catálogo y agrega flores a tu carrito
        </p>
        <Link to="/catalogo"
          style={{ background: '#52B788', color: '#fff', padding: '12px 32px', borderRadius: '10px', fontSize: '14px', fontWeight: '500', textDecoration: 'none', display: 'inline-block' }}
          className="hover:opacity-90 transition-opacity">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => navigate('/catalogo')}
          style={{ color: '#888', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
          className="hover:text-[#52B788] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '500', color: '#1A1A1A' }}>Mi carrito</h1>
          <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>{carrito.items.length} productos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '28px' }}>

        {/* Items */}
        <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {carrito.items.map((item) => (
            <div key={item.id}
              style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', padding: '20px', display: 'flex', gap: '16px' }}>

              {/* Imagen */}
              <div style={{ background: '#E8F5EE', width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                {item.imagen_url ? (
                  <img src={item.imagen_url} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: '500', fontSize: '14px', color: '#1A1A1A', marginBottom: '6px' }}>
                  {item.nombre}
                </h3>
                <p style={{ fontSize: '14px', color: '#52B788', marginBottom: '12px' }}>
                  ${parseFloat(item.precio).toFixed(2)} c/u
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '13px', color: '#888' }}>
                    Cantidad: <span style={{ fontWeight: '500', color: '#1A1A1A' }}>{item.cantidad}</span>
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A' }}>
                    ${parseFloat(item.subtotal).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Eliminar */}
              <button onClick={() => eliminarItem(item.producto_id)}
                style={{ color: '#ccc', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignSelf: 'flex-start' }}
                className="hover:text-red-400 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button onClick={vaciarCarrito}
            style={{ fontSize: '12px', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'flex-start', marginTop: '4px' }}
            className="hover:text-red-400 transition-colors">
            Vaciar carrito
          </button>
        </div>

        {/* Resumen */}
        <div>
          <div style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', padding: '28px 24px' }}>
            <h2 style={{ fontWeight: '500', fontSize: '16px', color: '#1A1A1A', marginBottom: '20px' }}>
              Resumen del pedido
            </h2>

            {/* Items resumen */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {carrito.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#888' }}>
                  <span>{item.nombre} x{item.cantidad}</span>
                  <span>${parseFloat(item.subtotal).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #C8EAD8', paddingTop: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A' }}>Total</span>
                <span style={{ fontSize: '20px', fontWeight: '600', color: '#52B788' }}>
                  ${parseFloat(carrito.total).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Método de pago */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', fontWeight: '500', color: '#555', marginBottom: '10px' }}>
                Método de pago
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { value: 'transferencia',           label: '🏦 Transferencia bancaria'   },
                  { value: 'efectivo_contra_entrega', label: '💵 Efectivo contra entrega'  },
                ].map((m) => (
                  <label key={m.value}
                    style={{
                      border: `1px solid ${metodoPago === m.value ? '#52B788' : '#C8EAD8'}`,
                      background: metodoPago === m.value ? '#E8F5EE' : '#fff',
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '11px 14px', borderRadius: '10px', cursor: 'pointer'
                    }}>
                    <input type="radio" name="metodo_pago"
                      value={m.value}
                      checked={metodoPago === m.value}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className="accent-[#52B788]" />
                    <span style={{ fontSize: '13px', color: '#555' }}>{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notas */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '12px', fontWeight: '500', color: '#555', marginBottom: '10px' }}>
                Notas del pedido (opcional)
              </p>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Instrucciones de entrega, dedicatoria..."
                rows={3}
                style={{ border: '1px solid #C8EAD8', padding: '11px 14px', borderRadius: '10px', fontSize: '13px', outline: 'none', width: '100%', resize: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <button onClick={handlePedido} disabled={creando}
              style={{ background: creando ? '#a0d4bc' : '#52B788', width: '100%', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: '500', color: '#fff', border: 'none', cursor: 'pointer' }}
              className="hover:opacity-90 transition-opacity">
              {creando ? 'Procesando...' : 'Confirmar pedido'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}