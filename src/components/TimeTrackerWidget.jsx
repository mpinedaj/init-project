import { useState, useEffect } from 'react'

export default function TimeTrackerWidget({ projects, onSaveTime }) {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '')

  useEffect(() => {
    let interval = null
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleToggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const handleSave = () => {
    if (seconds === 0) return
    setIsRunning(false)
    const project = projects.find(p => p.id === Number(selectedProjectId))
    if (onSaveTime && project) {
      onSaveTime(project.id, seconds)
    }
    setSeconds(0)
  }

  return (
    <div className={`time-tracker-widget ${isRunning ? 'running' : ''}`} id="timer-widget">
      <div className="tracker-select-wrapper">
        <select 
          value={selectedProjectId} 
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="tracker-select"
          disabled={isRunning}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.client})
            </option>
          ))}
        </select>
      </div>

      <div className="tracker-timer-display font-mono">
        <span className={`timer-dot ${isRunning ? 'pulsing' : ''}`}></span>
        {formatTime(seconds)}
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
