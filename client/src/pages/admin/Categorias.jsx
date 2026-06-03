import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
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

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargando,   setCargando]   = useState(true);
  const [modal,      setModal]      = useState(false);
  const [editando,   setEditando]   = useState(null);
  const [form,       setForm]       = useState({ nombre: '', descripcion: '' });
  const [guardando,  setGuardando]  = useState(false);

  const cargar = async () => {
    try {
      const { data } = await api.get('/categorias');
      setCategorias(data);
    } catch {
      toast.error('Error al cargar categorías');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const abrirCrear = () => {
    setEditando(null);
    setForm({ nombre: '', descripcion: '' });
    setModal(true);
  };

  const abrirEditar = (c) => {
    setEditando(c);
    setForm({ nombre: c.nombre, descripcion: c.descripcion || '' });
    setModal(true);
  };

  const handleGuardar = async () => {
    if (!form.nombre) {
      toast.error('El nombre es obligatorio');
      return;
    }
    setGuardando(true);
    try {
      if (editando) {
        await api.put(`/categorias/${editando.id}`, form);
        toast.success('Categoría actualizada');
      } else {
        await api.post('/categorias', form);
        toast.success('Categoría creada');
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
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await api.delete(`/categorias/${id}`);
      toast.success('Categoría eliminada');
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
          <h1 className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>Categorías</h1>
          <p className="text-sm" style={{ color: '#888', marginTop: '6px' }}>
            {categorias.length} categorías registradas
          </p>
        </div>
        <button onClick={abrirCrear}
          style={{ background: '#52B788', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}
          className="hover:opacity-90 transition-opacity">
          <Plus size={16} /> Nueva categoría
        </button>
      </div>

      {/* Grid */}
      {cargando ? (
        <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: '16px' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ background: '#E8F5EE', borderRadius: '12px', height: '96px' }}
              className="animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: '16px' }}>
          {categorias.map((c) => (
            <div key={c.id}
              style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ background: '#E8F5EE', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  🌸
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => abrirEditar(c)}
                    style={{ background: '#E8F5EE', color: '#2D6A4F', padding: '6px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex' }}
                    className="hover:opacity-80">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => handleEliminar(c.id)}
                    style={{ background: '#FDE8E8', color: '#9B2C2C', padding: '6px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex' }}
                    className="hover:opacity-80">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <p style={{ fontWeight: '500', fontSize: '14px', color: '#1A1A1A', marginBottom: '6px' }}>{c.nombre}</p>
              <p style={{ fontSize: '12px', color: '#888' }}>{c.descripcion || 'Sin descripción'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <Modal titulo={editando ? 'Editar categoría' : 'Nueva categoría'} onClose={() => setModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '8px' }}>
                Nombre
              </label>
              <input type="text" value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre de la categoría"
                style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '8px' }}>
                Descripción
              </label>
              <textarea value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Descripción de la categoría" rows={3}
                style={{ ...inputStyle, resize: 'none', padding: '11px 14px' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
              <button onClick={() => setModal(false)}
                style={{ flex: 1, padding: '11px', borderRadius: '10px', fontSize: '14px', border: '1px solid #C8EAD8', color: '#555', background: '#fff', cursor: 'pointer' }}
                className="hover:bg-[#F7F7F5] transition-colors">
                Cancelar
              </button>
              <button onClick={handleGuardar} disabled={guardando}
                style={{ flex: 1, padding: '11px', borderRadius: '10px', fontSize: '14px', fontWeight: '500', background: guardando ? '#a0d4bc' : '#52B788', color: '#fff', border: 'none', cursor: 'pointer' }}
                className="hover:opacity-90 transition-opacity">
                {guardando ? 'Guardando...' : editando ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}