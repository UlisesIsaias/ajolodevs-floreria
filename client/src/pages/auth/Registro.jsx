import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Registro() {
  const [form, setForm]         = useState({ nombre: '', apellido: '', email: '', password: '', telefono: '' });
  const [verPass, setVerPass]   = useState(false);
  const [cargando, setCargando] = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido || !form.email || !form.password) {
      toast.error('Completa todos los campos obligatorios');
      return;
    }
    if (form.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setCargando(true);
    try {
      const { data } = await api.post('/auth/registro', form);
      login(data.token, data.usuario);
      toast.success('¡Cuenta creada exitosamente!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al crear cuenta');
    } finally {
      setCargando(false);
    }
  };

  const inputStyle = {
    border: '1.5px solid #C8EAD8',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    background: '#fff',
    boxSizing: 'border-box'
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: '#F7F7F5' }}>
      <div className="w-full max-w-md rounded-2xl"
        style={{ background: '#fff', border: '1px solid #C8EAD8', padding: '48px 40px' }}>

        {/* Header */}
        <div className="text-center" style={{ marginBottom: '36px' }}>
          <img src="/logo.png" alt="AjoloDevs"
            className="mx-auto mb-5"
            style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
          <h1 className="text-xl font-medium" style={{ color: '#1A1A1A' }}>Crear cuenta</h1>
          <p className="text-sm" style={{ color: '#888', marginTop: '6px' }}>Únete a AjoloDevs Florería</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: '20px' }}>

          <div className="grid grid-cols-2" style={{ gap: '12px' }}>
            <div>
              <label className="text-xs font-medium block" style={{ color: '#555', marginBottom: '8px' }}>
                Nombre <span style={{ color: '#52B788' }}>*</span>
              </label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange}
                placeholder="Juan" style={inputStyle} />
            </div>
            <div>
              <label className="text-xs font-medium block" style={{ color: '#555', marginBottom: '8px' }}>
                Apellido <span style={{ color: '#52B788' }}>*</span>
              </label>
              <input type="text" name="apellido" value={form.apellido} onChange={handleChange}
                placeholder="Pérez" style={inputStyle} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium block" style={{ color: '#555', marginBottom: '8px' }}>
              Correo electrónico <span style={{ color: '#52B788' }}>*</span>
            </label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="tu@correo.com" style={inputStyle} />
          </div>

          <div>
            <label className="text-xs font-medium block" style={{ color: '#555', marginBottom: '8px' }}>
              Teléfono
            </label>
            <input type="tel" name="telefono" value={form.telefono} onChange={handleChange}
              placeholder="1234567890" style={inputStyle} />
          </div>

          <div>
            <label className="text-xs font-medium block" style={{ color: '#555', marginBottom: '8px' }}>
              Contraseña <span style={{ color: '#52B788' }}>*</span>
            </label>
            <div className="relative">
              <input
                type={verPass ? 'text' : 'password'}
                name="password" value={form.password} onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                style={{ ...inputStyle, padding: '12px 40px 12px 16px' }} />
              <button type="button" onClick={() => setVerPass(!verPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#888' }}>
                {verPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={cargando}
            style={{
              background: cargando ? '#a0d4bc' : '#52B788',
              padding: '13px',
              borderRadius: '10px',
              marginTop: '4px'
            }}
            className="w-full text-white text-sm font-medium hover:opacity-90 transition-opacity">
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

        </form>

        <p className="text-center text-xs" style={{ color: '#888', marginTop: '28px' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: '#52B788' }} className="font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>

      </div>
    </div>
  );
}