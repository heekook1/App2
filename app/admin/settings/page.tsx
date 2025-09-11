"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  ArrowLeft, 
  Settings, 
  Trash2, 
  Search,
  FileText,
  Flame,
  AlertTriangle,
  Home,
  RefreshCw
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { permitStore, type Permit } from "@/lib/permit-store-supabase"
import { toast } from "@/components/ui/use-toast"

export default function SystemSettingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [permits, setPermits] = useState<Permit[]>([])
  const [filteredPermits, setFilteredPermits] = useState<Permit[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deletePermitId, setDeletePermitId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/")
      return
    }
    loadPermits()
  }, [user, router])

  const loadPermits = async () => {
    try {
      setLoading(true)
      const allPermits = await permitStore.getAll()
      const sortedPermits = allPermits.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setPermits(sortedPermits)
      setFilteredPermits(sortedPermits)
    } catch (error) {
      console.error("Error loading permits:", error)
      toast({
        title: "오류",
        description: "허가서 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const filtered = permits.filter(permit => 
      permit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.requester.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPermits(filtered)
  }, [searchTerm, permits])

  const handleDelete = async () => {
    if (!deletePermitId) return

    setIsDeleting(true)
    try {
      const success = await permitStore.delete(deletePermitId)
      if (success) {
        toast({
          title: "삭제 완료",
          description: "허가서가 성공적으로 삭제되었습니다.",
        })
        await loadPermits()
      } else {
        toast({
          title: "삭제 실패",
          description: "허가서 삭제에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting permit:", error)
      toast({
        title: "오류",
        description: "허가서 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeletePermitId(null)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "general":
        return <FileText className="w-4 h-4" />
      case "fire":
        return <Flame className="w-4 h-4" />
      case "supplementary":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "general":
        return "일반위험"
      case "fire":
        return "화기작업"
      case "supplementary":
        return "보조작업"
      default:
        return type
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">임시저장</Badge>
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">결재대기</Badge>
      case "in-progress":
        return <Badge variant="outline" className="border-blue-500 text-blue-600">결재진행중</Badge>
      case "approved":
        return <Badge variant="outline" className="border-green-500 text-green-600">승인완료</Badge>
      case "rejected":
        return <Badge variant="destructive">반려</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (user?.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="hover:bg-muted">
              <ArrowLeft className="w-4 h-4 mr-2" />
              홈으로
            </Button>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">시스템 설정</h1>
              <p className="text-sm text-muted-foreground">작업허가서 관리 및 시스템 설정</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>작업허가서 관리</CardTitle>
                <CardDescription>
                  등록된 모든 작업허가서를 조회하고 관리할 수 있습니다.
                </CardDescription>
              </div>
              <Button onClick={loadPermits} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                새로고침
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="허가서 번호, 제목, 작성자, 부서로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">허가서 목록을 불러오는 중...</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableCaption>
                    총 {filteredPermits.length}개의 작업허가서가 등록되어 있습니다.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>종류</TableHead>
                      <TableHead>허가서 번호</TableHead>
                      <TableHead>제목</TableHead>
                      <TableHead>작성자</TableHead>
                      <TableHead>부서</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>작성일</TableHead>
                      <TableHead className="text-center">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPermits.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          등록된 작업허가서가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPermits.map((permit) => (
                        <TableRow key={permit.id}>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {getTypeIcon(permit.type)}
                              <span className="text-sm">{getTypeLabel(permit.type)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{permit.id}</TableCell>
                          <TableCell>{permit.title}</TableCell>
                          <TableCell>{permit.requester.name}</TableCell>
                          <TableCell>{permit.requester.department}</TableCell>
                          <TableCell>{getStatusBadge(permit.status)}</TableCell>
                          <TableCell className="text-sm">{formatDate(permit.createdAt)}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/permits/view/${permit.id}`)}
                              className="mr-2"
                            >
                              보기
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeletePermitId(permit.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={!!deletePermitId} onOpenChange={() => setDeletePermitId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>허가서 삭제 확인</AlertDialogTitle>
              <AlertDialogDescription>
                허가서 번호: <strong>{deletePermitId}</strong>
                <br />
                이 작업허가서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}