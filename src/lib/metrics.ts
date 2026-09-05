import type { Client, Invoice, Project } from '../types'

export function calculateMonthlyRevenue(projects: Project[]): number {
  return projects
    .filter((p) => p.status !== 'Completado')
    .reduce((sum, p) => sum + p.budget, 0)
}

export function calculatePendingInvoices(invoices: Invoice[]): {
  count: number
  total: number
} {
  const pending = invoices.filter((i) => i.status === 'Pendiente')
  return {
    count: pending.length,
    total: pending.reduce((sum, i) => sum + i.amount, 0),
  }
}

export function calculateClientBreakdown(clients: Client[], invoices: Invoice[]) {
  const billedByClient = new Map<number, number>()
  invoices
    .filter((i) => i.status === 'Pagada')
    .forEach((i) => {
      billedByClient.set(i.clientId, (billedByClient.get(i.clientId) || 0) + i.amount)
    })

  const totalPaid = Array.from(billedByClient.values()).reduce((a, b) => a + b, 0)

  const breakdown = clients.map((c) => {
    const billed = c.totalBilled || billedByClient.get(c.id) || 0
    const pct = totalPaid > 0 ? Math.round((billed / totalPaid) * 100) : 0
    return { ...c, billed, pct }
  })

  return { breakdown, totalPaid }
}

export function calculateBillableAmount(project: Project): number {
  const hours = project.hoursTracked / 3600
  return hours * project.hourlyRate
}