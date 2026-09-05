import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Session, User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  loading: boolean
  initialized: boolean
  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,

  initialize: async () => {
    const { data } = await supabase.auth.getSession()
    set({
      session: data.session,
      user: data.session?.user ?? null,
      isAuthenticated: !!data.session,
      initialized: true,
    })

    // Escucha cambios de sesión (login, logout, refresh de token)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session,
        initialized: true,
      })
    })
  },

  login: async (email, password) => {
    set({ loading: true })
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      set({ loading: false })
      throw error
    }
    set({
      session: data.session,
      user: data.session?.user ?? data.user ?? null,
      isAuthenticated: true,
      loading: false,
    })
  },

  register: async (name, email, password) => {
    set({ loading: true })
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    if (error) {
      set({ loading: false })
      throw error
    }
    // signUp puede crear sesión inmediatamente (si email confirm está desactivado)
    // o requerir confirmación de email (no hay sesión todavía).
    set({
      session: data.session,
      user: data.user ?? null,
      isAuthenticated: !!data.session,
      loading: false,
    })
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null, isAuthenticated: false })
  },
}))