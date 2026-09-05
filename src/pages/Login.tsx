import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (data: LoginForm) => {
    setError(null)
    // Mock: sin backend, acepta cualquier credencial válida por formato
    login(data.email, data.password)
    navigate('/dashboard')
  }

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <div className="logo-mark">K</div>
          Konta
        </Link>
        <h1 className="auth-title">Iniciar sesión</h1>
        <p className="auth-subtitle">Bienvenido de nuevo. Gestiona tu negocio freelance.</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              className="form-input"
              placeholder="tu@email.com"
              {...register('email')}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && <span className="form-error">{errors.password.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="auth-alt">
          ¿No tienes cuenta? <Link to="/register">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  )
}