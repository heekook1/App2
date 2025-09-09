"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Printer, 
  Edit, 
  FileText,
  HardHat,
  AlertTriangle,
  Shield,
  CheckCircle
} from "lucide-react"
import { jsaStore, type JSAData } from "@/lib/jsa-store"

export default function JSAViewPage() {
  const params = useParams()
  const router = useRouter()
  const [jsaData, setJsaData] = useState<JSAData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      const data = jsaStore.getById(params.id as string)
      setJsaData(data)
      setLoading(false)
    }
  }, [params.id])

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("ko-KR")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">JSA 문서를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!jsaData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">JSA 문서를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground mb-4">
              요청하신 JSA 문서가 존재하지 않거나 삭제되었습니다.
            </p>
            <Button onClick={() => router.push("/jsa/list")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                뒤로가기
              </Button>
              <div className="flex items-center space-x-2">
                <FileText className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold">JSA 상세보기</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/jsa/edit/${params.id}`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                수정
              </Button>
              <Button onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                인쇄
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Title and Status */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">
                  {jsaData.workName || "제목 없음"}
                </CardTitle>
                <Badge 
                  variant={jsaData.status === "completed" ? "default" : "secondary"}
                >
                  {jsaData.status === "completed" ? "완료" : "작성중"}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Basic Information */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>기본 정보</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">작업번호</label>
                  <p className="mt-1 font-medium">{jsaData.workNumber || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">개정일자</label>
                  <p className="mt-1 font-medium">{formatDate(jsaData.revisionDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">작업지역</label>
                  <p className="mt-1 font-medium">{jsaData.workArea || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">작성자</label>
                  <p className="mt-1 font-medium">{jsaData.author || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">작성일</label>
                  <p className="mt-1 font-medium">{formatDate(jsaData.authorDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">부서</label>
                  <p className="mt-1 font-medium">{jsaData.department || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">검토자</label>
                  <p className="mt-1 font-medium">{jsaData.reviewer || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">검토일</label>
                  <p className="mt-1 font-medium">{formatDate(jsaData.reviewDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">승인자</label>
                  <p className="mt-1 font-medium">{jsaData.approver || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Required Items */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HardHat className="w-5 h-5" />
                <span>필수 준비사항</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">필수 개인보호구</label>
                  <p className="mt-1 whitespace-pre-wrap">{jsaData.requiredPPE || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">필수 장비</label>
                  <p className="mt-1 whitespace-pre-wrap">{jsaData.requiredEquipment || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">필수 서류</label>
                  <p className="mt-1 whitespace-pre-wrap">{jsaData.requiredDocuments || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">필수 안전장비</label>
                  <p className="mt-1 whitespace-pre-wrap">{jsaData.requiredSafetyEquipment || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Steps */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>작업 단계별 위험성 평가</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {jsaData.steps.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  등록된 작업 단계가 없습니다.
                </div>
              ) : (
                <div className="space-y-4">
                  {jsaData.steps.map((step, index) => (
                    <div key={step.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-3">{step.step}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                <label className="text-sm font-medium text-muted-foreground">위험요소</label>
                              </div>
                              <p className="text-sm whitespace-pre-wrap">{step.hazards || "-"}</p>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <Shield className="w-4 h-4 text-blue-500" />
                                <label className="text-sm font-medium text-muted-foreground">통제방법</label>
                              </div>
                              <p className="text-sm whitespace-pre-wrap">{step.controls || "-"}</p>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <label className="text-sm font-medium text-muted-foreground">비고</label>
                              </div>
                              <p className="text-sm whitespace-pre-wrap">{step.notes || "-"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card className="shadow-sm print:hidden">
            <CardHeader>
              <CardTitle>문서 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <label className="text-muted-foreground">문서 ID</label>
                  <p className="font-mono">{jsaData.id}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">생성일</label>
                  <p>{new Date(jsaData.createdAt).toLocaleString("ko-KR")}</p>
                </div>
                <div>
                  <label className="text-muted-foreground">최종 수정일</label>
                  <p>{new Date(jsaData.updatedAt).toLocaleString("ko-KR")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}