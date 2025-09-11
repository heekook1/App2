"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GlobalPrintButton } from "@/components/global-print-button"
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  LogOut,
  List,
  Eye,
  Settings,
  BarChart3,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { permitStore, type Permit } from "@/lib/permit-store-supabase"
import { localStorageUtils } from "@/lib/local-storage"
import { calculatePermitStats, type PermitStats } from "@/lib/statistics"

function Dashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [pendingApprovals, setPendingApprovals] = useState<Permit[]>([])
  const [recentPermits, setRecentPermits] = useState<Permit[]>([])
  const [stats, setStats] = useState<PermitStats>({ inProgress: 0, approved: 0, rejected: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      if (user) {
        try {
          setLoading(true)
          
          // Get all permits from Supabase
          const allPermits = await permitStore.getAll()
          
          // Filter pending approvals for current user (simplified for now)
          const pending = allPermits.filter(p => 
            p.status === 'pending' || p.status === 'in-progress'
          )
          setPendingApprovals(pending.slice(0, 3))
          
          // Sort by creation date and get recent permits
          const sortedPermits = allPermits
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          setRecentPermits(sortedPermits.slice(0, 3))
          
          // Calculate statistics
          const statsData = {
            total: allPermits.length,
            inProgress: allPermits.filter(p => p.status === 'pending' || p.status === 'in-progress').length,
            approved: allPermits.filter(p => p.status === 'approved').length,
            rejected: allPermits.filter(p => p.status === 'rejected').length
          }
          setStats(statsData)
        } catch (error) {
          console.error('Error loading dashboard data:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadDashboardData()
  }, [user])

  const statsCards = [
    { label: "진행중인 허가서", value: stats.inProgress.toString(), icon: Clock, color: "bg-yellow-500" },
    { label: "승인 완료", value: stats.approved.toString(), icon: CheckCircle, color: "bg-green-500" },
    { label: "반려된 허가서", value: stats.rejected.toString(), icon: XCircle, color: "bg-red-500" },
    { label: "전체 허가서", value: stats.total.toString(), icon: FileText, color: "bg-primary" },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "관리자"
      case "approver":
        return "승인자"
      case "user":
        return "작업자"
      default:
        return "사용자"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 relative flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Company Logo"
                width={54}
                height={54}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-bold text-foreground">안전작업허가서 시스템</h1>
              <p className="text-sm text-muted-foreground">안전한 작업을 위한 전산화 결재시스템</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/permits/list")}
              className="border-border hover:bg-muted bg-transparent"
            >
              <List className="w-4 h-4 mr-2" />
              전체 목록
            </Button>
            <GlobalPrintButton />
            <div className="text-right">
              <p className="font-medium text-foreground">
                {user?.name} ({user?.username})
              </p>
              <p className="text-sm text-muted-foreground">{user?.department}</p>
            </div>
            <Badge variant={user?.role === "admin" ? "default" : "secondary"}>
              {getRoleDisplayName(user?.role || "")}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="border-border hover:bg-muted bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">안녕하세요, {user?.name}님!</h2>
          <p className="text-muted-foreground">
            {user?.department}의 {getRoleDisplayName(user?.role || "")}로 로그인하셨습니다.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-primary" />
                  <span>새 작업허가서 작성</span>
                </CardTitle>
                <CardDescription>안전한 작업을 위한 허가서를 작성하세요</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  className="justify-start bg-primary hover:bg-accent text-primary-foreground h-16"
                  onClick={() => router.push("/permits/general")}
                >
                  <div className="flex flex-col items-start">
                    <FileText className="w-5 h-5 mb-1" />
                    <span className="text-sm font-medium">일반위험</span>
                    <span className="text-xs opacity-80">작업허가서</span>
                  </div>
                </Button>
                <Button
                  className="justify-start bg-red-500 hover:bg-red-600 text-white h-16"
                  onClick={() => router.push("/permits/fire")}
                >
                  <div className="flex flex-col items-start">
                    <FileText className="w-5 h-5 mb-1" />
                    <span className="text-sm font-medium">화기작업</span>
                    <span className="text-xs opacity-80">허가서</span>
                  </div>
                </Button>
                <Button
                  className="justify-start bg-blue-500 hover:bg-blue-600 text-white h-16"
                  onClick={() => router.push("/permits/gas-measurement")}
                >
                  <div className="flex flex-col items-start">
                    <BarChart3 className="w-5 h-5 mb-1" />
                    <span className="text-sm font-medium">가스농도</span>
                    <span className="text-xs opacity-80">측정표</span>
                  </div>
                </Button>
                <Button
                  className="justify-start bg-orange-500 hover:bg-orange-600 text-white h-16"
                  onClick={() => router.push("/permits/fire-checklist")}
                >
                  <div className="flex flex-col items-start">
                    <List className="w-5 h-5 mb-1" />
                    <span className="text-sm font-medium">화기작업</span>
                    <span className="text-xs opacity-80">Check List</span>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* 위험성평가서(JSA) 섹션 */}
            <Card className="shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>위험성평가서(JSA) 작성</span>
                </CardTitle>
                <CardDescription>작업 전 위험성평가를 통한 안전한 작업환경 구축</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  className="justify-start bg-purple-500 hover:bg-purple-600 text-white h-16"
                  onClick={() => router.push("/jsa")}
                >
                  <div className="flex flex-col items-start">
                    <FileText className="w-5 h-5 mb-1" />
                    <span className="text-sm font-medium">작업 위험성 평가</span>
                    <span className="text-xs opacity-80">JSA (Job Safety Analysis)</span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-16 bg-transparent"
                  onClick={() => router.push("/jsa/list")}
                >
                  <div className="flex flex-col items-start">
                    <List className="w-5 h-5 mb-1" />
                    <span className="text-sm font-medium">저장된 JSA 목록</span>
                    <span className="text-xs text-muted-foreground">검색 및 관리</span>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {user?.role === "admin" && (
              <Card className="shadow-sm mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-primary" />
                    <span>관리자 기능</span>
                  </CardTitle>
                  <CardDescription>시스템 관리 및 통계 기능</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="justify-start h-16 bg-transparent"
                    onClick={() => router.push("/admin/users")}
                  >
                    <div className="flex flex-col items-start">
                      <Users className="w-5 h-5 mb-1" />
                      <span className="text-sm font-medium">사용자 관리</span>
                      <span className="text-xs text-muted-foreground">계정 생성/수정</span>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-16 bg-transparent"
                    onClick={() => alert("통계 보고서 기능 (개발 예정)")}
                  >
                    <div className="flex flex-col items-start">
                      <BarChart3 className="w-5 h-5 mb-1" />
                      <span className="text-sm font-medium">통계 보고서</span>
                      <span className="text-xs text-muted-foreground">월간/연간 통계</span>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-16 bg-transparent"
                    onClick={() => alert("시스템 설정 기능 (개발 예정)")}
                  >
                    <div className="flex flex-col items-start">
                      <Settings className="w-5 h-5 mb-1" />
                      <span className="text-sm font-medium">시스템 설정</span>
                      <span className="text-xs text-muted-foreground">환경 설정</span>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Pending Approvals */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>결재 대기</span>
                </CardTitle>
                <CardDescription>승인이 필요한 허가서</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">로딩 중...</p>
                    </div>
                  ) : pendingApprovals.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">결재 대기중인 허가서가 없습니다.</p>
                  ) : (
                    pendingApprovals.slice(0, 3).map((permit) => (
                      <div key={permit.id} className="p-3 bg-muted rounded-lg">
                        <p className="font-medium text-sm text-foreground truncate">{permit.title}</p>
                        <p className="text-xs text-muted-foreground">{permit.requester.department}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="border-yellow-500 text-yellow-600 text-xs">
                            대기중
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/permits/view/${permit.id}`)}
                            className="h-6 px-2 text-xs"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                  {pendingApprovals.length > 3 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => router.push("/permits/list?filter=pending")}
                    >
                      {pendingApprovals.length - 3}개 더 보기
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>최근 작업허가서</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/permits/list")}
                    className="border-border hover:bg-muted bg-transparent"
                  >
                    전체보기
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">로딩 중...</p>
                    </div>
                  ) : recentPermits.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">최근 작업허가서가 없습니다.</p>
                  ) : (
                    recentPermits.map((permit) => (
                      <div key={permit.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{permit.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {permit.requester.name} • {permit.requester.department} • {formatDate(permit.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              permit.status === "approved"
                                ? "default"
                                : permit.status === "rejected"
                                  ? "destructive"
                                  : "outline"
                            }
                          >
                            {permit.status === "approved" ? "승인완료" : permit.status === "rejected" ? "반려" : "진행중"}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/permits/view/${permit.id}`)}
                            className="border-border hover:bg-muted bg-transparent"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function HomePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return <Dashboard />
}
