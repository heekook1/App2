// User management store with localStorage persistence
export interface User {
  id: string
  username: string
  email: string
  name: string
  department: string
  role: "admin" | "approver" | "user"
  isActive: boolean
  createdAt: string
  lastLoginAt?: string
}

export interface UserActivity {
  id: string
  userId: string
  action: "login" | "logout" | "create_permit" | "approve_permit" | "reject_permit"
  details?: string
  timestamp: string
}

// Storage keys
const USERS_KEY = 'system_users'
const ACTIVITIES_KEY = 'user_activities'

// Get users from localStorage
const getUsersFromStorage = (): (User & { password: string })[] => {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(USERS_KEY)
  if (!stored) {
    // Initialize with existing users from auth-context
    const initialUsers = [
      {
        id: "1",
        username: "admin",
        email: "admin@company.com",
        name: "김관리자",
        password: "admin123",
        department: "안전관리팀",
        role: "admin" as const,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2", 
        username: "worker01",
        email: "worker@company.com",
        name: "이작업자",
        password: "worker123",
        department: "정비기술팀",
        role: "user" as const,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        username: "field",
        email: "field@company.com", 
        name: "김현장",
        password: "field123",
        department: "현장팀",
        role: "approver" as const,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "4",
        username: "manager",
        email: "manager@company.com",
        name: "박팀장", 
        password: "manager123",
        department: "운영팀",
        role: "approver" as const,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "5",
        username: "safety",
        email: "safety@company.com",
        name: "최안전",
        password: "safety123", 
        department: "안전관리팀",
        role: "approver" as const,
        isActive: true,
        createdAt: new Date().toISOString(),
      }
    ]
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers))
    return initialUsers
  }
  
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

// Save users to localStorage
const saveUsersToStorage = (users: (User & { password: string })[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// Get activities from localStorage
const getActivitiesFromStorage = (): UserActivity[] => {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(ACTIVITIES_KEY)
  return stored ? JSON.parse(stored) : []
}

// Save activities to localStorage
const saveActivitiesToStorage = (activities: UserActivity[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities))
}

// Generate random password
const generatePassword = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export const userStore = {
  // Get all users (without passwords)
  getAllUsers: (): User[] => {
    const users = getUsersFromStorage()
    return users.map(({ password, ...user }) => user)
  },

  // Get user by ID
  getUserById: (id: string): User | null => {
    const users = getUsersFromStorage()
    const user = users.find(u => u.id === id)
    if (!user) return null
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  // Get user for authentication (with password)
  getUserForAuth: (username: string): (User & { password: string }) | null => {
    const users = getUsersFromStorage()
    return users.find(u => u.username === username && u.isActive) || null
  },

  // Create new user
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>, password?: string): User => {
    const users = getUsersFromStorage()
    const newId = (Math.max(...users.map(u => parseInt(u.id)), 0) + 1).toString()
    
    const newUser = {
      ...userData,
      id: newId,
      isActive: true,
      createdAt: new Date().toISOString(),
      password: password || generatePassword()
    }
    
    users.push(newUser)
    saveUsersToStorage(users)
    
    // Log activity
    userStore.logActivity(newId, 'create_permit', `User created: ${userData.name}`)
    
    const { password: _, ...userWithoutPassword } = newUser
    return userWithoutPassword
  },

  // Update user
  updateUser: (id: string, updates: Partial<User>): boolean => {
    const users = getUsersFromStorage()
    const userIndex = users.findIndex(u => u.id === id)
    
    if (userIndex === -1) return false
    
    users[userIndex] = { ...users[userIndex], ...updates }
    saveUsersToStorage(users)
    return true
  },

  // Delete user (soft delete - set inactive)
  deleteUser: (id: string): boolean => {
    return userStore.updateUser(id, { isActive: false })
  },

  // Reset password
  resetPassword: (id: string, newPassword?: string): string | null => {
    const users = getUsersFromStorage()
    const userIndex = users.findIndex(u => u.id === id)
    
    if (userIndex === -1) return null
    
    const password = newPassword || generatePassword()
    users[userIndex].password = password
    saveUsersToStorage(users)
    
    return password
  },

  // Log user activity
  logActivity: (userId: string, action: UserActivity['action'], details?: string): void => {
    const activities = getActivitiesFromStorage()
    const newActivity: UserActivity = {
      id: Date.now().toString(),
      userId,
      action,
      details,
      timestamp: new Date().toISOString()
    }
    
    activities.unshift(newActivity) // Add to beginning
    // Keep only last 1000 activities
    if (activities.length > 1000) {
      activities.splice(1000)
    }
    
    saveActivitiesToStorage(activities)
  },

  // Get user activities
  getUserActivities: (userId?: string, limit = 50): UserActivity[] => {
    const activities = getActivitiesFromStorage()
    const filtered = userId ? activities.filter(a => a.userId === userId) : activities
    return filtered.slice(0, limit)
  },

  // Get user statistics
  getUserStats: () => {
    const users = getUsersFromStorage()
    const activities = getActivitiesFromStorage()
    
    return {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      byRole: {
        admin: users.filter(u => u.role === 'admin' && u.isActive).length,
        approver: users.filter(u => u.role === 'approver' && u.isActive).length,
        user: users.filter(u => u.role === 'user' && u.isActive).length
      },
      byDepartment: users.reduce((acc, user) => {
        if (user.isActive) {
          acc[user.department] = (acc[user.department] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>),
      recentActivities: activities.slice(0, 10)
    }
  },

  // Update last login
  updateLastLogin: (userId: string): void => {
    userStore.updateUser(userId, { lastLoginAt: new Date().toISOString() })
    userStore.logActivity(userId, 'login')
  }
}