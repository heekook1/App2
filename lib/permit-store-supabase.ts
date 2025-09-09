import { supabase, DatabasePermit, DatabasePermitApprover } from './supabase'

export interface PermitApprover {
  name: string
  email: string
  role: string
  status: "pending" | "approved" | "rejected"
  approvedAt?: string
  comments?: string
}

export interface Permit {
  id: string
  type: "general" | "fire" | "supplementary"
  subtype?: string
  title: string
  requester: {
    name: string
    department: string
    email: string
  }
  createdAt: string
  status: "draft" | "pending" | "in-progress" | "approved" | "rejected"
  currentApproverIndex: number
  approvers: PermitApprover[]
  data: any // The actual form data
  extensionRequests?: Array<{
    requestedAt: string
    requestedBy: string
    reason: string
    status: "pending" | "approved" | "rejected"
  }>
  completionData?: {
    completedAt: string
    completedBy: string
    finalChecks: any
  }
}

// Helper function to convert database permit to frontend permit
const convertDatabasePermitToPermit = async (dbPermit: DatabasePermit): Promise<Permit> => {
  // Get approvers for this permit
  const { data: approvers, error: approversError } = await supabase
    .from('permit_approvers')
    .select('*')
    .eq('permit_id', dbPermit.id)
    .order('approver_order')

  if (approversError) {
    console.error('Error fetching approvers:', approversError)
  }

  const convertedApprovers: PermitApprover[] = (approvers || []).map(approver => ({
    name: approver.name,
    email: approver.email,
    role: approver.role || '',
    status: approver.status as "pending" | "approved" | "rejected",
    approvedAt: approver.approved_at || undefined,
    comments: approver.comments || undefined
  }))

  return {
    id: dbPermit.id,
    type: dbPermit.type as "general" | "fire" | "supplementary",
    subtype: dbPermit.subtype || undefined,
    title: dbPermit.title,
    requester: {
      name: dbPermit.requester_name,
      department: dbPermit.requester_department || '',
      email: dbPermit.requester_email || ''
    },
    createdAt: dbPermit.created_at,
    status: dbPermit.status as "draft" | "pending" | "in-progress" | "approved" | "rejected",
    currentApproverIndex: dbPermit.current_approver_index,
    approvers: convertedApprovers,
    data: dbPermit.data
  }
}

// Convert frontend permit to database format
const convertPermitToDatabasePermit = (permit: Omit<Permit, 'createdAt'>): Omit<DatabasePermit, 'created_at' | 'updated_at'> => {
  return {
    id: permit.id,
    type: permit.type,
    subtype: permit.subtype || null,
    title: permit.title,
    status: permit.status,
    current_approver_index: permit.currentApproverIndex,
    requester_name: permit.requester.name,
    requester_department: permit.requester.department,
    requester_email: permit.requester.email,
    data: permit.data,
    completed_at: permit.status === 'approved' ? new Date().toISOString() : null,
    created_by: null // TODO: Add user tracking
  }
}

export const permitStore = {
  // Get all permits
  getAll: async (): Promise<Permit[]> => {
    try {
      const { data: permits, error } = await supabase
        .from('permits')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching permits:', error)
        return []
      }

      // Convert each permit with its approvers
      const convertedPermits = await Promise.all(
        permits.map(permit => convertDatabasePermitToPermit(permit))
      )

      return convertedPermits
    } catch (error) {
      console.error('Error in getAll:', error)
      return []
    }
  },

  // Get permit by ID
  getById: async (id: string): Promise<Permit | null> => {
    try {
      const { data: permit, error } = await supabase
        .from('permits')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching permit:', error)
        return null
      }

      return await convertDatabasePermitToPermit(permit)
    } catch (error) {
      console.error('Error in getById:', error)
      return null
    }
  },

  // Create a new permit
  create: async (permitData: {
    type: "general" | "fire" | "supplementary"
    subtype?: string
    title: string
    requester: {
      name: string
      department: string
      email: string
    }
    approvers: PermitApprover[]
    data: any
  }): Promise<Permit | null> => {
    try {
      const permitId = `${permitData.type.toUpperCase()}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
      
      // Create the permit
      const dbPermit = convertPermitToDatabasePermit({
        id: permitId,
        type: permitData.type,
        subtype: permitData.subtype,
        title: permitData.title,
        requester: permitData.requester,
        status: 'pending',
        currentApproverIndex: 0,
        approvers: permitData.approvers,
        data: permitData.data
      })

      const { data: createdPermit, error: permitError } = await supabase
        .from('permits')
        .insert(dbPermit)
        .select()
        .single()

      if (permitError) {
        console.error('Error creating permit:', permitError)
        return null
      }

      // Create approvers
      const approversToInsert = permitData.approvers.map((approver, index) => ({
        permit_id: permitId,
        approver_order: index,
        name: approver.name,
        email: approver.email,
        role: approver.role,
        status: 'pending'
      }))

      const { error: approversError } = await supabase
        .from('permit_approvers')
        .insert(approversToInsert)

      if (approversError) {
        console.error('Error creating approvers:', approversError)
        // Clean up the permit if approvers creation failed
        await supabase.from('permits').delete().eq('id', permitId)
        return null
      }

      return await convertDatabasePermitToPermit(createdPermit)
    } catch (error) {
      console.error('Error in create:', error)
      return null
    }
  },

  // Update permit status
  updateStatus: async (id: string, status: "draft" | "pending" | "in-progress" | "approved" | "rejected"): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('permits')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
          completed_at: status === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', id)

      if (error) {
        console.error('Error updating permit status:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in updateStatus:', error)
      return false
    }
  },

  // Approve permit
  approve: async (permitId: string, approverEmail: string, comments?: string): Promise<boolean> => {
    try {
      // Get the current permit
      const permit = await permitStore.getById(permitId)
      if (!permit) return false

      // Update the approver status
      const { error: approverError } = await supabase
        .from('permit_approvers')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          comments: comments || null,
          updated_at: new Date().toISOString()
        })
        .eq('permit_id', permitId)
        .eq('email', approverEmail)

      if (approverError) {
        console.error('Error updating approver:', approverError)
        return false
      }

      // Check if this is the last approver
      const currentApproverIndex = permit.currentApproverIndex
      const nextApproverIndex = currentApproverIndex + 1
      const isLastApprover = nextApproverIndex >= permit.approvers.length

      // Update permit status and approver index
      const newStatus = isLastApprover ? 'approved' : 'in-progress'
      const newApproverIndex = isLastApprover ? currentApproverIndex : nextApproverIndex

      const { error: permitError } = await supabase
        .from('permits')
        .update({
          status: newStatus,
          current_approver_index: newApproverIndex,
          updated_at: new Date().toISOString(),
          completed_at: isLastApprover ? new Date().toISOString() : null
        })
        .eq('id', permitId)

      if (permitError) {
        console.error('Error updating permit:', permitError)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in approve:', error)
      return false
    }
  },

  // Reject permit
  reject: async (permitId: string, approverEmail: string, comments: string): Promise<boolean> => {
    try {
      // Update the approver status
      const { error: approverError } = await supabase
        .from('permit_approvers')
        .update({
          status: 'rejected',
          approved_at: new Date().toISOString(),
          comments: comments,
          updated_at: new Date().toISOString()
        })
        .eq('permit_id', permitId)
        .eq('email', approverEmail)

      if (approverError) {
        console.error('Error updating approver:', approverError)
        return false
      }

      // Update permit status to rejected
      const { error: permitError } = await supabase
        .from('permits')
        .update({
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', permitId)

      if (permitError) {
        console.error('Error updating permit:', permitError)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in reject:', error)
      return false
    }
  },

  // Delete permit
  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('permits')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting permit:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in delete:', error)
      return false
    }
  },

  // Get permits by status
  getByStatus: async (status: string): Promise<Permit[]> => {
    try {
      const { data: permits, error } = await supabase
        .from('permits')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching permits by status:', error)
        return []
      }

      const convertedPermits = await Promise.all(
        permits.map(permit => convertDatabasePermitToPermit(permit))
      )

      return convertedPermits
    } catch (error) {
      console.error('Error in getByStatus:', error)
      return []
    }
  },

  // Get permits by requester department
  getByDepartment: async (department: string): Promise<Permit[]> => {
    try {
      const { data: permits, error } = await supabase
        .from('permits')
        .select('*')
        .eq('requester_department', department)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching permits by department:', error)
        return []
      }

      const convertedPermits = await Promise.all(
        permits.map(permit => convertDatabasePermitToPermit(permit))
      )

      return convertedPermits
    } catch (error) {
      console.error('Error in getByDepartment:', error)
      return []
    }
  }
}