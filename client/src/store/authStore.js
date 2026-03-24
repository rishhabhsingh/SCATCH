import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      setAuth: (user, accessToken) => set({ user, accessToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      logout: () => set({ user: null, accessToken: null }),
      isAuthenticated: () => !!useAuthStore.getState().accessToken,
    }),
    {
      name: 'scatch-auth',
      partialize: (state) => ({ user: state.user }),
      // Note: never persist accessToken — security risk
    }
  )
)