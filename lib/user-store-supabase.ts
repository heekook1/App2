import { supabase, DatabaseUser, DatabaseUserActivity } from './supabase'

export interface User {
  id: string
  username: string
  email: string
  name: string
  department: string
  role: 'admin' | 'approver' | 'user'
  phone?: string
  avatarUrl?: string
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface UserWithPassword extends User {
  password: string
}

export interface UserActivity {
  id: string
  userId: string
  activityType: string
  description: string
  metadata?: any
  createdAt: string
}

// Helper function to convert database user to frontend user
const convertDatabaseUserToUser = (dbUser: DatabaseUser): User => {
  return {
    id: dbUser.id,
    username: dbUser.username,
    email: dbUser.email,
    name: dbUser.name,
    department: dbUser.department || '',
    role: dbUser.role as 'admin' | 'approver' | 'user',
    phone: dbUser.phone || undefined,
    avatarUrl: dbUser.avatar_url || undefined,
    lastLogin: dbUser.last_login || undefined,
    createdAt: dbUser.created_at,
    updatedAt: dbUser.updated_at
  }
}

// Convert frontend user to database format
const convertUserToDatabaseUser = (user: Omit<User, 'createdAt' | 'updatedAt'>): Omit<DatabaseUser, 'created_at' | 'updated_at'> => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    department: user.department || null,
    role: user.role,
    phone: user.phone || null,
    avatar_url: user.avatarUrl || null,
    last_login: user.lastLogin || null
  }
}

export const userStore = {
  // Get all users
  getAll: async (): Promise<User[]> => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        return []
      }

      return users.map(convertDatabaseUserToUser)
    } catch (error) {
      console.error('Error in getAll:', error)
      return []
    }
  },

  // Get user by ID
  getById: async (id: string): Promise<User | null> => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching user:', error)
        return null
      }

      return convertDatabaseUserToUser(user)
    } catch (error) {
      console.error('Error in getById:', error)
      return null
    }
  },

  // Get user by email
  getByEmail: async (email: string): Promise<User | null> => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error) {
        console.error('Error fetching user by email:', error)
        return null
      }

      return convertDatabaseUserToUser(user)
    } catch (error) {
      console.error('Error in getByEmail:', error)
      return null
    }
  },

  // Get user by username
  getByUsername: async (username: string): Promise<User | null> => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

      if (error) {
        console.error('Error fetching user by username:', error)
        return null
      }

      return convertDatabaseUserToUser(user)
    } catch (error) {
      console.error('Error in getByUsername:', error)
      return null
    }
  },

  // Get user by username with password for authentication
  getUserForAuth: async (username: string): Promise<UserWithPassword | null> => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

      if (error) {
        console.error('Error fetching user for auth:', error)
        return null
      }

      const baseUser = convertDatabaseUserToUser(user)
      return {
        ...baseUser,
        password: user.password || 'user123'
      }
    } catch (error) {
      console.error('Error in getUserForAuth:', error)
      return null
    }
  },

  // Create user
  create: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>, password?: string): Promise<User | null> => {
    try {
      // Convert user data but exclude the id field to let database generate it
      const { id, ...dbUserWithoutId } = convertUserToDatabaseUser({
        ...userData,
        id: '' // This will be excluded anyway
      })

      // Add password if provided, otherwise use default
      const dataWithPassword = {
        ...dbUserWithoutId,
        password: password || 'user123'
      }

      const { data: createdUser, error } = await supabase
        .from('users')
        .insert(dataWithPassword)
        .select()
        .single()

      if (error) {
        console.error('Error creating user:', error)
        return null
      }

      return convertDatabaseUserToUser(createdUser)
    } catch (error) {
      console.error('Error in create:', error)
      return null
    }
  },

  // Update user
  update: async (id: string, updates: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | null> => {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      // Convert camelCase to snake_case for database
      const dbUpdateData: any = {}
      if (updates.username) dbUpdateData.username = updates.username
      if (updates.email) dbUpdateData.email = updates.email
      if (updates.name) dbUpdateData.name = updates.name
      if (updates.department !== undefined) dbUpdateData.department = updates.department
      if (updates.role) dbUpdateData.role = updates.role
      if (updates.phone !== undefined) dbUpdateData.phone = updates.phone
      if (updates.avatarUrl !== undefined) dbUpdateData.avatar_url = updates.avatarUrl
      if (updates.lastLogin !== undefined) dbUpdateData.last_login = updates.lastLogin
      
      dbUpdateData.updated_at = new Date().toISOString()

      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(dbUpdateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating user:', error)
        return null
      }

      return convertDatabaseUserToUser(updatedUser)
    } catch (error) {
      console.error('Error in update:', error)
      return null
    }
  },

  // Update last login
  updateLastLogin: async (id: string): Promise<boolean> => {
    try {
      // Check if id is a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(id)) {
        console.warn('Invalid UUID format for user ID, skipping last login update:', id)
        return false
      }

      const { error } = await supabase
        .from('users')
        .update({
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        console.error('Error updating last login:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in updateLastLogin:', error)
      return false
    }
  },

  // Delete user
  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting user:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in delete:', error)
      return false
    }
  },

  // Log user activity
  logActivity: async (userId: string, activityType: string, description: string, metadata?: any): Promise<boolean> => {
    try {
      // Check if userId is a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(userId)) {
        console.warn('Invalid UUID format for user ID, skipping activity log:', userId)
        return false
      }

      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: userId,
          activity_type: activityType,
          description: description,
          metadata: metadata || {}
        })

      if (error) {
        console.error('Error logging user activity:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in logActivity:', error)
      return false
    }
  },

  // Get user activities
  getActivities: async (userId: string, limit: number = 50): Promise<UserActivity[]> => {
    try {
      const { data: activities, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching user activities:', error)
        return []
      }

      return activities.map(activity => ({
        id: activity.id,
        userId: activity.user_id,
        activityType: activity.activity_type,
        description: activity.description || '',
        metadata: activity.metadata,
        createdAt: activity.created_at
      }))
    } catch (error) {
      console.error('Error in getActivities:', error)
      return []
    }
  },

  // Get recent activities for all users
  getRecentActivities: async (limit: number = 100): Promise<UserActivity[]> => {
    try {
      const { data: activities, error } = await supabase
        .from('user_activities')
        .select(`
          *,
          users (
            name,
            email,
            department
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching recent activities:', error)
        return []
      }

      return activities.map(activity => ({
        id: activity.id,
        userId: activity.user_id,
        activityType: activity.activity_type,
        description: activity.description || '',
        metadata: {
          ...activity.metadata,
          user: activity.users
        },
        createdAt: activity.created_at
      }))
    } catch (error) {
      console.error('Error in getRecentActivities:', error)
      return []
    }
  },

  // Get users by department
  getByDepartment: async (department: string): Promise<User[]> => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('department', department)
        .order('name')

      if (error) {
        console.error('Error fetching users by department:', error)
        return []
      }

      return users.map(convertDatabaseUserToUser)
    } catch (error) {
      console.error('Error in getByDepartment:', error)
      return []
    }
  },

  // Get users by role
  getByRole: async (role: 'admin' | 'approver' | 'user'): Promise<User[]> => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', role)
        .order('name')

      if (error) {
        console.error('Error fetching users by role:', error)
        return []
      }

      return users.map(convertDatabaseUserToUser)
    } catch (error) {
      console.error('Error in getByRole:', error)
      return []
    }
  }
}