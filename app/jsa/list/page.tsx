"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  ArrowLeft, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  FileText,
  Plus,
  Filter,
  Loader2,
  AlertTriangle
} from "lucide-react"
import { jsaStore, type JSAData } from "@/lib/jsa-store-supabase"

export default function JSAListPage() {
  const router = useRouter()
  const [jsaList, setJsaList] = useState<JSAData[]>([])
  const [filteredList, setFilteredList] = useState<JSAData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load JSA data from Supabase
  useEffect(() => {
    const loadJSAData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await jsaStore.getAll()
        setJsaList(data)
        setFilteredList(data)
      } catch (err) {
        console.error('Error loading JSA data:', err)
        setError('JSA 문서를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadJSAData()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = jsaList

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(jsa => 
        jsa.workName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jsa.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jsa.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jsa.workArea.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(jsa => jsa.status === statusFilter)
    }

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter(jsa => jsa.department === departmentFilter)
    }

    setFilteredList(filtered)
  }, [jsaList, searchTerm, statusFilter, departmentFilter])

  // Get unique departments for filter
  const departments = Array.from(new Set(jsaList.map(jsa => jsa.department))).filter(Boolean)

  // Delete JSA
  const handleDelete = async (id: string) => {
    if (confirm("정말로 이 JSA 문서를 삭제하시겠습니까?")) {
      try {
        const success = await jsaStore.delete(id)
        if (success) {
          const updatedList = await jsaStore.getAll()
          setJsaList(updatedList)
          setFilteredList(updatedList)
        } else {
          alert('삭제 중 오류가 발생했습니다.')
        }
      } catch (error) {
        console.error('Error deleting JSA:', error)
        alert('삭제 중 오류가 발생했습니다.')
      }
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "draft":
        return "secondary"
      default:
        return "outline"
    }
  }

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "완료"
      case "draft":
        return "작성중"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>JSA 문서를 불러오는 중...</span>
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
                <FileText className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">저장된 JSA 목록</h1>
              </div>
            </div>
            <Button 
              onClick={() => router.push("/jsa")}
              className="bg-purple-500 hover:bg-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              새 JSA 작성
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <Card className="shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>검색 및 필터</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="작업명, 작성자, 부서명, 작업지역으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="draft">작성중</SelectItem>
                  <SelectItem value="completed">완료</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="부서 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 부서</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary">{jsaList.length}</div>
              <div className="text-sm text-muted-foreground">전체 JSA</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {jsaList.filter(jsa => jsa.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">완료된 JSA</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {jsaList.filter(jsa => jsa.status === 'draft').length}
              </div>
              <div className="text-sm text-muted-foreground">작성중 JSA</div>
            </CardContent>
          </Card>
        </div>

        {/* JSA List */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>
              JSA 목록 ({filteredList.length}개)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredList.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {jsaList.length === 0 
                    ? "저장된 JSA 문서가 없습니다." 
                    : "검색 조건에 맞는 JSA 문서가 없습니다."
                  }
                </p>
                <Button 
                  onClick={() => router.push("/jsa")}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  첫 번째 JSA 작성하기
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredList.map((jsa) => (
                  <div 
                    key={jsa.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-lg">{jsa.workName || "제목 없음"}</h3>
                          <Badge variant={getStatusBadgeVariant(jsa.status)}>
                            {getStatusText(jsa.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div>작성자: {jsa.author}</div>
                          <div>부서: {jsa.department}</div>
                          <div>작업지역: {jsa.workArea}</div>
                          <div>작성일: {formatDate(jsa.createdAt)}</div>
                        </div>
                        {jsa.steps.length > 0 && (
                          <div className="text-sm text-muted-foreground mt-1">
                            작업단계: {jsa.steps.length}개
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/jsa/view/${jsa.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          보기
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/jsa/edit/${jsa.id}`)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          수정
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(jsa.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          삭제
                        </Button>
                      </div>
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