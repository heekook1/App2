"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Send, Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import SupplementaryPermitSelector from "@/components/supplementary-permit-selector"
import ApproverSelector from "@/components/approver-selector"
import WorkExtensionSection from "@/components/work-extension-section"
import WorkCompletionSection from "@/components/work-completion-section"
import PrintButton from "@/components/print-button"
import GlobalPrintStyles from "@/components/global-print-styles"
import { localStorageUtils, type StoredPermit } from "@/lib/local-storage"
import { permitStore } from "@/lib/permit-store"
import { userStore } from "@/lib/user-store"

interface GeneralRiskPermitData {
  // 기본정보
  manager: string
  department: string
  workSupervisor: string
  permitNumber: string
  validStartDateTime: string // Split valid date time into start and end
  validEndDateTime: string
  workName: string

  // 위치정보
  tmNumber: string
  workLocation: string
  deviceNumber: string
  deviceName: string
  workOverview: string

  // 작업정보
  workType: string[]
  supplementaryPermitType: string[]

  // 안전조치
  safetyMeasures: string[]
  personalProtectiveEquipment: string[]
  attachedDocuments: string[]

  // 승인자 정보 - Updated approver structure with username instead of email
  approvers: Array<{
    username: string
    name: string
    role: string
  }>

  // 확장 및 완료 데이터 구조 추가
  extensions: Array<{
    requestTime: string
    specialNotes: string
    workerCheck: "양호" | "미비" | "완료" | ""
    workerAction: string
    workerTime: string
    workerName: string
    supervisorCheck: "양호" | "미비" | "완료" | ""
    supervisorAction: string
    supervisorTime: string
    supervisorName: string
  }>

  completion: {
    completionTime: string
    specialNotes: string
    workerCheck: "양호" | "미비" | "완료" | ""
    workerAction: string
    workerTime: string
    workerName: string
    teamLeaderCheck: "양호" | "미비" | "완료" | ""
    teamLeaderAction: string
    teamLeaderTime: string
    teamLeaderName: string
    supervisorCheck: "양호" | "미비" | "완료" | ""
    supervisorAction: string
    supervisorTime: string
    supervisorName: string
  }
}

export default function GeneralRiskPermitPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [formData, setFormData] = useState<GeneralRiskPermitData>({
    manager: user?.name || "",
    department: user?.department || "",
    workSupervisor: "",
    permitNumber: `GP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${Math.floor(
      Math.random() * 1000,
    )
      .toString()
      .padStart(3, "0")}`,
    validStartDateTime: "", // Split into start and end times
    validEndDateTime: "",
    workName: "",
    tmNumber: "",
    workLocation: "",
    deviceNumber: "",
    deviceName: "",
    workOverview: "",
    workType: [],
    supplementaryPermitType: [],
    safetyMeasures: [],
    personalProtectiveEquipment: [],
    attachedDocuments: [],
    approvers: [
      { username: "", name: "", role: "작업책임자" }, // Updated roles as requested
      { username: "", name: "", role: "현장확인" },
      { username: "", name: "", role: "작업허가승인" },
      { username: "", name: "", role: "안전관리자 확인" },
    ],
    extensions: [],
    completion: {
      completionTime: "",
      specialNotes: "",
      workerCheck: "",
      workerAction: "",
      workerTime: "",
      workerName: "",
      teamLeaderCheck: "",
      teamLeaderAction: "",
      teamLeaderTime: "",
      teamLeaderName: "",
      supervisorCheck: "",
      supervisorAction: "",
      supervisorTime: "",
      supervisorName: "",
    },
  })

  const workTypes = ["PSM 대상 설비", "발전 및 지역난방계통 설비", "수처리 설비", "그 외 발전소 일반작업"]

  const safetyMeasuresOptions = [
    "작업구역 설정",
    "가스농도 측정",
    "밸브차단 및 표지부착",
    "맹판설치 및 표지부착",
    "위험물질 방출 및 처리",
    "용기개방 및 압력방출",
    "용기내부 세정 및 처리",
    "불활성 가스 치환 및 환기",
    "환기장비",
    "조명설비",
    "소화기",
    "안전장구",
    "안전교육",
    "운전원 입회",
    "경고표지판 부착",
    "기타 안전조치",
  ]

  const ppeOptions = [
    "안전모/안전화",
    "귀마개(귀덮개)",
    "보안경/보안면",
    "안전대",
    "방진마스크",
    "방독마스크",
    "화학물질용 장갑",
    "화학물질용 보호복",
    "화학물질용 장화",
    "방열복",
    "방열장갑",
    "공기호흡기/송기마스크",
    "절연복",
    "절연장갑",
  ]

  const attachedDocumentsOptions = ["P&ID", "Lockout/Tagout 목록", "특수작업절차서", "위험성평가서", "기타"]

  const handleInputChange = (field: keyof GeneralRiskPermitData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCheckboxChange = (field: keyof GeneralRiskPermitData, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter((item) => item !== value),
    }))
  }

  const handleApproverChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      approvers: prev.approvers.map((approver, i) => (i === index ? { ...approver, [field]: value } : approver)),
    }))
  }

  const handleSupplementaryPermitToggle = (permitType: string) => {
    handleCheckboxChange("supplementaryPermitType", permitType, !formData.supplementaryPermitType.includes(permitType))
  }

  const [supplementaryData, setSupplementaryData] = useState<Record<string, any>>({})

  const handleSupplementaryDataChange = (permitType: string, data: any) => {
    setSupplementaryData((prev) => ({
      ...prev,
      [permitType]: data,
    }))
  }

  const handleSave = () => {
    const permitData: StoredPermit = {
      id: formData.permitNumber,
      type: "general",
      title: formData.workName || "일반위험 작업허가서",
      requester: {
        name: formData.manager,
        department: formData.department,
      },
      createdAt: new Date().toISOString(),
      status: "pending",
      data: formData,
    }

    if (localStorageUtils.savePermit(permitData)) {
      alert("임시저장되었습니다.")
    } else {
      alert("저장 중 오류가 발생했습니다.")
    }
  }

  const handleSubmit = () => {
    // Convert formData.approvers to the required format
    const approvers = formData.approvers
      .filter(approver => approver.username) // Only include selected approvers
      .map(approver => {
        // Map username to email
        const emailMap: Record<string, string> = {
          'field': 'field@company.com',
          'manager': 'manager@company.com', 
          'safety': 'safety@company.com',
          'admin': 'admin@company.com'
        }
        return {
          name: approver.name,
          email: emailMap[approver.username] || `${approver.username}@company.com`,
          role: approver.role,
          status: "pending" as const
        }
      })

    // Use permitStore.create with selected approvers
    const newPermit = permitStore.create({
      type: "general",
      title: formData.workName || "일반위험 작업허가서",
      requester: {
        name: formData.manager,
        department: formData.department,
        email: "user@company.com",
      },
      approvers: approvers,
      data: {
        ...formData,
        ...supplementaryData
      },
    })

    if (newPermit) {
      // Log activity
      if (user) {
        userStore.logActivity(user.id, 'create_permit', `일반위험 작업허가서 생성: ${newPermit.title}`)
      }
      alert("결재 요청이 전송되었습니다.")
      router.push("/permits/list")
    } else {
      alert("결재 요청 중 오류가 발생했습니다.")
    }
  }

  const handleExtensionAdd = () => {
    setFormData((prev) => ({
      ...prev,
      extensions: [
        ...prev.extensions,
        {
          requestTime: "",
          specialNotes: "",
          workerCheck: "",
          workerAction: "",
          workerTime: "",
          workerName: "",
          supervisorCheck: "",
          supervisorAction: "",
          supervisorTime: "",
          supervisorName: "",
        },
      ],
    }))
  }

  const handleExtensionUpdate = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      extensions: prev.extensions.map((ext, i) => (i === index ? { ...ext, [field]: value } : ext)),
    }))
  }

  const handleCompletionUpdate = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      completion: { ...prev.completion, [field]: value },
    }))
  }

  return (
    <>
      <GlobalPrintStyles />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card shadow-sm print-hide">
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
                <h1 className="text-xl font-bold text-foreground">일반위험 안전작업허가서</h1>
                <p className="text-sm text-muted-foreground">General Risk Safety Work Permit</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <PrintButton />
              <Button variant="outline" onClick={handleSave} className="border-border hover:bg-muted bg-transparent">
                <Save className="w-4 h-4 mr-2" />
                임시저장
              </Button>
              <Button onClick={handleSubmit} className="bg-primary hover:bg-accent text-primary-foreground">
                <Send className="w-4 h-4 mr-2" />
                결재요청
              </Button>
            </div>
          </div>
        </header>

        <div className="hidden print:block text-center py-4 border-b-2 border-black">
          <h1 className="text-2xl font-bold">일반위험 안전작업허가서</h1>
          <p className="text-sm">General Risk Safety Work Permit</p>
        </div>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* 1. 기본정보 */}
            <Card className="shadow-sm border-2 border-primary/20 print-section">
              <CardHeader className="bg-primary/10 border-b-2 border-primary/20">
                <CardTitle className="text-lg font-bold text-foreground">
                  <span className="font-black">1. 기본정보</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-primary/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="manager" className="text-sm font-bold text-foreground">
                      담당자
                    </Label>
                    <Input
                      id="manager"
                      value={formData.manager}
                      onChange={(e) => handleInputChange("manager", e.target.value)}
                      className="mt-1 border-2 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-bold text-foreground">
                      담당부서
                    </Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      className="mt-1 border-2 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workSupervisor" className="text-sm font-bold text-foreground">
                      작업책임자
                    </Label>
                    <Input
                      id="workSupervisor"
                      value={formData.workSupervisor}
                      onChange={(e) => handleInputChange("workSupervisor", e.target.value)}
                      className="mt-1 border-2 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="permitNumber" className="text-sm font-bold text-foreground">
                      <span className="font-black">허가번호</span>
                    </Label>
                    <Input
                      id="permitNumber"
                      value={formData.permitNumber}
                      onChange={(e) => handleInputChange("permitNumber", e.target.value)}
                      className="mt-1 bg-muted border-2"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validStartDateTime" className="text-sm font-bold text-foreground">
                      <span className="font-black">작업시작 일시</span>
                    </Label>
                    <Input
                      id="validStartDateTime"
                      type="datetime-local"
                      value={formData.validStartDateTime}
                      onChange={(e) => handleInputChange("validStartDateTime", e.target.value)}
                      className="mt-1 border-2 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validEndDateTime" className="text-sm font-bold text-foreground">
                      <span className="font-black">작업종료 일시</span>
                    </Label>
                    <Input
                      id="validEndDateTime"
                      type="datetime-local"
                      value={formData.validEndDateTime}
                      onChange={(e) => handleInputChange("validEndDateTime", e.target.value)}
                      className="mt-1 border-2 focus:border-primary"
                    />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <Label htmlFor="workName" className="text-sm font-bold text-foreground">
                      <span className="font-black">작업명</span>
                    </Label>
                    <Input
                      id="workName"
                      value={formData.workName}
                      onChange={(e) => handleInputChange("workName", e.target.value)}
                      className="mt-1 border-2 focus:border-primary"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. 위치정보 */}
            <Card className="shadow-sm border-2 border-primary/20 print-section">
              <CardHeader className="bg-primary/10 border-b-2 border-primary/20">
                <CardTitle className="text-lg font-bold text-foreground">
                  <span className="font-black">2. 위치정보</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-primary/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tmNumber" className="text-sm font-bold text-foreground">
                      <span className="font-black">TM 번호</span>
                    </Label>
                    <Input
                      id="tmNumber"
                      value={formData.tmNumber}
                      onChange={(e) => handleInputChange("tmNumber", e.target.value)}
                      className="mt-1 border-2 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workLocation" className="text-sm font-bold text-foreground">
                      <span className="font-black">작업 장소</span>
                    </Label>
                    <Input
                      id="workLocation"
                      value={formData.workLocation}
                      onChange={(e) => handleInputChange("workLocation", e.target.value)}
                      className="mt-1 border-2 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deviceNumber" className="text-sm font-bold text-foreground">
                      <span className="font-black">장치 번호</span>
                    </Label>
                    <Input
                      id="deviceNumber"
                      value={formData.deviceNumber}
                      onChange={(e) => handleInputChange("deviceNumber", e.target.value)}
                      className="mt-1 border-2 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deviceName" className="text-sm font-bold text-foreground">
                      <span className="font-black">장치명</span>
                    </Label>
                    <Input
                      id="deviceName"
                      value={formData.deviceName}
                      onChange={(e) => handleInputChange("deviceName", e.target.value)}
                      className="mt-1 border-2 focus:border-primary"
                    />
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <Label htmlFor="workOverview" className="text-sm font-bold text-foreground">
                    <span className="font-black">작업개요</span>
                  </Label>
                  <Textarea
                    id="workOverview"
                    value={formData.workOverview}
                    onChange={(e) => handleInputChange("workOverview", e.target.value)}
                    className="mt-1 border-2 focus:border-primary"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 3. 작업정보 */}
            <Card className="shadow-sm border-2 border-primary/20 print-section">
              <CardHeader className="bg-primary/10 border-b-2 border-primary/20">
                <CardTitle className="text-lg font-bold text-foreground">
                  <span className="font-black">3. 작업정보</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-primary/5">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-sm font-bold mb-3 block">
                      <span className="font-black">구분</span>
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-white rounded-lg border-2 border-primary/10">
                      {workTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-3">
                          <Checkbox
                            id={`workType-${type}`}
                            checked={formData.workType.includes(type)}
                            onCheckedChange={(checked) => handleCheckboxChange("workType", type, checked as boolean)}
                            className="w-5 h-5 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <Label htmlFor={`workType-${type}`} className="text-sm font-medium">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-bold mb-3 block">
                      <span className="font-black">보충허가 종류</span>
                    </Label>
                    <div className="p-4 bg-white rounded-lg border-2 border-primary/10">
                      <SupplementaryPermitSelector
                        selectedPermits={formData.supplementaryPermitType}
                        onPermitToggle={handleSupplementaryPermitToggle}
                        supplementaryData={supplementaryData}
                        onSupplementaryDataChange={handleSupplementaryDataChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4. 안전조치 */}
            <Card className="shadow-sm border-2 border-primary/20 print-section">
              <CardHeader className="bg-primary/10 border-b-2 border-primary/20">
                <CardTitle className="text-lg font-bold text-foreground">
                  <span className="font-black">4. 안전조치</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground font-medium">
                  <span className="font-bold">필요한 부분에 체크표시, 확인은 ○ 표시</span>
                </p>
              </CardHeader>
              <CardContent className="p-6 bg-primary/5">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-sm font-bold mb-3 block">
                      <span className="font-black">안전조치 항목</span>
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-white rounded-lg border-2 border-primary/10">
                      {safetyMeasuresOptions.map((measure) => (
                        <div key={measure} className="flex items-center space-x-3">
                          <Checkbox
                            id={`safety-${measure}`}
                            checked={formData.safetyMeasures.includes(measure)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("safetyMeasures", measure, checked as boolean)
                            }
                            className="w-5 h-5 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <Label htmlFor={`safety-${measure}`} className="text-sm font-medium">
                            {measure}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-bold mb-3 block">
                      <span className="font-black">개인 보호구 (해당항목체크)</span>
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-white rounded-lg border-2 border-primary/10">
                      {ppeOptions.map((ppe) => (
                        <div key={ppe} className="flex items-center space-x-3">
                          <Checkbox
                            id={`ppe-${ppe}`}
                            checked={formData.personalProtectiveEquipment.includes(ppe)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("personalProtectiveEquipment", ppe, checked as boolean)
                            }
                            className="w-5 h-5 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <Label htmlFor={`ppe-${ppe}`} className="text-sm font-medium">
                            {ppe}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-bold mb-3 block">
                      <span className="font-black">첨부 서류</span>
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-white rounded-lg border-2 border-primary/10">
                      {attachedDocumentsOptions.map((doc) => (
                        <div key={doc} className="flex items-center space-x-3">
                          <Checkbox
                            id={`doc-${doc}`}
                            checked={formData.attachedDocuments.includes(doc)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange("attachedDocuments", doc, checked as boolean)
                            }
                            className="w-5 h-5 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <Label htmlFor={`doc-${doc}`} className="text-sm font-medium">
                            {doc}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 5. 안전작업 승인 */}
            <Card className="shadow-sm border-2 border-primary/20 print-section">
              <CardHeader className="bg-primary/10 border-b-2 border-primary/20">
                <CardTitle className="text-lg font-bold text-foreground">
                  <span className="font-black">5. 안전작업 승인</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-primary/5">
                <ApproverSelector approvers={formData.approvers} onApproverChange={handleApproverChange} />
              </CardContent>
            </Card>

            {/* 작업 확장 섹션 추가 */}
            <div className="print-section">
              <WorkExtensionSection
                extensions={formData.extensions}
                onExtensionAdd={handleExtensionAdd}
                onExtensionUpdate={handleExtensionUpdate}
              />
            </div>

            {/* 작업 완료 섹션 추가 */}
            <div className="print-section">
              <WorkCompletionSection completion={formData.completion} onCompletionUpdate={handleCompletionUpdate} />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
