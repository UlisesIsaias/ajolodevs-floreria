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
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div style={{ background: '#E8F5EE' }} className="h-96 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!pedido) return null;

  const { pedido: info, items, historial } = pedido;
  const estilo   = estatusColor[info.estatus] || estatusColor.pendiente;
  const pasoActual = pasos.indexOf(info.estatus);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/mis-pedidos')}
          style={{ color: '#888' }} className="hover:text-[#52B788] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-medium" style={{ color: '#1A1A1A' }}>
            Pedido #{info.id}
          </h1>
          <p className="text-sm" style={{ color: '#888' }}>
            {new Date(info.creado_en).toLocaleDateString('es-MX', {
              day: '2-digit', month: 'long', year: 'numeric'
            })}
          </p>
        </div>
        <span style={{ background: estilo.bg, color: estilo.color }}
          className="ml-auto text-xs font-medium px-3 py-1.5 rounded-full">
          {info.estatus.replace('_', ' ')}
        </span>
      </div>

      {/* Progreso */}
      {info.estatus !== 'cancelado' && (
        <div style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
          className="rounded-xl p-6 mb-6">
          <p className="text-xs font-medium mb-4" style={{ color: '#555' }}>Estado del pedido</p>
          <div className="flex items-center justify-between">
            {pasos.map((paso, i) => (
              <div key={paso} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div style={{
                    background: i <= pasoActual ? '#52B788' : '#E8F5EE',
                    border: `0.5px solid ${i <= pasoActual ? '#52B788' : '#C8EAD8'}`
                  }} className="w-8 h-8 rounded-full flex items-center justify-center">
                    {i <= pasoActual
                      ? <CheckCircle size={16} color="white" />
                      : <Clock size={14} style={{ color: '#aaa' }} />}
                  </div>
                  <p className="text-xs mt-2 capitalize" style={{
                    color: i <= pasoActual ? '#52B788' : '#aaa'
                  }}>
                    {paso.replace('_', ' ')}
                  </p>
                </div>
                {i < pasos.length - 1 && (
                  <div style={{ background: i < pasoActual ? '#52B788' : '#C8EAD8' }}
                    className="flex-1 h-0.5 mx-2 mb-5" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
            className="rounded-xl p-5">
            <p className="text-sm font-medium mb-4" style={{ color: '#1A1A1A' }}>
              Productos ({items.length})
            </p>
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2"
                  style={{ borderBottom: '0.5px solid #F0F0F0' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>
                      {item.nombre_producto}
                    </p>
                    <p className="text-xs" style={{ color: '#888' }}>
                      ${parseFloat(item.precio_unitario).toFixed(2)} x {item.cantidad}
                    </p>
                  </div>
                  <p className="text-sm font-medium" style={{ color: '#52B788' }}>
                    ${parseFloat(item.subtotal).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 pt-3"
              style={{ borderTop: '0.5px solid #C8EAD8' }}>
              <p className="font-medium text-sm" style={{ color: '#1A1A1A' }}>Total</p>
              <p className="font-medium text-lg" style={{ color: '#52B788' }}>
                ${parseFloat(info.total).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Comprobante — solo si es transferencia y está pendiente */}
          {info.metodo_pago === 'transferencia' && pago?.estatus === 'pendiente' && (
            <div style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
              className="rounded-xl p-5">
              <p className="text-sm font-medium mb-1" style={{ color: '#1A1A1A' }}>
                Subir comprobante de pago
              </p>
              <p className="text-xs mb-4" style={{ color: '#888' }}>
                Transfiere a la cuenta CLABE: <strong>123456789012345678</strong> y sube tu comprobante
              </p>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Número de referencia de la transferencia"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  style={{ border: '0.5px solid #C8EAD8' }}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:border-[#52B788]"
                />
                <label style={{ border: '0.5px dashed #C8EAD8', background: '#F7F7F5' }}
                  className="flex flex-col items-center justify-center py-6 rounded-xl cursor-pointer hover:bg-[#E8F5EE] transition-colors">
                  <Upload size={20} style={{ color: '#52B788' }} className="mb-2" />
                  <p className="text-xs" style={{ color: '#555' }}>
                    {archivo ? archivo.name : 'Seleccionar comprobante (imagen)'}
                  </p>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => setArchivo(e.target.files[0])} />
                </label>
                <button onClick={handleSubirComprobante} disabled={subiendo}
                  style={{ background: subiendo ? '#a0d4bc' : '#52B788' }}
                  className="w-full text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                  {subiendo ? 'Enviando...' : 'Enviar comprobante'}
                </button>
              </div>
            </div>
          )}

          {/* Estado del pago */}
          {pago && pago.estatus !== 'pendiente' && (
            <div style={{
              border: `0.5px solid ${pago.estatus === 'confirmado' ? '#C8EAD8' : '#FED7D7'}`,
              background: pago.estatus === 'confirmado' ? '#E8F5EE' : '#FFF5F5'
            }} className="rounded-xl p-4 flex items-center gap-3">
              <CheckCircle size={18} style={{ color: pago.estatus === 'confirmado' ? '#52B788' : '#e53e3e' }} />
              <p className="text-sm font-medium" style={{
                color: pago.estatus === 'confirmado' ? '#2D6A4F' : '#9B2C2C'
              }}>
                {pago.estatus === 'confirmado'    ? 'Pago confirmado' :
                 pago.estatus === 'verificando'   ? 'Pago en verificación' :
                 'Pago rechazado — vuelve a enviar tu comprobante'}
              </p>
            </div>
          )}
        </div>

        {/* Historial */}
        <div style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
          className="rounded-xl p-5 h-fit">
          <p className="text-sm font-medium mb-4" style={{ color: '#1A1A1A' }}>Historial</p>
          <div className="flex flex-col gap-3">
            {historial.map((h, i) => (
              <div key={h.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div style={{ background: '#52B788' }}
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-1" />
                  {i < historial.length - 1 && (
                    <div style={{ background: '#C8EAD8' }} className="w-0.5 flex-1 mt-1" />
                  )}
                </div>
                <div className="pb-3">
                  <p className="text-xs font-medium capitalize" style={{ color: '#1A1A1A' }}>
                    {h.estatus.replace('_', ' ')}
                  </p>
                  {h.comentario && (
                    <p className="text-xs" style={{ color: '#888' }}>{h.comentario}</p>
                  )}
                  <p className="text-xs mt-1" style={{ color: '#aaa' }}>
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