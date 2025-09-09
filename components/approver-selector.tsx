"use client"
import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { userStore, type User } from "@/lib/user-store-supabase"

interface Approver {
  username: string
  name: string
  role: string
}

interface ApproverSelectorProps {
  approvers: Approver[]
  onApproverChange: (index: number, field: string, value: string) => void
}

export default function ApproverSelector({ approvers, onApproverChange }: ApproverSelectorProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const approverRoles = ["작업책임자", "현장확인", "작업허가승인", "안전관리자 확인"]

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        const allUsers = await userStore.getAll()
        const availableUsers = allUsers.filter(user => 
          user.role === 'admin' || user.role === 'approver'
        )
        setUsers(availableUsers)
      } catch (error) {
        console.error('Error loading users:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {approverRoles.map((role, index) => {
        const approver = approvers[index] || { username: "", name: "", role }
        const selectedUser = users.find((user) => user.username === approver.username)

        return (
          <div key={index} className="space-y-2">
            <Label className="text-sm font-medium">{role}</Label>
            <div className="space-y-2">
              <Select
                value={approver.username}
                onValueChange={(value) => {
                  const user = users.find((u) => u.username === value)
                  if (user) {
                    onApproverChange(index, "username", user.username)
                    onApproverChange(index, "name", user.name)
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="결재자를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="" disabled>사용자를 불러오는 중...</SelectItem>
                  ) : users.length === 0 ? (
                    <SelectItem value="" disabled>사용가능한 승인자가 없습니다</SelectItem>
                  ) : (
                    users.map((user) => (
                      <SelectItem key={user.id} value={user.username}>
                        <div className="flex items-center space-x-2">
                          <span>{user.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {user.department}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {selectedUser && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>ID: {selectedUser.username}</span>
                  <span>•</span>
                  <span>{selectedUser.department}</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
