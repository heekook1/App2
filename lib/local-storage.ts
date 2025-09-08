// LocalStorage를 이용한 허가서 데이터 관리
export interface StoredPermit {
  id: string
  type: "general" | "fire" | "gas-measurement" | "fire-checklist"
  title: string
  requester: {
    name: string
    department: string
  }
  createdAt: string
  status: "pending" | "approved" | "rejected" | "in-progress"
  data: any
}

const PERMITS_KEY = "work_permits"

export const localStorageUtils = {
  // 모든 허가서 가져오기
  getAllPermits: (): StoredPermit[] => {
    try {
      const stored = localStorage.getItem(PERMITS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error reading permits from localStorage:", error)
      return []
    }
  },

  // 허가서 저장
  savePermit: (permit: StoredPermit): boolean => {
    try {
      const permits = localStorageUtils.getAllPermits()
      const existingIndex = permits.findIndex((p) => p.id === permit.id)

      if (existingIndex >= 0) {
        permits[existingIndex] = permit
      } else {
        permits.push(permit)
      }

      localStorage.setItem(PERMITS_KEY, JSON.stringify(permits))
      return true
    } catch (error) {
      console.error("Error saving permit to localStorage:", error)
      return false
    }
  },

  // 특정 허가서 가져오기
  getPermitById: (id: string): StoredPermit | null => {
    const permits = localStorageUtils.getAllPermits()
    return permits.find((p) => p.id === id) || null
  },

  // 허가서 삭제
  deletePermit: (id: string): boolean => {
    try {
      const permits = localStorageUtils.getAllPermits()
      const filtered = permits.filter((p) => p.id !== id)
      localStorage.setItem(PERMITS_KEY, JSON.stringify(filtered))
      return true
    } catch (error) {
      console.error("Error deleting permit from localStorage:", error)
      return false
    }
  },
}
