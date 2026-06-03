import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [resumen,      setResumen]      = useState(null);
  const [ventas,       setVentas]       = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [cargando,     setCargando]     = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const hoy    = new Date();
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: '16px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ background: '#E8F5EE', borderRadius: '12px', height: '96px' }}
              className="animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: 'Ventas hoy',
      valor: `$${parseFloat(resumen?.pedidos_hoy?.ventas_hoy || 0).toFixed(2)}`,
      sub:   `${resumen?.pedidos_hoy?.pedidos_hoy || 0} pedidos`,
      icono: <TrendingUp size={18} />,
      color: '#52B788',
      bg:    '#E8F5EE',
    },
    {
      label: 'Pedidos pendientes',
      valor: resumen?.pedidos_pendientes?.pedidos_pendientes || 0,
      sub:   'Por atender',
      icono: <ShoppingBag size={18} />,
      color: '#B7770D',
      bg:    '#FEF9E7',
    },
    {
      label: 'Stock bajo',
      valor: resumen?.productos_stock_bajo?.productos_stock_bajo || 0,
      sub:   'Productos por reabastecer',
      icono: <AlertTriangle size={18} />,
      color: '#9B2C2C',
      bg:    '#FDE8E8',
    },
    {
      label: 'Total clientes',
      valor: resumen?.total_clientes?.total_clientes || 0,
      sub:   'Clientes registrados',
      icono: <Users size={18} />,
      color: '#3B4FA8',
      bg:    '#E8F0FE',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '8px 0' }}>

      {/* Título */}
      <div>
        <h1 className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>Dashboard</h1>
        <p className="text-sm" style={{ color: '#888', marginTop: '6px' }}>
          {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: '16px' }}>
        {cards.map((c, i) => (
          <div key={i} style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', padding: '24px 20px' }}>
            <div style={{ background: c.bg, color: c.color, width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              {c.icono}
            </div>
            <p className="text-2xl font-medium" style={{ color: '#1A1A1A', marginBottom: '4px' }}>{c.valor}</p>
            <p className="text-xs font-medium" style={{ color: '#555', marginBottom: '2px' }}>{c.label}</p>
            <p className="text-xs" style={{ color: '#aaa' }}>{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '20px' }}>

        {/* Ventas del mes */}
        <div style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', padding: '28px 24px' }}>
          <p className="text-sm font-medium" style={{ color: '#1A1A1A', marginBottom: '20px' }}>
            Ventas del mes
          </p>
          {ventas.length === 0 ? (
            <p className="text-sm text-center" style={{ color: '#aaa', padding: '32px 0' }}>
              Sin ventas este mes
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ventas.slice(-7).map((v, i) => {
                const maxIngresos = Math.max(...ventas.map(x => parseFloat(x.ingresos)));
                const pct = maxIngresos > 0 ? (parseFloat(v.ingresos) / maxIngresos) * 100 : 0;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <p className="text-xs flex-shrink-0" style={{ color: '#888', width: '64px' }}>
                      {new Date(v.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                    </p>
                    <div className="flex-1 overflow-hidden" style={{ background: '#F7F7F5', height: '24px', borderRadius: '6px' }}>
                      <div style={{ width: `${pct}%`, background: '#52B788', height: '100%', borderRadius: '6px', transition: 'all 0.3s' }} />
                    </div>
                    <p className="text-xs flex-shrink-0 text-right" style={{ color: '#555', width: '64px' }}>
                      ${parseFloat(v.ingresos).toFixed(0)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Productos top */}
        <div style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', padding: '28px 24px' }}>
          <p className="text-sm font-medium" style={{ color: '#1A1A1A', marginBottom: '20px' }}>
            Productos más vendidos
          </p>
          {topProductos.length === 0 ? (
            <p className="text-sm text-center" style={{ color: '#aaa', padding: '32px 0' }}>
              Sin ventas registradas
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {topProductos.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F0F0F0', padding: '12px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ background: '#E8F5EE', color: '#2D6A4F', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '500' }}>
                      {i + 1}
                    </span>
                    <p className="text-sm" style={{ color: '#1A1A1A' }}>{p.nombre_producto}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium" style={{ color: '#52B788' }}>{p.total_vendido} vendidos</p>
                    <p className="text-xs" style={{ color: '#aaa' }}>${parseFloat(p.ingresos_generados).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Accesos rápidos */}
      <div style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', padding: '28px 24px' }}>
        <p className="text-sm font-medium" style={{ color: '#1A1A1A', marginBottom: '16px' }}>Accesos rápidos</p>
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '12px' }}>
          {[
            { to: '/admin/pedidos',    label: 'Ver pedidos', color: '#FEF9E7', text: '#B7770D' },
            { to: '/admin/productos',  label: 'Productos',   color: '#E8F5EE', text: '#2D6A4F' },
            { to: '/admin/inventario', label: 'Inventario',  color: '#FDE8E8', text: '#9B2C2C' },
            { to: '/admin/reportes',   label: 'Reportes',    color: '#E8F0FE', text: '#3B4FA8' },
          ].map((a, i) => (
            <Link key={i} to={a.to}
              style={{ background: a.color, color: a.text, padding: '14px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '500', textAlign: 'center', textDecoration: 'none' }}
              className="hover:opacity-80 transition-opacity">
              {a.label}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}