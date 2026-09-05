import { supabase } from './supabase'
import type { Client, Invoice, Project, Task, TimeEntry } from '../types'

// ---------- Helpers de mapeo (snake_case DB <-> camelCase TS) ----------

async function getUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    throw new Error('No hay sesión activa')
  }
  return data.user.id
}

function mapProject(row: Record<string, unknown>): Project {
  return {
    id: Number(row.id),
    title: String(row.title ?? ''),
    clientId: row.client_id ? Number(row.client_id) : 0,
    clientName: String(row.client_name ?? ''),
    status: (row.status as Project['status']) ?? 'Pendiente',
    priority: (row.priority as Project['priority']) ?? 'Media',
    budget: Number(row.budget ?? 0),
    deadline: String(row.deadline ?? ''),
    hoursTracked: Number(row.hours_tracked ?? 0),
    hourlyRate: Number(row.hourly_rate ?? 50),
    tasks: (row.tasks as Task[]) ?? [],
    createdAt: String(row.created_at ?? ''),
  }
}

function mapClient(row: Record<string, unknown>): Client {
  return {
    id: Number(row.id),
    name: String(row.name ?? ''),
    contact: String(row.contact ?? ''),
    email: String(row.email ?? ''),
    totalBilled: Number(row.total_billed ?? 0),
  }
}

function mapInvoice(row: Record<string, unknown>): Invoice {
  return {
    id: String(row.id ?? ''),
    number: String(row.number ?? ''),
    clientId: row.client_id ? Number(row.client_id) : 0,
    clientName: String(row.client_name ?? ''),
    amount: Number(row.amount ?? 0),
    date: String(row.issue_date ?? ''),
    dueDate: String(row.due_date ?? ''),
    status: (row.status as Invoice['status']) ?? 'Pendiente',
  }
}

function mapTimeEntry(row: Record<string, unknown>): TimeEntry {
  return {
    id: Number(row.id),
    projectId: Number(row.project_id ?? 0),
    seconds: Number(row.seconds ?? 0),
    date: String(row.entry_date ?? ''),
  }
}

// ---------- CLIENTS ----------

export async function fetchClients(): Promise<Client[]> {
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapClient)
}

export async function insertClient(client: Client): Promise<void> {
  const userId = await getUserId()
  const { error } = await supabase.from('clients').insert({
    id: client.id,
    user_id: userId,
    name: client.name,
    contact: client.contact,
    email: client.email,
    total_billed: client.totalBilled,
  })
  if (error) throw error
}

export async function updateClientRecord(client: Client): Promise<void> {
  const { error } = await supabase
    .from('clients')
    .update({ name: client.name, contact: client.contact, email: client.email, total_billed: client.totalBilled })
    .eq('id', client.id)
  if (error) throw error
}

export async function deleteClientRecord(id: number): Promise<void> {
  const { error } = await supabase.from('clients').delete().eq('id', id)
  if (error) throw error
}

// ---------- PROJECTS ----------

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map(mapProject)
}

export async function insertProject(project: Project): Promise<void> {
  const userId = await getUserId()
  const { error } = await supabase.from('projects').insert({
    id: project.id,
    user_id: userId,
    title: project.title,
    client_id: project.clientId || null,
    client_name: project.clientName,
    status: project.status,
    priority: project.priority,
    budget: project.budget,
    deadline: project.deadline,
    hours_tracked: project.hoursTracked,
    hourly_rate: project.hourlyRate,
    tasks: project.tasks,
  })
  if (error) throw error
}

export async function updateProjectRecord(project: Project): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update({
      title: project.title,
      client_id: project.clientId || null,
      client_name: project.clientName,
      status: project.status,
      priority: project.priority,
      budget: project.budget,
      deadline: project.deadline,
      hours_tracked: project.hoursTracked,
      hourly_rate: project.hourlyRate,
      tasks: project.tasks,
    })
    .eq('id', project.id)
  if (error) throw error
}

export async function deleteProjectRecord(id: number): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

// ---------- INVOICES ----------

export async function fetchInvoices(): Promise<Invoice[]> {
  const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapInvoice)
}

export async function insertInvoice(invoice: Invoice): Promise<void> {
  const userId = await getUserId()
  const { error } = await supabase.from('invoices').insert({
    id: invoice.id,
    user_id: userId,
    number: invoice.number,
    client_id: invoice.clientId || null,
    client_name: invoice.clientName,
    amount: invoice.amount,
    issue_date: invoice.date,
    due_date: invoice.dueDate,
    status: invoice.status,
  })
  if (error) throw error
}

export async function updateInvoiceRecord(invoice: Invoice): Promise<void> {
  const { error } = await supabase
    .from('invoices')
    .update({ status: invoice.status })
    .eq('id', invoice.id)
  if (error) throw error
}

export async function deleteInvoiceRecord(id: string): Promise<void> {
  const { error } = await supabase.from('invoices').delete().eq('id', id)
  if (error) throw error
}

// ---------- TIME ENTRIES ----------

export async function fetchTimeEntries(): Promise<TimeEntry[]> {
  const { data, error } = await supabase.from('time_entries').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapTimeEntry)
}

export async function insertTimeEntry(entry: TimeEntry): Promise<void> {
  const userId = await getUserId()
  const { error } = await supabase.from('time_entries').insert({
    user_id: userId,
    project_id: entry.projectId,
    seconds: entry.seconds,
    entry_date: entry.date,
  })
  if (error) throw error
}