import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Client, Invoice, Project, ProjectStatus, TimeEntry } from '../types'
import { seedClients, seedInvoices, seedProjects } from '../lib/seed'
import { generateInvoiceNumber } from '../lib/format'
import * as repo from '../lib/repository'

type TabId = 'overview' | 'projects' | 'clients' | 'invoices' | 'settings'
type ViewMode = 'kanban' | 'table'
type ModalName = 'newProject' | 'newClient' | 'newInvoice' | null

// Estado de sincronización con backend
type SyncStatus = 'idle' | 'loading' | 'synced' | 'error'

interface AppState {
  projects: Project[]
  clients: Client[]
  invoices: Invoice[]
  timeEntries: TimeEntry[]

  activeTab: TabId
  viewMode: ViewMode
  searchQuery: string
  toastMessage: string | null
  selectedProjectId: number | null
  openModal: ModalName
  syncStatus: SyncStatus

  // UI actions
  setActiveTab: (tab: TabId) => void
  setViewMode: (mode: ViewMode) => void
  setSearchQuery: (q: string) => void
  showToast: (msg: string) => void
  clearToast: () => void
  setSelectedProjectId: (id: number | null) => void
  setOpenModal: (modal: ModalName) => void

  // Data loading
  loadFromSupabase: () => Promise<void>

  // Project actions
  addProject: (input: {
    title: string
    clientId: number
    budget: number
    deadline: string
    priority: Project['priority']
  }) => Project
  updateProject: (project: Project) => void
  moveProject: (projectId: number, status: ProjectStatus) => void
  deleteProject: (projectId: number) => void
  toggleTask: (projectId: number, taskId: number) => void
  addTask: (projectId: number, text: string) => void
  addTimeToProject: (projectId: number, seconds: number) => void

  // Client actions
  addClient: (input: { name: string; contact: string; email: string }) => Client
  updateClient: (client: Client) => void
  deleteClient: (clientId: number) => void

  // Invoice actions
  addInvoice: (input: { clientId: number; amount: number; dueDate: string }) => Invoice
  markInvoicePaid: (invoiceId: string, paid: boolean) => void
  deleteInvoice: (invoiceId: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: seedProjects,
      clients: seedClients,
      invoices: seedInvoices,
      timeEntries: [],

      activeTab: 'overview',
      viewMode: 'kanban',
      searchQuery: '',
      toastMessage: null,
      selectedProjectId: null,
      openModal: null,
      syncStatus: 'idle',

      setActiveTab: (tab) => set({ activeTab: tab, searchQuery: '' }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      showToast: (msg) => set({ toastMessage: msg }),
      clearToast: () => set({ toastMessage: null }),
      setSelectedProjectId: (id) => set({ selectedProjectId: id }),
      setOpenModal: (modal) => set({ openModal: modal }),

      loadFromSupabase: async () => {
        set({ syncStatus: 'loading' })
        try {
          const [projects, clients, invoices, timeEntries] = await Promise.all([
            repo.fetchProjects(),
            repo.fetchClients(),
            repo.fetchInvoices(),
            repo.fetchTimeEntries(),
          ])
          set({
            projects: projects.length ? projects : seedProjects,
            clients: clients.length ? clients : seedClients,
            invoices: invoices.length ? invoices : seedInvoices,
            timeEntries,
            syncStatus: 'synced',
          })
        } catch (error) {
          console.error('Error cargando datos desde Supabase:', error)
          set({ syncStatus: 'error' })
        }
      },

      addProject: (input) => {
        const client = get().clients.find((c) => c.id === input.clientId)
        const newProject: Project = {
          id: Date.now(),
          title: input.title,
          clientId: input.clientId,
          clientName: client?.name || 'Sin cliente',
          status: 'Pendiente',
          priority: input.priority,
          budget: input.budget,
          deadline: input.deadline,
          hoursTracked: 0,
          hourlyRate: 50,
          createdAt: new Date().toISOString(),
          tasks: [
            { id: 1, text: 'Definir alcance y entregar propuesta', done: false },
            { id: 2, text: 'Desarrollo de entregables principales', done: false },
          ],
        }
        set({ projects: [newProject, ...get().projects] })
        repo.insertProject(newProject).catch((e) => console.error('Error insertando proyecto:', e))
        return newProject
      },

      updateProject: (project) => {
        set({
          projects: get().projects.map((p) => (p.id === project.id ? project : p)),
        })
        repo.updateProjectRecord(project).catch((e) => console.error('Error actualizando proyecto:', e))
      },

      moveProject: (projectId, status) => {
        const updated = get().projects.map((p) => (p.id === projectId ? { ...p, status } : p))
        set({ projects: updated })
        const project = updated.find((p) => p.id === projectId)
        if (project) repo.updateProjectRecord(project).catch((e) => console.error('Error moviendo proyecto:', e))
      },

      deleteProject: (projectId) => {
        set({ projects: get().projects.filter((p) => p.id !== projectId) })
        repo.deleteProjectRecord(projectId).catch((e) => console.error('Error eliminando proyecto:', e))
      },

      toggleTask: (projectId, taskId) => {
        const updated = get().projects.map((p) =>
          p.id === projectId
            ? { ...p, tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) }
            : p,
        )
        set({ projects: updated })
        const project = updated.find((p) => p.id === projectId)
        if (project) repo.updateProjectRecord(project).catch((e) => console.error('Error actualizando tarea:', e))
      },

      addTask: (projectId, text) => {
        const updated = get().projects.map((p) =>
          p.id === projectId
            ? { ...p, tasks: [...p.tasks, { id: Date.now(), text, done: false }] }
            : p,
        )
        set({ projects: updated })
        const project = updated.find((p) => p.id === projectId)
        if (project) repo.updateProjectRecord(project).catch((e) => console.error('Error agregando tarea:', e))
      },

      addTimeToProject: (projectId, seconds) => {
        const updated = get().projects.map((p) =>
          p.id === projectId ? { ...p, hoursTracked: p.hoursTracked + seconds } : p,
        )
        const entry: TimeEntry = {
          id: Date.now(),
          projectId,
          seconds,
          date: new Date().toISOString(),
        }
        set({
          projects: updated,
          timeEntries: [entry, ...get().timeEntries],
        })
        const project = updated.find((p) => p.id === projectId)
        if (project) repo.updateProjectRecord(project).catch((e) => console.error('Error guardando tiempo:', e))
        repo.insertTimeEntry(entry).catch((e) => console.error('Error insertando time entry:', e))
      },

      addClient: (input) => {
        const newClient: Client = {
          id: Date.now(),
          name: input.name,
          contact: input.contact,
          email: input.email,
          totalBilled: 0,
        }
        set({ clients: [...get().clients, newClient] })
        repo.insertClient(newClient).catch((e) => console.error('Error insertando cliente:', e))
        return newClient
      },

      updateClient: (client) => {
        set({ clients: get().clients.map((c) => (c.id === client.id ? client : c)) })
        repo.updateClientRecord(client).catch((e) => console.error('Error actualizando cliente:', e))
      },

      deleteClient: (clientId) => {
        set({ clients: get().clients.filter((c) => c.id !== clientId) })
        repo.deleteClientRecord(clientId).catch((e) => console.error('Error eliminando cliente:', e))
      },

      addInvoice: (input) => {
        const client = get().clients.find((c) => c.id === input.clientId)
        const number = generateInvoiceNumber(get().invoices.map((i) => i.number))
        const newInvoice: Invoice = {
          id: number,
          number,
          clientId: input.clientId,
          clientName: client?.name || 'Sin cliente',
          amount: input.amount,
          date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
          dueDate: input.dueDate,
          status: 'Pendiente',
        }
        set({ invoices: [newInvoice, ...get().invoices] })
        repo.insertInvoice(newInvoice).catch((e) => console.error('Error insertando factura:', e))
        return newInvoice
      },

      markInvoicePaid: (invoiceId, paid) => {
        const updated = get().invoices.map((i) =>
          i.id === invoiceId
            ? { ...i, status: (paid ? 'Pagada' : 'Pendiente') as Invoice['status'] }
            : i,
        )
        set({ invoices: updated })
        const invoice = updated.find((i) => i.id === invoiceId)
        if (invoice) repo.updateInvoiceRecord(invoice).catch((e) => console.error('Error actualizando factura:', e))
      },

      deleteInvoice: (invoiceId) => {
        set({ invoices: get().invoices.filter((i) => i.id !== invoiceId) })
        repo.deleteInvoiceRecord(invoiceId).catch((e) => console.error('Error eliminando factura:', e))
      },
    }),
    {
      name: 'konta-storage',
      partialize: (state) => ({
        projects: state.projects,
        clients: state.clients,
        invoices: state.invoices,
        timeEntries: state.timeEntries,
        viewMode: state.viewMode,
      }),
    },
  ),
)

export const useTabTitle = (tab: TabId) => {
  const titles: Record<TabId, string> = {
    overview: 'Inicio',
    projects: 'Proyectos',
    clients: 'Clientes',
    invoices: 'Facturas',
    settings: 'Configuración',
  }
  return titles[tab]
}