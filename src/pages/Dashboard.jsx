import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import StatCard from '../components/StatCard'
import KanbanBoard from '../components/KanbanBoard'
import ProjectDetailModal from '../components/ProjectDetailModal'
import Toast from '../components/Toast'

const initialProjects = [
  { 
    id: 1, 
    title: 'Rediseño E-commerce Web', 
    client: 'Acme Studio', 
    status: 'En Progreso', 
    priority: 'Alta',
    budget: '$2,800', 
    deadline: '15 Sep, 2026',
    hoursTracked: 16200, // 4.5 hrs
    tasks: [
      { id: 1, text: 'Definir paleta de colores y tipografía', done: true },
      { id: 2, text: 'Diseño de la página principal', done: true },
      { id: 3, text: 'Integración con pasarela de pagos Stripe', done: false },
      { id: 4, text: 'Pruebas responsive en móviles', done: false },
    ]
  },
  { 
    id: 2, 
    title: 'App Móvil iOS & Android', 
    client: 'TechNova Labs', 
    status: 'En Revisión', 
    priority: 'Alta',
    budget: '$4,500', 
    deadline: '20 Sep, 2026',
    hoursTracked: 32400, // 9.0 hrs
    tasks: [
      { id: 1, text: 'Arquitectura en React Native', done: true },
      { id: 2, text: 'Autenticación con Firebase', done: true },
      { id: 3, text: 'Publicación en TestFlight', done: true },
      { id: 4, text: 'Aprobación en App Store', done: false },
    ]
  },
  { 
    id: 3, 
    title: 'Branding & Identidad Visual', 
    client: 'Kira Coffee Co.', 
    status: 'Completado', 
    priority: 'Media',
    budget: '$1,200', 
    deadline: '01 Sep, 2026',
    hoursTracked: 21600, // 6.0 hrs
    tasks: [
      { id: 1, text: 'Vectorización de logotipo principal', done: true },
      { id: 2, text: 'Manual de uso de marca', done: true },
      { id: 3, text: 'Diseño de empaques para café', done: true },
    ]
  },
  { 
    id: 4, 
    title: 'Auditoría de Seguridad API', 
    client: 'FinPay Corp', 
    status: 'En Progreso', 
    priority: 'Baja',
    budget: '$3,100', 
    deadline: '30 Sep, 2026',
    hoursTracked: 7200, // 2.0 hrs
    tasks: [
      { id: 1, text: 'Análisis de vulnerabilidades OWASP', done: true },
      { id: 2, text: 'Reporte de tokens JWT y cifrado', done: false },
      { id: 3, text: 'Documentación de parches de seguridad', done: false },
    ]
  },
  { 
    id: 5, 
    title: 'Dashboard Analytics React', 
    client: 'Solaris Energy', 
    status: 'Pendiente', 
    priority: 'Media',
    budget: '$1,950', 
    deadline: '10 Oct, 2026',
    hoursTracked: 0,
    tasks: [
      { id: 1, text: 'Estructuración de componentes de gráfica', done: false },
      { id: 2, text: 'Conexión con base de datos PostgreSQL', done: false },
    ]
  },
]

const initialClients = [
  { id: 1, name: 'Acme Studio', contact: 'Laura García', email: 'laura@acme.com', activeProjects: 1, totalBilled: '$8,400', pct: 40 },
  { id: 2, name: 'TechNova Labs', contact: 'Carlos Ruiz', email: 'carlos@technova.io', activeProjects: 1, totalBilled: '$12,000', pct: 35 },
  { id: 3, name: 'Kira Coffee Co.', contact: 'Elena Rostova', email: 'elena@kiracoffee.com', activeProjects: 0, totalBilled: '$3,500', pct: 15 },
  { id: 4, name: 'FinPay Corp', contact: 'David Miller', email: 'david@finpay.com', activeProjects: 1, totalBilled: '$6,200', pct: 10 },
]

const initialInvoices = [
  { id: 'INV-2026-001', client: 'Acme Studio', amount: '$1,400', date: '01 Sep 2026', status: 'Pagada' },
  { id: 'INV-2026-002', client: 'TechNova Labs', amount: '$2,250', date: '28 Ago 2026', status: 'Pendiente' },
  { id: 'INV-2026-003', client: 'Kira Coffee Co.', amount: '$1,200', date: '15 Ago 2026', status: 'Pagada' },
  { id: 'INV-2026-004', client: 'FinPay Corp', amount: '$1,550', date: '03 Sep 2026', status: 'Pendiente' },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [projects, setProjects] = useState(initialProjects)
  const [clients, setClients] = useState(initialClients)
  const [invoices, setInvoices] = useState(initialInvoices)
  
  // Search & Toast state
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState(null)

  // Selected project for modal detail
  const [selectedProject, setSelectedProject] = useState(null)
  const [viewMode, setViewMode] = useState('kanban') // 'kanban' or 'table'

  // Modal New Project State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProjectTitle, setNewProjectTitle] = useState('')
  const [newProjectClient, setNewProjectClient] = useState('Acme Studio')
  const [newProjectBudget, setNewProjectBudget] = useState('')
  const [newProjectDeadline, setNewProjectDeadline] = useState('')
  const [newProjectPriority, setNewProjectPriority] = useState('Media')

  const showToast = (msg) => {
    setToastMessage(msg)
  }

  const tabTitles = {
    overview: 'Inicio & Resumen',
    projects: 'Gestión de Proyectos & Kanban',
    clients: 'Directorio de Clientes',
    invoices: 'Facturación & Pagos',
    settings: 'Configuración de la Cuenta'
  }

  // Dynamic search filtering
  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredInvoices = invoices.filter(inv =>
    inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddProject = (e) => {
    e.preventDefault()
    if (!newProjectTitle.trim()) return

    const newObj = {
      id: Date.now(),
      title: newProjectTitle,
      client: newProjectClient,
      status: 'Pendiente',
      priority: newProjectPriority,
      budget: newProjectBudget ? `$${newProjectBudget}` : '$1,000',
      deadline: newProjectDeadline || '30 Sep, 2026',
      hoursTracked: 0,
      tasks: [
        { id: 1, text: 'Definir alcance y entregar propuesta', done: false },
        { id: 2, text: 'Desarrollo de entregables principales', done: false }
      ]
    }

    setProjects([newObj, ...projects])
    setNewProjectTitle('')
    setNewProjectBudget('')
    setNewProjectDeadline('')
    setIsModalOpen(false)
    showToast(`Proyecto "${newObj.title}" creado con éxito ✨`)
  }

  const handleMoveProject = (projectId, newStatus) => {
    const proj = projects.find(p => p.id === projectId)
    setProjects(projects.map(p => p.id === projectId ? { ...p, status: newStatus } : p))
    showToast(`Proyecto "${proj.title}" movido a ${newStatus}`)
  }

  const handleUpdateProject = (updatedProject) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p))
    setSelectedProject(updatedProject)
  }

  return (
    <div className="dashboard-layout" id="dashboard-root">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="dashboard-main">
        <Topbar 
          activeTabTitle={tabTitles[activeTab]} 
          onNewProject={() => setIsModalOpen(true)} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="dashboard-content">
          {searchQuery && (
            <div className="search-active-banner">
              Resultados para: <strong>"{searchQuery}"</strong> ({filteredProjects.length} proyectos, {filteredClients.length} clientes, {filteredInvoices.length} facturas)
            </div>
          )}

          {/* ================= OVERVIEW TAB ================= */}
          {activeTab === 'overview' && (
            <div className="tab-content" id="tab-overview">
              {/* Metric Cards */}
              <div className="stats-grid">
                <StatCard 
                  title="Ingresos del Mes" 
                  value="$4,850" 
                  change="+14% vs mes anterior" 
                  isPositive={true} 
                  subtitle="4 facturas cobradas"
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  }
                />
                <StatCard 
                  title="Facturas Pendientes" 
                  value="$3,800" 
                  change="2 pendientes" 
                  isPositive={false} 
                  subtitle="Vencimiento medio: 5 días"
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  }
                />
                <StatCard 
                  title="Proyectos Activos" 
                  value={projects.filter(p => p.status === 'En Progreso' || p.status === 'En Revisión').length.toString()} 
                  change="+2 este mes" 
                  isPositive={true} 
                  subtitle="Capacidad: 80%"
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                  }
                />
                <StatCard 
                  title="Clientes Totales" 
                  value={clients.length.toString()} 
                  change="100% satisfacción" 
                  isPositive={true} 
                  subtitle="4 activos"
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  }
                />
              </div>

              {/* Financial Breakdown Bar Visual */}
              <div className="card mb-6">
                <div className="card-header">
                  <div>
                    <h3>Distribución de Ingresos por Cliente</h3>
                    <p className="card-subtitle">Desglose de facturación acumulada del trimestre</p>
                  </div>
                  <span className="text-emerald-400 font-bold">$30,100.00 Total</span>
                </div>
                <div className="financial-bar-container">
                  <div className="financial-bar">
                    <div className="bar-segment seg-1" style={{ width: '40%' }} title="Acme Studio 40%"></div>
                    <div className="bar-segment seg-2" style={{ width: '35%' }} title="TechNova Labs 35%"></div>
                    <div className="bar-segment seg-3" style={{ width: '15%' }} title="Kira Coffee Co. 15%"></div>
                    <div className="bar-segment seg-4" style={{ width: '10%' }} title="FinPay Corp 10%"></div>
                  </div>
                  <div className="financial-legend">
                    <span className="legend-item"><span className="dot seg-1"></span> Acme Studio (40%)</span>
                    <span className="legend-item"><span className="dot seg-2"></span> TechNova Labs (35%)</span>
                    <span className="legend-item"><span className="dot seg-3"></span> Kira Coffee (15%)</span>
                    <span className="legend-item"><span className="dot seg-4"></span> FinPay Corp (10%)</span>
                  </div>
                </div>
              </div>

              {/* Kanban Vista Previa */}
              <div className="card mb-6">
                <div className="card-header">
                  <div>
                    <h3>Flujo de Trabajo (Kanban)</h3>
                    <p className="card-subtitle">Haz clic en cualquier proyecto para ver sus tareas o mover su estado</p>
                  </div>
                  <button className="btn-link" onClick={() => setActiveTab('projects')}>Pantalla completa →</button>
                </div>
                <KanbanBoard 
                  projects={filteredProjects} 
                  onMoveProject={handleMoveProject}
                  onSelectProject={(p) => setSelectedProject(p)}
                />
              </div>
            </div>
          )}

          {/* ================= PROJECTS TAB ================= */}
          {activeTab === 'projects' && (
            <div className="tab-content" id="tab-projects">
              <div className="card">
                <div className="card-header">
                  <div>
                    <h3>Tablero de Proyectos</h3>
                    <p className="card-subtitle">Gestiona tareas, sub-entregables y progreso en tiempo real</p>
                  </div>
                  <div className="header-actions">
                    <div className="view-toggle">
                      <button 
                        className={`toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                        onClick={() => setViewMode('kanban')}
                      >
                        Kanban
                      </button>
                      <button 
                        className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                        onClick={() => setViewMode('table')}
                      >
                        Tabla
                      </button>
                    </div>
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                      + Nuevo Proyecto
                    </button>
                  </div>
                </div>

                {viewMode === 'kanban' ? (
                  <KanbanBoard 
                    projects={filteredProjects} 
                    onMoveProject={handleMoveProject}
                    onSelectProject={(p) => setSelectedProject(p)}
                  />
                ) : (
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Proyecto</th>
                          <th>Cliente</th>
                          <th>Prioridad</th>
                          <th>Horas</th>
                          <th>Presupuesto</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjects.map((p) => (
                          <tr key={p.id} className="cursor-pointer" onClick={() => setSelectedProject(p)}>
                            <td className="font-medium">{p.title}</td>
                            <td className="text-secondary">{p.client}</td>
                            <td>
                              <span className={`priority-badge ${(p.priority || 'Media').toLowerCase()}`}>
                                {p.priority || 'Media'}
                              </span>
                            </td>
                            <td className="font-mono text-sm">{p.hoursTracked ? `${(p.hoursTracked / 3600).toFixed(1)}h` : '0h'}</td>
                            <td className="font-semibold">{p.budget}</td>
                            <td>
                              <span className={`status-badge ${p.status.toLowerCase().replace(' ', '-')}`}>
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= CLIENTS TAB ================= */}
          {activeTab === 'clients' && (
            <div className="tab-content" id="tab-clients">
              <div className="card">
                <div className="card-header">
                  <div>
                    <h3>Directorio de Clientes</h3>
                    <p className="card-subtitle">Contacto e historial comercial con cada cuenta</p>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Empresa / Cliente</th>
                        <th>Contacto Principal</th>
                        <th>Email</th>
                        <th>Proyectos Activos</th>
                        <th>Total Facturado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map((c) => (
                        <tr key={c.id}>
                          <td className="font-medium">{c.name}</td>
                          <td className="text-secondary">{c.contact}</td>
                          <td className="font-mono text-sm">{c.email}</td>
                          <td>{c.activeProjects}</td>
                          <td className="font-semibold">{c.totalBilled}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= INVOICES TAB ================= */}
          {activeTab === 'invoices' && (
            <div className="tab-content" id="tab-invoices">
              <div className="card">
                <div className="card-header">
                  <div>
                    <h3>Gestión de Facturas</h3>
                    <p className="card-subtitle">Control de cuentas por cobrar e historial de pagos</p>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Nº Factura</th>
                        <th>Cliente</th>
                        <th>Fecha de Emisión</th>
                        <th>Monto</th>
                        <th>Estado</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((inv) => (
                        <tr key={inv.id}>
                          <td className="font-mono text-sm">{inv.id}</td>
                          <td className="font-medium">{inv.client}</td>
                          <td>{inv.date}</td>
                          <td className="font-semibold">{inv.amount}</td>
                          <td>
                            <span className={`status-badge ${inv.status.toLowerCase()}`}>
                              {inv.status}
                            </span>
                          </td>
                          <td>
                            {inv.status === 'Pendiente' && (
                              <button 
                                className="btn btn-outline btn-sm"
                                onClick={() => {
                                  setInvoices(invoices.map(i => i.id === inv.id ? { ...i, status: 'Pagada' } : i))
                                  showToast(`Factura ${inv.id} marcada como Pagada ✓`)
                                }}
                              >
                                Marcar Pagada
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= SETTINGS TAB ================= */}
          {activeTab === 'settings' && (
            <div className="tab-content" id="tab-settings">
              <div className="card max-w-2xl">
                <div className="card-header">
                  <h3>Configuración de Perfil Freelance</h3>
                </div>
                <form className="settings-form" onSubmit={(e) => { e.preventDefault(); showToast('Configuración guardada exitosamente ✓') }}>
                  <div className="form-group">
                    <label>Nombre Completo</label>
                    <input type="text" defaultValue="Martín Pineda" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input type="email" defaultValue="martin@ejemplo.com" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Tarifa por Hora ($ / hr)</label>
                    <input type="number" defaultValue="50" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Moneda Preferida</label>
                    <select defaultValue="USD" className="form-input">
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="MXN">MXN ($)</option>
                      <option value="COP">COP ($)</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* ================= MODAL DETALLE DE PROYECTO ================= */}
      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)}
          onUpdateProject={handleUpdateProject}
        />
      )}

      {/* ================= MODAL NUEVO PROYECTO ================= */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Crear Nuevo Proyecto</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleAddProject}>
              <div className="form-group">
                <label>Nombre del Proyecto</label>
                <input 
                  type="text" 
                  placeholder="Ej: Rediseño Sitio Web" 
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  className="form-input" 
                  required
                />
              </div>
              <div className="form-group">
                <label>Cliente</label>
                <select 
                  value={newProjectClient} 
                  onChange={(e) => setNewProjectClient(e.target.value)}
                  className="form-input"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Presupuesto ($)</label>
                  <input 
                    type="number" 
                    placeholder="2500" 
                    value={newProjectBudget}
                    onChange={(e) => setNewProjectBudget(e.target.value)}
                    className="form-input" 
                  />
                </div>
                <div className="form-group">
                  <label>Prioridad</label>
                  <select 
                    value={newProjectPriority}
                    onChange={(e) => setNewProjectPriority(e.target.value)}
                    className="form-input"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Crear Proyecto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
