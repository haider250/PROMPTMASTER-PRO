import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      subscription: null,
      isSupabaseReady: false,
      
      // Initialize Supabase connection
      initSupabase: async () => {
        if (isSupabaseConfigured()) {
          set({ isSupabaseReady: true })
          
          // Listen for auth changes
          supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
              set({
                user: session.user,
                isAuthenticated: true,
                subscription: {
                  plan: 'free',
                  status: 'active'
                }
              })
            } else {
              set({
                user: null,
                isAuthenticated: false,
                subscription: null
              })
            }
          })
        } else {
          set({ isSupabaseReady: false })
          console.log('Using demo mode - Supabase not configured')
        }
      },
      
      // Login with Supabase or demo mode
      login: async (email, password) => {
        if (isSupabaseConfigured()) {
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password
            })
            
            if (error) throw error
            
            return { success: true, user: data.user }
          } catch (error) {
            return { success: false, error: error.message }
          }
        } else {
          // Demo mode - simulate login
          try {
            const user = {
              id: 'demo-user-' + Date.now(),
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
        }
      },
      
      // Signup with Supabase or demo mode
      signup: async (email, password, fullName) => {
        if (isSupabaseConfigured()) {
          try {
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  full_name: fullName
                }
              }
            })
            
            if (error) throw error
            
            return { success: true, user: data.user }
          } catch (error) {
            return { success: false, error: error.message }
          }
        } else {
          // Demo mode - simulate signup
          try {
            const user = {
              id: 'demo-user-' + Date.now(),
              email,
              name: fullName || email.split('@')[0],
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
        }
      },
      
      // Logout
      logout: async () => {
        if (isSupabaseConfigured()) {
          try {
            await supabase.auth.signOut()
            set({ 
              user: null, 
              isAuthenticated: false, 
              subscription: null 
            })
            return { success: true }
          } catch (error) {
            return { success: false, error: error.message }
          }
        } else {
          // Demo mode
          set({ 
            user: null, 
            isAuthenticated: false, 
            subscription: null 
          })
          return { success: true }
        }
      },
      
      // Update subscription
      updateSubscription: (plan) => {
        const currentUser = get().user
        if (currentUser) {
          if (isSupabaseConfigured()) {
            // Update in Supabase
            // This would be implemented when backend is ready
          } else {
            // Demo mode - update locally
            set({
              subscription: {
                plan,
                status: 'active',
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              }
            })
          }
        }
      },
      
      // Update user profile
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
        subscription: state.subscription,
        isSupabaseReady: state.isSupabaseReady
      })
    }
  )
)

export { useAuthStore }