export type ProjectStatus = 'Pendiente' | 'En Progreso' | 'En Revisión' | 'Completado'
export type Priority = 'Alta' | 'Media' | 'Baja'
export type InvoiceStatus = 'Pendiente' | 'Pagada'
export type ViewMode = 'kanban' | 'table'

export type TagColor = 'red' | 'orange' | 'amber' | 'lime' | 'green' | 'teal' | 'cyan' | 'blue' | 'violet' | 'pink'

export interface Task {
  id: number
  text: string
  done: boolean
  color?: TagColor
}

export interface Project {
  id: number
  title: string
  clientId: number
  clientName: string
  status: ProjectStatus
  priority: Priority
  color?: TagColor
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
  color?: TagColor
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