import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Clock, Star } from 'lucide-react';

const beneficios = [
  { icono: <Truck size={22} />,   titulo: 'Envío mismo día',      desc: 'Pedidos antes de las 2pm' },
  { icono: <Shield size={22} />,  titulo: 'Flores garantizadas',  desc: 'Frescura asegurada' },
  { icono: <Clock size={22} />,   titulo: 'Lun - Sáb 9am - 7pm', desc: 'Siempre disponibles' },
  { icono: <Star size={22} />,    titulo: 'Calidad premium',      desc: 'Selección exclusiva' },
];

const categorias = [
  { nombre: 'Ramos',           emoji: '💐', desc: 'Para toda ocasión',     color: '#FFF0F5' },
  { nombre: 'Arreglos',        emoji: '🌸', desc: 'En base o canasta',     color: '#F0FFF4' },
  { nombre: 'Plantas',         emoji: '🌿', desc: 'Interior y exterior',   color: '#F0FFF4' },
  { nombre: 'Bouquets novia',  emoji: '👰', desc: 'Para bodas especiales', color: '#FFF9F0' },
];

export default function Home() {
  return (
    <div style={{ background: '#fff' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #f8fffe 0%, #e8f5ee 50%, #f0fff8 100%)', borderBottom: '0.5px solid #C8EAD8' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Texto */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div style={{ background: '#52B788' }} className="w-8 h-0.5 rounded-full" />
                <span style={{ color: '#2D6A4F' }} className="text-sm font-medium tracking-wide uppercase">
                  Florería AjoloDevs
                </span>
              </div>
              <h1 style={{ color: '#1A1A1A', lineHeight: '1.15' }}
                className="text-5xl md:text-6xl font-medium mb-6">
                Flores que<br />
                <span style={{ color: '#52B788' }}>hablan</span> por ti
              </h1>
              <p style={{ color: '#666', lineHeight: '1.8' }}
                className="text-lg mb-10 max-w-md">
                Arreglos florales únicos para cada momento especial. 
                Entregados con amor directamente a tu puerta.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/catalogo"
                  style={{ background: '#52B788' }}
                  className="text-white px-8 py-4 rounded-2xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-3 shadow-sm">
                  Explorar catálogo <ArrowRight size={18} />
                </Link>
                <Link to="/registro"
                  style={{ border: '1.5px solid #C8EAD8', color: '#2D6A4F' }}
                  className="px-8 py-4 rounded-2xl text-sm font-medium hover:bg-[#E8F5EE] transition-colors">
                  Crear cuenta gratis
                </Link>
              </div>
            </div>

            {/* Visual decorativo */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-80 h-80">
                {/* Círculo grande fondo */}
                <div style={{ background: '#E8F5EE', border: '1px solid #C8EAD8' }}
                  className="absolute inset-0 rounded-full" />
                {/* Círculo medio */}
                <div style={{ background: '#fff', border: '1px solid #C8EAD8' }}
                  className="absolute inset-8 rounded-full flex items-center justify-center">
                  <svg width="100" height="100" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="5" fill="#52B788"/>
                    <ellipse cx="16" cy="7"  rx="4" ry="6" fill="#52B788" opacity="0.5"/>
                    <ellipse cx="16" cy="25" rx="4" ry="6" fill="#52B788" opacity="0.5"/>
                    <ellipse cx="7"  cy="16" rx="6" ry="4" fill="#52B788" opacity="0.5"/>
                    <ellipse cx="25" cy="16" rx="6" ry="4" fill="#52B788" opacity="0.5"/>
                    <ellipse cx="9"  cy="9"  rx="3.5" ry="5" fill="#52B788" opacity="0.3" transform="rotate(45 9 9)"/>
                    <ellipse cx="23" cy="23" rx="3.5" ry="5" fill="#52B788" opacity="0.3" transform="rotate(45 23 23)"/>
                    <ellipse cx="23" cy="9"  rx="3.5" ry="5" fill="#52B788" opacity="0.3" transform="rotate(-45 23 9)"/>
                    <ellipse cx="9"  cy="23" rx="3.5" ry="5" fill="#52B788" opacity="0.3" transform="rotate(-45 9 23)"/>
                  </svg>
                </div>
                {/* Badges flotantes */}
                <div style={{ background: '#fff', border: '0.5px solid #C8EAD8', top: '10px', right: '-10px' }}
                  className="absolute px-4 py-2 rounded-2xl shadow-sm">
                  <p className="text-xs font-medium" style={{ color: '#1A1A1A' }}>🌸 +200 arreglos</p>
                </div>
                <div style={{ background: '#52B788', bottom: '20px', left: '-10px' }}
                  className="absolute px-4 py-2 rounded-2xl">
                  <p className="text-xs font-medium text-white">✓ Entrega hoy</p>
                </div>
                <div style={{ background: '#fff', border: '0.5px solid #C8EAD8', bottom: '-10px', right: '20px' }}
                  className="absolute px-4 py-2 rounded-2xl shadow-sm">
                  <p className="text-xs font-medium" style={{ color: '#1A1A1A' }}>⭐ 4.9 / 5</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── BENEFICIOS ───────────────────────────────────── */}
      <section style={{ borderBottom: '0.5px solid #C8EAD8' }} className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {beneficios.map((b, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3 p-6"
              style={{ border: '0.5px solid #C8EAD8', borderRadius: '20px', background: '#fff' }}>
              <div style={{ background: '#E8F5EE', color: '#52B788' }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center">
                {b.icono}
              </div>
              <p className="font-medium text-sm" style={{ color: '#1A1A1A' }}>{b.titulo}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#888' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORÍAS ───────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: '#FAFAFA' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#52B788' }}>
              Nuestras colecciones
            </p>
            <h2 className="text-3xl font-medium mb-4" style={{ color: '#1A1A1A' }}>
              Encuentra el arreglo perfecto
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: '#888', lineHeight: '1.8' }}>
              Desde ramos clásicos hasta arreglos exclusivos para bodas, 
              tenemos la flor ideal para cada momento.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categorias.map((c, i) => (
              <Link key={i} to={`/catalogo?categoria=${c.nombre}`}
                style={{ background: '#fff', border: '0.5px solid #C8EAD8' }}
                className="rounded-2xl p-8 text-center hover:border-[#52B788] hover:shadow-md transition-all group cursor-pointer">
                <div style={{ background: c.color }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl group-hover:scale-110 transition-transform">
                  {c.emoji}
                </div>
                <p className="font-medium text-sm mb-1" style={{ color: '#1A1A1A' }}>{c.nombre}</p>
                <p className="text-xs" style={{ color: '#888' }}>{c.desc}</p>
                <div style={{ color: '#52B788' }}
                  className="flex items-center justify-center gap-1 mt-3 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver colección <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ────────────────────────────────── */}
      <section className="py-20 px-6" style={{ borderTop: '0.5px solid #C8EAD8', borderBottom: '0.5px solid #C8EAD8' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#52B788' }}>
              Simple y rápido
            </p>
            <h2 className="text-3xl font-medium" style={{ color: '#1A1A1A' }}>
              ¿Cómo funciona?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '01', titulo: 'Elige tus flores',    desc: 'Explora nuestro catálogo y selecciona el arreglo perfecto para tu ocasión.', icono: '🌸' },
              { num: '02', titulo: 'Realiza tu pedido',   desc: 'Agrega al carrito, elige tu método de pago y confirma tu pedido en minutos.', icono: '🛒' },
              { num: '03', titulo: 'Recibe en tu puerta', desc: 'Entregamos el mismo día si tu pedido es antes de las 2pm. Frescura garantizada.', icono: '🚚' },
            ].map((p, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4">
                <div style={{ background: '#E8F5EE', border: '0.5px solid #C8EAD8' }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl">
                  {p.icono}
                </div>
                <div style={{ background: '#52B788', color: 'white' }}
                  className="text-xs font-medium px-3 py-1 rounded-full">
                  {p.num}
                </div>
                <p className="font-medium" style={{ color: '#1A1A1A' }}>{p.titulo}</p>
                <p className="text-sm leading-relaxed" style={{ color: '#888' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────── */}
      <section className="py-24 px-6 text-center" style={{ background: '#1A1A1A' }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#52B788' }}>
            Comienza hoy
          </p>
          <h2 className="text-4xl font-medium text-white mb-4" style={{ lineHeight: '1.2' }}>
            ¿Lista para sorprender<br />a alguien especial?
          </h2>
          <p className="text-sm mb-10" style={{ color: '#888', lineHeight: '1.8' }}>
            Crea tu cuenta gratis y realiza tu primer pedido hoy mismo.
            Flores frescas, entregadas con amor.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/catalogo"
              style={{ background: '#52B788' }}
              className="text-white px-8 py-4 rounded-2xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
              Ver catálogo <ArrowRight size={16} />
            </Link>
            <Link to="/registro"
              style={{ border: '1px solid #333', color: '#fff' }}
              className="px-8 py-4 rounded-2xl text-sm font-medium hover:border-[#52B788] transition-colors">
              Crear cuenta gratis
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}