import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppStore } from '../store/useAppStore'
import { projectSchema, type ProjectFormValues } from '../lib/schemas'

export default function ProjectFormModal() {
  const clients = useAppStore((s) => s.clients)
  const addProject = useAppStore((s) => s.addProject)
  const setOpenModal = useAppStore((s) => s.setOpenModal)
  const showToast = useAppStore((s) => s.showToast)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      clientId: clients[0]?.id || 0,
      budget: 0,
      deadline: '',
      priority: 'Media',
    },
  })

  const onSubmit = (data: ProjectFormValues) => {
    const project = addProject(data)
    setOpenModal(null)
    showToast(`Proyecto "${project.title}" creado con éxito ✨`)
  }

  return (
    <div className="modal-backdrop" onClick={() => setOpenModal(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Crear Nuevo Proyecto</h3>
          <button className="modal-close" onClick={() => setOpenModal(null)}>×</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label>Nombre del Proyecto</label>
            <input
              type="text"
              placeholder="Ej: Rediseño Sitio Web"
              className="form-input"
              {...register('title')}
            />
            {errors.title && <span className="form-error">{errors.title.message}</span>}
          </div>
          <div className="form-group">
            <label>Cliente</label>
            <select className="form-input" {...register('clientId', { valueAsNumber: true })}>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Presupuesto ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="2500"
                className="form-input"
                {...register('budget', { valueAsNumber: true })}
              />
              {errors.budget && <span className="form-error">{errors.budget.message}</span>}
            </div>
            <div className="form-group">
              <label>Prioridad</label>
              <select className="form-input" {...register('priority')}>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Fecha límite</label>
            <input type="date" className="form-input" {...register('deadline')} />
            {errors.deadline && <span className="form-error">{errors.deadline.message}</span>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={() => setOpenModal(null)}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Crear Proyecto</button>
          </div>
        </form>
      </div>
    </div>
  )
}