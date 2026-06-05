import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const estatusColor = {
  pendiente:  { bg: '#FEF9E7', color: '#B7770D' },
  en_proceso: { bg: '#E8F5EE', color: '#2D6A4F' },
  enviado:    { bg: '#E8F0FE', color: '#3B4FA8' },
  entregado:  { bg: '#E8F5EE', color: '#1a6b3a' },
  cancelado:  { bg: '#FDE8E8', color: '#9B2C2C' },
};

export default function MisPedidos() {
  const [pedidos,  setPedidos]  = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await api.get('/pedidos/mis-pedidos');
        setPedidos(data);
      } catch {
        toast.error('Error al cargar pedidos');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  if (cargando) {
    return (
      <div style={{ maxWidth: '768px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ background: '#E8F5EE', borderRadius: '12px', height: '80px' }}
              className="animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ background: '#E8F5EE', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <ShoppingBag size={32} style={{ color: '#52B788' }} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px' }}>
          Aún no tienes pedidos
        </h2>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '32px' }}>
          Explora el catálogo y realiza tu primer pedido
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
    <div style={{ maxWidth: '768px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '500', color: '#1A1A1A' }}>Mis pedidos</h1>
        <p style={{ fontSize: '14px', color: '#888', marginTop: '6px' }}>
          {pedidos.length} pedidos realizados
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {pedidos.map((pedido) => {
          const estilo = estatusColor[pedido.estatus] || estatusColor.pendiente;
          return (
            <Link key={pedido.id} to={`/pedido/${pedido.id}`}
              style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}
              className="hover:border-[#52B788] transition-colors group">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: '#E8F5EE', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShoppingBag size={18} style={{ color: '#52B788' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A', marginBottom: '6px' }}>
                    Pedido #{pedido.id}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: estilo.bg, color: estilo.color, fontSize: '12px', fontWeight: '500', padding: '3px 10px', borderRadius: '20px', textTransform: 'capitalize' }}>
                      {pedido.estatus.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '12px', color: '#aaa' }}>
                      {pedido.total_items} {pedido.total_items === 1 ? 'producto' : 'productos'}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#52B788' }}>
                    ${parseFloat(pedido.total).toFixed(2)}
                  </p>
                  <p style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>
                    {new Date(pedido.creado_en).toLocaleDateString('es-MX', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
                <ChevronRight size={16} style={{ color: '#ccc' }}
                  className="group-hover:text-[#52B788] transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}