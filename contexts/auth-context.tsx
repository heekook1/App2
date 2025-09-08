"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { userStore } from "@/lib/user-store"

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

const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@company.com",
    name: "김관리자",
    password: "admin123",
    department: "안전관리팀",
    role: "admin",
  },
  {
    id: "2",
    username: "worker01",
    email: "worker@company.com",
    name: "이작업자",
    password: "worker123",
    department: "정비기술팀",
    role: "user",
  },
  {
    id: "3",
    username: "field",
    email: "field@company.com",
    name: "김현장",
    password: "field123",
    department: "현장팀",
    role: "approver",
  },
  {
    id: "4",
    username: "manager",
    email: "manager@company.com",
    name: "박팀장",
    password: "manager123",
    department: "운영팀",
    role: "approver",
  },
  {
    id: "5",
    username: "safety",
    email: "safety@company.com",
    name: "최안전",
    password: "safety123",
    department: "안전관리팀",
    role: "approver",
  },
]

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

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = userStore.getUserForAuth(username)

    if (foundUser && foundUser.password === password) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      
      // Log login activity
      userStore.updateLastLogin(foundUser.id)
      
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    if (user) {
      userStore.logActivity(user.id, 'logout')
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
