import { useState, useEffect } from 'react';
import { AlertTriangle, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

function Modal({ titulo, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div style={{ background: '#fff', border: '1px solid #C8EAD8', borderRadius: '16px', width: '100%', maxWidth: '440px' }}>
        <div style={{ borderBottom: '1px solid #C8EAD8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px' }}>
          <p style={{ fontWeight: '500', fontSize: '14px', color: '#1A1A1A' }}>{titulo}</p>
          <button onClick={onClose} style={{ color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}

export default function AdminInventario() {
  const [productos, setProductos] = useState([]);
  const [stockBajo, setStockBajo] = useState([]);
  const [cargando,  setCargando]  = useState(true);
  const [modal,     setModal]     = useState(null);
  const [form,      setForm]      = useState({ cantidad: '', motivo: '' });
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    try {
      const [{ data: prods }, { data: bajo }] = await Promise.all([
        api.get('/productos'),
        api.get('/inventario/stock-bajo'),
      ]);
      setProductos(prods);
      setStockBajo(bajo);
    } catch {
      toast.error('Error al cargar inventario');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const abrirEntrada = (producto) => {
    setModal({ tipo: 'entrada', producto });
    setForm({ cantidad: '', motivo: 'Reabastecimiento' });
  };

  const abrirAjuste = (producto) => {
    setModal({ tipo: 'ajuste', producto });
    setForm({ cantidad: producto.stock_actual, motivo: 'Ajuste manual' });
  };

  const handleGuardar = async () => {
    if (!form.cantidad) {
      toast.error('La cantidad es obligatoria');
      return;
    }
    setGuardando(true);
    try {
      if (modal.tipo === 'entrada') {
        await api.post('/inventario/entrada', {
          producto_id: modal.producto.id,
          cantidad:    parseInt(form.cantidad),
          motivo:      form.motivo,
        });
        toast.success('Stock actualizado correctamente');
      } else {
        await api.post('/inventario/ajuste', {
          producto_id: modal.producto.id,
          stock_nuevo: parseInt(form.cantidad),
          motivo:      form.motivo,
        });
        toast.success('Stock ajustado correctamente');
      }
      setModal(null);
      cargar();
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al actualizar stock');
    } finally {
      setGuardando(false);
    }
  };

  const inputStyle = {
    border: '1px solid #C8EAD8',
    padding: '11px 14px',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    background: '#fff',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '8px 0' }}>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>Inventario</h1>
        <p className="text-sm" style={{ color: '#888', marginTop: '6px' }}>
          {productos.length} productos en inventario
        </p>
      </div>

      {/* Alertas stock bajo */}
      {stockBajo.length > 0 && (
        <div style={{ background: '#FEF9E7', border: '1px solid #F6E05E', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <AlertTriangle size={18} style={{ color: '#B7770D', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#B7770D', marginBottom: '4px' }}>
              {stockBajo.length} productos con stock bajo
            </p>
            <p style={{ fontSize: '12px', color: '#B7770D' }}>
              {stockBajo.map(p => p.nombre).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Tabla */}
      {cargando ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ background: '#E8F5EE', borderRadius: '12px', height: '64px' }}
              className="animate-pulse" />
          ))}
        </div>
      ) : (
        <div style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
          <table className="w-full">
            <thead style={{ background: '#F7F7F5', borderBottom: '1px solid #C8EAD8' }}>
              <tr>
                {['Producto', 'Categoría', 'Stock actual', 'Stock mínimo', 'Estado', 'Acciones'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '500', color: '#555' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productos.map((p, i) => {
                const bajo = p.stock_actual <= p.stock_minimo;
                return (
                  <tr key={p.id} style={{ borderBottom: i < productos.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: '#E8F5EE', width: '36px', height: '36px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                          {p.imagen_url
                            ? <img src={p.imagen_url} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                                  <circle cx="16" cy="16" r="4" fill="#52B788"/>
                                  <ellipse cx="16" cy="9" rx="3" ry="5" fill="#52B788" opacity="0.6"/>
                                  <ellipse cx="16" cy="23" rx="3" ry="5" fill="#52B788" opacity="0.6"/>
                                  <ellipse cx="9" cy="16" rx="5" ry="3" fill="#52B788" opacity="0.6"/>
                                  <ellipse cx="23" cy="16" rx="5" ry="3" fill="#52B788" opacity="0.6"/>
                                </svg>
                              </div>
                          }
                        </div>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A' }}>{p.nombre}</p>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ background: '#E8F5EE', color: '#2D6A4F', fontSize: '12px', padding: '4px 10px', borderRadius: '20px' }}>
                        {p.categoria_nombre}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: bajo ? '#9B2C2C' : '#1A1A1A' }}>
                      {p.stock_actual}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '14px', color: '#888' }}>
                      {p.stock_minimo}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ background: bajo ? '#FDE8E8' : '#E8F5EE', color: bajo ? '#9B2C2C' : '#2D6A4F', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: '500' }}>
                        {bajo ? 'Stock bajo' : 'Normal'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => abrirEntrada(p)}
                          style={{ background: '#E8F5EE', color: '#2D6A4F', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '7px 14px', borderRadius: '8px', fontWeight: '500', border: 'none', cursor: 'pointer' }}
                          className="hover:opacity-80 transition-opacity">
                          <Plus size={12} /> Entrada
                        </button>
                        <button onClick={() => abrirAjuste(p)}
                          style={{ background: '#F7F7F5', color: '#555', border: '1px solid #C8EAD8', fontSize: '12px', padding: '7px 14px', borderRadius: '8px', fontWeight: '500', cursor: 'pointer' }}
                          className="hover:opacity-80 transition-opacity">
                          Ajustar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <Modal
          titulo={modal.tipo === 'entrada' ? `Entrada de stock — ${modal.producto.nombre}` : `Ajustar stock — ${modal.producto.nombre}`}
          onClose={() => setModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '8px' }}>
                {modal.tipo === 'entrada' ? 'Cantidad a agregar' : 'Nuevo stock total'}
              </label>
              <input type="number" min="0" value={form.cantidad}
                onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                placeholder="0" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '8px' }}>
                Motivo
              </label>
              <input type="text" value={form.motivo}
                onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                placeholder="Motivo del movimiento" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
              <button onClick={() => setModal(null)}
                style={{ flex: 1, padding: '11px', borderRadius: '10px', fontSize: '14px', border: '1px solid #C8EAD8', color: '#555', background: '#fff', cursor: 'pointer' }}
                className="hover:bg-[#F7F7F5] transition-colors">
                Cancelar
              </button>
              <button onClick={handleGuardar} disabled={guardando}
                style={{ flex: 1, padding: '11px', borderRadius: '10px', fontSize: '14px', fontWeight: '500', background: guardando ? '#a0d4bc' : '#52B788', color: '#fff', border: 'none', cursor: 'pointer' }}
                className="hover:opacity-90 transition-opacity">
                {guardando ? 'Guardando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}