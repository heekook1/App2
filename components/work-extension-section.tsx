"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Clock } from "lucide-react"

interface ExtensionRecord {
  requestTime: string
  specialNotes: string
  workerCheck: "양호" | "미비" | "완료" | ""
  workerAction: string
  workerTime: string
  workerName: string
  workerSignature: string
  supervisorCheck: "양호" | "미비" | "완료" | ""
  supervisorAction: string
  supervisorTime: string
  supervisorName: string
  supervisorSignature: string
}

interface WorkExtensionSectionProps {
  extensions: ExtensionRecord[]
  onExtensionUpdate: (index: number, field: keyof ExtensionRecord, value: string) => void
}

export default function WorkExtensionSection({ extensions, onExtensionUpdate }: WorkExtensionSectionProps) {
  const displayExtensions =
    extensions.length > 0
      ? extensions
      : [
          {
            requestTime: "",
            specialNotes: "",
            workerCheck: "" as const,
            workerAction: "",
            workerTime: "",
            workerName: "",
            workerSignature: "",
            supervisorCheck: "" as const,
            supervisorAction: "",
            supervisorTime: "",
            supervisorName: "",
            supervisorSignature: "",
          },
        ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          6. 연장작업허가
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-1">연장 요청시간</label>
            <Input
              type="text"
              placeholder=""
              value={displayExtensions[0]?.requestTime || ""}
              onChange={(e) => onExtensionUpdate(0, "requestTime", e.target.value)}
              className="bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">특이사항</label>
            <Textarea
              placeholder=""
              value={displayExtensions[0]?.specialNotes || ""}
              onChange={(e) => onExtensionUpdate(0, "specialNotes", e.target.value)}
              rows={2}
              className="bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-center font-semibold whitespace-nowrap">구분</th>
                <th className="border border-gray-300 p-3 text-center font-semibold whitespace-nowrap">확인자</th>
                <th className="border border-gray-300 p-3 text-center font-semibold whitespace-nowrap">확인결과</th>
                <th className="border border-gray-300 p-3 text-center font-semibold whitespace-nowrap">미비조치</th>
                <th className="border border-gray-300 p-3 text-center font-semibold whitespace-nowrap">확인시간</th>
                <th className="border border-gray-300 p-3 text-center font-semibold whitespace-nowrap">이름</th>
                <th className="border border-gray-300 p-3 text-center font-semibold whitespace-nowrap">서명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className="border border-gray-300 p-3 font-medium bg-gray-50 text-center align-middle whitespace-nowrap"
                  rowSpan={2}
                >
                  연장작업 전
                </td>
                <td className="border border-gray-300 p-3 text-center align-middle whitespace-nowrap">담당자</td>
                <td className="border border-gray-300 p-3 text-center align-middle">
                  <div className="flex gap-3 justify-center">
                    <label className="flex items-center whitespace-nowrap">
                      <input
                        type="radio"
                        name="worker-check-0"
                        value="양호"
                        checked={displayExtensions[0]?.workerCheck === "양호"}
                        onChange={(e) => onExtensionUpdate(0, "workerCheck", e.target.value)}
                        className="mr-1"
                      />
                      양호
                    </label>
                    <label className="flex items-center whitespace-nowrap">
                      <input
                        type="radio"
                        name="worker-check-0"
                        value="미비"
                        checked={displayExtensions[0]?.workerCheck === "미비"}
                        onChange={(e) => onExtensionUpdate(0, "workerCheck", e.target.value)}
                        className="mr-1"
                      />
                      미비
                    </label>
                  </div>
                </td>
                <td className="border border-gray-300 p-3 text-center align-middle">
                  <label className="flex items-center justify-center whitespace-nowrap">
                    <input type="checkbox" className="mr-1" />
                    완료
                  </label>
                </td>
                <td className="border border-gray-300 p-1 align-middle">
                  <Input type="text" value="" placeholder="" className="border-0 p-2 h-8 text-center" readOnly />
                </td>
                <td className="border border-gray-300 p-1 align-middle">
                  <Input
                    value={displayExtensions[0]?.workerName || ""}
                    onChange={(e) => onExtensionUpdate(0, "workerName", e.target.value)}
                    className="border-0 p-2 h-8 text-center"
                    placeholder=""
                  />
                </td>
                <td className="border border-gray-300 p-1 align-middle">
                  <Input
                    value={displayExtensions[0]?.workerSignature || ""}
                    onChange={(e) => onExtensionUpdate(0, "workerSignature", e.target.value)}
                    className="border-0 p-2 h-8 text-center"
                    placeholder=""
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 text-center align-middle whitespace-nowrap">교대그룹장</td>
                <td className="border border-gray-300 p-3 text-center align-middle">
                  <div className="flex gap-3 justify-center">
                    <label className="flex items-center whitespace-nowrap">
                      <input
                        type="radio"
                        name="supervisor-check-0"
                        value="양호"
                        checked={displayExtensions[0]?.supervisorCheck === "양호"}
                        onChange={(e) => onExtensionUpdate(0, "supervisorCheck", e.target.value)}
                        className="mr-1"
                      />
                      양호
                    </label>
                    <label className="flex items-center whitespace-nowrap">
                      <input
                        type="radio"
                        name="supervisor-check-0"
                        value="미비"
                        checked={displayExtensions[0]?.supervisorCheck === "미비"}
                        onChange={(e) => onExtensionUpdate(0, "supervisorCheck", e.target.value)}
                        className="mr-1"
                      />
                      미비
                    </label>
                  </div>
                </td>
                <td className="border border-gray-300 p-3 text-center align-middle">
                  <label className="flex items-center justify-center whitespace-nowrap">
                    <input type="checkbox" className="mr-1" />
                    완료
                  </label>
                </td>
                <td className="border border-gray-300 p-1 align-middle">
                  <Input type="text" value="" placeholder="" className="border-0 p-2 h-8 text-center" readOnly />
                </td>
                <td className="border border-gray-300 p-1 align-middle">
                  <Input
                    value={displayExtensions[0]?.supervisorName || ""}
                    onChange={(e) => onExtensionUpdate(0, "supervisorName", e.target.value)}
                    className="border-0 p-2 h-8 text-center"
                    placeholder=""
                  />
                </td>
                <td className="border border-gray-300 p-1 align-middle">
                  <Input
                    value={displayExtensions[0]?.supervisorSignature || ""}
                    onChange={(e) => onExtensionUpdate(0, "supervisorSignature", e.target.value)}
                    className="border-0 p-2 h-8 text-center"
                    placeholder=""
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
