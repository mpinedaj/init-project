import { z } from 'zod'

export const projectSchema = z.object({
  title: z.string().min(1, 'El nombre es obligatorio'),
  clientId: z.number().int().positive(),
  budget: z.number().min(0, 'El presupuesto debe ser positivo'),
  deadline: z.string().min(1, 'La fecha límite es obligatoria'),
  priority: z.enum(['Alta', 'Media', 'Baja']),
})

export type ProjectFormValues = z.infer<typeof projectSchema>

export const clientSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  contact: z.string().min(1, 'El contacto es obligatorio'),
  email: z.string().email('Email inválido'),
})

export type ClientFormValues = z.infer<typeof clientSchema>

export const invoiceSchema = z.object({
  clientId: z.number().int().positive(),
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  dueDate: z.string().min(1, 'La fecha de vencimiento es obligatoria'),
})

export type InvoiceFormValues = z.infer<typeof invoiceSchema>

export const settingsSchema = z.object({
  fullName: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido'),
  hourlyRate: z.number().min(0, 'La tarifa debe ser positiva'),
  currency: z.enum(['USD', 'EUR', 'MXN', 'COP']),
})

export type SettingsFormValues = z.infer<typeof settingsSchema>