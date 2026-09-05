import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import type { ReactElement } from 'react'

/* ---- SVG Icon Components ---- */
const Icons: Record<string, ReactElement> = {
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

interface Feature {
  icon: ReactElement
  title: string
  description: string
}

interface Testimonial {
  quote: string
  author: string
  role: string
  avatar: string
}

interface Faq {
  question: string
  answer: string
}

const features: Feature[] = [
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

const testimonials: Testimonial[] = [
  {
    quote: 'Chrono cambió por completo cómo organizo mis proyectos de desarrollo. Antes perdía facturas y entregas, ahora todo está a 1 clic.',
    author: 'Sebastián Morales',
    role: 'Fullstack Developer',
    avatar: 'SM',
  },
  {
    quote: 'El tablero Kanban y la vista de ingresos del mes me dan la tranquilidad que necesitaba para enfocarme en diseñar.',
    author: 'Camila Torres',
    role: 'UI/UX Designer',
    avatar: 'CT',
  },
  {
    quote: 'La simplicidad y el tema oscuro son increíbles. Es la única herramienta freelance que no me da pereza usar todos los días.',
    author: 'Daniel Rivas',
    role: 'Consultor SEO & Growth',
    avatar: 'DR',
  },
]

const faqs: Faq[] = [
  {
    question: '¿Chrono es realmente gratis para empezar?',
    answer: 'Sí. El plan Free te permite gestionar hasta 3 clientes y proyectos activos de forma indefinida sin necesidad de ingresar tarjeta de crédito.',
  },
  {
    question: '¿Mis datos están seguros?',
    answer: 'Absolutamente. Utilizamos almacenamiento cifrado en la nube y conexiones seguras SSL de 256 bits para garantizar la privacidad de tus clientes y montos.',
  },
  {
    question: '¿Puedo exportar mis facturas y proyectos?',
    answer: 'Sí, todas tus facturas y reportes se pueden descargar o imprimir directamente en PDF con un formato profesional adaptado a tu marca.',
  },
  {
    question: '¿Cómo funciona la integración con la nube?',
    answer: 'Chrono sincroniza automáticamente tus datos entre tus dispositivos (laptop, tablet o móvil) para que siempre tengas la información actualizada.',
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
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [heroCardTab, setHeroCardTab] = useState<'kanban' | 'stats' | 'invoices'>('kanban')

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav className="navbar" id="navbar">
        <div className="navbar-inner">
          <a href="#" className="navbar-logo" id="navbar-logo">
            <div className="logo-mark">C</div>
            Chrono
          </a>
          <div className="navbar-links font-mono">
            <a href="#hero" id="nav-product">Producto</a>
            <a href="#features" id="nav-features">Funcionalidades</a>
            <a href="#pricing" id="nav-pricing">Precios</a>
            <a href="#faq" id="nav-faq">FAQ</a>
          </div>
          <div className="navbar-actions">
            <ThemeToggle />
            <button className="btn-mono-pill outline" id="btn-login" onClick={() => navigate('/login')}>
              • Iniciar sesión
            </button>
            <button className="btn-mono-pill" id="btn-signup" onClick={() => navigate('/register')}>
              • Empieza gratis →
            </button>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero" id="hero">
        <div className="hero-content-wrapper">
          <div className="hero-header-text">
            <div className="hero-badge font-mono">
              <span className="indicator"></span>
              Plataforma de gestión freelance v1.0
            </div>

            <h1 className="hero-title-editorial">
              <span className="serif-title">Gestión inteligente,</span>
              <span className="sans-title">diseñada para freelancers</span>
            </h1>

            <p className="hero-subtitle-editorial">
              Organiza tus proyectos, gestiona tus clientes y automatiza tu facturación — con total claridad y confianza.
            </p>

            <div className="hero-actions-pills">
              <button className="btn-mono-pill" id="hero-cta-primary" onClick={() => navigate('/register')}>
                • Solicitar demo
              </button>
              <button className="btn-mono-pill outline" id="hero-cta-secondary" onClick={() => navigate('/login')}>
                • Explorar plataforma →
              </button>
            </div>
          </div>

          <div className="hero-aetherfield-card">
            <div className="aether-card-header">
              <div>
                <div className="aether-greeting">Buen día, Martín Pineda</div>
                <div className="aether-subtext">Tus métricas e impacto financiero están listos para revisar.</div>
              </div>
              <div className="aether-card-tabs font-mono">
                <button className={`aether-tab ${heroCardTab === 'kanban' ? 'active' : ''}`} onClick={() => setHeroCardTab('kanban')}>Proyectos</button>
                <button className={`aether-tab ${heroCardTab === 'stats' ? 'active' : ''}`} onClick={() => setHeroCardTab('stats')}>Finanzas</button>
                <button className={`aether-tab ${heroCardTab === 'invoices' ? 'active' : ''}`} onClick={() => setHeroCardTab('invoices')}>Facturas</button>
              </div>
            </div>

            <div className="aether-card-content">
              {heroCardTab === 'kanban' && (
                <div className="aether-grid-cards">
                  <div className="aether-mini-card">
                    <div className="mini-card-top">
                      <span className="mini-badge yellow">En Progreso</span>
                      <span className="font-mono text-xs">$2,800</span>
                    </div>
                    <h4>Rediseño Web E-Commerce</h4>
                    <p className="text-xs text-muted">Acme Studio • 4/4 tareas</p>
                  </div>
                  <div className="aether-mini-card highlight-lime">
                    <div className="mini-card-top">
                      <span className="mini-badge black">En Revisión</span>
                      <span className="font-mono text-xs">$4,500</span>
                    </div>
                    <h4>App Móvil iOS & Android</h4>
                    <p className="text-xs text-muted">TechNova Labs • 3/4 tareas</p>
                  </div>
                  <div className="aether-mini-card">
                    <div className="mini-card-top">
                      <span className="mini-badge green">Completado</span>
                      <span className="font-mono text-xs">$1,200</span>
                    </div>
                    <h4>Branding Kira Coffee</h4>
                    <p className="text-xs text-muted">Kira Coffee Co. • Entregado</p>
                  </div>
                </div>
              )}

              {heroCardTab === 'stats' && (
                <div className="aether-grid-stats">
                  <div className="aether-stat-block">
                    <span className="stat-block-label">INGRESOS DEL MES</span>
                    <div className="stat-block-value">$4,850.00</div>
                    <span className="stat-block-change positive">↑ +14.2% este mes</span>
                  </div>
                  <div className="aether-stat-block">
                    <span className="stat-block-label">CUENTAS POR COBRAR</span>
                    <div className="stat-block-value">$3,800.00</div>
                    <span className="stat-block-change warning">2 facturas pendientes</span>
                  </div>
                  <div className="aether-stat-block highlight-stat">
                    <span className="stat-block-label">HORAS FACTURADAS</span>
                    <div className="stat-block-value">42.5 hrs</div>
                    <span className="stat-block-change">Tarifa media: $50/h</span>
                  </div>
                </div>
              )}

              {heroCardTab === 'invoices' && (
                <div className="aether-table-wrapper">
                  <table className="aether-table">
                    <thead>
                      <tr>
                        <th>Nº Factura</th>
                        <th>Cliente</th>
                        <th>Monto</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="font-mono">INV-2026-001</td>
                        <td className="font-semibold">Acme Studio</td>
                        <td className="font-mono font-bold">$1,400.00</td>
                        <td><span className="status-badge pagada">Pagada</span></td>
                      </tr>
                      <tr>
                        <td className="font-mono">INV-2026-002</td>
                        <td className="font-semibold">TechNova Labs</td>
                        <td className="font-mono font-bold">$2,250.00</td>
                        <td><span className="status-badge pendiente">Pendiente</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section" id="features">
        <div className="section-header animate-on-scroll">
          <span className="section-label font-mono">Funcionalidades</span>
          <h2 className="section-title">
            <span className="serif-title">Todo lo que necesitas,</span>
            <span className="sans-title">en una sola pantalla</span>
          </h2>
          <p className="section-subtitle">
            Herramientas diseñadas para dedicar más tiempo a tu trabajo y menos a la administración.
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

      {/* ===== TESTIMONIALS ===== */}
      <section className="section testimonials-section" id="testimonials">
        <div className="section-header animate-on-scroll">
          <span className="section-label font-mono">Prueba Social</span>
          <h2 className="section-title">
            <span className="serif-title">Construido para profesionales,</span>
            <span className="sans-title">amado por freelancers</span>
          </h2>
          <p className="section-subtitle">
            Descubre por qué cientos de freelancers gestionan su negocio con Chrono.
          </p>
        </div>

        <div className="testimonials-grid animate-on-scroll">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p className="quote">"{t.quote}"</p>
              <div className="author-info">
                <div className="author-avatar">{t.avatar}</div>
                <div>
                  <div className="author-name">{t.author}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="section" id="pricing">
        <div className="section-header animate-on-scroll">
          <span className="section-label font-mono">Precios</span>
          <h2 className="section-title">
            <span className="serif-title">Simple y transparente,</span>
            <span className="sans-title">sin sorpresas</span>
          </h2>
          <p className="section-subtitle">
            Empieza gratis. Escala cuando estés listo. Sin costos ocultos.
          </p>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card animate-on-scroll" id="pricing-free">
            <div className="pricing-plan font-mono">Free</div>
            <div className="pricing-price">
              <span className="currency">$</span>
              <span className="amount font-sans">0</span>
              <span className="period font-mono">/mes</span>
            </div>
            <p className="pricing-desc">Para empezar tu carrera freelance.</p>
            <div className="pricing-divider"></div>
            <div className="pricing-features">
              {freePlan.map((f, i) => (
                <div key={i} className="pricing-feature">
                  <span className="check-icon">✓</span>
                  {f}
                </div>
              ))}
            </div>
            <button className="btn-mono-pill outline" style={{ width: '100%', justifyContent: 'center' }} id="free-cta" onClick={() => navigate('/register')}>
              • Empezar gratis
            </button>
          </div>

          <div className="pricing-card featured animate-on-scroll" id="pricing-pro">
            <div className="pricing-badge font-mono">Popular</div>
            <div className="pricing-plan font-mono">Pro</div>
            <div className="pricing-price">
              <span className="currency">$</span>
              <span className="amount font-sans">15</span>
              <span className="period font-mono">/mes</span>
            </div>
            <p className="pricing-desc">Sin límites. Para freelancers que quieren crecer.</p>
            <div className="pricing-divider"></div>
            <div className="pricing-features">
              {proPlan.map((f, i) => (
                <div key={i} className="pricing-feature">
                  <span className="check-icon">✓</span>
                  {f}
                </div>
              ))}
            </div>
            <button className="btn-mono-pill" style={{ width: '100%', justifyContent: 'center' }} id="pro-cta" onClick={() => navigate('/register')}>
              • Comenzar prueba gratis →
            </button>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section faq-section" id="faq">
        <div className="section-header animate-on-scroll">
          <span className="section-label font-mono">FAQ</span>
          <h2 className="section-title">
            <span className="serif-title">Preguntas frecuentes,</span>
            <span className="sans-title">respuestas claras</span>
          </h2>
          <p className="section-subtitle">Todo lo que necesitas saber antes de comenzar.</p>
        </div>

        <div className="faq-container animate-on-scroll">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq-item ${openFaq === i ? 'open' : ''}`}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="faq-question">
                <span>{faq.question}</span>
                <span className="faq-toggle font-mono">{openFaq === i ? '−' : '+'}</span>
              </div>
              {openFaq === i && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section cta-section" id="cta">
        <div className="cta-box animate-on-scroll">
          <h2 className="section-title">
            <span className="serif-title">¿Listo para tomar el control?</span>
          </h2>
          <p>
            Únete a miles de freelancers que ya organizan su trabajo con Chrono.
            Sin tarjeta de crédito.
          </p>
          <button className="btn-mono-pill" id="cta-final" onClick={() => navigate('/register')}>
            • Crear cuenta gratis {Icons.arrow}
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer" id="footer">
        <div className="footer-inner">
          <div className="footer-brand font-sans">
            <div className="logo-mark-sm">C</div>
            Chrono
          </div>
          <div className="footer-links font-mono">
            <a href="#hero">Producto</a>
            <a href="#features">Funcionalidades</a>
            <a href="#pricing">Precios</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="footer-copy font-mono">
            © {new Date().getFullYear()} Chrono Inc.
          </div>
        </div>
      </footer>
    </>
  )
}