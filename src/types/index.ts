export type ProjectStatus = 'Pendiente' | 'En Progreso' | 'En Revisión' | 'Completado'
export type Priority = 'Alta' | 'Media' | 'Baja'
export type InvoiceStatus = 'Pendiente' | 'Pagada'
export type ViewMode = 'kanban' | 'table'

export interface Task {
  id: number
  text: string
  done: boolean
}

export interface Project {
  id: number
  title: string
  clientId: number
  clientName: string
  status: ProjectStatus
  priority: Priority
  budget: number
  deadline: string
  hoursTracked: number // segundos
  hourlyRate: number
  tasks: Task[]
  createdAt: string
}

export interface Client {
  id: number
  name: string
  contact: string
  email: string
  totalBilled: number
}

export interface Invoice {
  id: string
  number: string
  clientId: number
  clientName: string
  amount: number
  date: string
  dueDate: string
  status: InvoiceStatus
}

export interface TimeEntry {
  id: number
  projectId: number
  seconds: number
  date: string
}