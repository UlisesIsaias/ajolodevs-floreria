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
      <div style={{ background: '#fff', border: '1px solid #C8EAD8', borderRadius: '16px', width: '100%', maxWidth: '440px' }}>
        <div style={{ borderBottom: '1px solid #C8EAD8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px' }}>
          <p style={{ fontWeight: '500', fontSize: '14px', color: '#1A1A1A' }}>
            Cambiar estatus — Pedido #{pedido.id}
          </p>
          <button onClick={onClose} style={{ color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '10px' }}>
              Nuevo estatus
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(estatusColor).map(([key, val]) => (
                <label key={key}
                  style={{
                    border: `1px solid ${estatus === key ? val.color : '#C8EAD8'}`,
                    background: estatus === key ? val.bg : '#fff',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '11px 14px', borderRadius: '10px', cursor: 'pointer'
                  }}>
                  <input type="radio" name="estatus" value={key}
                    checked={estatus === key}
                    onChange={(e) => setEstatus(e.target.value)}
                    className="accent-[#52B788]" />
                  <span style={{ fontSize: '14px', textTransform: 'capitalize', color: val.color }}>
                    {key.replace('_', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '8px' }}>
              Comentario (opcional)
            </label>
            <textarea value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Comentario sobre el cambio..."
              rows={2}
              style={{ border: '1px solid #C8EAD8', padding: '11px 14px', borderRadius: '10px', fontSize: '14px', outline: 'none', width: '100%', resize: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onClose}
              style={{ flex: 1, padding: '11px', borderRadius: '10px', fontSize: '14px', border: '1px solid #C8EAD8', color: '#555', background: '#fff', cursor: 'pointer' }}
              className="hover:bg-[#F7F7F5] transition-colors">
              Cancelar
            </button>
            <button onClick={handleGuardar} disabled={guardando}
              style={{ flex: 1, padding: '11px', borderRadius: '10px', fontSize: '14px', fontWeight: '500', background: guardando ? '#a0d4bc' : '#52B788', color: '#fff', border: 'none', cursor: 'pointer' }}
              className="hover:opacity-90 transition-opacity">
              {guardando ? 'Guardando...' : 'Actualizar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPedidos() {
  const [pedidos,       setPedidos]       = useState([]);
  const [cargando,      setCargando]      = useState(true);
  const [filtroEstatus, setFiltroEstatus] = useState('');
  const [modalPedido,   setModalPedido]   = useState(null);

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '8px 0' }}>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>Pedidos</h1>
        <p className="text-sm" style={{ color: '#888', marginTop: '6px' }}>{pedidos.length} pedidos</p>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[['', 'Todos'], ['pendiente', 'Pendientes'], ['en_proceso', 'En proceso'],
          ['enviado', 'Enviados'], ['entregado', 'Entregados'], ['cancelado', 'Cancelados']
        ].map(([val, label]) => (
          <button key={val} onClick={() => setFiltroEstatus(val)}
            style={{
              background: filtroEstatus === val ? '#52B788' : '#fff',
              color:      filtroEstatus === val ? '#fff'    : '#555',
              border:     '1px solid #C8EAD8',
              padding: '8px 16px', borderRadius: '10px', fontSize: '13px',
              fontWeight: '500', cursor: 'pointer'
            }}
            className="transition-colors">
            {label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {cargando ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ background: '#E8F5EE', borderRadius: '12px', height: '80px' }}
              className="animate-pulse" />
          ))}
        </div>
      ) : pedidos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontSize: '14px', color: '#aaa' }}>No hay pedidos</p>
        </div>
      ) : (
        <div style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
          <table className="w-full">
            <thead style={{ background: '#F7F7F5', borderBottom: '1px solid #C8EAD8' }}>
              <tr>
                {['#', 'Cliente', 'Total', 'Método', 'Estatus', 'Fecha', 'Acciones'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '500', color: '#555' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p, i) => {
                const estilo = estatusColor[p.estatus] || estatusColor.pendiente;
                return (
                  <tr key={p.id} style={{ borderBottom: i < pedidos.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#1A1A1A' }}>
                      #{p.id}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ fontSize: '14px', color: '#1A1A1A' }}>{p.cliente}</p>
                      <p style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>{p.email}</p>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#52B788' }}>
                      ${parseFloat(p.total).toFixed(2)}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: '#888' }}>
                      {p.metodo_pago === 'transferencia' ? '🏦 Transferencia' : '💵 Efectivo'}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ background: estilo.bg, color: estilo.color, fontSize: '12px', fontWeight: '500', padding: '4px 10px', borderRadius: '20px', textTransform: 'capitalize' }}>
                        {p.estatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px', color: '#888' }}>
                      {new Date(p.creado_en).toLocaleDateString('es-MX', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <button onClick={() => setModalPedido(p)}
                        style={{ background: '#E8F5EE', color: '#2D6A4F', fontSize: '12px', padding: '7px 14px', borderRadius: '8px', fontWeight: '500', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        className="hover:opacity-80 transition-opacity">
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