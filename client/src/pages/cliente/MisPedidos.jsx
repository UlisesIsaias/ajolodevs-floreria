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
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ background: '#E8F5EE' }}
              className="h-20 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div style={{ background: '#E8F5EE' }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={32} style={{ color: '#52B788' }} />
        </div>
        <h2 className="text-xl font-medium mb-2" style={{ color: '#1A1A1A' }}>
          Aún no tienes pedidos
        </h2>
        <p className="text-sm mb-8" style={{ color: '#888' }}>
          Explora el catálogo y realiza tu primer pedido
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
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-medium mb-2" style={{ color: '#1A1A1A' }}>Mis pedidos</h1>
      <p className="text-sm mb-8" style={{ color: '#888' }}>{pedidos.length} pedidos realizados</p>

      <div className="flex flex-col gap-3">
        {pedidos.map((pedido) => {
          const estilo = estatusColor[pedido.estatus] || estatusColor.pendiente;
          return (
            <Link key={pedido.id} to={`/pedido/${pedido.id}`}
              style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
              className="rounded-xl p-4 flex items-center justify-between hover:border-[#52B788] transition-colors group">
              <div className="flex items-center gap-4">
                <div style={{ background: '#E8F5EE' }}
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ShoppingBag size={18} style={{ color: '#52B788' }} />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: '#1A1A1A' }}>
                    Pedido #{pedido.id}
                  </p>
                  <div className="flex items-center gap-2">
                    <span style={{ background: estilo.bg, color: estilo.color }}
                      className="text-xs font-medium px-2 py-0.5 rounded-full">
                      {pedido.estatus.replace('_', ' ')}
                    </span>
                    <span className="text-xs" style={{ color: '#aaa' }}>
                      {pedido.total_items} {pedido.total_items === 1 ? 'producto' : 'productos'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium" style={{ color: '#52B788' }}>
                    ${parseFloat(pedido.total).toFixed(2)}
                  </p>
                  <p className="text-xs" style={{ color: '#aaa' }}>
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