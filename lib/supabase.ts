import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface DatabaseUser {
  id: string
  username: string
  email: string
  name: string
  department: string
  role: 'admin' | 'approver' | 'user'
  is_active: boolean
  created_at: string
  updated_at: string
  last_login_at?: string
}

export interface DatabasePermit {
  id: string
  type: 'general' | 'fire' | 'supplementary'
  title: string
  status: 'draft' | 'pending' | 'in-progress' | 'approved' | 'rejected'
  requester_id: string
  current_approver_index: number
  data: any // JSON data
  created_at: string
  updated_at: string
}

export interface DatabaseJSA {
  id: string
  title: string
  workplace: string
  work_date: string
  team_leader: string
  workers: string[]
  steps: Array<{
    step: string
    hazards: string[]
    controls: string[]
  }>
  requester_id: string
  created_at: string
  updated_at: string
}