import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import StatCard from '../components/StatCard'

const initialProjects = [
  { id: 1, title: 'Rediseño E-commerce Web', client: 'Acme Studio', status: 'En Progreso', budget: '$2,800', deadline: '15 Sep, 2026' },
  { id: 2, title: 'App Móvil iOS & Android', client: 'TechNova Labs', status: 'En Revisión', budget: '$4,500', deadline: '20 Sep, 2026' },
  { id: 3, title: 'Branding & Identidad Visual', client: 'Kira Coffee Co.', status: 'Completado', budget: '$1,200', deadline: '01 Sep, 2026' },
  { id: 4, title: 'Auditoría de Seguridad API', client: 'FinPay Corp', status: 'En Progreso', budget: '$3,100', deadline: '30 Sep, 2026' },
  { id: 5, title: 'Dashboard Analytics React', client: 'Solaris Energy', status: 'Pendiente', budget: '$1,950', deadline: '10 Oct, 2026' },
]

const initialClients = [
  { id: 1, name: 'Acme Studio', contact: 'Laura García', email: 'laura@acme.com', activeProjects: 1, totalBilled: '$8,400' },
  { id: 2, name: 'TechNova Labs', contact: 'Carlos Ruiz', email: 'carlos@technova.io', activeProjects: 1, totalBilled: '$12,000' },
  { id: 3, name: 'Kira Coffee Co.', contact: 'Elena Rostova', email: 'elena@kiracoffee.com', activeProjects: 0, totalBilled: '$3,500' },
  { id: 4, name: 'FinPay Corp', contact: 'David Miller', email: 'david@finpay.com', activeProjects: 1, totalBilled: '$6,200' },
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
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProjectTitle, setNewProjectTitle] = useState('')
  const [newProjectClient, setNewProjectClient] = useState('Acme Studio')
  const [newProjectBudget, setNewProjectBudget] = useState('')
  const [newProjectDeadline, setNewProjectDeadline] = useState('')

  const tabTitles = {
    overview: 'Inicio & Resumen',
    projects: 'Gestión de Proyectos',
    clients: 'Directorio de Clientes',
    invoices: 'Facturación & Pagos',
    settings: 'Configuración de la Cuenta'
  }

  const handleAddProject = (e) => {
    e.preventDefault()
    if (!newProjectTitle.trim()) return

    const newObj = {
      id: Date.now(),
      title: newProjectTitle,
      client: newProjectClient,
      status: 'En Progreso',
      budget: newProjectBudget ? `$${newProjectBudget}` : '$1,000',
      deadline: newProjectDeadline || '30 Sep, 2026'
    }

    setProjects([newObj, ...projects])
    setNewProjectTitle('')
    setNewProjectBudget('')
    setNewProjectDeadline('')
    setIsModalOpen(false)
  }

  return (
    <div className="dashboard-layout" id="dashboard-root">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="dashboard-main">
        <Topbar 
          activeTabTitle={tabTitles[activeTab]} 
          onNewProject={() => setIsModalOpen(true)} 
        />

        <main className="dashboard-content">
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
                  value={projects.filter(p => p.status === 'En Progreso').length.toString()} 
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

              {/* Recent Activity & Projects */}
              <div className="dashboard-grid-2col">
                {/* Recent Projects Card */}
                <div className="card">
                  <div className="card-header">
                    <h3>Proyectos Recientes</h3>
                    <button className="btn-link" onClick={() => setActiveTab('projects')}>Ver todos →</button>
                  </div>
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Proyecto</th>
                          <th>Cliente</th>
                          <th>Estado</th>
                          <th>Presupuesto</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.slice(0, 4).map((p) => (
                          <tr key={p.id}>
                            <td className="font-medium">{p.title}</td>
                            <td className="text-secondary">{p.client}</td>
                            <td>
                              <span className={`status-badge ${p.status.toLowerCase().replace(' ', '-')}`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="font-semibold">{p.budget}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Invoices Card */}
                <div className="card">
                  <div className="card-header">
                    <h3>Facturación Reciente</h3>
                    <button className="btn-link" onClick={() => setActiveTab('invoices')}>Ver facturas →</button>
                  </div>
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Factura</th>
                          <th>Cliente</th>
                          <th>Monto</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((inv) => (
                          <tr key={inv.id}>
                            <td className="font-mono text-sm">{inv.id}</td>
                            <td>{inv.client}</td>
                            <td className="font-semibold">{inv.amount}</td>
                            <td>
                              <span className={`status-badge ${inv.status.toLowerCase()}`}>
                                {inv.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= PROJECTS TAB ================= */}
          {activeTab === 'projects' && (
            <div className="tab-content" id="tab-projects">
              <div className="card">
                <div className="card-header">
                  <div>
                    <h3>Listado de Proyectos</h3>
                    <p className="card-subtitle">Administra entregables, estados y presupuestos por cliente</p>
                  </div>
                  <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    + Nuevo Proyecto
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Proyecto</th>
                        <th>Cliente</th>
                        <th>Fecha Límite</th>
                        <th>Presupuesto</th>
                        <th>Estado</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((p) => (
                        <tr key={p.id}>
                          <td className="font-medium">{p.title}</td>
                          <td className="text-secondary">{p.client}</td>
                          <td>{p.deadline}</td>
                          <td className="font-semibold">{p.budget}</td>
                          <td>
                            <span className={`status-badge ${p.status.toLowerCase().replace(' ', '-')}`}>
                              {p.status}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn-action-icon"
                              title="Cambiar estado"
                              onClick={() => {
                                const nextStatus = p.status === 'En Progreso' ? 'En Revisión' : p.status === 'En Revisión' ? 'Completado' : 'En Progreso'
                                setProjects(projects.map(proj => proj.id === p.id ? { ...proj, status: nextStatus } : proj))
                              }}
                            >
                              ↻
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= CLIENTS TAB ================= */}
          {activeTab === 'clients' && (
            <div className="tab-content" id="tab-clients">
              <div className="card">
                <div className="card-header">
                  <div>
                    <h3>Clientes Registrados</h3>
                    <p className="card-subtitle">Directorio de contacto e historial comercial</p>
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
                      {clients.map((c) => (
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
                      {invoices.map((inv) => (
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
                <form className="settings-form" onSubmit={(e) => { e.preventDefault(); alert('Configuración guardada exitosamente') }}>
                  <div className="form-group">
                    <label>Nombre Completo</label>
                    <input type="text" defaultValue="Martín Pineda" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input type="email" defaultValue="martin@ejemplo.com" className="form-input" />
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
                  <div className="form-group">
                    <label>Nombre Comercial / Marca Personal</label>
                    <input type="text" defaultValue="Martín Pineda Design Studio" className="form-input" />
                  </div>
                  <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

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
                  <label>Fecha Límite</label>
                  <input 
                    type="text" 
                    placeholder="30 Sep, 2026" 
                    value={newProjectDeadline}
                    onChange={(e) => setNewProjectDeadline(e.target.value)}
                    className="form-input" 
                  />
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
