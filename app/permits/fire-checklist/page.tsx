"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Plus, Trash2, Flame } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import PrintButton from "@/components/print-button"
import GlobalPrintStyles from "@/components/global-print-styles"

interface GasMeasurement {
  time: string
  o2: string
  co: string
  h2s: string
  combustibleGas: string
  measurer: string
}

export default function FireWorkChecklistPage() {
  const router = useRouter()
  const { user } = useAuth()

  // Basic information
  const [workDate, setWorkDate] = useState("")
  const [workLocation, setWorkLocation] = useState("")
  const [fireMonitor, setFireMonitor] = useState("")

  // Safety equipment checks
  const [monitorAssigned, setMonitorAssigned] = useState<"해당없음" | "양호" | "미비">("해당없음")
  const [equipmentCheck, setEquipmentCheck] = useState<"해당없음" | "양호" | "미비">("해당없음")
  const [extinguisherCount, setExtinguisherCount] = useState("2")
  const [extinguisherCheck, setExtinguisherCheck] = useState<"해당없음" | "양호" | "미비">("해당없음")

  // Gas measurements
  const [measurements, setMeasurements] = useState<GasMeasurement[]>([
    { time: "", o2: "", co: "", h2s: "", combustibleGas: "", measurer: "" },
  ])

  const addMeasurement = () => {
    // Cleared the time field for new measurements as well
    setMeasurements([...measurements, { time: "", o2: "", co: "", h2s: "", combustibleGas: "", measurer: "" }])
  }

  const removeMeasurement = (index: number) => {
    if (measurements.length > 1) {
      setMeasurements(measurements.filter((_, i) => i !== index))
    }
  }

  const updateMeasurement = (index: number, field: keyof GasMeasurement, value: string) => {
    const updated = [...measurements]
    updated[index][field] = value
    setMeasurements(updated)
  }

  const handleSave = () => {
    // Save logic here
    alert("체크리스트가 저장되었습니다.")
  }

  const getStatusColor = (status: "해당없음" | "양호" | "미비") => {
    switch (status) {
      case "양호":
        return "bg-green-500"
      case "미비":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <>
      <GlobalPrintStyles />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card shadow-sm print-hide">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="border-border hover:bg-muted"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                뒤로가기
              </Button>
              <div className="flex items-center space-x-2">
                <Flame className="w-6 h-6 text-red-500" />
                <h1 className="text-xl font-bold text-foreground">화기작업 Check List</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
              <PrintButton />
            </div>
          </div>
        </header>

        <div className="hidden print:block text-center py-4 border-b-2 border-black">
          <h1 className="text-2xl font-bold">화기작업 Check List</h1>
          <p className="text-sm">화기 작업 안전점검</p>
        </div>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Title Section */}
          <div className="text-center mb-8 print-hide">
            <h1 className="text-3xl font-bold text-foreground mb-2">화기작업 Check List</h1>
            <div className="w-full h-1 bg-red-500 mb-4"></div>
            <p className="text-lg font-semibold text-foreground">화기 작업 안전점검</p>
          </div>

          {/* Basic Information */}
          <Card className="mb-6 print-section">
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workDate">작업 일시</Label>
                  <Input id="workDate" type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="fireMonitor">화재 감시자</Label>
                  <Input
                    id="fireMonitor"
                    value={fireMonitor}
                    onChange={(e) => setFireMonitor(e.target.value)}
                    placeholder="감시자 이름"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="workLocation">작업 장소</Label>
                <Textarea
                  id="workLocation"
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                  placeholder="작업 장소를 상세히 입력하세요"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Safety Equipment Checks */}
          <Card className="mb-6 print-section">
            <CardHeader>
              <CardTitle>안전 장비 점검</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Fire Monitor Assignment */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">화재감시자 지정 및 복장 착용</h4>
                </div>
                <div className="flex space-x-2">
                  {["해당없음", "양호", "미비"].map((status) => (
                    <Button
                      key={status}
                      variant={monitorAssigned === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMonitorAssigned(status as any)}
                      className={monitorAssigned === status ? getStatusColor(status as any) : ""}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Equipment Check */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">확성기 / 손전등 / 방연마스크 소지</h4>
                </div>
                <div className="flex space-x-2">
                  {["해당없음", "양호", "미비"].map((status) => (
                    <Button
                      key={status}
                      variant={equipmentCheck === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setEquipmentCheck(status as any)}
                      className={equipmentCheck === status ? getStatusColor(status as any) : ""}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Fire Extinguisher */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <h4 className="font-medium">소화기</h4>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={extinguisherCount}
                      onChange={(e) => setExtinguisherCount(e.target.value)}
                      className="w-16 text-center"
                      min="1"
                    />
                    <span>개 이상 비치</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {["해당없음", "양호", "미비"].map((status) => (
                    <Button
                      key={status}
                      variant={extinguisherCheck === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setExtinguisherCheck(status as any)}
                      className={extinguisherCheck === status ? getStatusColor(status as any) : ""}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gas Concentration Measurements */}
          <Card className="mb-6 print-section">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>가스농도 측정표</CardTitle>
                <Button onClick={addMeasurement} size="sm" variant="outline" className="print-hide bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  측정 추가
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>■ 4시간 주기로 측정 (장소에 상관없이 최초 1회 측정 필수)</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-center">측정시간</th>
                      <th className="border border-border p-2 text-center">
                        O₂
                        <br />
                        (18~23.5%)
                      </th>
                      <th className="border border-border p-2 text-center">
                        CO
                        <br />
                        (30ppm 미만)
                      </th>
                      <th className="border border-border p-2 text-center">
                        H₂S
                        <br />
                        (10ppm 미만)
                      </th>
                      <th className="border border-border p-2 text-center">
                        가연성가스
                        <br />
                        (20%LEL 미만)
                      </th>
                      <th className="border border-border p-2 text-center">측정자</th>
                      <th className="border border-border p-2 text-center print-hide">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {measurements.map((measurement, index) => (
                      <tr key={index}>
                        <td className="border border-border p-2">
                          <Input
                            type="time"
                            value={measurement.time}
                            onChange={(e) => updateMeasurement(index, "time", e.target.value)}
                            className="w-full"
                          />
                        </td>
                        <td className="border border-border p-2">
                          <Input
                            value={measurement.o2}
                            onChange={(e) => updateMeasurement(index, "o2", e.target.value)}
                            placeholder=""
                            className="w-full text-center"
                          />
                        </td>
                        <td className="border border-border p-2">
                          <Input
                            value={measurement.co}
                            onChange={(e) => updateMeasurement(index, "co", e.target.value)}
                            placeholder=""
                            className="w-full text-center"
                          />
                        </td>
                        <td className="border border-border p-2">
                          <Input
                            value={measurement.h2s}
                            onChange={(e) => updateMeasurement(index, "h2s", e.target.value)}
                            placeholder=""
                            className="w-full text-center"
                          />
                        </td>
                        <td className="border border-border p-2">
                          <Input
                            value={measurement.combustibleGas}
                            onChange={(e) => updateMeasurement(index, "combustibleGas", e.target.value)}
                            placeholder=""
                            className="w-full text-center"
                          />
                        </td>
                        <td className="border border-border p-2">
                          <Input
                            value={measurement.measurer}
                            onChange={(e) => updateMeasurement(index, "measurer", e.target.value)}
                            placeholder=""
                            className="w-full"
                          />
                        </td>
                        <td className="border border-border p-2 text-center print-hide">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeMeasurement(index)}
                            disabled={measurements.length === 1}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Footer Information */}
          <div className="text-center text-sm text-muted-foreground print:block">
            <p>
              작성자: {user?.name} ({user?.department})
            </p>
            <p>작성일시: {new Date().toLocaleString("ko-KR")}</p>
          </div>
        </main>
      </div>
    </>
  )
}
