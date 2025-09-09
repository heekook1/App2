"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Eye, FileText, Flame, AlertTriangle, Shield, Download, BarChart3, List, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { generatePermitPDF } from "@/lib/pdf-utils"
import { permitStore, type Permit } from "@/lib/permit-store-supabase"

export default function PermitListPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [permits, setPermits] = useState<Permit[]>([])
  const [filteredPermits, setFilteredPermits] = useState<Permit[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load permits from Supabase
  useEffect(() => {
    const loadPermits = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await permitStore.getAll()
        setPermits(data)
        setFilteredPermits(data)
      } catch (err) {
        console.error('Error loading permits:', err)
        setError('허가서를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadPermits()
  }, [])

  useEffect(() => {
    let filtered = permits

    if (searchTerm) {
      filtered = filtered.filter(permit => 
        permit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permit.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permit.requester.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(permit => permit.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(permit => permit.type === typeFilter)
    }

    setFilteredPermits(filtered)
  }, [permits, searchTerm, statusFilter, typeFilter])

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
        return "보충작업"
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
      minute: "2-digit"
    })
  }

  const handleDownloadPDF = async (permit: Permit) => {
    try {
      await generatePermitPDF(permit, permit.type)
      alert("PDF 다운로드가 시작되었습니다.")
    } catch (error) {
      console.error("PDF 생성 오류:", error)
      alert("PDF 생성 중 오류가 발생했습니다.")
    }
  }

  const getStats = () => {
    return {
      total: permits.length,
      pending: permits.filter(p => p.status === 'pending').length,
      inProgress: permits.filter(p => p.status === 'in-progress').length,
      approved: permits.filter(p => p.status === 'approved').length,
      rejected: permits.filter(p => p.status === 'rejected').length
    }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>허가서를 불러오는 중...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">오류가 발생했습니다</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              다시 시도
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="border-border hover:bg-muted bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                뒤로가기
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold text-foreground">작업허가서 관리</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">전체</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">결재대기</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <div className="text-sm text-muted-foreground">진행중</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-sm text-muted-foreground">승인완료</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-muted-foreground">반려</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="제목, 작성자, 부서로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="draft">임시저장</SelectItem>
                  <SelectItem value="pending">결재대기</SelectItem>
                  <SelectItem value="in-progress">결재진행중</SelectItem>
                  <SelectItem value="approved">승인완료</SelectItem>
                  <SelectItem value="rejected">반려</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 유형</SelectItem>
                  <SelectItem value="general">일반위험</SelectItem>
                  <SelectItem value="fire">화기작업</SelectItem>
                  <SelectItem value="supplementary">보충작업</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground flex items-center">
                <List className="w-4 h-4 mr-2" />
                총 {filteredPermits.length}개
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permit List */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            {filteredPermits.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {permits.length === 0 
                    ? "등록된 허가서가 없습니다." 
                    : "검색 조건에 맞는 허가서가 없습니다."
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPermits.map((permit) => (
                  <div 
                    key={permit.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-muted rounded-lg">
                          {getTypeIcon(permit.type)}
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{permit.title}</h3>
                          <div className="text-sm text-muted-foreground">
                            {getTypeLabel(permit.type)} • {permit.id}
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(permit.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                      <div>
                        <span className="font-medium">작성자:</span> {permit.requester.name}
                      </div>
                      <div>
                        <span className="font-medium">부서:</span> {permit.requester.department}
                      </div>
                      <div>
                        <span className="font-medium">작성일:</span> {formatDate(permit.createdAt)}
                      </div>
                      <div>
                        <span className="font-medium">승인자:</span> {permit.approvers.length}명
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/permits/view/${permit.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        상세보기
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPDF(permit)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}