import type { ProjectStatus, Project } from '../types'
import { useAppStore } from '../store/useAppStore'
import { formatHours } from '../lib/format'
import { getTagHex } from '../lib/colors'

interface Column {
  id: ProjectStatus
  label: string
  color: string
}

const columns: Column[] = [
  { id: 'Pendiente', label: 'Por Hacer', color: '#EF4444' },
  { id: 'En Progreso', label: 'En Progreso', color: '#3B82F6' },
  { id: 'En Revisión', label: 'En Revisión', color: '#F59E0B' },
  { id: 'Completado', label: 'Completado', color: '#10B981' },
]

const statusOrder: ProjectStatus[] = ['Pendiente', 'En Progreso', 'En Revisión', 'Completado']

function getNextStatus(current: ProjectStatus, direction: 'next' | 'prev'): ProjectStatus {
  const index = statusOrder.indexOf(current)
  if (direction === 'next' && index < statusOrder.length - 1) return statusOrder[index + 1]
  if (direction === 'prev' && index > 0) return statusOrder[index - 1]
  return current
}

interface KanbanBoardProps {
  projects: Project[]
}

export default function KanbanBoard({ projects }: KanbanBoardProps) {
  const moveProject = useAppStore((s) => s.moveProject)
  const setSelectedProjectId = useAppStore((s) => s.setSelectedProjectId)
  const showToast = useAppStore((s) => s.showToast)

  return (
    <div className="kanban-board" id="kanban-board-wrapper">
      {columns.map((col) => {
        const colProjects = projects.filter((p) => p.status === col.id)
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
                <div className="kanban-empty-state">Sin proyectos</div>
              ) : (
                colProjects.map((p) => {
                  const tasksDone = p.tasks.filter((t) => t.done).length
                  const tasksTotal = p.tasks.length
                  const progressPct = tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 0

                  return (
                    <div
                      key={p.id}
                      className="kanban-card"
                      onClick={() => setSelectedProjectId(p.id)}
                      style={p.color ? { borderLeft: `3px solid ${getTagHex(p.color)}` } : undefined}
                    >
                      <div className="kanban-card-top">
                        <span className="kanban-card-client">
                          {p.color && (
                            <span className="kanban-color-dot" style={{ backgroundColor: getTagHex(p.color) }} />
                          )}
                          {p.clientName}
                        </span>
                        <span className={`priority-badge ${p.priority.toLowerCase()}`}>
                          {p.priority}
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
                          <span className="kanban-meta-item">⏱ {formatHours(p.hoursTracked)}h</span>
                          <span className="kanban-meta-item font-semibold">${p.budget.toLocaleString()}</span>
                        </div>

                        <div className="kanban-card-actions" onClick={(e) => e.stopPropagation()}>
                          {col.id !== 'Pendiente' && (
                            <button
                              className="kanban-btn-move"
                              title="Mover a la izquierda"
                              onClick={() => {
                                moveProject(p.id, getNextStatus(p.status, 'prev'))
                                showToast(`Proyecto "${p.title}" movido a ${getNextStatus(p.status, 'prev')}`)
                              }}
                            >
                              ←
                            </button>
                          )}
                          {col.id !== 'Completado' && (
                            <button
                              className="kanban-btn-move"
                              title="Mover a la derecha"
                              onClick={() => {
                                moveProject(p.id, getNextStatus(p.status, 'next'))
                                showToast(`Proyecto "${p.title}" movido a ${getNextStatus(p.status, 'next')}`)
                              }}
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