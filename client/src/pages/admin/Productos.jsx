import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

function Modal({ titulo, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div style={{ background: '#fff', border: '0.5px solid #C8EAD8', maxHeight: '90vh' }}
        className="w-full max-w-lg rounded-2xl overflow-y-auto">
        <div style={{ borderBottom: '0.5px solid #C8EAD8' }}
          className="flex items-center justify-between px-6 py-4">
          <p className="font-medium text-sm" style={{ color: '#1A1A1A' }}>{titulo}</p>
          <button onClick={onClose} style={{ color: '#aaa' }} className="hover:text-[#1A1A1A]">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

const formInicial = {
  categoria_id: '', nombre: '', descripcion: '',
  precio: '', stock_inicial: '', stock_minimo: '5', destacado: false,
};

export default function AdminProductos() {
  const [productos,   setProductos]   = useState([]);
  const [categorias,  setCategorias]  = useState([]);
  const [cargando,    setCargando]    = useState(true);
  const [modal,       setModal]       = useState(false);
  const [editando,    setEditando]    = useState(null);
  const [form,        setForm]        = useState(formInicial);
  const [imagen,      setImagen]      = useState(null);
  const [preview,     setPreview]     = useState(null);
  const [guardando,   setGuardando]   = useState(false);

  const cargar = async () => {
    try {
      const [{ data: prods }, { data: cats }] = await Promise.all([
        api.get('/productos'),
        api.get('/categorias'),
      ]);
      setProductos(prods);
      setCategorias(cats);
    } catch {
      toast.error('Error al cargar productos');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const abrirCrear = () => {
    setEditando(null);
    setForm(formInicial);
    setImagen(null);
    setPreview(null);
    setModal(true);
  };

  const abrirEditar = (p) => {
    setEditando(p);
    setForm({
      categoria_id: p.categoria_id,
      nombre:       p.nombre,
      descripcion:  p.descripcion || '',
      precio:       p.precio,
      stock_inicial: p.stock_actual,
      stock_minimo:  p.stock_minimo,
      destacado:     p.destacado,
    });
    setPreview(p.imagen_url);
    setImagen(null);
    setModal(true);
  };

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagen(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleGuardar = async () => {
    if (!form.categoria_id || !form.nombre || !form.precio) {
      toast.error('Categoría, nombre y precio son obligatorios');
      return;
    }
    setGuardando(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imagen) fd.append('imagen', imagen);

      if (editando) {
        await api.put(`/productos/${editando.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Producto actualizado');
      } else {
        await api.post('/productos', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Producto creado');
      }
      setModal(false);
      cargar();
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await api.delete(`/productos/${id}`);
      toast.success('Producto eliminado');
      cargar();
    } catch {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>Productos</h1>
          <p className="text-sm mt-1" style={{ color: '#888' }}>{productos.length} productos registrados</p>
        </div>
        <button onClick={abrirCrear}
          style={{ background: '#52B788' }}
          className="text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Plus size={16} /> Nuevo producto
        </button>
      </div>

      {/* Tabla */}
      {cargando ? (
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ background: '#E8F5EE' }} className="h-16 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm" style={{ color: '#aaa' }}>No hay productos registrados</p>
        </div>
      ) : (
        <div style={{ border: '0.5px solid #C8EAD8', background: '#fff' }} className="rounded-xl overflow-hidden">
          <table className="w-full">
            <thead style={{ background: '#F7F7F5', borderBottom: '0.5px solid #C8EAD8' }}>
              <tr>
                {['Producto', 'Categoría', 'Precio', 'Stock', 'Acciones'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium" style={{ color: '#555' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productos.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < productos.length - 1 ? '0.5px solid #F0F0F0' : 'none' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div style={{ background: '#E8F5EE' }} className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        {p.imagen_url
                          ? <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center">
                              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
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
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: '#52B788' }}>
                    ${parseFloat(p.precio).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span style={{
                      background: p.stock_actual <= p.stock_minimo ? '#FDE8E8' : '#E8F5EE',
                      color:      p.stock_actual <= p.stock_minimo ? '#9B2C2C' : '#2D6A4F',
                    }} className="text-xs px-2 py-1 rounded-full font-medium">
                      {p.stock_actual} uds
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => abrirEditar(p)}
                        style={{ background: '#E8F5EE', color: '#2D6A4F' }}
                        className="p-2 rounded-lg hover:opacity-80 transition-opacity">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => handleEliminar(p.id)}
                        style={{ background: '#FDE8E8', color: '#9B2C2C' }}
                        className="p-2 rounded-lg hover:opacity-80 transition-opacity">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <Modal titulo={editando ? 'Editar producto' : 'Nuevo producto'} onClose={() => setModal(false)}>
          <div className="flex flex-col gap-4">

            {/* Preview imagen */}
            <label style={{ border: '0.5px dashed #C8EAD8', background: '#F7F7F5' }}
              className="flex flex-col items-center justify-center py-6 rounded-xl cursor-pointer hover:bg-[#E8F5EE] transition-colors">
              {preview ? (
                <img src={preview} alt="preview" className="h-24 object-contain rounded-lg" />
              ) : (
                <>
                  <Upload size={20} style={{ color: '#52B788' }} className="mb-2" />
                  <p className="text-xs" style={{ color: '#555' }}>Seleccionar imagen</p>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImagen} />
            </label>

            {/* Categoría */}
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#555' }}>Categoría</label>
              <select value={form.categoria_id} onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                style={{ border: '0.5px solid #C8EAD8' }}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:border-[#52B788]">
                <option value="">Seleccionar categoría</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>

            {/* Nombre */}
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#555' }}>Nombre</label>
              <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre del producto"
                style={{ border: '0.5px solid #C8EAD8' }}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:border-[#52B788]" />
            </div>

            {/* Descripción */}
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#555' }}>Descripción</label>
              <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Descripción del producto" rows={3}
                style={{ border: '0.5px solid #C8EAD8' }}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:border-[#52B788] resize-none" />
            </div>

            {/* Precio + Stock */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Precio', key: 'precio',        placeholder: '0.00' },
                { label: 'Stock inicial', key: 'stock_inicial', placeholder: '0' },
                { label: 'Stock mínimo', key: 'stock_minimo',  placeholder: '5' },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs font-medium block mb-1" style={{ color: '#555' }}>{f.label}</label>
                  <input type="number" value={form[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    style={{ border: '0.5px solid #C8EAD8' }}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:border-[#52B788]" />
                </div>
              ))}
            </div>

            {/* Destacado */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.destacado}
                onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                className="accent-[#52B788] w-4 h-4" />
              <span className="text-sm" style={{ color: '#555' }}>Producto destacado</span>
            </label>

            {/* Botones */}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(false)}
                style={{ border: '0.5px solid #C8EAD8', color: '#555' }}
                className="flex-1 py-2.5 rounded-xl text-sm hover:bg-[#F7F7F5] transition-colors">
                Cancelar
              </button>
              <button onClick={handleGuardar} disabled={guardando}
                style={{ background: guardando ? '#a0d4bc' : '#52B788' }}
                className="flex-1 text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                {guardando ? 'Guardando...' : editando ? 'Actualizar' : 'Crear producto'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}