import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Clock, Star } from 'lucide-react';

const beneficios = [
  { icono: <Truck size={22} />,  titulo: 'Envío mismo día',      desc: 'Pedidos antes de las 2pm' },
  { icono: <Shield size={22} />, titulo: 'Flores garantizadas',  desc: 'Frescura asegurada' },
  { icono: <Clock size={22} />,  titulo: 'Lun - Sáb 9am - 7pm', desc: 'Siempre disponibles' },
  { icono: <Star size={22} />,   titulo: 'Calidad premium',      desc: 'Selección exclusiva' },
];

const categorias = [
  { nombre: 'Ramos',          emoji: '💐', desc: 'Para toda ocasión',     color: '#FFF0F5' },
  { nombre: 'Arreglos',       emoji: '🌸', desc: 'En base o canasta',     color: '#F0FFF4' },
  { nombre: 'Plantas',        emoji: '🌿', desc: 'Interior y exterior',   color: '#F0FFF4' },
  { nombre: 'Bouquets novia', emoji: '👰', desc: 'Para bodas especiales', color: '#FFF9F0' },
];

export default function Home() {
  return (
    <div style={{ background: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: '17px' }}>

      {/* ── ESTILOS GLOBALES + RESPONSIVOS ───────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* Hover effects */
        .cat-card:hover .cat-arrow { opacity: 1 !important; }
        .cat-card:hover { border-color: #52B788 !important; box-shadow: 0 12px 40px rgba(82,183,136,.15) !important; transform: translateY(-4px); }
        .cat-card { transition: all .25s; }
        .cat-emoji { transition: transform .25s; }
        .cat-card:hover .cat-emoji { transform: scale(1.15); }
        .hero-btn-main:hover { background: #2D6A4F !important; transform: translateY(-2px); }
        .hero-btn-main { transition: all .2s; }
        .step-icon { transition: transform .3s; }
        .step-icon:hover { transform: scale(1.1) rotate(-5deg); }
        .cta-btn-main:hover { background: #2D6A4F !important; transform: translateY(-2px); }
        .cta-btn-main { transition: all .2s; }
        .cta-btn-outline:hover { border-color: #52B788 !important; color: #52B788 !important; }
        .cta-btn-outline { transition: all .2s; }
        .benefit-card:hover { border-color: #52B788 !important; box-shadow: 0 8px 24px rgba(82,183,136,.12) !important; }
        .benefit-card { transition: all .25s; }

        /* ── LAYOUTS BASE (desktop) ── */
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 64px 40px;
        }
        .hero-visual-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          height: 420px;
        }
        .beneficios-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .categorias-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }
        .section-pad { padding: 72px 40px; }
        .beneficios-pad { padding: 56px 40px; }
        .cta-pad { padding: 96px 40px; }

        /* ── TABLET ── */
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr;
            padding: 48px 24px;
            gap: 40px;
          }
          .hero-visual-wrap { height: 340px; }
          .hero-h1 { font-size: 46px !important; }
          .beneficios-grid { grid-template-columns: repeat(2, 1fr); }
          .categorias-grid { grid-template-columns: repeat(2, 1fr); }
          .steps-grid { grid-template-columns: 1fr; gap: 32px; }
          .section-pad { padding: 48px 24px !important; }
          .beneficios-pad { padding: 40px 24px !important; }
          .cta-pad { padding: 64px 24px !important; }
          .section-h2 { font-size: 34px !important; }
          .cta-h2 { font-size: 38px !important; }
        }

        /* ── MÓVIL ── */
        @media (max-width: 540px) {
          .hero-grid { padding: 36px 16px; gap: 32px; }
          .hero-h1 { font-size: 34px !important; }
          .hero-visual-wrap { height: 280px; }
          .hero-card-main { width: 200px !important; left: 8px !important; top: 20px !important; }
          .hero-card-main-img { height: 120px !important; font-size: 52px !important; }
          .hero-card-main-body { padding: 14px !important; }
          .beneficios-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .categorias-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
          .section-pad { padding: 36px 16px !important; }
          .beneficios-pad { padding: 32px 16px !important; }
          .cta-pad { padding: 56px 16px !important; }
          .hero-stats { gap: 16px !important; flex-wrap: wrap; }
          .hero-stat-num { font-size: 22px !important; }
          .cta-h2 { font-size: 28px !important; }
          .section-h2 { font-size: 26px !important; }
          .cta-btns { flex-direction: column; align-items: stretch; }
          .cta-btns a { justify-content: center; }
          .hero-btns { flex-direction: column; }
          .hero-btns a { justify-content: center; }
          .badge-entrega { display: none !important; }
          .badge-arreglos { display: none !important; }
          .badge-rating { right: 4px !important; font-size: 12px !important; padding: 8px 12px !important; }
          .promo-bar-text { font-size: 11px !important; }
          .cat-card { padding: 20px 12px !important; border-radius: 16px !important; }
          .cat-emoji-wrap { width: 54px !important; height: 54px !important; font-size: 28px !important; }
        }
      `}</style>

      {/* ── PROMO BAR ────────────────────────────────────── */}
      <div style={{ background: '#2D6A4F', color: '#fff', textAlign: 'center', padding: '10px 16px', letterSpacing: '.4px' }}>
        <span className="promo-bar-text" style={{ fontSize: '13px', fontWeight: 500 }}>
          🚚 Envío mismo día en pedidos antes de las 2pm &nbsp;
          <span style={{ background: 'rgba(255,255,255,.2)', padding: '2px 12px', borderRadius: '100px', margin: '0 6px' }}>FLORES10</span>
          &nbsp; 10% OFF en tu primer pedido 🌸
        </span>
      </div>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #f8fffe 0%, #e8f5ee 50%, #f0fff8 100%)', borderBottom: '1px solid #C8EAD8' }}>
        <div className="hero-grid">

          {/* Texto */}
          <div>
            <div style={{ background: '#D8F3DC', color: '#2D6A4F', fontSize: '12px', fontWeight: 600, padding: '6px 18px', borderRadius: '100px', display: 'inline-block', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '20px' }}>
              ✨ Entregas en el mismo día
            </div>
            <h1 className="hero-h1" style={{ fontFamily: "'Playfair Display', serif", fontSize: '64px', lineHeight: 1.05, color: '#1A1A1A', marginBottom: '16px', fontWeight: 700 }}>
              Flores que<br />
              <em style={{ color: '#52B788', fontStyle: 'italic' }}>hablan</em> por ti
            </h1>
            <p style={{ color: '#666', lineHeight: 1.8, fontSize: '18px', marginBottom: '32px', maxWidth: '420px' }}>
              Arreglos florales únicos para cada momento especial.
              Entregados con amor directamente a tu puerta.
            </p>
            <div className="hero-btns" style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '40px' }}>
              <Link to="/catalogo"
                className="hero-btn-main"
                style={{ background: '#52B788', color: '#fff', padding: '14px 32px', borderRadius: '100px', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                Explorar catálogo <ArrowRight size={18} />
              </Link>
              <Link to="/registro"
                style={{ background: 'transparent', border: '1.5px solid #C8EAD8', color: '#2D6A4F', padding: '14px 28px', borderRadius: '100px', fontSize: '15px', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Crear cuenta gratis
              </Link>
            </div>
            {/* Stats */}
            <div className="hero-stats" style={{ display: 'flex', gap: '36px' }}>
              {[
                { num: '+200', label: 'Arreglos únicos' },
                { num: '4.9★', label: 'Calificación' },
                { num: '100%', label: 'Frescura garantizada' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="hero-stat-num" style={{ fontFamily: "'Playfair Display', serif", fontSize: '30px', fontWeight: 700, color: '#2D6A4F' }}>{s.num}</div>
                  <div style={{ fontSize: '13px', color: '#888' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual decorativo */}
          <div className="hero-visual-wrap">
            <div className="hero-card-main" style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,.08)', position: 'absolute', width: '260px', top: '30px', left: '40px', border: '1px solid #E8EAD8' }}>
              <div className="hero-card-main-img" style={{ background: 'linear-gradient(135deg, #B7E4C7, #52B788)', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '72px' }}>
                🌹
              </div>
              <div className="hero-card-main-body" style={{ padding: '18px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#52B788', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Más vendido</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', marginBottom: '4px' }}>Ramo Eterno de Rosas</div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '12px' }}>24 rosas premium · Mensaje incluido</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A1A' }}>$749 <span style={{ fontSize: '13px', color: '#bbb', fontWeight: 400, textDecoration: 'line-through' }}>$899</span></div>
                  <div style={{ background: '#52B788', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', cursor: 'pointer' }}>+</div>
                </div>
              </div>
            </div>
            {/* Badge: entrega */}
            <div className="badge-entrega" style={{ position: 'absolute', top: '10px', right: '10px', background: '#fff', border: '0.5px solid #C8EAD8', borderRadius: '16px', padding: '10px 16px', boxShadow: '0 8px 24px rgba(0,0,0,.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>🚚</span>
              <div>
                <div style={{ fontSize: '11px', color: '#888' }}>Entrega</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#2D6A4F' }}>Hoy mismo</div>
              </div>
            </div>
            {/* Badge: rating */}
            <div className="badge-rating" style={{ position: 'absolute', bottom: '80px', right: '0', background: '#52B788', color: '#fff', borderRadius: '14px', padding: '10px 16px', boxShadow: '0 8px 20px rgba(82,183,136,.3)', fontSize: '14px', fontWeight: 600 }}>
              ⭐ 4.9 / 5
            </div>
            {/* Badge: arreglos */}
            <div className="badge-arreglos" style={{ position: 'absolute', bottom: '10px', left: '30px', background: '#fff', border: '0.5px solid #C8EAD8', borderRadius: '16px', padding: '10px 16px', boxShadow: '0 8px 24px rgba(0,0,0,.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>💐</span>
              <div>
                <div style={{ fontSize: '11px', color: '#888' }}>Flores</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>+200 arreglos</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── BENEFICIOS ───────────────────────────────────── */}
      <section className="beneficios-pad" style={{ borderBottom: '1px solid #C8EAD8' }}>
        <div className="beneficios-grid">
          {beneficios.map((b, i) => (
            <div key={i} className="benefit-card"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '28px 20px', border: '1px solid #E8EAD8', borderRadius: '20px', background: '#fff' }}>
              <div style={{ background: '#D8F3DC', color: '#52B788', width: '52px', height: '52px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {b.icono}
              </div>
              <p style={{ fontWeight: 600, fontSize: '15px', color: '#1A1A1A' }}>{b.titulo}</p>
              <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.6 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORÍAS ───────────────────────────────────── */}
      <section className="section-pad" style={{ background: '#FAFAF8' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#52B788', marginBottom: '10px' }}>
              Nuestras colecciones
            </p>
            <h2 className="section-h2" style={{ fontFamily: "'Playfair Display', serif", fontSize: '42px', color: '#1A1A1A', marginBottom: '12px', fontWeight: 700 }}>
              Encuentra el arreglo perfecto
            </h2>
            <p style={{ fontSize: '16px', maxWidth: '460px', margin: '0 auto', color: '#888', lineHeight: 1.8 }}>
              Desde ramos clásicos hasta arreglos exclusivos para bodas,
              tenemos la flor ideal para cada momento.
            </p>
          </div>
          <div className="categorias-grid">
            {categorias.map((c, i) => (
              <Link key={i} to={`/catalogo?categoria=${c.nombre}`}
                className="cat-card"
                style={{ background: '#fff', border: '1px solid #E8EAD8', borderRadius: '24px', padding: '32px 20px', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                <div className="cat-emoji cat-emoji-wrap"
                  style={{ background: c.color, width: '72px', height: '72px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '36px' }}>
                  {c.emoji}
                </div>
                <p style={{ fontWeight: 600, fontSize: '16px', marginBottom: '6px', color: '#1A1A1A' }}>{c.nombre}</p>
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '14px' }}>{c.desc}</p>
                <div className="cat-arrow"
                  style={{ color: '#52B788', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, opacity: 0 }}>
                  Ver colección <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ────────────────────────────────── */}
      <section className="section-pad" style={{ borderTop: '1px solid #C8EAD8', borderBottom: '1px solid #C8EAD8', background: '#fff' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#52B788', marginBottom: '10px' }}>
              Simple y rápido
            </p>
            <h2 className="section-h2" style={{ fontFamily: "'Playfair Display', serif", fontSize: '42px', color: '#1A1A1A', fontWeight: 700 }}>
              ¿Cómo funciona?
            </h2>
          </div>
          <div className="steps-grid">
            {[
              { num: '01', titulo: 'Elige tus flores',    desc: 'Explora nuestro catálogo y selecciona el arreglo perfecto para tu ocasión.',     emoji: '🌸' },
              { num: '02', titulo: 'Realiza tu pedido',   desc: 'Agrega al carrito, elige tu método de pago y confirma tu pedido en minutos.',     emoji: '🛒' },
              { num: '03', titulo: 'Recibe en tu puerta', desc: 'Entregamos el mismo día si tu pedido es antes de las 2pm. Frescura garantizada.', emoji: '🚚' },
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
                <div className="step-icon"
                  style={{ background: '#D8F3DC', border: '3px solid #B7E4C7', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', position: 'relative', flexShrink: 0 }}>
                  {p.emoji}
                  <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#52B788', color: '#fff', width: '26px', height: '26px', borderRadius: '50%', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.num}
                  </div>
                </div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: '#1A1A1A' }}>{p.titulo}</p>
                <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.8 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────── */}
      <section className="cta-pad" style={{ textAlign: 'center', background: '#1A1A1A' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#52B788', marginBottom: '16px' }}>
            Comienza hoy
          </p>
          <h2 className="cta-h2" style={{ fontFamily: "'Playfair Display', serif", fontSize: '52px', color: '#fff', marginBottom: '16px', lineHeight: 1.15, fontWeight: 700 }}>
            ¿Lista para sorprender<br />a alguien especial?
          </h2>
          <p style={{ fontSize: '16px', marginBottom: '36px', color: '#888', lineHeight: 1.8 }}>
            Crea tu cuenta gratis y realiza tu primer pedido hoy mismo.
            Flores frescas, entregadas con amor.
          </p>
          <div className="cta-btns" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            <Link to="/catalogo"
              className="cta-btn-main"
              style={{ background: '#52B788', color: '#fff', padding: '16px 40px', borderRadius: '100px', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              Ver catálogo <ArrowRight size={16} />
            </Link>
            <Link to="/registro"
              className="cta-btn-outline"
              style={{ background: 'transparent', border: '1.5px solid #333', color: '#fff', padding: '16px 36px', borderRadius: '100px', fontSize: '15px', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Crear cuenta gratis
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}