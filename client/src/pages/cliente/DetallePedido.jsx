import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const estatusColor = {
  pendiente:  { bg: '#FEF9E7', color: '#B7770D' },
  en_proceso: { bg: '#E8F5EE', color: '#2D6A4F' },
  enviado:    { bg: '#E8F0FE', color: '#3B4FA8' },
  entregado:  { bg: '#E8F5EE', color: '#1a6b3a' },
  cancelado:  { bg: '#FDE8E8', color: '#9B2C2C' },
};

const pasos = ['pendiente', 'en_proceso', 'enviado', 'entregado'];

export default function DetallePedido() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [pedido,    setPedido]    = useState(null);
  const [pago,      setPago]      = useState(null);
  const [cargando,  setCargando]  = useState(true);
  const [referencia, setReferencia] = useState('');
  const [archivo,   setArchivo]   = useState(null);
  const [subiendo,  setSubiendo]  = useState(false);

  const cargar = async () => {
    try {
      const [{ data: pedidoData }, { data: pagoData }] = await Promise.all([
        api.get(`/pedidos/${id}`),
        api.get(`/pagos/${id}`),
      ]);
      setPedido(pedidoData);
      setPago(pagoData);
    } catch {
      toast.error('Error al cargar pedido');
      navigate('/mis-pedidos');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, [id]);

  const handleSubirComprobante = async () => {
    if (!referencia) {
      toast.error('Ingresa el número de referencia');
      return;
    }
    setSubiendo(true);
    try {
      const formData = new FormData();
      formData.append('referencia', referencia);
      if (archivo) formData.append('comprobante', archivo);
      await api.post(`/pagos/${id}/comprobante`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Comprobante enviado correctamente');
      cargar();
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al subir comprobante');
    } finally {
      setSubiendo(false);
    }
  };

  if (cargando) {
    return (
      <div style={{ maxWidth: '896px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ background: '#E8F5EE', borderRadius: '16px', height: '384px' }} className="animate-pulse" />
      </div>
    );
  }

  if (!pedido) return null;

  const { pedido: info, items, historial } = pedido;
  const estilo     = estatusColor[info.estatus] || estatusColor.pendiente;
  const pasoActual = pasos.indexOf(info.estatus);

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
    <div style={{ maxWidth: '896px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => navigate('/mis-pedidos')}
          style={{ color: '#888', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
          className="hover:text-[#52B788] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '500', color: '#1A1A1A' }}>
            Pedido #{info.id}
          </h1>
          <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
            {new Date(info.creado_en).toLocaleDateString('es-MX', {
              day: '2-digit', month: 'long', year: 'numeric'
            })}
          </p>
        </div>
        <span style={{ background: estilo.bg, color: estilo.color, fontSize: '12px', fontWeight: '500', padding: '6px 14px', borderRadius: '20px', marginLeft: 'auto', textTransform: 'capitalize' }}>
          {info.estatus.replace('_', ' ')}
        </span>
      </div>

      {/* Progreso */}
      {info.estatus !== 'cancelado' && (
        <div style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', padding: '28px 24px', marginBottom: '24px' }}>
          <p style={{ fontSize: '13px', fontWeight: '500', color: '#555', marginBottom: '20px' }}>
            Estado del pedido
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {pasos.map((paso, i) => (
              <div key={paso} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    background: i <= pasoActual ? '#52B788' : '#E8F5EE',
                    border: `1px solid ${i <= pasoActual ? '#52B788' : '#C8EAD8'}`,
                    width: '36px', height: '36px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {i <= pasoActual
                      ? <CheckCircle size={16} color="white" />
                      : <Clock size={14} style={{ color: '#aaa' }} />}
                  </div>
                  <p style={{ fontSize: '11px', marginTop: '8px', textTransform: 'capitalize', color: i <= pasoActual ? '#52B788' : '#aaa' }}>
                    {paso.replace('_', ' ')}
                  </p>
                </div>
                {i < pasos.length - 1 && (
                  <div style={{ background: i < pasoActual ? '#52B788' : '#C8EAD8', flex: 1, height: '2px', margin: '0 8px', marginBottom: '20px' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '20px' }}>

        {/* Items + comprobante */}
        <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Productos */}
          <div style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', padding: '24px' }}>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A', marginBottom: '16px' }}>
              Productos ({items.length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F0F0F0' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A' }}>
                      {item.nombre_producto}
                    </p>
                    <p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                      ${parseFloat(item.precio_unitario).toFixed(2)} x {item.cantidad}
                    </p>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#52B788' }}>
                    ${parseFloat(item.subtotal).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #C8EAD8' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A' }}>Total</p>
              <p style={{ fontSize: '20px', fontWeight: '600', color: '#52B788' }}>
                ${parseFloat(info.total).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Comprobante */}
          {info.metodo_pago === 'transferencia' && pago?.estatus === 'pendiente' && (
            <div style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', padding: '24px' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A', marginBottom: '6px' }}>
                Subir comprobante de pago
              </p>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
                Transfiere a la cuenta CLABE: <strong>123456789012345678</strong> y sube tu comprobante
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Número de referencia de la transferencia"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  style={inputStyle}
                />
                <label style={{ border: '1px dashed #C8EAD8', background: '#F7F7F5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px', borderRadius: '12px', cursor: 'pointer' }}
                  className="hover:bg-[#E8F5EE] transition-colors">
                  <Upload size={20} style={{ color: '#52B788', marginBottom: '8px' }} />
                  <p style={{ fontSize: '13px', color: '#555' }}>
                    {archivo ? archivo.name : 'Seleccionar comprobante (imagen)'}
                  </p>
                  <input type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={(e) => setArchivo(e.target.files[0])} />
                </label>
                <button onClick={handleSubirComprobante} disabled={subiendo}
                  style={{ background: subiendo ? '#a0d4bc' : '#52B788', width: '100%', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: '500', color: '#fff', border: 'none', cursor: 'pointer' }}
                  className="hover:opacity-90 transition-opacity">
                  {subiendo ? 'Enviando...' : 'Enviar comprobante'}
                </button>
              </div>
            </div>
          )}

          {/* Estado del pago */}
          {pago && pago.estatus !== 'pendiente' && (
            <div style={{
              border: `1px solid ${pago.estatus === 'confirmado' ? '#C8EAD8' : '#FED7D7'}`,
              background: pago.estatus === 'confirmado' ? '#E8F5EE' : '#FFF5F5',
              borderRadius: '12px', padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <CheckCircle size={18} style={{ color: pago.estatus === 'confirmado' ? '#52B788' : '#e53e3e' }} />
              <p style={{ fontSize: '14px', fontWeight: '500', color: pago.estatus === 'confirmado' ? '#2D6A4F' : '#9B2C2C' }}>
                {pago.estatus === 'confirmado'  ? 'Pago confirmado' :
                 pago.estatus === 'verificando' ? 'Pago en verificación' :
                 'Pago rechazado — vuelve a enviar tu comprobante'}
              </p>
            </div>
          )}
        </div>

        {/* Historial */}
        <div style={{ border: '1px solid #C8EAD8', background: '#fff', borderRadius: '12px', padding: '24px', height: 'fit-content' }}>
          <p style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A1A', marginBottom: '20px' }}>Historial</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {historial.map((h, i) => (
              <div key={h.id} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ background: '#52B788', width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '4px' }} />
                  {i < historial.length - 1 && (
                    <div style={{ background: '#C8EAD8', width: '1px', flex: 1, marginTop: '4px' }} />
                  )}
                </div>
                <div style={{ paddingBottom: '16px' }}>
                  <p style={{ fontSize: '13px', fontWeight: '500', textTransform: 'capitalize', color: '#1A1A1A' }}>
                    {h.estatus.replace('_', ' ')}
                  </p>
                  {h.comentario && (
                    <p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{h.comentario}</p>
                  )}
                  <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                    {new Date(h.creado_en).toLocaleDateString('es-MX', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}