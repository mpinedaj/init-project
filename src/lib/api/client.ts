import type { Client, Invoice, Project, TimeEntry } from '../../types'
import { seedClients, seedInvoices, seedProjects } from '../seed'

/**
 * Contrato de datos del SaaS.
 * La implementación actual persiste en localStorage. Al migrar a Supabase,
 * solo hay que reemplazar `createLocalStorageApi` por un cliente HTTP/PostgREST
 * que cumpla la misma interfaz, sin tocar los componentes.
 */
export interface DataApi {
  getProjects(): Promise<Project[]>
  saveProjects(projects: Project[]): Promise<void>

  getClients(): Promise<Client[]>
  saveClients(clients: Client[]): Promise<void>

  getInvoices(): Promise<Invoice[]>
  saveInvoices(invoices: Invoice[]): Promise<void>

  getTimeEntries(): Promise<TimeEntry[]>
  saveTimeEntries(entries: TimeEntry[]): Promise<void>

  clear(): Promise<void>
}

const KEYS = {
  projects: 'konta:projects',
  clients: 'konta:clients',
  invoices: 'konta:invoices',
  timeEntries: 'konta:timeEntries',
} as const

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function createLocalStorageApi(): DataApi {
  return {
    async getProjects() {
      return read<Project[]>(KEYS.projects, seedProjects)
    },
    async saveProjects(projects) {
      write(KEYS.projects, projects)
    },

    async getClients() {
      return read<Client[]>(KEYS.clients, seedClients)
    },
    async saveClients(clients) {
      write(KEYS.clients, clients)
    },

    async getInvoices() {
      return read<Invoice[]>(KEYS.invoices, seedInvoices)
    },
    async saveInvoices(invoices) {
      write(KEYS.invoices, invoices)
    },

    async getTimeEntries() {
      return read<TimeEntry[]>(KEYS.timeEntries, [])
    },
    async saveTimeEntries(entries) {
      write(KEYS.timeEntries, entries)
    },

    async clear() {
      Object.values(KEYS).forEach((key) => localStorage.removeItem(key))
    },
  }
}