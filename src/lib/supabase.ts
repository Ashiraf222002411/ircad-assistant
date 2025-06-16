// src/lib/supabase.ts
'use client'

import { createClient, Session } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://umfhgjenqkrlzneivxjj.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtZmhnamVucWtybHpuZWl2eGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MzM4MzQsImV4cCI6MjA1MDAwOTgzNH0.CPM' // Replace with your FULL key

console.log('🚀 Supabase URL:', supabaseUrl ? '✅ Connected' : '❌ Missing')
console.log('🔑 Supabase Key:', supabaseKey ? '✅ Found' : '❌ Missing')

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Auth service functions
export const authService = {
  // Register new user
  async register(userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    department: string
    role: string
    phone?: string
  }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            department: userData.department,
            role: userData.role,
            phone: userData.phone,
            avatar: userData.firstName[0] + userData.lastName[0]
          }
        }
      })
      return { data, error }
    } catch (error) {
      console.error('Registration error:', error)
      return { data: null, error }
    }
  },

  // Login existing user
  async login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    } catch (error) {
      console.error('Login error:', error)
      return { data: null, error }
    }
  },

  // Logout user
  async logout() {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      console.error('Logout error:', error)
      return { error }
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      return { user, error }
    } catch (error) {
      console.error('Get user error:', error)
      return { user: null, error }
    }
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}