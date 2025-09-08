import { permitStore } from "./permit-store"
import { localStorageUtils } from "./local-storage"

export interface PermitStats {
  inProgress: number
  approved: number
  rejected: number
  total: number
}

export function calculatePermitStats(): PermitStats {
  // Get all permits from both sources
  const storePermits = permitStore.getAll()
  const localPermits = localStorageUtils.getAllPermits()
  
  // Combine permits and remove duplicates
  const permitMap = new Map<string, any>()
  
  // Add permits from store first  
  storePermits.forEach(p => permitMap.set(p.id, p))
  
  // Add permits from localStorage (will override if same ID exists)
  localPermits.forEach(p => permitMap.set(p.id, p))
  
  const allPermits = Array.from(permitMap.values())
  
  return {
    inProgress: allPermits.filter(p => p.status === "pending" || p.status === "in-progress").length,
    approved: allPermits.filter(p => p.status === "approved").length,
    rejected: allPermits.filter(p => p.status === "rejected").length,
    total: allPermits.length
  }
}

export function calculateUserStats(userEmail: string) {
  const stats = calculatePermitStats()
  const pendingApprovals = permitStore.getPendingForApprover(userEmail)
  
  return {
    ...stats,
    pendingApprovals: pendingApprovals.length
  }
}