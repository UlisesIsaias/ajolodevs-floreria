import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const estatusColor = {
  pendiente:  { bg: '#FEF9E7', color: '#B7770D' },
  en_proceso: { bg: '#E8F5EE', color: '#2D6A4F' },
  enviado:    { bg: '#E8F0FE', color: '#3B4FA8' },
  entregado:  { bg: '#E8F5EE', color: '#1a6b3a' },
  cancelado:  { bg: '#FDE8E8', color: '#9B2C2C' },
};

function ModalEstatus({ pedido, onClose, onActualizar }) {
  const [estatus,    setEstatus]    = useState(pedido.estatus);
  const [comentario, setComentario] = useState('');
  const [guardando,  setGuardando]  = useState(false);

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      await api.patch(`/pedidos/${pedido.id}/estatus`, { estatus, comentario });
      toast.success('Estatus actualizado');
      onActualizar();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al actualizar');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div style={{ background: '#fff', border: '0.5px solid #C8EAD8' }}
        className="w-full max-w-md rounded-2xl">
        <div style={{ borderBottom: '0.5px solid #C8EAD8' }}
          className="flex items-center justify-between px-6 py-4">
          <p className="font-medium text-sm" style={{ color: '#1A1A1A' }}>
            Cambiar estatus — Pedido #{pedido.id}
          </p>
          <button onClick={onClose} style={{ color: '#aaa' }}><X size={18} /></button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium block mb-2" style={{ color: '#555' }}>
              Nuevo estatus
            </label>
            <div className="flex flex-col gap-2">
              {Object.entries(estatusColor).map(([key, val]) => (
                <label key={key}
                  style={{
                    border: `0.5px solid ${estatus === key ? val.color : '#C8EAD8'}`,
                    background: estatus === key ? val.bg : '#fff',
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors">
                  <input type="radio" name="estatus" value={key}
                    checked={estatus === key}
                    onChange={(e) => setEstatus(e.target.value)}
                    className="accent-[#52B788]" />
                  <span className="text-sm capitalize" style={{ color: val.color }}>
                    {key.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: '#555' }}>
              Comentario (opcional)
            </label>
            <textarea value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Comentario sobre el cambio..."
              rows={2}
              style={{ border: '0.5px solid #C8EAD8' }}
              className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:border-[#52B788] resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose}
              style={{ border: '0.5px solid #C8EAD8', color: '#555' }}
              className="flex-1 py-2.5 rounded-xl text-sm hover:bg-[#F7F7F5]">
              Cancelar
            </button>
            <button onClick={handleGuardar} disabled={guardando}
              style={{ background: guardando ? '#a0d4bc' : '#52B788' }}
              className="flex-1 text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90">
              {guardando ? 'Guardando...' : 'Actualizar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPedidos() {
  const [pedidos,        setPedidos]        = useState([]);
  const [cargando,       setCargando]       = useState(true);
  const [filtroEstatus,  setFiltroEstatus]  = useState('');
  const [modalPedido,    setModalPedido]    = useState(null);

  const cargar = async () => {
    try {
      const url = filtroEstatus ? `/pedidos?estatus=${filtroEstatus}` : '/pedidos';
      const { data } = await api.get(url);
      setPedidos(data);
    } catch {
      toast.error('Error al cargar pedidos');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, [filtroEstatus]);

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>Pedidos</h1>
          <p className="text-sm mt-1" style={{ color: '#888' }}>{pedidos.length} pedidos</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {[['', 'Todos'], ['pendiente', 'Pendientes'], ['en_proceso', 'En proceso'],
          ['enviado', 'Enviados'], ['entregado', 'Entregados'], ['cancelado', 'Cancelados']
        ].map(([val, label]) => (
          <button key={val} onClick={() => setFiltroEstatus(val)}
            style={{
              background: filtroEstatus === val ? '#52B788' : '#fff',
              color:      filtroEstatus === val ? '#fff'    : '#555',
              border:     '0.5px solid #C8EAD8',
            }}
            className="px-4 py-2 rounded-xl text-xs font-medium transition-colors">
            {label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {cargando ? (
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ background: '#E8F5EE' }} className="h-20 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : pedidos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm" style={{ color: '#aaa' }}>No hay pedidos</p>
        </div>
      ) : (
        <div style={{ border: '0.5px solid #C8EAD8', background: '#fff' }} className="rounded-xl overflow-hidden">
          <table className="w-full">
            <thead style={{ background: '#F7F7F5', borderBottom: '0.5px solid #C8EAD8' }}>
              <tr>
                {['#', 'Cliente', 'Total', 'Método', 'Estatus', 'Fecha', 'Acciones'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium" style={{ color: '#555' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p, i) => {
                const estilo = estatusColor[p.estatus] || estatusColor.pendiente;
                return (
                  <tr key={p.id} style={{ borderBottom: i < pedidos.length - 1 ? '0.5px solid #F0F0F0' : 'none' }}>
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: '#1A1A1A' }}>#{p.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm" style={{ color: '#1A1A1A' }}>{p.cliente}</p>
                      <p className="text-xs" style={{ color: '#aaa' }}>{p.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: '#52B788' }}>
                      ${parseFloat(p.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#888' }}>
                      {p.metodo_pago === 'transferencia' ? '🏦 Transferencia' : '💵 Efectivo'}
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ background: estilo.bg, color: estilo.color }}
                        className="text-xs font-medium px-2 py-1 rounded-full capitalize">
                        {p.estatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#888' }}>
                      {new Date(p.creado_en).toLocaleDateString('es-MX', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setModalPedido(p)}
                        style={{ background: '#E8F5EE', color: '#2D6A4F' }}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium hover:opacity-80 flex items-center gap-1">
                        Gestionar <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalPedido && (
        <ModalEstatus
          pedido={modalPedido}
          onClose={() => setModalPedido(null)}
          onActualizar={cargar}
        />
      )}
    </div>
  );
}