import { useState } from 'react'
import type { Project } from '../types'
import { useAppStore } from '../store/useAppStore'
import { calculateBillableAmount } from '../lib/metrics'
import { formatHours } from '../lib/format'

interface ProjectDetailModalProps {
  project: Project
  onClose: () => void
}

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const [newTaskText, setNewTaskText] = useState('')
  const toggleTask = useAppStore((s) => s.toggleTask)
  const addTask = useAppStore((s) => s.addTask)

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskText.trim()) return
    addTask(project.id, newTaskText)
    setNewTaskText('')
  }

  const hoursTracked = formatHours(project.hoursTracked)
  const calculatedBillable = calculateBillableAmount(project).toFixed(2)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content project-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="text-secondary text-xs uppercase tracking-wider">{project.clientName}</span>
            <h3 className="text-xl font-bold">{project.title}</h3>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="project-detail-body">
          <div className="project-meta-grid">
            <div className="meta-box">
              <span className="meta-label">Estado</span>
              <span className={`status-badge ${project.status.toLowerCase().replace(' ', '-')}`}>
                {project.status}
              </span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Presupuesto</span>
              <span className="font-semibold text-lg">${project.budget.toLocaleString()}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Horas Registradas</span>
              <span className="font-mono text-lg font-semibold">{hoursTracked} hrs</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Monto Estimado (${project.hourlyRate}/h)</span>
              <span className="font-semibold text-lg text-emerald-400">${calculatedBillable}</span>
            </div>
          </div>

          <div className="checklist-section">
            <h4 className="section-subtitle">Checklist de Tareas</h4>

            <form onSubmit={handleAddTask} className="add-task-form">
              <input
                type="text"
                placeholder="Añadir nueva sub-tarea..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="form-input"
              />
              <button type="submit" className="btn btn-primary btn-sm">+ Añadir</button>
            </form>

            <div className="task-list">
              {project.tasks.map((task) => (
                <label key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(project.id, task.id)}
                  />
                  <span className="task-text">{task.text}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}