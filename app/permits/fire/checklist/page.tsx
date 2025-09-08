"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Send, Flame } from "lucide-react"

interface FireWorkChecklistData {
  workDateTime: string
  workLocation: string
  fireWatcher: string

  // 화재감시자 지정 및 복장 착용
  fireWatcherDesignation: "해당없음" | "양호" | "미비" | ""

  // 확성기 손전등 방연마스크 소지
  equipmentPossession: "해당없음" | "양호" | "미비" | ""

  // 소화기 2개 이상 비치
  fireExtinguisher: "해당없음" | "양호" | "미비" | ""

  // 가스농도 측정표
  gasMeasurements: Array<{
    time: string
    o2: string
    co: string
    h2s: string
    combustibleGas: string
    measurer: string
  }>
}

export default function FireWorkChecklistPage() {
  const router = useRouter()

  const [formData, setFormData] = useState<FireWorkChecklistData>({
    workDateTime: "",
    workLocation: "",
    fireWatcher: "",
    fireWatcherDesignation: "",
    equipmentPossession: "",
    fireExtinguisher: "",
    gasMeasurements: Array(15)
      .fill(null)
      .map(() => ({
        time: "",
        o2: "",
        co: "",
        h2s: "",
        combustibleGas: "",
        measurer: "",
      })),
  })

  const handleInputChange = (field: keyof FireWorkChecklistData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleGasMeasurementChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      gasMeasurements: prev.gasMeasurements.map((measurement, i) =>
        i === index ? { ...measurement, [field]: value } : measurement,
      ),
    }))
  }

  const handleSave = () => {
    console.log("Saving checklist:", formData)
    alert("체크리스트가 저장되었습니다.")
  }

  const handleSubmit = () => {
    console.log("Submitting checklist:", formData)
    alert("체크리스트가 제출되었습니다.")
    router.push("/")
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
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">화기작업 Check List</h1>
              <p className="text-sm text-muted-foreground">Fire Work Safety Checklist</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleSave} className="border-border hover:bg-muted bg-transparent">
              <Save className="w-4 h-4 mr-2" />
              저장
            </Button>
            <Button onClick={handleSubmit} className="bg-red-500 hover:bg-red-600 text-white">
              <Send className="w-4 h-4 mr-2" />
              제출
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* 기본 정보 */}
          <Card className="shadow-sm border-2 border-red-500/20">
            <CardHeader className="bg-red-50 border-b-2 border-red-500/20">
              <CardTitle className="text-lg font-bold text-foreground">
                <span className="font-black">화기 작업 안전점검</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-red-50/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="workDateTime" className="text-sm font-black text-foreground">
                    작업 일시
                  </Label>
                  <Input
                    id="workDateTime"
                    type="datetime-local"
                    value={formData.workDateTime}
                    onChange={(e) => handleInputChange("workDateTime", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workLocation" className="text-sm font-black text-foreground">
                    작업 장소
                  </Label>
                  <Input
                    id="workLocation"
                    value={formData.workLocation}
                    onChange={(e) => handleInputChange("workLocation", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fireWatcher" className="text-sm font-black text-foreground">
                    화재 감시자
                  </Label>
                  <Input
                    id="fireWatcher"
                    value={formData.fireWatcher}
                    onChange={(e) => handleInputChange("fireWatcher", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 안전점검 체크리스트 */}
          <Card className="shadow-sm border-2 border-red-500/20">
            <CardHeader className="bg-red-50 border-b-2 border-red-500/20">
              <CardTitle className="text-lg font-bold text-foreground">
                <span className="font-black">안전점검 체크리스트</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* 화재감시자 지정 및 복장 착용 */}
                <div className="space-y-3">
                  <Label className="text-sm font-black text-foreground">화재감시자 지정 및 복장 착용</Label>
                  <div className="flex items-center space-x-6 p-4 bg-gray-50 rounded-lg border">
                    {["해당없음", "양호", "미비"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`fireWatcherDesignation-${option}`}
                          checked={formData.fireWatcherDesignation === option}
                          onCheckedChange={(checked) =>
                            checked && handleInputChange("fireWatcherDesignation", option as any)
                          }
                          className="w-5 h-5 border-2 border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                        />
                        <Label htmlFor={`fireWatcherDesignation-${option}`} className="text-sm font-medium">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 확성기 손전등 방연마스크 소지 */}
                <div className="space-y-3">
                  <Label className="text-sm font-black text-foreground">확성기 손전등 방연마스크 소지 / /</Label>
                  <div className="flex items-center space-x-6 p-4 bg-gray-50 rounded-lg border">
                    {["해당없음", "양호", "미비"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`equipmentPossession-${option}`}
                          checked={formData.equipmentPossession === option}
                          onCheckedChange={(checked) =>
                            checked && handleInputChange("equipmentPossession", option as any)
                          }
                          className="w-5 h-5 border-2 border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                        />
                        <Label htmlFor={`equipmentPossession-${option}`} className="text-sm font-medium">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 소화기 2개 이상 비치 */}
                <div className="space-y-3">
                  <Label className="text-sm font-black text-foreground">소화기 2개 이상 비치</Label>
                  <div className="flex items-center space-x-6 p-4 bg-gray-50 rounded-lg border">
                    {["해당없음", "양호", "미비"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`fireExtinguisher-${option}`}
                          checked={formData.fireExtinguisher === option}
                          onCheckedChange={(checked) => checked && handleInputChange("fireExtinguisher", option as any)}
                          className="w-5 h-5 border-2 border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                        />
                        <Label htmlFor={`fireExtinguisher-${option}`} className="text-sm font-medium">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 가스농도 측정표 */}
          <Card className="shadow-sm border-2 border-red-500/20">
            <CardHeader className="bg-red-50 border-b-2 border-red-500/20">
              <CardTitle className="text-lg font-bold text-foreground">
                <span className="font-black">가스농도 측정표</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground font-medium">
                <span className="font-bold">※ 4시간 주기로 측정/장소에 상관없이 최초 1회 측정 필수</span>
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-3 text-sm font-black text-center whitespace-nowrap">
                        측정시간
                      </th>
                      <th className="border border-gray-300 p-3 text-sm font-black text-center whitespace-nowrap">
                        O₂
                        <br />
                        (18~23.5%)
                      </th>
                      <th className="border border-gray-300 p-3 text-sm font-black text-center whitespace-nowrap">
                        CO
                        <br />
                        (30ppm미만)
                      </th>
                      <th className="border border-gray-300 p-3 text-sm font-black text-center whitespace-nowrap">
                        H₂S
                        <br />
                        (10ppm미만)
                      </th>
                      <th className="border border-gray-300 p-3 text-sm font-black text-center whitespace-nowrap">
                        가연성가스
                        <br />
                        (20%LEL미만)
                      </th>
                      <th className="border border-gray-300 p-3 text-sm font-black text-center whitespace-nowrap">
                        측정자
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.gasMeasurements.map((measurement, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2">
                          <Input
                            type="time"
                            value={measurement.time}
                            onChange={(e) => handleGasMeasurementChange(index, "time", e.target.value)}
                            className="text-sm border-0 bg-transparent"
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={measurement.o2}
                            onChange={(e) => handleGasMeasurementChange(index, "o2", e.target.value)}
                            className="text-sm border-0 bg-transparent text-center"
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={measurement.co}
                            onChange={(e) => handleGasMeasurementChange(index, "co", e.target.value)}
                            className="text-sm border-0 bg-transparent text-center"
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={measurement.h2s}
                            onChange={(e) => handleGasMeasurementChange(index, "h2s", e.target.value)}
                            className="text-sm border-0 bg-transparent text-center"
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={measurement.combustibleGas}
                            onChange={(e) => handleGasMeasurementChange(index, "combustibleGas", e.target.value)}
                            className="text-sm border-0 bg-transparent text-center"
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={measurement.measurer}
                            onChange={(e) => handleGasMeasurementChange(index, "measurer", e.target.value)}
                            className="text-sm border-0 bg-transparent text-center"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
