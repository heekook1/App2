// Mock data store for permits - in a real app this would be a database
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

// Storage key for localStorage - use same key as local-storage.ts
const STORAGE_KEY = 'work_permits'

// Initialize mock data if not exists
const initializeMockData = (): Permit[] => {
  return [
    {
      id: "GP-20241208-001",
      type: "general",
      title: "보일러 정비작업",
      requester: {
        name: "이작업자",
        department: "정비기술팀",
        email: "worker@company.com",
      },
      createdAt: "2024-12-08T10:00:00Z",
      status: "pending",
      currentApproverIndex: 0,
      approvers: [
        { name: "김현장", email: "field@company.com", role: "현장확인", status: "pending" },
        { name: "박팀장", email: "manager@company.com", role: "작업허가승인", status: "pending" },
        { name: "최안전", email: "safety@company.com", role: "안전관리자 확인", status: "pending" },
        { name: "김관리자", email: "admin@company.com", role: "최종승인", status: "pending" },
      ],
      data: {},
    },
    {
      id: "FW-20241208-002",
      type: "fire",
      title: "배관 용접작업",
      requester: {
        name: "이작업자",
        department: "시설팀",
        email: "worker@company.com",
      },
      createdAt: "2024-12-08T14:00:00Z",
      status: "in-progress",
      currentApproverIndex: 1,
      approvers: [
        {
          name: "김현장",
          email: "field@company.com",
          role: "현장확인",
          status: "approved",
          approvedAt: "2024-12-08T14:30:00Z",
        },
        { name: "박팀장", email: "manager@company.com", role: "작업허가승인", status: "pending" },
        { name: "최안전", email: "safety@company.com", role: "안전관리자 확인", status: "pending" },
        { name: "김관리자", email: "admin@company.com", role: "최종승인", status: "pending" },
      ],
      data: {},
    },
  ]
}

// Get permits from localStorage
const getPermitsFromStorage = (): Permit[] => {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    const mockData = initializeMockData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData))
    return mockData
  }
  
  try {
    return JSON.parse(stored)
  } catch {
    const mockData = initializeMockData()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData))
    return mockData
  }
}

// Save permits to localStorage
const savePermitsToStorage = (permits: Permit[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(permits))
}

export const permitStore = {
  getAll: (): Permit[] => getPermitsFromStorage(),

  getById: (id: string): Permit | undefined => {
    const permits = getPermitsFromStorage()
    return permits.find((permit) => permit.id === id)
  },

  getPendingForApprover: (email: string): Permit[] => {
    const permits = getPermitsFromStorage()
    return permits.filter((permit) => {
      if (permit.status !== "pending" && permit.status !== "in-progress") return false
      // Check if approvers array exists and has items
      if (!permit.approvers || permit.approvers.length === 0) return false
      // Check if currentApproverIndex is valid
      if (permit.currentApproverIndex >= permit.approvers.length) return false
      const currentApprover = permit.approvers[permit.currentApproverIndex]
      return currentApprover?.email === email && currentApprover?.status === "pending"
    })
  },

  create: (permit: Omit<Permit, "id" | "createdAt" | "status" | "currentApproverIndex">): Permit => {
    const permits = getPermitsFromStorage()
    const typePrefix = permit.type === 'general' ? 'GP' : permit.type === 'fire' ? 'FW' : 'SP'
    const newPermit: Permit = {
      ...permit,
      id: `${typePrefix}-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${String(permits.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      status: "pending",
      currentApproverIndex: 0,
    }
    permits.push(newPermit)
    savePermitsToStorage(permits)
    return newPermit
  },

  approve: (id: string, approverEmail: string, comments?: string): boolean => {
    const permits = getPermitsFromStorage()
    const permit = permits.find((p) => p.id === id)
    if (!permit) return false

    const currentApprover = permit.approvers[permit.currentApproverIndex]
    if (currentApprover?.email !== approverEmail) return false

    currentApprover.status = "approved"
    currentApprover.approvedAt = new Date().toISOString()
    currentApprover.comments = comments

    // Move to next approver or complete
    if (permit.currentApproverIndex < permit.approvers.length - 1) {
      permit.currentApproverIndex++
      permit.status = "in-progress"
    } else {
      permit.status = "approved"
    }

    savePermitsToStorage(permits)
    return true
  },

  reject: (id: string, approverEmail: string, comments: string): boolean => {
    const permits = getPermitsFromStorage()
    const permit = permits.find((p) => p.id === id)
    if (!permit) return false

    const currentApprover = permit.approvers[permit.currentApproverIndex]
    if (currentApprover?.email !== approverEmail) return false

    currentApprover.status = "rejected"
    currentApprover.approvedAt = new Date().toISOString()
    currentApprover.comments = comments
    permit.status = "rejected"

    savePermitsToStorage(permits)
    return true
  },

  requestExtension: (id: string, requestedBy: string, reason: string): boolean => {
    const permits = getPermitsFromStorage()
    const permit = permits.find((p) => p.id === id)
    if (!permit) return false

    if (!permit.extensionRequests) permit.extensionRequests = []
    permit.extensionRequests.push({
      requestedAt: new Date().toISOString(),
      requestedBy,
      reason,
      status: "pending",
    })

    savePermitsToStorage(permits)
    return true
  },

  completeWork: (id: string, completedBy: string, finalChecks: any): boolean => {
    const permits = getPermitsFromStorage()
    const permit = permits.find((p) => p.id === id)
    if (!permit || permit.status !== "approved") return false

    permit.completionData = {
      completedAt: new Date().toISOString(),
      completedBy,
      finalChecks,
    }

    savePermitsToStorage(permits)
    return true
  },
}
