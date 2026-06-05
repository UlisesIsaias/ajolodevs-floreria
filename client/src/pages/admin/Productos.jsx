import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

function Modal({ titulo, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div style={{ background: '#fff', border: '1px solid #C8EAD8', borderRadius: '16px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ borderBottom: '1px solid #C8EAD8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
          <p style={{ fontWeight: '500', fontSize: '14px', color: '#1A1A1A' }}>{titulo}</p>
          <button onClick={onClose} style={{ color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
            className="hover:text-[#1A1A1A]">
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}

const formInicial = {
  categoria_id: '', nombre: '', descripcion: '',
  precio: '', stock_inicial: '', stock_minimo: '5', destacado: false,
};

export default function AdminProductos() {
  const [productos,  setProductos]  = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando,   setCargando]   = useState(true);
  const [modal,      setModal]      = useState(false);
  const [editando,   setEditando]   = useState(null);
  const [form,       setForm]       = useState(formInicial);
  const [imagen,     setImagen]     = useState(null);
  const [preview,    setPreview]    = useState(null);
  const [guardando,  setGuardando]  = useState(false);

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
      categoria_id:  p.categoria_id,
      nombre:        p.nombre,
      descripcion:   p.descripcion || '',
      precio:        p.precio,
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
        await api.put(`/productos/${editando.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Producto actualizado');
      } else {
        await api.post('/productos', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>Productos</h1>
          <p className="text-sm" style={{ color: '#888', marginTop: '6px' }}>
            {productos.length} productos registrados
          </p>
        </div>
        <button onClick={abrirCrear}
          style={{ background: '#52B788', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}
          className="hover:opacity-90 transition-opacity">
          <Plus size={16} /> Nuevo producto
        </button>
      </div>

      {/* Tabla */}
      {cargando ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ background: '#E8F5EE', borderRadius: '12px', height: '64px' }}
              className="animate-pulse" />
          ))}
        </div>
      ) : productos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontSize: '14px', color: '#aaa' }}>No hay productos registrados</p>
        </div>
      ) : (
        <div style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
          <table className="w-full">
            <thead style={{ background: '#F7F7F5', borderBottom: '1px solid #C8EAD8' }}>
              <tr>
                {['Producto', 'Categoría', 'Precio', 'Stock', 'Acciones'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '500', color: '#555' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productos.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < productos.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ background: '#E8F5EE', width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                        {p.imagen_url
                          ? <img src={p.imagen_url} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                      <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A' }}>{p.nombre}</p>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ background: '#E8F5EE', color: '#2D6A4F', fontSize: '12px', padding: '4px 10px', borderRadius: '20px' }}>
                      {p.categoria_nombre}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500', color: '#52B788' }}>
                    ${parseFloat(p.precio).toFixed(2)}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      background: p.stock_actual <= p.stock_minimo ? '#FDE8E8' : '#E8F5EE',
                      color:      p.stock_actual <= p.stock_minimo ? '#9B2C2C' : '#2D6A4F',
                      fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: '500'
                    }}>
                      {p.stock_actual} uds
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => abrirEditar(p)}
                        style={{ background: '#E8F5EE', color: '#2D6A4F', padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex' }}
                        className="hover:opacity-80 transition-opacity">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => handleEliminar(p.id)}
                        style={{ background: '#FDE8E8', color: '#9B2C2C', padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex' }}
                        className="hover:opacity-80 transition-opacity">
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Preview imagen */}
            <label style={{ border: '1px dashed #C8EAD8', background: '#F7F7F5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px', borderRadius: '12px', cursor: 'pointer' }}
              className="hover:bg-[#E8F5EE] transition-colors">
              {preview ? (
                <img src={preview} alt="preview" style={{ height: '96px', objectFit: 'contain', borderRadius: '8px' }} />
              ) : (
                <>
                  <Upload size={20} style={{ color: '#52B788', marginBottom: '8px' }} />
                  <p style={{ fontSize: '13px', color: '#555' }}>Seleccionar imagen</p>
                </>
              )}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImagen} />
            </label>

            {/* Categoría */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '8px' }}>
                Categoría
              </label>
              <select value={form.categoria_id}
                onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                style={inputStyle}>
                <option value="">Seleccionar categoría</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>

            {/* Nombre */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '8px' }}>
                Nombre
              </label>
              <input type="text" value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre del producto" style={inputStyle} />
            </div>

            {/* Descripción */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '8px' }}>
                Descripción
              </label>
              <textarea value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Descripción del producto" rows={3}
                style={{ ...inputStyle, resize: 'none' }} />
            </div>

            {/* Precio + Stock */}
            <div className="grid grid-cols-3" style={{ gap: '12px' }}>
              {[
                { label: 'Precio',        key: 'precio',        placeholder: '0.00' },
                { label: 'Stock inicial', key: 'stock_inicial', placeholder: '0'    },
                { label: 'Stock mínimo',  key: 'stock_minimo',  placeholder: '5'    },
              ].map((f) => (
                <div key={f.key}>
                  <label style={{ fontSize: '12px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '8px' }}>
                    {f.label}
                  </label>
                  <input type="number" value={form[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder} style={inputStyle} />
                </div>
              ))}
            </div>

            {/* Destacado */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.destacado}
                onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                className="accent-[#52B788] w-4 h-4" />
              <span style={{ fontSize: '14px', color: '#555' }}>Producto destacado</span>
            </label>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
              <button onClick={() => setModal(false)}
                style={{ flex: 1, padding: '11px', borderRadius: '10px', fontSize: '14px', border: '1px solid #C8EAD8', color: '#555', background: '#fff', cursor: 'pointer' }}
                className="hover:bg-[#F7F7F5] transition-colors">
                Cancelar
              </button>
              <button onClick={handleGuardar} disabled={guardando}
                style={{ flex: 1, padding: '11px', borderRadius: '10px', fontSize: '14px', fontWeight: '500', background: guardando ? '#a0d4bc' : '#52B788', color: '#fff', border: 'none', cursor: 'pointer' }}
                className="hover:opacity-90 transition-opacity">
                {guardando ? 'Guardando...' : editando ? 'Actualizar' : 'Crear producto'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}