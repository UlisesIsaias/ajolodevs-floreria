import { useState, useEffect } from 'react';
import { Trash2, X, User, Shield, ShieldOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

function Modal({ titulo, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div style={{ background: '#fff', border: '1px solid #C8EAD8', borderRadius: '16px', width: '100%', maxWidth: '480px' }}>
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

export default function AdminUsuarios() {
  const [usuarios,  setUsuarios]  = useState([]);
  const [cargando,  setCargando]  = useState(true);
  const [modal,     setModal]     = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [form,      setForm]      = useState({});

  const cargar = async () => {
    try {
      const { data } = await api.get('/usuarios');
      setUsuarios(data);
    } catch {
      toast.error('Error al cargar usuarios');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const abrirDetalle = (u) => {
    setForm({
      nombre:   u.nombre,
      apellido: u.apellido,
      email:    u.email,
      telefono: u.telefono || '',
      rol:      u.rol,
      activo:   u.activo,
    });
    setModal(u);
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      await api.put(`/usuarios/${modal.id}`, form);
      toast.success('Usuario actualizado');
      setModal(null);
      cargar();
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al actualizar');
    } finally {
      setGuardando(false);
    }
  };

  const handleToggle = async (u) => {
    try {
      await api.patch(`/usuarios/${u.id}/toggle`);
      toast.success(u.activo ? 'Usuario desactivado' : 'Usuario activado');
      cargar();
    } catch {
      toast.error('Error al cambiar estado');
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return;
    try {
      await api.delete(`/usuarios/${id}`);
      toast.success('Usuario eliminado');
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
      <div>
        <h1 className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>Usuarios</h1>
        <p className="text-sm" style={{ color: '#888', marginTop: '6px' }}>
          {usuarios.length} usuarios registrados
        </p>
      </div>

      {/* Tabla */}
      {cargando ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ background: '#E8F5EE', borderRadius: '12px', height: '64px' }}
              className="animate-pulse" />
          ))}
        </div>
      ) : usuarios.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontSize: '14px', color: '#aaa' }}>No hay usuarios registrados</p>
        </div>
      ) : (
        <div style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', overflow: 'hidden' }}>
          <table className="w-full">
            <thead style={{ background: '#F7F7F5', borderBottom: '1px solid #C8EAD8' }}>
              <tr>
                {['Usuario', 'Email', 'Teléfono', 'Rol', 'Estado', 'Acciones'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '12px', fontWeight: '500', color: '#555' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < usuarios.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ background: '#E8F5EE', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#2D6A4F' }}>
                          {u.nombre.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A' }}>
                          {u.nombre} {u.apellido}
                        </p>
                        <p style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>
                          #{u.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#555' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#888' }}>
                    {u.telefono || '—'}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      background: u.rol === 'admin' ? '#E8F0FE' : '#E8F5EE',
                      color:      u.rol === 'admin' ? '#3B4FA8' : '#2D6A4F',
                      fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: '500'
                    }}>
                      {u.rol}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      background: u.activo ? '#E8F5EE' : '#FDE8E8',
                      color:      u.activo ? '#2D6A4F' : '#9B2C2C',
                      fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: '500'
                    }}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => abrirDetalle(u)}
                        style={{ background: '#E8F5EE', color: '#2D6A4F', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '500', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        className="hover:opacity-80 transition-opacity">
                        <User size={12} /> Ver
                      </button>
                      <button onClick={() => handleToggle(u)}
                        style={{ background: u.activo ? '#FEF9E7' : '#E8F5EE', color: u.activo ? '#B7770D' : '#2D6A4F', padding: '7px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex' }}
                        className="hover:opacity-80 transition-opacity">
                        {u.activo ? <ShieldOff size={13} /> : <Shield size={13} />}
                      </button>
                      <button onClick={() => handleEliminar(u.id)}
                        style={{ background: '#FDE8E8', color: '#9B2C2C', padding: '7px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex' }}
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

      {/* Modal detalle/edición */}
      {modal && (
        <Modal titulo={`${modal.nombre} ${modal.apellido}`} onClose={() => setModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#F7F7F5', borderRadius: '12px' }}>
              <div style={{ background: '#E8F5EE', width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '20px', fontWeight: '600', color: '#2D6A4F' }}>
                  {modal.nombre.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A' }}>
                  {modal.nombre} {modal.apellido}
                </p>
                <p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                  Registrado el {new Date(modal.creado_en).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Campos */}
            <div className="grid grid-cols-2" style={{ gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '8px' }}>Nombre</label>
                <input type="text" value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '8px' }}>Apellido</label>
                <input type="text" value={form.apellido}
                  onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                  style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '8px' }}>Email</label>
              <input type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle} />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '8px' }}>Teléfono</label>
              <input type="tel" value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                placeholder="—" style={inputStyle} />
            </div>

            <div className="grid grid-cols-2" style={{ gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '8px' }}>Rol</label>
                <select value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value })}
                  style={inputStyle}>
                  <option value="cliente">Cliente</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '8px' }}>Estado</label>
                <select value={form.activo}
                  onChange={(e) => setForm({ ...form, activo: e.target.value === 'true' })}
                  style={inputStyle}>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
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
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}