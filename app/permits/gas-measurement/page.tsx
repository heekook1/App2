"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import PrintButton from "@/components/print-button"
import GlobalPrintStyles from "@/components/global-print-styles"

export default function GasMeasurementPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    workDate: "",
    workLocation: "",
    measurements: Array(15).fill({
      time: "",
      o2: "",
      co: "",
      h2s: "",
      combustibleGas: "",
      measurer: "",
    }),
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleMeasurementChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      measurements: prev.measurements.map((measurement, i) =>
        i === index ? { ...measurement, [field]: value } : measurement,
      ),
    }))
  }

  const handleSave = () => {
    console.log("Saving gas measurement data:", formData)
    alert("가스농도 측정표가 저장되었습니다.")
  }

  return (
    <>
      <GlobalPrintStyles />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 print-hide">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.back()} className="border-border hover:bg-muted">
                <ArrowLeft className="w-4 h-4 mr-2" />
                뒤로가기
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">가스농도 측정표</h1>
                <p className="text-sm text-muted-foreground">4시간 주기로 측정, 장소에 상관없이 최초 1회 측정 필수</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
              <PrintButton />
            </div>
          </div>

          <div className="hidden print:block text-center py-4 border-b-2 border-black">
            <h1 className="text-2xl font-bold">가스농도 측정표</h1>
            <p className="text-sm">4시간 주기로 측정, 장소에 상관없이 최초 1회 측정 필수</p>
          </div>

          <Card className="shadow-sm print-section">
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-6">
                <div>
                  <Label htmlFor="workDate">작업 일시</Label>
                  <Input
                    id="workDate"
                    type="datetime-local"
                    value={formData.workDate}
                    onChange={(e) => handleInputChange("workDate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="workLocation">작업 장소</Label>
                  <Input
                    id="workLocation"
                    value={formData.workLocation}
                    onChange={(e) => handleInputChange("workLocation", e.target.value)}
                    placeholder="작업 장소를 입력하세요"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gas Measurement Table */}
          <Card className="shadow-sm mt-6 print-section">
            <CardHeader>
              <CardTitle>가스농도 측정표</CardTitle>
              <p className="text-sm text-muted-foreground">※ 4시간 주기로 측정, 장소에 상관없이 최초 1회 측정 필수</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-center font-medium">측정시간</th>
                      <th className="border border-border p-2 text-center font-medium">
                        O₂
                        <br />
                        <span className="text-xs font-normal">(18~23.5%)</span>
                      </th>
                      <th className="border border-border p-2 text-center font-medium">
                        CO
                        <br />
                        <span className="text-xs font-normal">(30ppm 미만)</span>
                      </th>
                      <th className="border border-border p-2 text-center font-medium">
                        H₂S
                        <br />
                        <span className="text-xs font-normal">(10ppm 미만)</span>
                      </th>
                      <th className="border border-border p-2 text-center font-medium">
                        가연성가스
                        <br />
                        <span className="text-xs font-normal">(20%LEL 미만)</span>
                      </th>
                      <th className="border border-border p-2 text-center font-medium">측정자</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.measurements.map((measurement, index) => (
                      <tr key={index}>
                        <td className="border border-border p-1">
                          <Input
                            type="time"
                            value={measurement.time}
                            onChange={(e) => handleMeasurementChange(index, "time", e.target.value)}
                            className="border-0 text-center text-sm"
                          />
                        </td>
                        <td className="border border-border p-1">
                          <Input
                            value={measurement.o2}
                            onChange={(e) => handleMeasurementChange(index, "o2", e.target.value)}
                            className="border-0 text-center text-sm"
                            placeholder=""
                          />
                        </td>
                        <td className="border border-border p-1">
                          <Input
                            value={measurement.co}
                            onChange={(e) => handleMeasurementChange(index, "co", e.target.value)}
                            className="border-0 text-center text-sm"
                            placeholder=""
                          />
                        </td>
                        <td className="border border-border p-1">
                          <Input
                            value={measurement.h2s}
                            onChange={(e) => handleMeasurementChange(index, "h2s", e.target.value)}
                            className="border-0 text-center text-sm"
                            placeholder=""
                          />
                        </td>
                        <td className="border border-border p-1">
                          <Input
                            value={measurement.combustibleGas}
                            onChange={(e) => handleMeasurementChange(index, "combustibleGas", e.target.value)}
                            className="border-0 text-center text-sm"
                            placeholder=""
                          />
                        </td>
                        <td className="border border-border p-1">
                          <Input
                            value={measurement.measurer}
                            onChange={(e) => handleMeasurementChange(index, "measurer", e.target.value)}
                            className="border-0 text-center text-sm"
                            placeholder=""
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
      </div>
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          
          body {
            font-size: 11px !important;
            line-height: 1.2 !important;
          }
          
          .print-hide {
            display: none !important;
          }
          
          .print-section {
            page-break-inside: avoid;
            margin-bottom: 8px !important;
          }
          
          /* A4 한 장에 맞도록 컴팩트한 레이아웃 적용 */
          .container {
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .card {
            box-shadow: none !important;
            border: 1px solid #000 !important;
            margin-bottom: 4px !important;
          }
          
          .card-header {
            padding: 8px !important;
            border-bottom: 1px solid #000 !important;
          }
          
          .card-content {
            padding: 8px !important;
          }
          
          .card-title {
            font-size: 14px !important;
            font-weight: bold !important;
            margin: 0 !important;
          }
          
          /* 기본정보 한 줄 레이아웃 강제 적용 */
          .grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 12px !important;
          }
          
          label {
            font-size: 10px !important;
            font-weight: bold !important;
            margin-bottom: 2px !important;
            display: block !important;
          }
          
          input {
            font-size: 10px !important;
            padding: 2px 4px !important;
            border: 1px solid #000 !important;
            background: white !important;
            color: black !important;
            height: auto !important;
            min-height: 20px !important;
          }
          
          /* 테이블 최적화로 A4 한 장에 맞춤 */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 9px !important;
            margin-top: 4px !important;
          }
          
          th, td {
            border: 1px solid #000 !important;
            padding: 2px !important;
            text-align: center !important;
            vertical-align: middle !important;
          }
          
          th {
            background-color: #f5f5f5 !important;
            font-weight: bold !important;
            font-size: 8px !important;
            line-height: 1.1 !important;
          }
          
          td input {
            width: 100% !important;
            border: none !important;
            background: transparent !important;
            text-align: center !important;
            font-size: 8px !important;
            padding: 1px !important;
            min-height: 16px !important;
          }
          
          .text-xs {
            font-size: 7px !important;
          }
          
          /* 프린트 헤더 최적화 */
          .hidden.print\\:block {
            display: block !important;
            margin-bottom: 8px !important;
            padding: 4px 0 !important;
          }
          
          .hidden.print\\:block h1 {
            font-size: 16px !important;
            margin: 0 !important;
          }
          
          .hidden.print\\:block p {
            font-size: 10px !important;
            margin: 2px 0 0 0 !important;
          }
        }
      `}</style>
    </>
  )
}
