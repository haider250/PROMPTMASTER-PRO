import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      subscription: null,
      
      login: async (email, password) => {
        try {
          // Simulate authentication - in production, this would connect to Supabase
          const user = {
            id: '1',
            email,
            name: email.split('@')[0],
            plan: 'free',
            createdAt: new Date().toISOString()
          }
          
          set({ 
            user, 
            isAuthenticated: true,
            subscription: {
              plan: 'free',
              status: 'active',
              expiresAt: null
            }
          })
          
          return { success: true, user }
        } catch (error) {
          return { success: false, error: error.message }
        }
      },
      
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          subscription: null 
        })
      },
      
      updateSubscription: (plan) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            subscription: {
              plan,
              status: 'active',
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            }
          })
        }
      },
      
      updateUser: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates }
          })
        }
      }
    }),
    {
      name: 'promptmaster-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        subscription: state.subscription
      })
    }
  )
)

export { useAuthStore }