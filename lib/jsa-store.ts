// JSA (Job Safety Analysis) data management store

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

const JSA_STORAGE_KEY = 'jsa_documents'

// Get all JSA documents from localStorage
const getJSAFromStorage = (): JSAData[] => {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(JSA_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

// Save JSA documents to localStorage
const saveJSAToStorage = (jsaList: JSAData[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(JSA_STORAGE_KEY, JSON.stringify(jsaList))
}

export const jsaStore = {
  // Get all JSA documents
  getAll: (): JSAData[] => {
    return getJSAFromStorage()
  },

  // Get JSA by ID
  getById: (id: string): JSAData | null => {
    const jsaList = getJSAFromStorage()
    return jsaList.find(jsa => jsa.id === id) || null
  },

  // Save JSA document
  save: (jsaData: Omit<JSAData, 'id' | 'createdAt' | 'updatedAt'>): JSAData => {
    const jsaList = getJSAFromStorage()
    const now = new Date().toISOString()
    
    const newJSA: JSAData = {
      ...jsaData,
      id: `jsa-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    }
    
    jsaList.push(newJSA)
    saveJSAToStorage(jsaList)
    
    return newJSA
  },

  // Update existing JSA document
  update: (id: string, updates: Partial<Omit<JSAData, 'id' | 'createdAt'>>): JSAData | null => {
    const jsaList = getJSAFromStorage()
    const index = jsaList.findIndex(jsa => jsa.id === id)
    
    if (index === -1) return null
    
    jsaList[index] = {
      ...jsaList[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    saveJSAToStorage(jsaList)
    return jsaList[index]
  },

  // Delete JSA document
  delete: (id: string): boolean => {
    const jsaList = getJSAFromStorage()
    const filteredList = jsaList.filter(jsa => jsa.id !== id)
    
    if (filteredList.length === jsaList.length) return false
    
    saveJSAToStorage(filteredList)
    return true
  },

  // Get statistics
  getStats: () => {
    const jsaList = getJSAFromStorage()
    return {
      total: jsaList.length,
      draft: jsaList.filter(jsa => jsa.status === 'draft').length,
      completed: jsaList.filter(jsa => jsa.status === 'completed').length
    }
  }
}