"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Flame,
  AlertTriangle,
  Shield,
  Download,
  Printer,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { permitStore, type Permit } from "@/lib/permit-store"
import { localStorageUtils } from "@/lib/local-storage"
import { userStore } from "@/lib/user-store"
import { PrintLayout } from "@/components/print-layout"
import { generatePermitPDF, printPermit } from "@/lib/pdf-utils"

export default function PermitViewPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [permit, setPermit] = useState<Permit | null>(null)
  const [comments, setComments] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (params.id) {
      // Always try permitStore first (it has the complete data with approvers)
      const foundPermit = permitStore.getById(params.id as string)
      if (foundPermit) {
        setPermit(foundPermit)
      } else {
        // Fallback to localStorageUtils for old data
        const storedPermit = localStorageUtils.getPermitById(params.id as string)
        if (storedPermit) {
          // Convert StoredPermit to Permit format
          const permit: Permit = {
            id: storedPermit.id,
            type: storedPermit.type as "general" | "fire" | "supplementary",
            title: storedPermit.title,
            requester: {
              name: storedPermit.requester.name,
              department: storedPermit.requester.department,
              email: storedPermit.requester.email || "user@company.com",
            },
            createdAt: storedPermit.createdAt,
            status: storedPermit.status as "draft" | "pending" | "in-progress" | "approved" | "rejected",
            currentApproverIndex: 0,
            approvers: [],
            data: storedPermit.data,
          }
          setPermit(permit)
        } else {
          setPermit(null)
        }
      }
    }
  }, [params.id])

  if (!permit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">허가서를 찾을 수 없습니다</h3>
          <Button onClick={() => router.push("/permits/list")} variant="outline">
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    )
  }

  const canApprove = () => {
    if (!user || !permit.approvers || permit.approvers.length === 0) return false
    if (permit.status !== "pending" && permit.status !== "in-progress") return false
    const currentApprover = permit.approvers[permit.currentApproverIndex]
    return currentApprover?.email === user.email && currentApprover?.status === "pending"
  }

  const handleApprove = async () => {
    if (!user) return
    setIsProcessing(true)

    const success = permitStore.approve(permit.id, user.email, comments)
    if (success) {
      // Log activity
      userStore.logActivity(user.id, 'approve_permit', `허가서 승인: ${permit.title}`)
      
      // Simulate email notification
      console.log(`Email sent to next approver or requester about approval`)
      alert("승인이 완료되었습니다.")

      // Refresh permit data
      const updatedPermit = permitStore.getById(permit.id)
      setPermit(updatedPermit || null)
      setComments("")
    }

    setIsProcessing(false)
  }

  const handleReject = async () => {
    if (!user || !comments.trim()) {
      alert("반려 사유를 입력해주세요.")
      return
    }

    setIsProcessing(true)

    const success = permitStore.reject(permit.id, user.email, comments)
    if (success) {
      // Log activity
      userStore.logActivity(user.id, 'reject_permit', `허가서 반려: ${permit.title} - ${comments}`)
      
      // Simulate email notification
      console.log(`Email sent to requester about rejection: ${comments}`)
      alert("반려가 완료되었습니다.")

      // Refresh permit data
      const updatedPermit = permitStore.getById(permit.id)
      setPermit(updatedPermit || null)
      setComments("")
    }

    setIsProcessing(false)
  }

  const handleDownloadPDF = async () => {
    try {
      await generatePermitPDF(permit, permit.type)
      alert("PDF 다운로드가 시작되었습니다.")
    } catch (error) {
      console.error("PDF 생성 오류:", error)
      alert("PDF 생성 중 오류가 발생했습니다.")
    }
  }

  const handlePrint = () => {
    printPermit()
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
        return <FileText className="w-5 h-5" />
      case "fire":
        return <Flame className="w-5 h-5" />
      case "supplementary":
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "general":
        return "일반위험 안전작업허가서"
      case "fire":
        return "화기작업 안전작업허가서"
      case "supplementary":
        return "보조작업 허가서"
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

  return (
    <>
      <div className="min-h-screen bg-background print:hidden">
        {/* Header */}
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => router.push("/permits/list")} className="hover:bg-muted">
                <ArrowLeft className="w-4 h-4 mr-2" />
                목록으로
              </Button>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{getTypeLabel(permit.type)}</h1>
                <p className="text-sm text-muted-foreground">{permit.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                className="border-border hover:bg-muted bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                PDF 다운로드
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="border-border hover:bg-muted bg-transparent"
              >
                <Printer className="w-4 h-4 mr-2" />
                인쇄
              </Button>
              {getStatusBadge(permit.status)}
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="shadow-sm">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="text-lg font-bold text-foreground">기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">작업명</Label>
                    <p className="text-foreground font-medium">{permit.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">허가서 번호</Label>
                    <p className="text-foreground font-medium">{permit.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">작성자</Label>
                    <p className="text-foreground font-medium">{permit.requester.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">부서</Label>
                    <p className="text-foreground font-medium">{permit.requester.department}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">작성일시</Label>
                    <p className="text-foreground font-medium">{formatDate(permit.createdAt)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">현재 상태</Label>
                    <div className="mt-1">{getStatusBadge(permit.status)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Approval Progress */}
            {permit.approvers && permit.approvers.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="text-lg font-bold text-foreground">결재 진행 현황</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {permit.approvers.map((approver, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        {approver.status === "approved" ? (
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        ) : approver.status === "rejected" ? (
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <XCircle className="w-5 h-5 text-white" />
                          </div>
                        ) : index === permit.currentApproverIndex ? (
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-foreground">{approver.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {approver.role}
                          </Badge>
                          {index === permit.currentApproverIndex && permit.status === "in-progress" && (
                            <Badge variant="outline" className="text-xs border-blue-500 text-blue-600">
                              현재 결재자
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{approver.email}</p>
                        {approver.approvedAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {approver.status === "approved" ? "승인" : "반려"}: {formatDate(approver.approvedAt)}
                          </p>
                        )}
                        {approver.comments && (
                          <p className="text-sm text-foreground mt-2 p-2 bg-muted rounded">{approver.comments}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            )}

            {/* Approval Actions */}
            {canApprove() && (
              <Card className="shadow-sm">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="text-lg font-bold text-foreground">결재 처리</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="comments" className="text-sm font-medium">
                        의견 (선택사항)
                      </Label>
                      <Textarea
                        id="comments"
                        placeholder="승인 또는 반려 사유를 입력하세요..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        onClick={handleApprove}
                        disabled={isProcessing}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {isProcessing ? "처리중..." : "승인"}
                      </Button>
                      <Button onClick={handleReject} disabled={isProcessing} variant="destructive">
                        <XCircle className="w-4 h-4 mr-2" />
                        {isProcessing ? "처리중..." : "반려"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Extension Requests */}
            {permit.extensionRequests && permit.extensionRequests.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="text-lg font-bold text-foreground">연장 요청 내역</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {permit.extensionRequests.map((request, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground">{request.requestedBy}</span>
                          <Badge
                            variant={
                              request.status === "approved"
                                ? "default"
                                : request.status === "rejected"
                                  ? "destructive"
                                  : "outline"
                            }
                          >
                            {request.status === "approved" ? "승인" : request.status === "rejected" ? "반려" : "대기중"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">요청일: {formatDate(request.requestedAt)}</p>
                        <p className="text-sm text-foreground">{request.reason}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Work Completion */}
            {permit.completionData && (
              <Card className="shadow-sm">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="text-lg font-bold text-foreground">작업 완료 확인</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">완료자</Label>
                      <p className="text-foreground font-medium">{permit.completionData.completedBy}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">완료일시</Label>
                      <p className="text-foreground font-medium">{formatDate(permit.completionData.completedAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      <PrintLayout permit={permit} />
    </>
  )
}
