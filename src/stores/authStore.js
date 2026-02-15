import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const HARDCODED_CREDENTIALS = {
  email: 'intern@demo.com',
  password: 'intern123'
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      error: null,
      rememberMe: false,

      login: (email, password, rememberMe) => {
        if (email === HARDCODED_CREDENTIALS.email && password === HARDCODED_CREDENTIALS.password) {
          set({ 
            user: { email, id: '1', name: 'Intern' }, 
            isAuthenticated: true, 
            error: null,
            rememberMe 
          })
          return true
        } else {
          set({ error: 'Invalid email or password' })
          return false
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null })
        // Clear all app data on logout
        localStorage.removeItem('task-storage')
        localStorage.removeItem('activity-storage')
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.rememberMe ? state.user : null,
        isAuthenticated: state.rememberMe ? state.isAuthenticated : false,
        rememberMe: state.rememberMe 
      }),
    }
  )
)