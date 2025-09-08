"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Eye, FileText, Flame, AlertTriangle, Shield, Download, BarChart3, List } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { generatePermitPDF } from "@/lib/pdf-utils"
import { localStorageUtils, type StoredPermit } from "@/lib/local-storage"

export default function PermitListPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [permits, setPermits] = useState<StoredPermit[]>([])
  const [filteredPermits, setFilteredPermits] = useState<StoredPermit[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    const storedPermits = localStorageUtils.getAllPermits()
    setPermits(storedPermits)
    setFilteredPermits(storedPermits)
  }, [])

  useEffect(() => {
    let filtered = permits

    if (searchTerm) {
      filtered = filtered.filter(
        (permit) =>
          permit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          permit.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          permit.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((permit) => permit.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((permit) => permit.type === typeFilter)
    }

    setFilteredPermits(filtered)
  }, [permits, searchTerm, statusFilter, typeFilter])

  const handleBulkDownload = async () => {
    if (filteredPermits.length === 0) {
      alert("다운로드할 허가서가 없습니다.")
      return
    }

    try {
      for (const permit of filteredPermits) {
        await generatePermitPDF(permit, permit.type)
        // Add small delay to prevent overwhelming the browser
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
      alert(`${filteredPermits.length}개의 허가서 PDF 다운로드가 시작되었습니다.`)
    } catch (error) {
      console.error("일괄 PDF 생성 오류:", error)
      alert("PDF 생성 중 오류가 발생했습니다.")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">임시저장</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            결재대기
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            결재진행중
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="border-green-500 text-green-600">
            승인완료
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">반려</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "general":
        return <FileText className="w-4 h-4" />
      case "fire":
        return <Flame className="w-4 h-4" />
      case "gas-measurement":
        return <BarChart3 className="w-4 h-4" />
      case "fire-checklist":
        return <List className="w-4 h-4" />
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
      case "gas-measurement":
        return "가스농도측정"
      case "fire-checklist":
        return "화기작업체크리스트"
      case "supplementary":
        return "보조작업"
      default:
        return type
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

  const showDetailedInfo = (permit: StoredPermit) => {
    const permitData = permit.data
    let details = `
허가서 상세 정보:
- 허가서 번호: ${permit.id}
- 작업명: ${permit.title}
- 유형: ${getTypeLabel(permit.type)}
- 작성자: ${permit.requester.name} (${permit.requester.department})
- 작성일: ${formatDate(permit.createdAt)}
- 현재 상태: ${permit.status === "pending" ? "결재대기" : permit.status === "in-progress" ? "결재진행중" : permit.status === "approved" ? "승인완료" : "반려"}
`

    // 작업 상세 정보 추가
    if (permitData) {
      if (permitData.workLocation) {
        details += `- 작업 장소: ${permitData.workLocation}\n`
      }
      if (permitData.workOverview) {
        details += `- 작업 개요: ${permitData.workOverview}\n`
      }
      if (permitData.validStartDateTime && permitData.validEndDateTime) {
        details += `- 작업 기간: ${new Date(permitData.validStartDateTime).toLocaleString("ko-KR")} ~ ${new Date(permitData.validEndDateTime).toLocaleString("ko-KR")}\n`
      }
      if (permitData.workSupervisor) {
        details += `- 작업책임자: ${permitData.workSupervisor}\n`
      }
      if (permitData.safetyMeasures && permitData.safetyMeasures.length > 0) {
        details += `- 안전조치: ${permitData.safetyMeasures.join(", ")}\n`
      }
    }

    alert(details.trim())
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="hover:bg-muted">
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">작업허가서 목록</h1>
              <p className="text-sm text-muted-foreground">Work Permit List</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkDownload}
            disabled={filteredPermits.length === 0}
            className="border-border hover:bg-muted bg-transparent"
          >
            <Download className="w-4 h-4 mr-2" />
            일괄 다운로드 ({filteredPermits.length})
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Filters */}
        <Card className="shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="허가서 번호, 작업명, 작성자로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="상태 필터" />
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
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="유형 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 유형</SelectItem>
                  <SelectItem value="general">일반위험</SelectItem>
                  <SelectItem value="fire">화기작업</SelectItem>
                  <SelectItem value="gas-measurement">가스농도측정</SelectItem>
                  <SelectItem value="fire-checklist">화기작업체크리스트</SelectItem>
                  <SelectItem value="supplementary">보조작업</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Permits List */}
        <div className="space-y-4">
          {filteredPermits.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">검색 결과가 없습니다</h3>
                <p className="text-muted-foreground">다른 검색 조건을 시도해보세요.</p>
              </CardContent>
            </Card>
          ) : (
            filteredPermits.map((permit) => (
              <Card key={permit.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(permit.type)}
                          <span className="text-sm font-medium text-muted-foreground">{getTypeLabel(permit.type)}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {permit.id}
                        </Badge>
                        {getStatusBadge(permit.status)}
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-1">{permit.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>작성자: {permit.requester.name}</span>
                        <span>부서: {permit.requester.department}</span>
                        <span>작성일: {formatDate(permit.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/permits/view/${permit.id}`)}
                        className="border-border hover:bg-muted bg-transparent"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        상세보기
                      </Button>
                      {(permit.status === "pending" || permit.status === "in-progress") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => showDetailedInfo(permit)}
                          className="border-blue-500 text-blue-600 hover:bg-blue-50"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          상세정보
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
