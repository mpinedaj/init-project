import type { ReactElement } from 'react'

interface StatCardProps {
  title: string
  value: string
  change?: string
  isPositive?: boolean
  icon?: ReactElement
  iconBg?: string
  subtitle?: string
}

export default function StatCard({ title, value, change, isPositive, icon, iconBg, subtitle }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {icon && (
          <div className={`stat-icon-container ${iconBg || ''}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-footer">
        {change && (
          <span className={`stat-trend ${isPositive ? 'positive' : 'negative'}`}>
            {change}
          </span>
        )}
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
    </div>
  )
}