import { useState } from 'react';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function AdminReportes() {
  const hoy       = new Date().toISOString().split('T')[0];
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  const [fechaInicio, setFechaInicio] = useState(inicioMes);
  const [fechaFin,    setFechaFin]    = useState(hoy);
  const [resumen,     setResumen]     = useState(null);
  const [ventasDia,   setVentasDia]   = useState([]);
  const [topProds,    setTopProds]    = useState([]);
  const [porCat,      setPorCat]      = useState([]);
  const [cargando,    setCargando]    = useState(false);

  const buscar = async () => {
    if (!fechaInicio || !fechaFin) {
      toast.error('Selecciona el rango de fechas');
      return;
    }
    setCargando(true);
    try {
      const [{ data: res }, { data: dias }, { data: top }, { data: cat }] = await Promise.all([
        api.get(`/reportes/ventas?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`),
        api.get(`/reportes/ventas-por-dia?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`),
        api.get('/reportes/productos-top?limite=5'),
        api.get('/reportes/por-categoria'),
      ]);
      setResumen(res);
      setVentasDia(dias);
      setTopProds(top);
      setPorCat(cat);
    } catch {
      toast.error('Error al cargar reportes');
    } finally {
      setCargando(false);
    }
  };

  const inputStyle = {
    border: '1px solid #C8EAD8',
    padding: '11px 14px',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    background: '#fff',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', padding: '8px 0' }}>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>Reportes</h1>
        <p className="text-sm" style={{ color: '#888', marginTop: '6px' }}>Análisis de ventas e ingresos</p>
      </div>

      {/* Filtro fechas */}
      <div style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', padding: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '16px' }}>
        {[
          { label: 'Fecha inicio', value: fechaInicio, onChange: setFechaInicio },
          { label: 'Fecha fin',    value: fechaFin,    onChange: setFechaFin    },
        ].map((f) => (
          <div key={f.label}>
            <label style={{ fontSize: '12px', fontWeight: '500', color: '#555', display: 'block', marginBottom: '8px' }}>
              {f.label}
            </label>
            <input type="date" value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              style={inputStyle} />
          </div>
        ))}
        <button onClick={buscar} disabled={cargando}
          style={{ background: cargando ? '#a0d4bc' : '#52B788', color: '#fff', padding: '11px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}
          className="hover:opacity-90 transition-opacity">
          <Search size={15} />
          {cargando ? 'Buscando...' : 'Generar reporte'}
        </button>
      </div>

      {resumen && (
        <>
          {/* Métricas */}
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '16px' }}>
            {[
              { label: 'Total pedidos',    valor: resumen.total_pedidos    || 0 },
              { label: 'Ingresos totales', valor: `$${parseFloat(resumen.ingresos_totales || 0).toFixed(2)}` },
              { label: 'Ticket promedio',  valor: `$${parseFloat(resumen.ticket_promedio  || 0).toFixed(2)}` },
              { label: 'Venta máxima',     valor: `$${parseFloat(resumen.venta_maxima     || 0).toFixed(2)}` },
            ].map((m, i) => (
              <div key={i} style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', padding: '24px 20px' }}>
                <p style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>{m.label}</p>
                <p className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>{m.valor}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '20px' }}>

            {/* Ventas por día */}
            <div style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', padding: '28px 24px' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A', marginBottom: '20px' }}>
                Ventas por día
              </p>
              {ventasDia.length === 0 ? (
                <p style={{ fontSize: '14px', textAlign: 'center', color: '#aaa', padding: '32px 0' }}>Sin datos</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {ventasDia.map((v, i) => {
                    const max = Math.max(...ventasDia.map(x => parseFloat(x.ingresos)));
                    const pct = max > 0 ? (parseFloat(v.ingresos) / max) * 100 : 0;
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <p className="flex-shrink-0" style={{ fontSize: '12px', color: '#888', width: '64px' }}>
                          {new Date(v.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                        </p>
                        <div className="flex-1" style={{ background: '#F7F7F5', height: '24px', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, background: '#52B788', height: '100%', borderRadius: '6px', transition: 'all 0.3s' }} />
                        </div>
                        <p className="flex-shrink-0 text-right" style={{ fontSize: '12px', color: '#555', width: '72px' }}>
                          ${parseFloat(v.ingresos).toFixed(0)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Por categoría */}
            <div style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', padding: '28px 24px' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A', marginBottom: '20px' }}>
                Ventas por categoría
              </p>
              {porCat.length === 0 ? (
                <p style={{ fontSize: '14px', textAlign: 'center', color: '#aaa', padding: '32px 0' }}>Sin datos</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {porCat.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F0F0F0', padding: '12px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ background: '#52B788', width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' }} />
                        <p style={{ fontSize: '14px', color: '#1A1A1A' }}>{c.categoria}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '12px', fontWeight: '500', color: '#52B788' }}>
                          ${parseFloat(c.ingresos).toFixed(2)}
                        </p>
                        <p style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>
                          {c.total_ventas} ventas
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Productos top */}
          <div style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', padding: '28px 24px' }}>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A', marginBottom: '20px' }}>
              Top 5 productos más vendidos
            </p>
            {topProds.length === 0 ? (
              <p style={{ fontSize: '14px', textAlign: 'center', color: '#aaa', padding: '16px 0' }}>Sin datos</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-5" style={{ gap: '16px' }}>
                {topProds.map((p, i) => (
                  <div key={i} style={{ border: '1px solid #C8EAD8', background: '#F7F7F5', borderRadius: '12px', padding: '20px 16px', textAlign: 'center' }}>
                    <span style={{ background: '#E8F5EE', color: '#2D6A4F', fontSize: '12px', fontWeight: '500', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                      {i + 1}
                    </span>
                    <p style={{ fontSize: '12px', fontWeight: '500', color: '#1A1A1A', marginBottom: '8px' }}>
                      {p.nombre_producto}
                    </p>
                    <p style={{ fontSize: '22px', fontWeight: '600', color: '#52B788' }}>
                      {p.total_vendido}
                    </p>
                    <p style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>vendidos</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}