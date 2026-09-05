import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el archivo .env')
}

// La publishable key (antes "anon key") es pública por diseño.
// La seguridad de los datos la protege Row Level Security (RLS) en la base de datos.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)