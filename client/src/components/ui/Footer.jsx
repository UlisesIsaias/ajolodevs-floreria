import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ borderTop: '0.5px solid #C8EAD8', background: '#F7F7F5' }}
      className="py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Marca */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div style={{ background: '#52B788' }} className="w-8 h-8 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="4" fill="white"/>
                  <ellipse cx="16" cy="9"  rx="3" ry="5" fill="white" opacity="0.9"/>
                  <ellipse cx="16" cy="23" rx="3" ry="5" fill="white" opacity="0.9"/>
                  <ellipse cx="9"  cy="16" rx="5" ry="3" fill="white" opacity="0.9"/>
                  <ellipse cx="23" cy="16" rx="5" ry="3" fill="white" opacity="0.9"/>
                </svg>
              </div>
              <span className="font-medium text-sm" style={{ color: '#1A1A1A' }}>AjoloDevs Florería</span>
            </div>
            <p className="text-xs" style={{ color: '#888', lineHeight: '1.6' }}>
              Flores frescas para cada momento especial. Entrega el mismo día.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-medium mb-3" style={{ color: '#1A1A1A' }}>Navegación</p>
            <div className="flex flex-col gap-2">
              {[['/', 'Inicio'], ['/catalogo', 'Catálogo'], ['/login', 'Mi cuenta']].map(([to, label]) => (
                <Link key={to} to={to} className="text-xs hover:text-[#52B788] transition-colors" style={{ color: '#888' }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div>
            <p className="text-xs font-medium mb-3" style={{ color: '#1A1A1A' }}>Contacto</p>
            <div className="flex flex-col gap-2 text-xs" style={{ color: '#888' }}>
              <span>contacto@ajolodevs.com</span>
              <span>Lunes a Sábado 9am - 7pm</span>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '0.5px solid #C8EAD8' }} className="mt-8 pt-4 text-center">
          <p className="text-xs" style={{ color: '#aaa' }}>
            © 2025 AjoloDevs Florería. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}