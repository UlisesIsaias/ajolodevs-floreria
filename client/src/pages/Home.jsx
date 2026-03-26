import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Clock } from 'lucide-react';

const beneficios = [
  { icono: <Truck size={20} />,   titulo: 'Envío mismo día',     desc: 'Pedidos antes de las 2pm' },
  { icono: <Shield size={20} />,  titulo: 'Flores frescas',      desc: 'Garantía de frescura' },
  { icono: <Clock size={20} />,   titulo: 'Lun - Sáb 9am - 7pm', desc: 'Siempre disponibles' },
];

const categorias = [
  { nombre: 'Ramos',     emoji: '💐', desc: 'Para toda ocasión' },
  { nombre: 'Arreglos',  emoji: '🌸', desc: 'En base o canasta' },
  { nombre: 'Plantas',   emoji: '🌿', desc: 'Interior y exterior' },
  { nombre: 'Bouquets',  emoji: '👰', desc: 'Para bodas' },
];

export default function Home() {
  return (
    <div>

      {/* Hero */}
      <section style={{ background: '#F2FAF6', borderBottom: '0.5px solid #C8EAD8' }} className="py-20 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-lg">
            <span style={{ background: '#E8F5EE', color: '#2D6A4F' }}
              className="text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
              Envío mismo día disponible
            </span>
            <h1 style={{ color: '#1A1A1A', lineHeight: '1.2' }}
              className="text-4xl font-medium mb-4">
              Flores frescas para<br />cada momento especial
            </h1>
            <p style={{ color: '#666' }} className="text-base mb-8 leading-relaxed">
              Arreglos florales hechos con amor, entregados directo a tu puerta. 
              Encuentra el arreglo perfecto para cada ocasión.
            </p>
            <div className="flex gap-3">
              <Link to="/catalogo"
                style={{ background: '#52B788' }}
                className="text-white px-6 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                Ver catálogo <ArrowRight size={16} />
              </Link>
              <Link to="/registro"
                style={{ border: '0.5px solid #C8EAD8', color: '#2D6A4F' }}
                className="px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#E8F5EE] transition-colors">
                Crear cuenta
              </Link>
            </div>
          </div>

          {/* Flores decorativas */}
          <div className="flex gap-4 items-end">
            {[
              { bg: '#C8EAD8', size: 'w-28 h-28', mt: '' },
              { bg: '#E8F5EE', size: 'w-36 h-36', mt: 'mt-8' },
              { bg: '#C8EAD8', size: 'w-24 h-24', mt: '' },
            ].map((f, i) => (
              <div key={i} style={{ background: f.bg }}
                className={`${f.size} ${f.mt} rounded-full flex items-center justify-center`}>
                <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="4" fill="#52B788"/>
                  <ellipse cx="16" cy="9"  rx="3" ry="5" fill="#52B788" opacity="0.6"/>
                  <ellipse cx="16" cy="23" rx="3" ry="5" fill="#52B788" opacity="0.6"/>
                  <ellipse cx="9"  cy="16" rx="5" ry="3" fill="#52B788" opacity="0.6"/>
                  <ellipse cx="23" cy="16" rx="5" ry="3" fill="#52B788" opacity="0.6"/>
                </svg>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {beneficios.map((b, i) => (
            <div key={i} style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
              className="rounded-xl p-5 flex items-start gap-4">
              <div style={{ background: '#E8F5EE', color: '#52B788' }}
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                {b.icono}
              </div>
              <div>
                <p className="font-medium text-sm mb-1" style={{ color: '#1A1A1A' }}>{b.titulo}</p>
                <p className="text-xs" style={{ color: '#888' }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="py-12 px-4" style={{ background: '#F7F7F5' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-medium mb-2" style={{ color: '#1A1A1A' }}>
            Explora por categoría
          </h2>
          <p className="text-sm mb-8" style={{ color: '#888' }}>
            Encuentra el arreglo perfecto para cada ocasión
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categorias.map((c, i) => (
              <Link key={i} to={`/catalogo?categoria=${c.nombre}`}
                style={{ border: '0.5px solid #C8EAD8', background: '#fff' }}
                className="rounded-xl p-6 text-center hover:border-[#52B788] hover:shadow-sm transition-all group">
                <div className="text-3xl mb-3">{c.emoji}</div>
                <p className="font-medium text-sm mb-1" style={{ color: '#1A1A1A' }}>{c.nombre}</p>
                <p className="text-xs" style={{ color: '#888' }}>{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section style={{ background: '#52B788' }} className="py-16 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-medium text-white mb-3">
            ¿Lista para sorprender a alguien?
          </h2>
          <p className="text-sm mb-8" style={{ color: '#E8F5EE' }}>
            Crea tu cuenta y realiza tu primer pedido hoy mismo
          </p>
          <Link to="/catalogo"
            className="bg-white text-sm font-medium px-8 py-3 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            style={{ color: '#52B788' }}>
            Ver flores <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}