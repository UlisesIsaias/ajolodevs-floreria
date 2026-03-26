import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
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

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>Categorías</h1>
          <p className="text-sm mt-1" style={{ color: '#888' }}>{categorias.length} categorías registradas</p>
        </div>
        <button onClick={abrirCrear}
          style={{ background: '#52B788' }}
          className="text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:opacity-90">
          <Plus size={16} /> Nueva categoría
        </button>
      </div>

      {cargando ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ background: '#E8F5EE' }} className="h-24 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categorias.map((c) => (
            <div key={c.id}
              style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
              className="rounded-xl p-5">
              <div className="flex items-start justify-between mb-2">
                <div style={{ background: '#E8F5EE' }}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl">
                  🌸
                </div>
                <div className="flex gap-2">
                  <button onClick={() => abrirEditar(c)}
                    style={{ background: '#E8F5EE', color: '#2D6A4F' }}
                    className="p-1.5 rounded-lg hover:opacity-80">
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => handleEliminar(c.id)}
                    style={{ background: '#FDE8E8', color: '#9B2C2C' }}
                    className="p-1.5 rounded-lg hover:opacity-80">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <p className="font-medium text-sm mb-1" style={{ color: '#1A1A1A' }}>{c.nombre}</p>
              <p className="text-xs" style={{ color: '#888' }}>{c.descripcion || 'Sin descripción'}</p>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal titulo={editando ? 'Editar categoría' : 'Nueva categoría'} onClose={() => setModal(false)}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#555' }}>Nombre</label>
              <input type="text" value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre de la categoría"
                style={{ border: '0.5px solid #C8EAD8' }}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:border-[#52B788]" />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#555' }}>Descripción</label>
              <textarea value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                placeholder="Descripción de la categoría" rows={3}
                style={{ border: '0.5px solid #C8EAD8' }}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:border-[#52B788] resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(false)}
                style={{ border: '0.5px solid #C8EAD8', color: '#555' }}
                className="flex-1 py-2.5 rounded-xl text-sm hover:bg-[#F7F7F5] transition-colors">
                Cancelar
              </button>
              <button onClick={handleGuardar} disabled={guardando}
                style={{ background: guardando ? '#a0d4bc' : '#52B788' }}
                className="flex-1 text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90">
                {guardando ? 'Guardando...' : editando ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}