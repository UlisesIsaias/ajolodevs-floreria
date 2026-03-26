import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [resumen,  setResumen]  = useState(null);
  const [ventas,   setVentas]   = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const hoy   = new Date();
        const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().split('T')[0];
        const fin    = hoy.toISOString().split('T')[0];

        const [{ data: res }, { data: ven }, { data: top }] = await Promise.all([
          api.get('/reportes/dashboard'),
          api.get(`/reportes/ventas-por-dia?fecha_inicio=${inicio}&fecha_fin=${fin}`),
          api.get('/reportes/productos-top?limite=5'),
        ]);
        setResumen(res);
        setVentas(ven);
        setTopProductos(top);
      } catch {
        toast.error('Error al cargar dashboard');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  if (cargando) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ background: '#E8F5EE' }} className="h-24 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      label:  'Ventas hoy',
      valor:  `$${parseFloat(resumen?.pedidos_hoy?.ventas_hoy || 0).toFixed(2)}`,
      sub:    `${resumen?.pedidos_hoy?.pedidos_hoy || 0} pedidos`,
      icono:  <TrendingUp size={18} />,
      color:  '#52B788',
      bg:     '#E8F5EE',
    },
    {
      label:  'Pedidos pendientes',
      valor:  resumen?.pedidos_pendientes?.pedidos_pendientes || 0,
      sub:    'Por atender',
      icono:  <ShoppingBag size={18} />,
      color:  '#B7770D',
      bg:     '#FEF9E7',
    },
    {
      label:  'Stock bajo',
      valor:  resumen?.productos_stock_bajo?.productos_stock_bajo || 0,
      sub:    'Productos por reabastecer',
      icono:  <AlertTriangle size={18} />,
      color:  '#9B2C2C',
      bg:     '#FDE8E8',
    },
    {
      label:  'Total clientes',
      valor:  resumen?.total_clientes?.total_clientes || 0,
      sub:    'Clientes registrados',
      icono:  <Users size={18} />,
      color:  '#3B4FA8',
      bg:     '#E8F0FE',
    },
  ];

  return (
    <div className="flex flex-col gap-8">

      {/* Título */}
      <div>
        <h1 className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#888' }}>
          {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={i} style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
            className="rounded-xl p-5">
            <div style={{ background: c.bg, color: c.color }}
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3">
              {c.icono}
            </div>
            <p className="text-2xl font-medium mb-1" style={{ color: '#1A1A1A' }}>{c.valor}</p>
            <p className="text-xs font-medium mb-0.5" style={{ color: '#555' }}>{c.label}</p>
            <p className="text-xs" style={{ color: '#aaa' }}>{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Ventas del mes */}
        <div style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
          className="rounded-xl p-6">
          <p className="text-sm font-medium mb-5" style={{ color: '#1A1A1A' }}>
            Ventas del mes
          </p>
          {ventas.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: '#aaa' }}>
              Sin ventas este mes
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {ventas.slice(-7).map((v, i) => {
                const maxIngresos = Math.max(...ventas.map(x => parseFloat(x.ingresos)));
                const pct = maxIngresos > 0 ? (parseFloat(v.ingresos) / maxIngresos) * 100 : 0;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <p className="text-xs w-16 flex-shrink-0" style={{ color: '#888' }}>
                      {new Date(v.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                    </p>
                    <div className="flex-1 h-6 rounded-lg overflow-hidden"
                      style={{ background: '#F7F7F5' }}>
                      <div style={{ width: `${pct}%`, background: '#52B788' }}
                        className="h-full rounded-lg transition-all" />
                    </div>
                    <p className="text-xs w-16 text-right flex-shrink-0" style={{ color: '#555' }}>
                      ${parseFloat(v.ingresos).toFixed(0)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Productos top */}
        <div style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
          className="rounded-xl p-6">
          <p className="text-sm font-medium mb-5" style={{ color: '#1A1A1A' }}>
            Productos más vendidos
          </p>
          {topProductos.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: '#aaa' }}>
              Sin ventas registradas
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {topProductos.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2"
                  style={{ borderBottom: '0.5px solid #F0F0F0' }}>
                  <div className="flex items-center gap-3">
                    <span style={{ background: '#E8F5EE', color: '#2D6A4F' }}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                      {i + 1}
                    </span>
                    <p className="text-sm" style={{ color: '#1A1A1A' }}>{p.nombre_producto}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium" style={{ color: '#52B788' }}>
                      {p.total_vendido} vendidos
                    </p>
                    <p className="text-xs" style={{ color: '#aaa' }}>
                      ${parseFloat(p.ingresos_generados).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Accesos rápidos */}
      <div style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
        className="rounded-xl p-6">
        <p className="text-sm font-medium mb-4" style={{ color: '#1A1A1A' }}>Accesos rápidos</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/admin/pedidos',    label: 'Ver pedidos',    color: '#FEF9E7', text: '#B7770D' },
            { to: '/admin/productos',  label: 'Productos',      color: '#E8F5EE', text: '#2D6A4F' },
            { to: '/admin/inventario', label: 'Inventario',     color: '#FDE8E8', text: '#9B2C2C' },
            { to: '/admin/reportes',   label: 'Reportes',       color: '#E8F0FE', text: '#3B4FA8' },
          ].map((a, i) => (
            <Link key={i} to={a.to}
              style={{ background: a.color, color: a.text }}
              className="py-3 px-4 rounded-xl text-sm font-medium text-center hover:opacity-80 transition-opacity">
              {a.label}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}