import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,

      setAuth: (user, accessToken) => set({ user, accessToken }),
      setAccessToken: (accessToken) => set({ accessToken }),

      logout: () => set({ user: null, accessToken: null }),

      isAuthenticated: () => !!get().accessToken,
      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'scatch-auth',
      // persist both user and accessToken
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
)