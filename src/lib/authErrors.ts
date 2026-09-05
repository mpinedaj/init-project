// Traduce los mensajes de error comunes de Supabase Auth a español.

export function translateAuthError(raw: string): string {
  const msg = raw.toLowerCase()

  if (msg.includes('email not confirmed')) {
    return 'Tu correo no está confirmado. Revisa tu bandeja de entrada (y spam) para confirmar tu cuenta.'
  }
  if (msg.includes('invalid login credentials')) {
    return 'Credenciales incorrectas. Revisa tu correo y contraseña.'
  }
  if (msg.includes('user already registered')) {
    return 'Ya existe una cuenta con ese correo. Inicia sesión.'
  }
  if (msg.includes('password should be at least')) {
    return 'La contraseña debe tener al menos 6 caracteres.'
  }
  if (msg.includes('rate limit')) {
    return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.'
  }
  if (msg.includes('failed to fetch') || msg.includes('network')) {
    return 'Error de conexión con el servidor. Revisa tu conexión.'
  }

  return raw
}