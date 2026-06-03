import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #C8EAD8', background: '#F7F7F5' }}>
      <div className="max-w-7xl mx-auto" style={{ padding: '48px 32px 32px' }}>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '40px' }}>

          {/* Marca */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <img src="/logo.png" alt="AjoloDevs"
                style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              <span style={{ color: '#1A1A1A', fontWeight: '500', fontSize: '14px' }}>
                AjoloDevs Florería
              </span>
            </div>
            <p style={{ color: '#888', fontSize: '13px', lineHeight: '1.7' }}>
              Flores frescas para cada momento especial. Entrega el mismo día.
            </p>
          </div>

          {/* Links */}
          <div>
            <p style={{ color: '#1A1A1A', fontWeight: '500', fontSize: '13px', marginBottom: '16px' }}>
              Navegación
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[['/', 'Inicio'], ['/catalogo', 'Catálogo'], ['/login', 'Mi cuenta']].map(([to, label]) => (
                <Link key={to} to={to}
                  style={{ color: '#888', fontSize: '13px', textDecoration: 'none' }}
                  className="hover:text-[#52B788] transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div>
            <p style={{ color: '#1A1A1A', fontWeight: '500', fontSize: '13px', marginBottom: '16px' }}>
              Contacto
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ color: '#888', fontSize: '13px' }}>contacto@ajolodevs.com</span>
              <span style={{ color: '#888', fontSize: '13px' }}>Lunes a Sábado 9am - 7pm</span>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid #C8EAD8', marginTop: '40px', paddingTop: '24px', textAlign: 'center' }}>
          <p style={{ color: '#bbb', fontSize: '12px' }}>
            © 2025 AjoloDevs Florería. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}