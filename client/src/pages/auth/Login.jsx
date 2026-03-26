import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [form, setForm]         = useState({ email: '', password: '' });
  const [verPass, setVerPass]   = useState(false);
  const [cargando, setCargando] = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Completa todos los campos');
      return;
    }
    setCargando(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.usuario);
      toast.success(`¡Bienvenido ${data.usuario.nombre}!`);
      navigate(data.usuario.rol === 'admin' ? '/admin' : '/');
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#F7F7F5' }}>
      <div style={{ background: '#fff', border: '0.5px solid #C8EAD8' }}
        className="w-full max-w-md rounded-2xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div style={{ background: '#52B788' }}
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="4" fill="white"/>
              <ellipse cx="16" cy="9"  rx="3" ry="5" fill="white" opacity="0.9"/>
              <ellipse cx="16" cy="23" rx="3" ry="5" fill="white" opacity="0.9"/>
              <ellipse cx="9"  cy="16" rx="5" ry="3" fill="white" opacity="0.9"/>
              <ellipse cx="23" cy="16" rx="5" ry="3" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <h1 className="text-xl font-medium" style={{ color: '#1A1A1A' }}>Bienvenido de nuevo</h1>
          <p className="text-sm mt-1" style={{ color: '#888' }}>Ingresa a tu cuenta</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: '#555' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@correo.com"
              style={{ border: '0.5px solid #C8EAD8' }}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#52B788] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: '#555' }}>
              Contraseña
            </label>
            <div className="relative">
              <input
                type={verPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{ border: '0.5px solid #C8EAD8' }}
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none focus:border-[#52B788] transition-colors pr-10"
              />
              <button type="button" onClick={() => setVerPass(!verPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#888' }}>
                {verPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={cargando}
            style={{ background: cargando ? '#a0d4bc' : '#52B788' }}
            className="w-full text-white py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 mt-2">
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

        </form>

        <p className="text-center text-xs mt-6" style={{ color: '#888' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" style={{ color: '#52B788' }} className="font-medium hover:underline">
            Regístrate aquí
          </Link>
        </p>

      </div>
    </div>
  );
}