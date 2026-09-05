import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppStore } from '../store/useAppStore'
import { invoiceSchema, type InvoiceFormValues } from '../lib/schemas'

export default function InvoiceFormModal() {
  const clients = useAppStore((s) => s.clients)
  const addInvoice = useAppStore((s) => s.addInvoice)
  const setOpenModal = useAppStore((s) => s.setOpenModal)
  const showToast = useAppStore((s) => s.showToast)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: clients[0]?.id || 0,
      amount: 0,
      dueDate: '',
    },
  })

  const onSubmit = (data: InvoiceFormValues) => {
    const invoice = addInvoice(data)
    setOpenModal(null)
    showToast(`Factura ${invoice.number} creada ✓`)
  }

  return (
    <div className="modal-backdrop" onClick={() => setOpenModal(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Nueva Factura</h3>
          <button className="modal-close" onClick={() => setOpenModal(null)}>×</button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label>Cliente</label>
            <select className="form-input" {...register('clientId', { valueAsNumber: true })}>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Monto ($)</label>
            <input
              type="number"
              step="0.01"
              placeholder="500"
              className="form-input"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && <span className="form-error">{errors.amount.message}</span>}
          </div>
          <div className="form-group">
            <label>Fecha de vencimiento</label>
            <input type="date" className="form-input" {...register('dueDate')} />
            {errors.dueDate && <span className="form-error">{errors.dueDate.message}</span>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={() => setOpenModal(null)}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Crear Factura</button>
          </div>
        </form>
      </div>
    </div>
  )
}