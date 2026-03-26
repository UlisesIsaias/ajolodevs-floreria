import { useState } from 'react';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function AdminReportes() {
  const hoy        = new Date().toISOString().split('T')[0];
  const inicioMes  = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

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

  return (
    <div className="flex flex-col gap-6">

      <div>
        <h1 className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>Reportes</h1>
        <p className="text-sm mt-1" style={{ color: '#888' }}>Análisis de ventas e ingresos</p>
      </div>

      {/* Filtro fechas */}
      <div style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
        className="rounded-xl p-5 flex flex-wrap items-end gap-4">
        {[
          { label: 'Fecha inicio', value: fechaInicio, onChange: setFechaInicio },
          { label: 'Fecha fin',    value: fechaFin,    onChange: setFechaFin    },
        ].map((f) => (
          <div key={f.label}>
            <label className="text-xs font-medium block mb-1" style={{ color: '#555' }}>{f.label}</label>
            <input type="date" value={f.value} onChange={(e) => f.onChange(e.target.value)}
              style={{ border: '0.5px solid #C8EAD8' }}
              className="px-3 py-2 rounded-lg text-sm outline-none focus:border-[#52B788]" />
          </div>
        ))}
        <button onClick={buscar} disabled={cargando}
          style={{ background: cargando ? '#a0d4bc' : '#52B788' }}
          className="text-white px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:opacity-90">
          <Search size={15} />
          {cargando ? 'Buscando...' : 'Generar reporte'}
        </button>
      </div>

      {resumen && (
        <>
          {/* Métricas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total pedidos',    valor: resumen.total_pedidos    || 0 },
              { label: 'Ingresos totales', valor: `$${parseFloat(resumen.ingresos_totales || 0).toFixed(2)}` },
              { label: 'Ticket promedio',  valor: `$${parseFloat(resumen.ticket_promedio  || 0).toFixed(2)}` },
              { label: 'Venta máxima',     valor: `$${parseFloat(resumen.venta_maxima     || 0).toFixed(2)}` },
            ].map((m, i) => (
              <div key={i} style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
                className="rounded-xl p-5">
                <p className="text-xs mb-2" style={{ color: '#888' }}>{m.label}</p>
                <p className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>{m.valor}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Ventas por día */}
            <div style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
              className="rounded-xl p-6">
              <p className="text-sm font-medium mb-5" style={{ color: '#1A1A1A' }}>Ventas por día</p>
              {ventasDia.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: '#aaa' }}>Sin datos</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {ventasDia.map((v, i) => {
                    const max = Math.max(...ventasDia.map(x => parseFloat(x.ingresos)));
                    const pct = max > 0 ? (parseFloat(v.ingresos) / max) * 100 : 0;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <p className="text-xs w-16 flex-shrink-0" style={{ color: '#888' }}>
                          {new Date(v.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                        </p>
                        <div className="flex-1 h-6 rounded-lg" style={{ background: '#F7F7F5' }}>
                          <div style={{ width: `${pct}%`, background: '#52B788' }}
                            className="h-full rounded-lg" />
                        </div>
                        <p className="text-xs w-20 text-right flex-shrink-0" style={{ color: '#555' }}>
                          ${parseFloat(v.ingresos).toFixed(0)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Por categoría */}
            <div style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
              className="rounded-xl p-6">
              <p className="text-sm font-medium mb-5" style={{ color: '#1A1A1A' }}>Ventas por categoría</p>
              {porCat.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: '#aaa' }}>Sin datos</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {porCat.map((c, i) => (
                    <div key={i} className="flex items-center justify-between py-2"
                      style={{ borderBottom: '0.5px solid #F0F0F0' }}>
                      <div className="flex items-center gap-2">
                        <span style={{ background: '#E8F5EE' }}
                          className="w-2 h-2 rounded-full inline-block" />
                        <p className="text-sm" style={{ color: '#1A1A1A' }}>{c.categoria}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium" style={{ color: '#52B788' }}>
                          ${parseFloat(c.ingresos).toFixed(2)}
                        </p>
                        <p className="text-xs" style={{ color: '#aaa' }}>{c.total_ventas} ventas</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Productos top */}
          <div style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
            className="rounded-xl p-6">
            <p className="text-sm font-medium mb-5" style={{ color: '#1A1A1A' }}>
              Top 5 productos más vendidos
            </p>
            {topProds.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: '#aaa' }}>Sin datos</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {topProds.map((p, i) => (
                  <div key={i} style={{ border: '0.5px solid #C8EAD8', background: '#F7F7F5' }}
                    className="rounded-xl p-4 text-center">
                    <span style={{ background: '#E8F5EE', color: '#2D6A4F' }}
                      className="text-xs font-medium w-7 h-7 rounded-full flex items-center justify-center mx-auto mb-3">
                      {i + 1}
                    </span>
                    <p className="text-xs font-medium mb-1" style={{ color: '#1A1A1A' }}>
                      {p.nombre_producto}
                    </p>
                    <p className="text-lg font-medium" style={{ color: '#52B788' }}>
                      {p.total_vendido}
                    </p>
                    <p className="text-xs" style={{ color: '#aaa' }}>vendidos</p>
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