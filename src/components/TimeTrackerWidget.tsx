import { useState, useEffect } from 'react'
import type { Project } from '../types'
import { useAppStore } from '../store/useAppStore'
import { formatDuration } from '../lib/format'

interface TimeTrackerWidgetProps {
  projects: Project[]
}

export default function TimeTrackerWidget({ projects }: TimeTrackerWidgetProps) {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<number>(projects[0]?.id || 0)
  const addTimeToProject = useAppStore((s) => s.addTimeToProject)
  const showToast = useAppStore((s) => s.showToast)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  const handleToggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const handleSave = () => {
    if (seconds === 0) return
    setIsRunning(false)
    if (selectedProjectId) {
      addTimeToProject(selectedProjectId, seconds)
      const project = projects.find((p) => p.id === selectedProjectId)
      showToast(`Tiempo guardado en "${project?.title || 'proyecto'}" ✓`)
    }
    setSeconds(0)
  }

  return (
    <div className={`time-tracker-widget ${isRunning ? 'running' : ''}`} id="timer-widget">
      <div className="tracker-select-wrapper">
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(Number(e.target.value))}
          className="tracker-select"
          disabled={isRunning}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.clientName})
            </option>
          ))}
        </select>
      </div>

      <div className="tracker-timer-display font-mono">
        <span className={`timer-dot ${isRunning ? 'pulsing' : ''}`}></span>
        {formatDuration(seconds)}
      </div>

      <div className="tracker-controls">
        <button
          className={`btn-timer-toggle ${isRunning ? 'pause' : 'play'}`}
          onClick={handleToggleTimer}
          title={isRunning ? 'Pausar tiempo' : 'Iniciar tiempo'}
        >
          {isRunning ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          )}
        </button>

        {seconds > 0 && (
          <button
            className="btn-timer-save"
            onClick={handleSave}
            title="Guardar horas"
          >
            ✓
          </button>
        )}
      </div>
    </div>
  )
}