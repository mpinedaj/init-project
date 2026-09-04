const columns = [
  { id: 'Pendiente', label: 'Por Hacer', color: '#EF4444' },
  { id: 'En Progreso', label: 'En Progreso', color: '#3B82F6' },
  { id: 'En Revisión', label: 'En Revisión', color: '#F59E0B' },
  { id: 'Completado', label: 'Completado', color: '#10B981' }
]

export default function KanbanBoard({ projects, onMoveProject, onSelectProject }) {
  const getNextStatus = (currentStatus, direction) => {
    const statusOrder = ['Pendiente', 'En Progreso', 'En Revisión', 'Completado']
    const index = statusOrder.indexOf(currentStatus)
    if (direction === 'next' && index < statusOrder.length - 1) {
      return statusOrder[index + 1]
    }
    if (direction === 'prev' && index > 0) {
      return statusOrder[index - 1]
    }
    return currentStatus
  }

  return (
    <div className="kanban-board" id="kanban-board-wrapper">
      {columns.map((col) => {
        const colProjects = projects.filter((p) => (p.status || 'Pendiente') === col.id)
        return (
          <div key={col.id} className="kanban-column" id={`kanban-col-${col.id.toLowerCase().replace(' ', '-')}`}>
            <div className="kanban-column-header">
              <div className="kanban-col-title">
                <span className="col-indicator-dot" style={{ backgroundColor: col.color }}></span>
                <h4>{col.label}</h4>
              </div>
              <span className="col-count">{colProjects.length}</span>
            </div>

            <div className="kanban-column-content">
              {colProjects.length === 0 ? (
                <div className="kanban-empty-state">
                  Sin proyectos
                </div>
              ) : (
                colProjects.map((p) => {
                  const tasksDone = p.tasks ? p.tasks.filter(t => t.done).length : 2
                  const tasksTotal = p.tasks ? p.tasks.length : 4
                  const progressPct = Math.round((tasksDone / tasksTotal) * 100)

                  return (
                    <div 
                      key={p.id} 
                      className="kanban-card"
                      onClick={() => onSelectProject && onSelectProject(p)}
                    >
                      <div className="kanban-card-top">
                        <span className="kanban-card-client">{p.client}</span>
                        <span className={`priority-badge ${(p.priority || 'Media').toLowerCase()}`}>
                          {p.priority || 'Media'}
                        </span>
                      </div>

                      <h5 className="kanban-card-title">{p.title}</h5>

                      <div className="kanban-card-progress">
                        <div className="progress-info">
                          <span>Tareas</span>
                          <span>{tasksDone}/{tasksTotal}</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
                        </div>
                      </div>

                      <div className="kanban-card-footer">
                        <div className="kanban-card-meta">
                          <span className="kanban-meta-item">
                            ⏱ {p.hoursTracked ? `${(p.hoursTracked / 3600).toFixed(1)}h` : '0h'}
                          </span>
                          <span className="kanban-meta-item font-semibold">
                            {p.budget}
                          </span>
                        </div>

                        <div className="kanban-card-actions" onClick={(e) => e.stopPropagation()}>
                          {col.id !== 'Pendiente' && (
                            <button 
                              className="kanban-btn-move"
                              title="Mover a la izquierda"
                              onClick={() => onMoveProject(p.id, getNextStatus(p.status, 'prev'))}
                            >
                              ←
                            </button>
                          )}
                          {col.id !== 'Completado' && (
                            <button 
                              className="kanban-btn-move"
                              title="Mover a la derecha"
                              onClick={() => onMoveProject(p.id, getNextStatus(p.status, 'next'))}
                            >
                              →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
