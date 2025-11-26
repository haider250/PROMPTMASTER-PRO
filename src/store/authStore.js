import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

const useAuthStore = create(
  persist(
    (set, get) => {
      // Initialize auth state from Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          set({ 
            user: session.user, 
            isAuthenticated: true,
            // Assuming subscription info is part of user metadata or fetched separately
            subscription: {
              plan: session.user.user_metadata?.plan || 'free',
              status: 'active',
              expiresAt: null // Or fetch from user_metadata if available
            }
          })
        }
      })

      // Listen for auth state changes
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          set({
            user: session.user,
            isAuthenticated: true,
            subscription: {
              plan: session.user.user_metadata?.plan || 'free',
              status: 'active',
              expiresAt: null
            }
          })
        } else if (event === 'SIGNED_OUT') {
          set({ user: null, isAuthenticated: false, subscription: null })
        }
      })

      return {
        user: null,
        isAuthenticated: false,
        subscription: null,
        
        login: async (email, password) => {
          try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            
            if (error) {
              throw error;
            }

            set({ 
              user: data.user, 
              isAuthenticated: true,
              subscription: {
                plan: data.user.user_metadata?.plan || 'free',
                status: 'active',
                expiresAt: null
              }
            })
            
            return { success: true, user: data.user }
          } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message }
          }
        },

        register: async (name, email, password) => {
          try {
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  name,
                  plan: 'free' // Default plan for new users
                }
              }
            });

            if (error) {
              throw error;
            }

            set({
              user: data.user,
              isAuthenticated: true,
              subscription: {
                plan: data.user.user_metadata?.plan || 'free',
                status: 'active',
                expiresAt: null
              }
            })
            return { success: true, user: data.user }
          } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message }
          }
        },
        
        logout: async () => {
          const { error } = await supabase.auth.signOut()
          if (error) {
            console.error('Logout error:', error);
          }
          set({ 
            user: null, 
            isAuthenticated: false, 
            subscription: null 
          })
        },
        
        updateSubscription: (plan) => {
          const currentUser = get().user
          if (currentUser) {
            // In a real app, you would update the subscription in Supabase
            // For now, we'll just update the local state and user metadata
            const { data, error } = supabase.auth.updateUser({
              data: { plan }
            })

            if (error) {
              console.error('Error updating user metadata:', error)
              return
            }

            set({
              subscription: {
                plan,
                status: 'active',
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              },
              user: { ...currentUser, user_metadata: { ...currentUser.user_metadata, plan } }
            })
          }
        },
        
        updateUser: async (updates) => {
          const currentUser = get().user
          if (currentUser) {
            const { error } = await supabase.auth.updateUser({ data: updates })
            if (error) {
              console.error('Error updating user:', error)
              return
            }
            set({
              user: { ...currentUser, ...updates, user_metadata: { ...currentUser.user_metadata, ...updates } }
            })
          }
        }
      }
    },
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
