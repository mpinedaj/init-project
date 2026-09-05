export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatHours(seconds: number): string {
  return (seconds / 3600).toFixed(1)
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function generateInvoiceNumber(existing: string[]): string {
  const year = new Date().getFullYear()
  let max = 0
  existing.forEach((n) => {
    const match = n.match(/(\d+)$/)
    if (match) max = Math.max(max, parseInt(match[1], 10))
  })
  const next = max + 1
  return `INV-${year}-${next.toString().padStart(3, '0')}`
}