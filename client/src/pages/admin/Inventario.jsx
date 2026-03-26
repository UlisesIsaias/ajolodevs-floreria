import { useState, useEffect } from 'react';
import { AlertTriangle, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

function Modal({ titulo, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div style={{ background: '#fff', border: '0.5px solid #C8EAD8' }}
        className="w-full max-w-md rounded-2xl">
        <div style={{ borderBottom: '0.5px solid #C8EAD8' }}
          className="flex items-center justify-between px-6 py-4">
          <p className="font-medium text-sm" style={{ color: '#1A1A1A' }}>{titulo}</p>
          <button onClick={onClose} style={{ color: '#aaa' }}><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function AdminInventario() {
  const [productos,  setProductos]  = useState([]);
  const [stockBajo,  setStockBajo]  = useState([]);
  const [cargando,   setCargando]   = useState(true);
  const [modal,      setModal]      = useState(null);
  const [form,       setForm]       = useState({ cantidad: '', motivo: '' });
  const [guardando,  setGuardando]  = useState(false);

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

  return (
    <div className="flex flex-col gap-6">

      <div>
        <h1 className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>Inventario</h1>
        <p className="text-sm mt-1" style={{ color: '#888' }}>{productos.length} productos en inventario</p>
      </div>

      {/* Alertas stock bajo */}
      {stockBajo.length > 0 && (
        <div style={{ background: '#FEF9E7', border: '0.5px solid #F6E05E' }}
          className="rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} style={{ color: '#B7770D' }} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium mb-1" style={{ color: '#B7770D' }}>
              {stockBajo.length} productos con stock bajo
            </p>
            <p className="text-xs" style={{ color: '#B7770D' }}>
              {stockBajo.map(p => p.nombre).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Tabla */}
      {cargando ? (
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ background: '#E8F5EE' }} className="h-16 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div style={{ border: '0.5px solid #C8EAD8', background: '#fff' }} className="rounded-xl overflow-hidden">
          <table className="w-full">
            <thead style={{ background: '#F7F7F5', borderBottom: '0.5px solid #C8EAD8' }}>
              <tr>
                {['Producto', 'Categoría', 'Stock actual', 'Stock mínimo', 'Estado', 'Acciones'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium" style={{ color: '#555' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productos.map((p, i) => {
                const bajo = p.stock_actual <= p.stock_minimo;
                return (
                  <tr key={p.id} style={{ borderBottom: i < productos.length - 1 ? '0.5px solid #F0F0F0' : 'none' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div style={{ background: '#E8F5EE' }} className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                          {p.imagen_url
                            ? <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center">
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
                        <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{p.nombre}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ background: '#E8F5EE', color: '#2D6A4F' }}
                        className="text-xs px-2 py-1 rounded-full">{p.categoria_nombre}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: bajo ? '#9B2C2C' : '#1A1A1A' }}>
                      {p.stock_actual}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#888' }}>{p.stock_minimo}</td>
                    <td className="px-4 py-3">
                      <span style={{
                        background: bajo ? '#FDE8E8' : '#E8F5EE',
                        color:      bajo ? '#9B2C2C' : '#2D6A4F',
                      }} className="text-xs px-2 py-1 rounded-full font-medium">
                        {bajo ? 'Stock bajo' : 'Normal'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => abrirEntrada(p)}
                          style={{ background: '#E8F5EE', color: '#2D6A4F' }}
                          className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium hover:opacity-80">
                          <Plus size={12} /> Entrada
                        </button>
                        <button onClick={() => abrirAjuste(p)}
                          style={{ background: '#F7F7F5', color: '#555', border: '0.5px solid #C8EAD8' }}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium hover:opacity-80">
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
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#555' }}>
                {modal.tipo === 'entrada' ? 'Cantidad a agregar' : 'Nuevo stock total'}
              </label>
              <input type="number" min="0" value={form.cantidad}
                onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                placeholder="0"
                style={{ border: '0.5px solid #C8EAD8' }}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:border-[#52B788]" />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#555' }}>Motivo</label>
              <input type="text" value={form.motivo}
                onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                placeholder="Motivo del movimiento"
                style={{ border: '0.5px solid #C8EAD8' }}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:border-[#52B788]" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)}
                style={{ border: '0.5px solid #C8EAD8', color: '#555' }}
                className="flex-1 py-2.5 rounded-xl text-sm hover:bg-[#F7F7F5]">
                Cancelar
              </button>
              <button onClick={handleGuardar} disabled={guardando}
                style={{ background: guardando ? '#a0d4bc' : '#52B788' }}
                className="flex-1 text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90">
                {guardando ? 'Guardando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}