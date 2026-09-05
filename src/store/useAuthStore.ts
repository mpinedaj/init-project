import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, name?: string) => void
  register: (name: string, email: string, password: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email, _password, name) => {
        const user: User = {
          id: `${Date.now()}`,
          name: name || email.split('@')[0],
          email,
        }
        set({ user, isAuthenticated: true })
      },

      register: (name, email, _password) => {
        const user: User = {
          id: `${Date.now()}`,
          name,
          email,
        }
        set({ user, isAuthenticated: true })
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'konta-auth',
    },
  ),
)