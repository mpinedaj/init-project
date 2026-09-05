import { useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import StatCard from '../components/StatCard'
import KanbanBoard from '../components/KanbanBoard'
import ProjectDetailModal from '../components/ProjectDetailModal'
import TimeTrackerWidget from '../components/TimeTrackerWidget'
import Toast from '../components/Toast'
import ProjectFormModal from '../components/ProjectFormModal'
import ClientFormModal from '../components/ClientFormModal'
import InvoiceFormModal from '../components/InvoiceFormModal'
import { useAppStore } from '../store/useAppStore'
import {
  calculateMonthlyRevenue,
  calculatePendingInvoices,
  calculateClientBreakdown,
} from '../lib/metrics'
import { formatCurrency, formatHours } from '../lib/format'

export default function Dashboard() {
  const projects = useAppStore((s) => s.projects)
  const clients = useAppStore((s) => s.clients)
  const invoices = useAppStore((s) => s.invoices)
  const activeTab = useAppStore((s) => s.activeTab)
  const viewMode = useAppStore((s) => s.viewMode)
  const setViewMode = useAppStore((s) => s.setViewMode)
  const searchQuery = useAppStore((s) => s.searchQuery)
  const toastMessage = useAppStore((s) => s.toastMessage)
  const clearToast = useAppStore((s) => s.clearToast)
  const selectedProjectId = useAppStore((s) => s.selectedProjectId)
  const setSelectedProjectId = useAppStore((s) => s.setSelectedProjectId)
  const openModal = useAppStore((s) => s.openModal)
  const setOpenModal = useAppStore((s) => s.setOpenModal)
  const markInvoicePaid = useAppStore((s) => s.markInvoicePaid)
  const deleteInvoice = useAppStore((s) => s.deleteInvoice)
  const deleteClient = useAppStore((s) => s.deleteClient)
  const showToast = useAppStore((s) => s.showToast)

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || null

  // Filters
  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase()
    if (!q) return projects
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q),
    )
  }, [projects, searchQuery])

  const filteredClients = useMemo(() => {
    const q = searchQuery.toLowerCase()
    if (!q) return clients
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.contact.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q),
    )
  }, [clients, searchQuery])

  const filteredInvoices = useMemo(() => {
    const q = searchQuery.toLowerCase()
    if (!q) return invoices
    return invoices.filter(
      (inv) =>
        inv.number.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        inv.status.toLowerCase().includes(q),
    )
  }, [invoices, searchQuery])

  // Metrics
  const monthlyRevenue = calculateMonthlyRevenue(projects)
  const pending = calculatePendingInvoices(invoices)
  const activeProjects = projects.filter((p) => p.status !== 'Completado').length
  const { breakdown } = calculateClientBreakdown(clients, invoices)

  const handleExportInvoicePdf = () => {
    window.print()
  }

  return (
    <div className="dashboard-layout" id="dashboard-root">
      <Sidebar />

      <div className="dashboard-main">
        <Topbar />

        <main className="dashboard-content">
          {searchQuery && (
            <div className="search-active-banner">
              Resultados para: <strong>"{searchQuery}"</strong> ({filteredProjects.length} proyectos,{' '}
              {filteredClients.length} clientes, {filteredInvoices.length} facturas)
            </div>
          )}

          {/* ================= OVERVIEW TAB ================= */}
          {activeTab === 'overview' && (
            <div className="tab-content" id="tab-overview">
              <div className="stats-grid">
                <StatCard
                  title="INGRESOS DEL MES"
                  value={formatCurrency(monthlyRevenue)}
                  change="▲ +14% vs. mes anterior"
                  isPositive
                  iconBg="yellow"
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  }
                />
                <StatCard
                  title="FACTURAS PENDIENTES"
                  value={String(pending.count)}
                  subtitle={formatCurrency(pending.total) + ' por cobrar'}
                  iconBg="dark"
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  }
                />
                <StatCard
                  title="PROYECTOS ACTIVOS"
                  value={String(activeProjects)}
                  subtitle={`${projects.filter((p) => p.status === 'En Progreso').length} en progreso`}
                  iconBg="emerald"
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                  }
                />
                <StatCard
                  title="CLIENTES TOTALES"
                  value={String(clients.length)}
                  subtitle={`${clients.reduce((sum, c) => sum + (c.totalBilled > 0 ? 1 : 0), 0)} con facturación`}
                  iconBg="yellow-user"
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  }
                />
              </div>

              <div className="dashboard-grid-2col mb-6">
                <div className="card">
                  <div className="card-header mb-4">
                    <h3>Distribución financiera por cliente</h3>
                    <span className="sidebar-version font-mono">Este mes</span>
                  </div>
                  <div className="client-breakdown-list">
                    {breakdown.map((c) => (
                      <div key={c.id} className="client-breakdown-item">
                        <div className="breakdown-top">
                          <span>{c.name}</span>
                          <span className="text-muted font-mono">{c.pct}%</span>
                        </div>
                        <div className="breakdown-bar-bg">
                          <div className="breakdown-bar-fill" style={{ width: `${c.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-dark-due">
                  <h3>Próximo a vencer</h3>
                  <div className="due-invoices-list">
                    {invoices
                      .filter((i) => i.status === 'Pendiente')
                      .slice(0, 3)
                      .map((inv) => (
                        <div key={inv.id} className="due-invoice-item">
                          <div>
                            <div className="due-inv-id font-mono">{inv.number}</div>
                            <div className="due-inv-client">{inv.clientName}</div>
                          </div>
                          <div className="due-inv-amount font-mono">{formatCurrency(inv.amount)}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="card mb-6">
                <div className="card-header mb-4">
                  <h3>Seguimiento de tiempo</h3>
                </div>
                <TimeTrackerWidget projects={projects} />
              </div>

              <div className="card">
                <div className="card-header mb-6">
                  <h3>Tablero de Proyectos</h3>
                  <div className="aether-card-tabs font-mono">
                    <button className={`aether-tab ${viewMode === 'kanban' ? 'active' : ''}`} onClick={() => setViewMode('kanban')}>Kanban</button>
                    <button className={`aether-tab ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>Tabla</button>
                  </div>
                </div>

                {viewMode === 'kanban' ? (
                  <KanbanBoard projects={filteredProjects} />
                ) : (
                  <ProjectTable projects={filteredProjects} />
                )}
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
                      <button className={`toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`} onClick={() => setViewMode('kanban')}>Kanban</button>
                      <button className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>Tabla</button>
                    </div>
                    <button className="btn btn-primary" onClick={() => setOpenModal('newProject')}>+ Nuevo Proyecto</button>
                  </div>
                </div>

                {viewMode === 'kanban' ? (
                  <KanbanBoard projects={filteredProjects} />
                ) : (
                  <ProjectTable projects={filteredProjects} />
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
                  <button className="btn btn-primary" onClick={() => setOpenModal('newClient')}>+ Nuevo Cliente</button>
                </div>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Empresa / Cliente</th>
                        <th>Contacto Principal</th>
                        <th>Email</th>
                        <th>Total Facturado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map((c) => (
                        <tr key={c.id}>
                          <td className="font-medium">{c.name}</td>
                          <td className="text-secondary">{c.contact}</td>
                          <td className="font-mono text-sm">{c.email}</td>
                          <td className="font-semibold">{formatCurrency(c.totalBilled)}</td>
                          <td>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => {
                                deleteClient(c.id)
                                showToast(`Cliente "${c.name}" eliminado`)
                              }}
                            >
                              Eliminar
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

          {/* ================= INVOICES TAB ================= */}
          {activeTab === 'invoices' && (
            <div className="tab-content" id="tab-invoices">
              <div className="card">
                <div className="card-header">
                  <div>
                    <h3>Gestión de Facturas</h3>
                    <p className="card-subtitle">Control de cuentas por cobrar e historial de pagos</p>
                  </div>
                  <button className="btn btn-primary" onClick={() => setOpenModal('newInvoice')}>+ Nueva Factura</button>
                </div>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Nº Factura</th>
                        <th>Cliente</th>
                        <th>Fecha de Emisión</th>
                        <th>Vencimiento</th>
                        <th>Monto</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((inv) => (
                        <tr key={inv.id}>
                          <td className="font-mono text-sm">{inv.number}</td>
                          <td className="font-medium">{inv.clientName}</td>
                          <td>{inv.date}</td>
                          <td>{inv.dueDate}</td>
                          <td className="font-semibold">{formatCurrency(inv.amount)}</td>
                          <td>
                            <span className={`status-badge ${inv.status.toLowerCase()}`}>{inv.status}</span>
                          </td>
                          <td>
                            <div className="row-actions">
                              {inv.status === 'Pendiente' && (
                                <button
                                  className="btn btn-outline btn-sm"
                                  onClick={() => {
                                    markInvoicePaid(inv.id, true)
                                    showToast(`Factura ${inv.number} marcada como Pagada ✓`)
                                  }}
                                >
                                  Marcar Pagada
                                </button>
                              )}
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => handleExportInvoicePdf()}
                              >
                                PDF
                              </button>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => {
                                  deleteInvoice(inv.id)
                                  showToast(`Factura ${inv.number} eliminada`)
                                }}
                              >
                                Eliminar
                              </button>
                            </div>
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
              <SettingsForm />
            </div>
          )}
        </main>
      </div>

      {toastMessage && <Toast message={toastMessage} onClose={clearToast} />}
      {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProjectId(null)} />}
      {openModal === 'newProject' && <ProjectFormModal />}
      {openModal === 'newClient' && <ClientFormModal />}
      {openModal === 'newInvoice' && <InvoiceFormModal />}
    </div>
  )
}

function ProjectTable({ projects }: { projects: ReturnType<typeof useAppStore.getState>['projects'] }) {
  const setSelectedProjectId = useAppStore((s) => s.setSelectedProjectId)
  const deleteProject = useAppStore((s) => s.deleteProject)
  const showToast = useAppStore((s) => s.showToast)

  return (
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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id} className="cursor-pointer" onClick={() => setSelectedProjectId(p.id)}>
              <td className="font-medium">{p.title}</td>
              <td className="text-secondary">{p.clientName}</td>
              <td>
                <span className={`priority-badge ${p.priority.toLowerCase()}`}>{p.priority}</span>
              </td>
              <td className="font-mono text-sm">{formatHours(p.hoursTracked)}h</td>
              <td className="font-semibold">{formatCurrency(p.budget)}</td>
              <td>
                <span className={`status-badge ${p.status.toLowerCase().replace(' ', '-')}`}>{p.status}</span>
              </td>
              <td>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteProject(p.id)
                    showToast(`Proyecto "${p.title}" eliminado`)
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SettingsForm() {
  const showToast = useAppStore((s) => s.showToast)
  const hourlyRate = useAppStore((s) => s.projects[0]?.hourlyRate ?? 50)

  return (
    <div className="card max-w-2xl">
      <div className="card-header">
        <h3>Configuración de Perfil Freelance</h3>
      </div>
      <form
        className="settings-form"
        onSubmit={(e) => {
          e.preventDefault()
          showToast('Configuración guardada exitosamente ✓')
        }}
      >
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
          <input type="number" defaultValue={hourlyRate} className="form-input" />
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
  )
}