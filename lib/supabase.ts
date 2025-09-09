import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Database types based on our schema
export interface DatabaseUser {
  id: string
  username: string
  email: string
  name: string
  department: string | null
  role: string
  phone: string | null
  avatar_url: string | null
  last_login: string | null
  created_at: string
  updated_at: string
}

export interface DatabasePermit {
  id: string
  type: string
  subtype: string | null
  title: string
  status: string
  current_approver_index: number
  requester_name: string
  requester_department: string | null
  requester_email: string | null
  data: any
  created_at: string
  updated_at: string
  completed_at: string | null
  created_by: string | null
}

export interface DatabasePermitApprover {
  id: string
  permit_id: string
  approver_order: number
  name: string
  email: string
  role: string | null
  status: string
  approved_at: string | null
  comments: string | null
  created_at: string
  updated_at: string
}

export interface DatabaseJSADocument {
  id: string
  work_name: string
  work_number: string | null
  revision_date: string | null
  author: string | null
  author_date: string | null
  department: string | null
  reviewer: string | null
  review_date: string | null
  work_area: string | null
  approver: string | null
  approval_date: string | null
  required_ppe: string | null
  required_equipment: string | null
  required_documents: string | null
  required_safety_equipment: string | null
  status: string
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface DatabaseJSAStep {
  id: string
  jsa_document_id: string
  step_order: number
  step: string
  hazards: string | null
  controls: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface DatabaseUserActivity {
  id: string
  user_id: string
  activity_type: string
  description: string | null
  metadata: any
  created_at: string
}

// Helper functions for common queries
export const supabaseHelpers = {
  // Get current user info
  getCurrentUser: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user
  },

  // Get user by email
  getUserByEmail: async (email: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    return { data, error }
  },

  // Create user
  createUser: async (userData: Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()
    
    return { data, error }
  },

  // Subscribe to realtime changes
  subscribeToPermits: (callback: (payload: any) => void) => {
    return supabase
      .channel('permits-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'permits' 
        }, 
        callback
      )
      .subscribe()
  },

  subscribeToJSA: (callback: (payload: any) => void) => {
    return supabase
      .channel('jsa-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'jsa_documents' 
        }, 
        callback
      )
      .subscribe()
  }
}

export default supabase