export default function StatCard({ title, value, change, isPositive, icon, subtitle }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {icon && <div className="stat-icon-wrapper">{icon}</div>}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-footer">
        {change && (
          <span className={`stat-trend ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '↑' : '↓'} {change}
          </span>
        )}
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
    </div>
  )
}
