// src/contexts/AuthContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const mapSupabaseUser = (supabaseUser: SupabaseUser): User => ({
  id: supabaseUser.id,
  email: supabaseUser.email!,
  firstName: supabaseUser.user_metadata?.first_name || '',
  lastName: supabaseUser.user_metadata?.last_name || '',
  role: supabaseUser.user_metadata?.role || 'user',
  avatar: supabaseUser.user_metadata?.avatar
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { user: supabaseUser, error } = await authService.getCurrentUser()
        if (error) {
          console.error('Error getting current user:', error)
          return
        }
        if (supabaseUser) {
          setUser(mapSupabaseUser(supabaseUser))
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Subscribe to auth state changes
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(mapSupabaseUser(session.user))
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await authService.login(email, password)
      if (error) {
        throw error
      }
      if (data?.user) {
        setUser(mapSupabaseUser(data.user))
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { data, error } = await authService.register({
        email,
        password,
        firstName,
        lastName,
        department: 'General',
        role: 'user'
      })
      if (error) {
        throw error
      }
      if (data?.user) {
        setUser(mapSupabaseUser(data.user))
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const { error } = await authService.logout()
      if (error) {
        throw error
      }
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}