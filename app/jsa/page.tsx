"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, ArrowLeft, Save, FileText, Printer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { jsaStore, type JSAData, type JSAStep } from "@/lib/jsa-store"
import AIChat from "@/components/ai-chat"


export default function JSAPage() {
  const router = useRouter()
  const [steps, setSteps] = useState<JSAStep[]>([
    { id: "1", step: "", hazards: "", controls: "", notes: "" }
  ])

  const [formData, setFormData] = useState({
    workName: "",
    workNumber: "",
    revisionDate: new Date().toISOString().split('T')[0],
    author: "",
    authorDate: new Date().toISOString().split('T')[0],
    department: "",
    reviewer: "",
    reviewDate: new Date().toISOString().split('T')[0],
    workArea: "",
    approver: "",
    approvalDate: new Date().toISOString().split('T')[0],
    requiredPPE: "",
    requiredEquipment: "",
    requiredDocuments: "",
    requiredSafetyEquipment: ""
  })

  const addStep = () => {
    const newId = (Math.max(...steps.map(s => parseInt(s.id)), 0) + 1).toString()
    setSteps([...steps, { id: newId, step: "", hazards: "", controls: "", notes: "" }])
  }

  const removeStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter(s => s.id !== id))
    }
  }

  const updateStep = (id: string, field: keyof JSAStep, value: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSave = () => {
    try {
      // Validation
      if (!formData.workName.trim()) {
        alert("작업명을 입력해주세요.")
        return
      }
      if (!formData.author.trim()) {
        alert("작성자를 입력해주세요.")
        return
      }
      if (!formData.department.trim()) {
        alert("부서명을 입력해주세요.")
        return
      }

      // Check if there's at least one step with content
      const hasValidSteps = steps.some(step => 
        step.step.trim() || step.hazards.trim() || step.controls.trim()
      )
      
      if (!hasValidSteps) {
        alert("최소 하나의 작업단계를 작성해주세요.")
        return
      }

      // Save JSA data
      const savedJSA = jsaStore.save({
        ...formData,
        steps: steps,
        status: "completed"
      })

      alert("위험성평가서(JSA)가 성공적으로 저장되었습니다!")
      
      // Redirect to list page or stay for printing
      const goToList = confirm("저장된 JSA 목록을 보시겠습니까? (취소하면 현재 페이지에 머물러 인쇄할 수 있습니다.)")
      if (goToList) {
        router.push("/jsa/list")
      }
      
    } catch (error) {
      console.error("JSA 저장 오류:", error)
      alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.")
    }
  }

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body { 
            margin: 0; 
            padding: 0; 
            font-size: 11px;
            line-height: 1.2;
          }
          header { display: none !important; }
          .print\\:hidden { display: none !important; }
          .container { max-width: none !important; padding: 0 !important; margin: 0 !important; }
          .grid { display: grid !important; }
          .border { border: 1px solid #000 !important; }
          .bg-slate-100 { 
            background-color: #e2e8f0 !important; 
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .text-sm { font-size: 10px !important; }
          .text-xs { font-size: 9px !important; }
          .text-lg { font-size: 12px !important; }
          .text-xl { font-size: 14px !important; }
          .p-2 { padding: 4px !important; }
          .p-3 { padding: 6px !important; }
          .p-4 { padding: 8px !important; }
          .p-6 { padding: 12px !important; }
          .p-8 { padding: 0 !important; }
          .py-4 { padding-top: 0 !important; padding-bottom: 0 !important; }
          .py-8 { padding-top: 0 !important; padding-bottom: 0 !important; }
          .px-4 { padding-left: 0 !important; padding-right: 0 !important; }
          .mb-2 { margin-bottom: 8px !important; }
          .mb-4 { margin-bottom: 12px !important; }
          .mb-6 { margin-bottom: 16px !important; }
          .mb-8 { margin-bottom: 20px !important; }
          .gap-2 { gap: 2px !important; }
          .gap-4 { gap: 4px !important; }
          .shadow-sm { box-shadow: none !important; }
          .min-h-\\[80px\\] { min-height: 60px !important; }
          .h-16 { height: auto !important; }
          .max-w-4xl { max-width: none !important; }
          textarea { 
            font-size: 10px !important; 
            line-height: 1.3 !important;
            padding: 4px !important;
          }
          input { 
            font-size: 10px !important; 
            padding: 2px 4px !important;
          }
          .font-medium { font-weight: 600 !important; }
          .font-bold { font-weight: 700 !important; }
        }
      `}</style>
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
                <h1 className="text-xl font-bold text-foreground">작업 위험성 평가(JSA)</h1>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={() => window.print()} 
                variant="outline"
                className="border-border hover:bg-muted bg-transparent"
              >
                <Printer className="w-4 h-4 mr-2" />
                인쇄
              </Button>
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="shadow-sm">
          <CardContent className="p-8">
            {/* JSA 제목 */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold border-2 border-black p-2 inline-block">
                작업 위험성 평가(JSA)
              </h2>
            </div>

            {/* 상단 헤더 정보 */}
            <div className="grid grid-cols-12 gap-4 mb-8">
              {/* 좌측 기본 정보 */}
              <div className="col-span-8">
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <Label className="bg-slate-100 p-2 text-center font-medium">작업명</Label>
                    <div className="col-span-2">
                      <Input
                        value={formData.workName}
                        onChange={(e) => updateFormData("workName", e.target.value)}
                        placeholder="작업명을 입력하세요"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <Label className="bg-slate-100 p-2 text-center font-medium">부서명</Label>
                    <div className="col-span-2">
                      <Input
                        value={formData.department}
                        onChange={(e) => updateFormData("department", e.target.value)}
                        placeholder="부서명을 입력하세요"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <Label className="bg-slate-100 p-2 text-center font-medium">작업지역</Label>
                    <div className="col-span-2">
                      <Input
                        value={formData.workArea}
                        onChange={(e) => updateFormData("workArea", e.target.value)}
                        placeholder="작업지역을 입력하세요"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 우측 문서 정보 */}
              <div className="col-span-4">
                <div className="grid grid-cols-2 gap-2 items-center mb-2">
                  <Label className="bg-slate-100 p-2 text-center font-medium text-sm">작업번호</Label>
                  <Input
                    value={formData.workNumber}
                    onChange={(e) => updateFormData("workNumber", e.target.value)}
                    placeholder="작업번호"
                    className="text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 items-center mb-2">
                  <Label className="bg-slate-100 p-2 text-center font-medium text-sm">개정일자</Label>
                  <Input
                    type="date"
                    value={formData.revisionDate}
                    onChange={(e) => updateFormData("revisionDate", e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 작성자/검토자/승인자 정보 */}
            <div className="mb-8">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="grid grid-cols-2 gap-2 items-center mb-2">
                    <Label className="bg-slate-100 p-2 text-center font-medium text-sm">작성자</Label>
                    <Input
                      value={formData.author}
                      onChange={(e) => updateFormData("author", e.target.value)}
                      placeholder="작성자명"
                      className="text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <Label className="bg-slate-100 p-2 text-center font-medium text-sm">작성일자</Label>
                    <Input
                      type="date"
                      value={formData.authorDate}
                      onChange={(e) => updateFormData("authorDate", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-2 gap-2 items-center mb-2">
                    <Label className="bg-slate-100 p-2 text-center font-medium text-sm">검토자</Label>
                    <Input
                      value={formData.reviewer}
                      onChange={(e) => updateFormData("reviewer", e.target.value)}
                      placeholder="검토자명"
                      className="text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <Label className="bg-slate-100 p-2 text-center font-medium text-sm">검토일자</Label>
                    <Input
                      type="date"
                      value={formData.reviewDate}
                      onChange={(e) => updateFormData("reviewDate", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-2 gap-2 items-center mb-2">
                    <Label className="bg-slate-100 p-2 text-center font-medium text-sm">승인자</Label>
                    <Input
                      value={formData.approver}
                      onChange={(e) => updateFormData("approver", e.target.value)}
                      placeholder="승인자명"
                      className="text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <Label className="bg-slate-100 p-2 text-center font-medium text-sm">승인일자</Label>
                    <Input
                      type="date"
                      value={formData.approvalDate}
                      onChange={(e) => updateFormData("approvalDate", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 필요 사항들 */}
            <div className="mb-8 space-y-2">
              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="bg-slate-100 p-2 text-center font-medium">필요한 보호구</Label>
                <div className="col-span-3">
                  <Input
                    value={formData.requiredPPE}
                    onChange={(e) => updateFormData("requiredPPE", e.target.value)}
                    placeholder="안전화, 안전모, 안전대, 절연장갑 등"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="bg-slate-100 p-2 text-center font-medium">필요한 장비/공구</Label>
                <div className="col-span-3">
                  <Input
                    value={formData.requiredEquipment}
                    onChange={(e) => updateFormData("requiredEquipment", e.target.value)}
                    placeholder="스패너 등 기본공구"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="bg-slate-100 p-2 text-center font-medium">필요한 자료</Label>
                <div className="col-span-3">
                  <Input
                    value={formData.requiredDocuments}
                    onChange={(e) => updateFormData("requiredDocuments", e.target.value)}
                    placeholder="공정안전자료, MSDS, P&ID, 관련도면 등"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="bg-slate-100 p-2 text-center font-medium">필요한 안전장비</Label>
                <div className="col-span-3">
                  <Input
                    value={formData.requiredSafetyEquipment}
                    onChange={(e) => updateFormData("requiredSafetyEquipment", e.target.value)}
                    placeholder="가스농도 측정기, 환기장치, 보호장갑 등"
                  />
                </div>
              </div>
            </div>

            {/* 작업단계 테이블 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">작업단계별 위험성평가</h3>
                <Button onClick={addStep} size="sm" variant="outline" className="print:hidden">
                  <Plus className="w-4 h-4 mr-2" />
                  작업단계 추가
                </Button>
              </div>

              {/* 테이블 헤더 */}
              <div className="grid grid-cols-12 gap-2 mb-2">
                <div className="col-span-1 bg-slate-100 p-3 text-center font-medium border">번호</div>
                <div className="col-span-3 bg-slate-100 p-3 text-center font-medium border">작업단계<br/>(Steps)</div>
                <div className="col-span-3 bg-slate-100 p-3 text-center font-medium border">유해위험요인<br/>(Hazards)</div>
                <div className="col-span-3 bg-slate-100 p-3 text-center font-medium border">대책<br/>(Controls)</div>
                <div className="col-span-2 bg-slate-100 p-3 text-center font-medium border">비고</div>
                <div className="col-span-1 bg-slate-100 p-3 text-center font-medium border print:hidden">삭제</div>
              </div>

              {/* 작업단계 행들 */}
              {steps.map((step, index) => (
                <div key={step.id} className="grid grid-cols-12 gap-2 mb-2">
                  <div className="col-span-1 p-3 text-center border bg-slate-50 flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="col-span-3 border">
                    <Textarea
                      value={step.step}
                      onChange={(e) => updateStep(step.id, "step", e.target.value)}
                      placeholder="작업단계를 입력하세요"
                      className="min-h-[80px] resize-none border-0"
                    />
                  </div>
                  <div className="col-span-3 border">
                    <Textarea
                      value={step.hazards}
                      onChange={(e) => updateStep(step.id, "hazards", e.target.value)}
                      placeholder="유해위험요인을 입력하세요"
                      className="min-h-[80px] resize-none border-0"
                    />
                  </div>
                  <div className="col-span-3 border">
                    <Textarea
                      value={step.controls}
                      onChange={(e) => updateStep(step.id, "controls", e.target.value)}
                      placeholder="대책을 입력하세요"
                      className="min-h-[80px] resize-none border-0"
                    />
                  </div>
                  <div className="col-span-2 border">
                    <Textarea
                      value={step.notes}
                      onChange={(e) => updateStep(step.id, "notes", e.target.value)}
                      placeholder="비고"
                      className="min-h-[80px] resize-none border-0"
                    />
                  </div>
                  <div className="col-span-1 p-3 border flex items-center justify-center print:hidden">
                    <Button
                      onClick={() => removeStep(step.id)}
                      size="sm"
                      variant="outline"
                      disabled={steps.length === 1}
                      className="p-2 h-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* AI 채팅 도우미 */}
            <div className="mt-8 print:hidden">
              <h3 className="text-lg font-medium mb-4">AI 작업 안전 도우미</h3>
              <AIChat />
            </div>
          </CardContent>
        </Card>
      </main>
      </div>
    </>
  )
}