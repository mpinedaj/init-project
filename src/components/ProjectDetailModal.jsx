import { useState } from 'react'

export default function ProjectDetailModal({ project, onClose, onUpdateProject }) {
  const [newTaskText, setNewTaskText] = useState('')
  const [hourlyRate, setHourlyRate] = useState(project.hourlyRate || 50)

  if (!project) return null

  const tasks = project.tasks || [
    { id: 1, text: 'Definir requerimientos y wireframes', done: true },
    { id: 2, text: 'Diseño de interfaz en Figma', done: true },
    { id: 3, text: 'Desarrollo frontend React', done: false },
    { id: 4, text: 'Pruebas de usuario y despliegue', done: false },
  ]

  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
    onUpdateProject({ ...project, tasks: updatedTasks })
  }

  const handleAddTask = (e) => {
    e.preventDefault()
    if (!newTaskText.trim()) return
    const newTask = { id: Date.now(), text: newTaskText, done: false }
    const updatedTasks = [...tasks, newTask]
    onUpdateProject({ ...project, tasks: updatedTasks })
    setNewTaskText('')
  }

  const hoursTracked = project.hoursTracked ? (project.hoursTracked / 3600).toFixed(1) : '0.0'
  const calculatedBillable = (parseFloat(hoursTracked) * hourlyRate).toFixed(2)

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content project-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="text-secondary text-xs uppercase tracking-wider">{project.client}</span>
            <h3 className="text-xl font-bold">{project.title}</h3>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="project-detail-body">
          {/* Top Info Cards */}
          <div className="project-meta-grid">
            <div className="meta-box">
              <span className="meta-label">Estado</span>
              <span className={`status-badge ${project.status.toLowerCase().replace(' ', '-')}`}>
                {project.status}
              </span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Presupuesto</span>
              <span className="font-semibold text-lg">{project.budget}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Horas Registradas</span>
              <span className="font-mono text-lg font-semibold">{hoursTracked} hrs</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Monto Estimado ($50/h)</span>
              <span className="font-semibold text-lg text-emerald-400">${calculatedBillable}</span>
            </div>
          </div>

          {/* Checklist Section */}
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
              {tasks.map((task) => (
                <label key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={task.done} 
                    onChange={() => toggleTask(task.id)}
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
