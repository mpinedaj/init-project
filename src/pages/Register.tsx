import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const registerSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const register = useAuthStore((s) => s.register)
  const [error, setError] = useState<string | null>(null)

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const onSubmit = (data: RegisterForm) => {
    setError(null)
    register(data.name, data.email, data.password)
    navigate('/dashboard')
  }

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <div className="logo-mark">K</div>
          Konta
        </Link>
        <h1 className="auth-title">Crear cuenta</h1>
        <p className="auth-subtitle">Empieza a gestionar tu negocio freelance hoy.</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              className="form-input"
              placeholder="Martín Pineda"
              {...registerField('name')}
            />
            {errors.name && <span className="form-error">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              className="form-input"
              placeholder="tu@email.com"
              {...registerField('email')}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              {...registerField('password')}
            />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </button>
        </form>

        <p className="auth-alt">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}