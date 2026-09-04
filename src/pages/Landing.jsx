import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

/* ---- SVG Icon Components ---- */
const Icons = {
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  kanban: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  ),
  invoice: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  chart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  clock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  arrow: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
}

const features = [
  {
    icon: Icons.users,
    title: 'Gestión de clientes',
    description: 'Organiza información, historial de proyectos y comunicación con cada cliente en un solo lugar.',
  },
  {
    icon: Icons.kanban,
    title: 'Tablero de proyectos',
    description: 'Visualiza el estado de cada proyecto con un tablero Kanban. Prioriza y cumple cada deadline.',
  },
  {
    icon: Icons.invoice,
    title: 'Facturación',
    description: 'Genera facturas profesionales en segundos. Envíalas y rastrea el estado de pago automáticamente.',
  },
  {
    icon: Icons.chart,
    title: 'Métricas en tiempo real',
    description: 'Ingresos, proyectos activos y rendimiento. Toma decisiones informadas sobre tu negocio.',
  },
  {
    icon: Icons.clock,
    title: 'Seguimiento de tiempo',
    description: 'Cronometra horas por proyecto y vincúlalas directamente a las facturas de cada cliente.',
  },
  {
    icon: Icons.shield,
    title: 'Seguro en la nube',
    description: 'Datos cifrados y respaldados automáticamente. Accede desde cualquier dispositivo, siempre.',
  },
]

const freePlan = [
  'Hasta 3 clientes',
  '5 facturas al mes',
  'Tablero Kanban básico',
  'Dashboard de métricas',
  'Soporte por email',
]

const proPlan = [
  'Clientes ilimitados',
  'Facturas ilimitadas',
  'Kanban avanzado',
  'Seguimiento de tiempo',
  'Reportes y exportaciones',
  'Soporte prioritario 24/7',
]

export default function Landing() {
  const navigate = useNavigate()
  const observerRef = useRef(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observerRef.current.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav className="navbar" id="navbar">
        <div className="navbar-inner">
          <a href="#" className="navbar-logo" id="navbar-logo">
            <div className="logo-mark">K</div>
            Konta
          </a>
          <div className="navbar-links">
            <a href="#features" id="nav-features">Funcionalidades</a>
            <a href="#pricing" id="nav-pricing">Precios</a>
          </div>
          <div className="navbar-actions">
            <button className="btn btn-ghost" id="btn-login" onClick={() => navigate('/dashboard')}>
              Iniciar sesión
            </button>
            <button className="btn btn-primary" id="btn-signup" onClick={() => navigate('/dashboard')}>
              Empieza gratis
            </button>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="indicator"></span>
            Disponible ahora — gratis para empezar
          </div>

          <h1>
            Tu negocio freelance,<br />
            <span className="accent">bajo control total</span>
          </h1>

          <p className="hero-description">
            Clientes, proyectos y facturación en una sola plataforma.
            Diseñada para que te enfoques en lo que importa.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" id="hero-cta-primary" onClick={() => navigate('/dashboard')}>
              Comenzar gratis {Icons.arrow}
            </button>
            <button className="btn btn-outline btn-lg" id="hero-cta-secondary" onClick={() => navigate('/dashboard')}>
              Ver demo
            </button>
          </div>

          <div className="hero-metrics">
            <div className="metric">
              <div className="metric-value">2,400+</div>
              <div className="metric-label">Freelancers activos</div>
            </div>
            <div className="metric">
              <div className="metric-value">$1.2M</div>
              <div className="metric-label">Facturado</div>
            </div>
            <div className="metric">
              <div className="metric-value">99.9%</div>
              <div className="metric-label">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section" id="features">
        <div className="section-header animate-on-scroll">
          <span className="section-label">Funcionalidades</span>
          <h2 className="section-title">Todo lo que necesitas</h2>
          <p className="section-subtitle">
            Herramientas para dedicar más tiempo a tu trabajo y menos a la administración.
          </p>
        </div>

        <div className="features-grid animate-on-scroll">
          {features.map((feature, i) => (
            <div key={i} className="feature-card" id={`feature-${i}`}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="section" id="pricing">
        <div className="section-header animate-on-scroll">
          <span className="section-label">Precios</span>
          <h2 className="section-title">Simple y transparente</h2>
          <p className="section-subtitle">
            Empieza gratis. Escala cuando estés listo. Sin costos ocultos.
          </p>
        </div>

        <div className="pricing-grid">
          {/* Free */}
          <div className="pricing-card animate-on-scroll" id="pricing-free">
            <div className="pricing-plan">Free</div>
            <div className="pricing-price">
              <span className="currency">$</span>
              <span className="amount">0</span>
              <span className="period">/mes</span>
            </div>
            <p className="pricing-desc">
              Para empezar tu carrera freelance.
            </p>
            <div className="pricing-divider"></div>
            <div className="pricing-features">
              {freePlan.map((f, i) => (
                <div key={i} className="pricing-feature">
                  <span className="check-icon">✓</span>
                  {f}
                </div>
              ))}
            </div>
            <button className="btn btn-outline btn-lg" style={{ width: '100%' }} id="free-cta" onClick={() => navigate('/dashboard')}>
              Empezar gratis
            </button>
          </div>

          {/* Pro */}
          <div className="pricing-card featured animate-on-scroll" id="pricing-pro">
            <div className="pricing-badge">Popular</div>
            <div className="pricing-plan">Pro</div>
            <div className="pricing-price">
              <span className="currency">$</span>
              <span className="amount">15</span>
              <span className="period">/mes</span>
            </div>
            <p className="pricing-desc">
              Sin límites. Para freelancers que quieren crecer.
            </p>
            <div className="pricing-divider"></div>
            <div className="pricing-features">
              {proPlan.map((f, i) => (
                <div key={i} className="pricing-feature">
                  <span className="check-icon">✓</span>
                  {f}
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} id="pro-cta" onClick={() => navigate('/dashboard')}>
              Comenzar prueba gratis
            </button>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section cta-section" id="cta">
        <div className="cta-box animate-on-scroll">
          <h2>¿Listo para tomar el control?</h2>
          <p>
            Únete a miles de freelancers que ya organizan su trabajo con Konta.
            Sin tarjeta de crédito.
          </p>
          <button className="btn btn-primary btn-lg" id="cta-final" onClick={() => navigate('/dashboard')}>
            Crear cuenta gratis {Icons.arrow}
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer" id="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="logo-mark-sm">K</div>
            Konta
          </div>
          <div className="footer-links">
            <a href="#features">Funcionalidades</a>
            <a href="#pricing">Precios</a>
            <a href="#">Privacidad</a>
            <a href="#">Términos</a>
          </div>
          <div className="footer-copy">
            © {new Date().getFullYear()} Konta
          </div>
        </div>
      </footer>
    </>
  )
}
