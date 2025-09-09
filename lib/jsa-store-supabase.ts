import { supabase, DatabaseJSADocument, DatabaseJSAStep } from './supabase'

export interface JSAStep {
  id: string
  step: string
  hazards: string
  controls: string
  notes: string
}

export interface JSAData {
  id: string
  workName: string
  workNumber: string
  revisionDate: string
  author: string
  authorDate: string
  department: string
  reviewer: string
  reviewDate: string
  workArea: string
  approver: string
  approvalDate: string
  requiredPPE: string
  requiredEquipment: string
  requiredDocuments: string
  requiredSafetyEquipment: string
  steps: JSAStep[]
  createdAt: string
  updatedAt: string
  status: "draft" | "completed"
}

// Helper function to convert database JSA to frontend JSA
const convertDatabaseJSAToJSA = async (dbJSA: DatabaseJSADocument): Promise<JSAData> => {
  // Get steps for this JSA document
  const { data: steps, error: stepsError } = await supabase
    .from('jsa_steps')
    .select('*')
    .eq('jsa_document_id', dbJSA.id)
    .order('step_order')

  if (stepsError) {
    console.error('Error fetching JSA steps:', stepsError)
  }

  const convertedSteps: JSAStep[] = (steps || []).map(step => ({
    id: step.id,
    step: step.step,
    hazards: step.hazards || '',
    controls: step.controls || '',
    notes: step.notes || ''
  }))

  return {
    id: dbJSA.id,
    workName: dbJSA.work_name,
    workNumber: dbJSA.work_number || '',
    revisionDate: dbJSA.revision_date || '',
    author: dbJSA.author || '',
    authorDate: dbJSA.author_date || '',
    department: dbJSA.department || '',
    reviewer: dbJSA.reviewer || '',
    reviewDate: dbJSA.review_date || '',
    workArea: dbJSA.work_area || '',
    approver: dbJSA.approver || '',
    approvalDate: dbJSA.approval_date || '',
    requiredPPE: dbJSA.required_ppe || '',
    requiredEquipment: dbJSA.required_equipment || '',
    requiredDocuments: dbJSA.required_documents || '',
    requiredSafetyEquipment: dbJSA.required_safety_equipment || '',
    steps: convertedSteps,
    createdAt: dbJSA.created_at,
    updatedAt: dbJSA.updated_at,
    status: dbJSA.status as "draft" | "completed"
  }
}

// Convert frontend JSA to database format
const convertJSAToDatabaseJSA = (jsa: Omit<JSAData, 'createdAt' | 'updatedAt'>): Omit<DatabaseJSADocument, 'created_at' | 'updated_at' | 'created_by'> => {
  return {
    id: jsa.id,
    work_name: jsa.workName,
    work_number: jsa.workNumber || null,
    revision_date: jsa.revisionDate || null,
    author: jsa.author || null,
    author_date: jsa.authorDate || null,
    department: jsa.department || null,
    reviewer: jsa.reviewer || null,
    review_date: jsa.reviewDate || null,
    work_area: jsa.workArea || null,
    approver: jsa.approver || null,
    approval_date: jsa.approvalDate || null,
    required_ppe: jsa.requiredPPE || null,
    required_equipment: jsa.requiredEquipment || null,
    required_documents: jsa.requiredDocuments || null,
    required_safety_equipment: jsa.requiredSafetyEquipment || null,
    status: jsa.status
  }
}

export const jsaStore = {
  // Get all JSA documents
  getAll: async (): Promise<JSAData[]> => {
    try {
      const { data: jsaDocuments, error } = await supabase
        .from('jsa_documents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching JSA documents:', error)
        return []
      }

      // Convert each JSA with its steps
      const convertedJSAs = await Promise.all(
        jsaDocuments.map(jsa => convertDatabaseJSAToJSA(jsa))
      )

      return convertedJSAs
    } catch (error) {
      console.error('Error in getAll:', error)
      return []
    }
  },

  // Get JSA by ID
  getById: async (id: string): Promise<JSAData | null> => {
    try {
      const { data: jsa, error } = await supabase
        .from('jsa_documents')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching JSA document:', error)
        return null
      }

      return await convertDatabaseJSAToJSA(jsa)
    } catch (error) {
      console.error('Error in getById:', error)
      return null
    }
  },

  // Save JSA document
  save: async (jsaData: Omit<JSAData, 'id' | 'createdAt' | 'updatedAt'>): Promise<JSAData | null> => {
    try {
      const jsaId = `jsa-${Date.now()}`
      
      // Create the JSA document
      const dbJSA = convertJSAToDatabaseJSA({
        ...jsaData,
        id: jsaId
      })

      const { data: createdJSA, error: jsaError } = await supabase
        .from('jsa_documents')
        .insert({
          ...dbJSA,
          created_by: null // TODO: Add user tracking
        })
        .select()
        .single()

      if (jsaError) {
        console.error('Error creating JSA document:', jsaError)
        return null
      }

      // Create steps
      if (jsaData.steps.length > 0) {
        const stepsToInsert = jsaData.steps.map((step, index) => ({
          id: step.id,
          jsa_document_id: jsaId,
          step_order: index,
          step: step.step,
          hazards: step.hazards || null,
          controls: step.controls || null,
          notes: step.notes || null
        }))

        const { error: stepsError } = await supabase
          .from('jsa_steps')
          .insert(stepsToInsert)

        if (stepsError) {
          console.error('Error creating JSA steps:', stepsError)
          // Clean up the JSA document if steps creation failed
          await supabase.from('jsa_documents').delete().eq('id', jsaId)
          return null
        }
      }

      return await convertDatabaseJSAToJSA(createdJSA)
    } catch (error) {
      console.error('Error in save:', error)
      return null
    }
  },

  // Update existing JSA document
  update: async (id: string, updates: Partial<Omit<JSAData, 'id' | 'createdAt'>>): Promise<JSAData | null> => {
    try {
      // Get the current JSA
      const currentJSA = await jsaStore.getById(id)
      if (!currentJSA) return null

      // Prepare the updated JSA data
      const updatedJSA = {
        ...currentJSA,
        ...updates,
        updatedAt: new Date().toISOString()
      }

      const dbJSA = convertJSAToDatabaseJSA(updatedJSA)

      // Update the JSA document
      const { data: updatedDocument, error: jsaError } = await supabase
        .from('jsa_documents')
        .update({
          ...dbJSA,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (jsaError) {
        console.error('Error updating JSA document:', jsaError)
        return null
      }

      // Update steps if provided
      if (updates.steps) {
        // Delete existing steps
        await supabase
          .from('jsa_steps')
          .delete()
          .eq('jsa_document_id', id)

        // Insert new steps
        if (updates.steps.length > 0) {
          const stepsToInsert = updates.steps.map((step, index) => ({
            id: step.id,
            jsa_document_id: id,
            step_order: index,
            step: step.step,
            hazards: step.hazards || null,
            controls: step.controls || null,
            notes: step.notes || null
          }))

          const { error: stepsError } = await supabase
            .from('jsa_steps')
            .insert(stepsToInsert)

          if (stepsError) {
            console.error('Error updating JSA steps:', stepsError)
            return null
          }
        }
      }

      return await convertDatabaseJSAToJSA(updatedDocument)
    } catch (error) {
      console.error('Error in update:', error)
      return null
    }
  },

  // Delete JSA document
  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('jsa_documents')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting JSA document:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in delete:', error)
      return false
    }
  },

  // Get statistics
  getStats: async () => {
    try {
      const { data: jsaDocuments, error } = await supabase
        .from('jsa_documents')
        .select('status')

      if (error) {
        console.error('Error fetching JSA stats:', error)
        return {
          total: 0,
          draft: 0,
          completed: 0
        }
      }

      const total = jsaDocuments.length
      const draft = jsaDocuments.filter(jsa => jsa.status === 'draft').length
      const completed = jsaDocuments.filter(jsa => jsa.status === 'completed').length

      return {
        total,
        draft,
        completed
      }
    } catch (error) {
      console.error('Error in getStats:', error)
      return {
        total: 0,
        draft: 0,
        completed: 0
      }
    }
  },

  // Get JSAs by department
  getByDepartment: async (department: string): Promise<JSAData[]> => {
    try {
      const { data: jsaDocuments, error } = await supabase
        .from('jsa_documents')
        .select('*')
        .eq('department', department)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching JSA documents by department:', error)
        return []
      }

      const convertedJSAs = await Promise.all(
        jsaDocuments.map(jsa => convertDatabaseJSAToJSA(jsa))
      )

      return convertedJSAs
    } catch (error) {
      console.error('Error in getByDepartment:', error)
      return []
    }
  },

  // Get JSAs by status
  getByStatus: async (status: "draft" | "completed"): Promise<JSAData[]> => {
    try {
      const { data: jsaDocuments, error } = await supabase
        .from('jsa_documents')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching JSA documents by status:', error)
        return []
      }

      const convertedJSAs = await Promise.all(
        jsaDocuments.map(jsa => convertDatabaseJSAToJSA(jsa))
      )

      return convertedJSAs
    } catch (error) {
      console.error('Error in getByStatus:', error)
      return []
    }
  }
}