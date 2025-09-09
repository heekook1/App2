"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { userStore } from "@/lib/user-store-supabase"

interface User {
  id: string
  username: string // Changed from email to username
  email: string
  name: string
  department: string
  role: "admin" | "user" | "approver"
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean> // Changed parameter from email to username
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // First try to get user from Supabase
      const supabaseUser = await userStore.getByUsername(username)
      
      if (supabaseUser) {
        // For now, use simple password check with default passwords
        // In a real app, you'd use proper password hashing
        const defaultPasswords: Record<string, string> = {
          'admin': 'admin123',
          'worker01': 'worker123', 
          'field': 'field123',
          'manager': 'manager123',
          'safety': 'safety123'
        }
        
        const expectedPassword = defaultPasswords[username] || 'user123'
        
        if (password === expectedPassword) {
          setUser(supabaseUser)
          localStorage.setItem("user", JSON.stringify(supabaseUser))
          
          // Log login activity to Supabase
          await userStore.updateLastLogin(supabaseUser.id)
          
          setIsLoading(false)
          return true
        }
      }
      
      // Fallback to hardcoded users for backwards compatibility
      const mockUsers = [
        { username: "admin", password: "admin123", id: "1", email: "admin@company.com", name: "김관리자", department: "안전관리팀", role: "admin" as const },
        { username: "worker01", password: "worker123", id: "2", email: "worker@company.com", name: "이작업자", department: "정비기술팀", role: "user" as const },
        { username: "field", password: "field123", id: "3", email: "field@company.com", name: "김현장", department: "현장팀", role: "approver" as const }
      ]

      const mockUser = mockUsers.find(u => u.username === username && u.password === password)
      
      if (mockUser) {
        const { password: _, ...userWithoutPassword } = mockUser
        setUser(userWithoutPassword)
        localStorage.setItem("user", JSON.stringify(userWithoutPassword))
        
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = async () => {
    if (user) {
      try {
        await userStore.logActivity(user.id, 'logout', 'User logged out')
      } catch (error) {
        console.error('Error logging logout activity:', error)
      }
    }
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
