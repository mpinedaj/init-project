import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppStore } from '../store/useAppStore'
import { clientSchema, type ClientFormValues } from '../lib/schemas'

export default function ClientFormModal() {
  const addClient = useAppStore((s) => s.addClient)
  const setOpenModal = useAppStore((s) => s.setOpenModal)
  const showToast = useAppStore((s) => s.showToast)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: { name: '', contact: '', email: '' },
  })

  const onSubmit = (data: ClientFormValues) => {
    const client = addClient(data)
    setOpenModal(null)
    showToast(`Cliente "${client.name}" agregado ✓`)
  }

  return (
    <div className="modal-backdrop" onClick={() => setOpenModal(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Nuevo Cliente</h3>
          <button className="modal-close" onClick={() => setOpenModal(null)}>×</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label>Nombre de la empresa</label>
            <input type="text" placeholder="Acme Studio" className="form-input" {...register('name')} />
            {errors.name && <span className="form-error">{errors.name.message}</span>}
          </div>
          <div className="form-group">
            <label>Contacto principal</label>
            <input type="text" placeholder="Laura García" className="form-input" {...register('contact')} />
            {errors.contact && <span className="form-error">{errors.contact.message}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="laura@acme.studio" className="form-input" {...register('email')} />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={() => setOpenModal(null)}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Agregar Cliente</button>
          </div>
        </form>
      </div>
    </div>
  )
}