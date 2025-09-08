"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"

interface CompletionData {
  completionTime: string
  specialNotes: string
  workerCheck: "양호" | "미비" | "완료" | ""
  workerAction: string
  workerTime: string
  workerName: string
  workerSignature: string
  teamLeaderCheck: "양호" | "미비" | "완료" | ""
  teamLeaderAction: string
  teamLeaderTime: string
  teamLeaderName: string
  teamLeaderSignature: string
  supervisorCheck: "양호" | "미비" | "완료" | ""
  supervisorAction: string
  supervisorTime: string
  supervisorName: string
  supervisorSignature: string
}

interface WorkCompletionSectionProps {
  completion: CompletionData
  onCompletionUpdate: (field: keyof CompletionData, value: string) => void
}

export default function WorkCompletionSection({ completion, onCompletionUpdate }: WorkCompletionSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          7. 작업완료 확인
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-1">작업완료시간</label>
            <Input type="text" placeholder="" value={completion.completionTime} className="bg-white" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">특이사항</label>
            <Textarea
              placeholder=""
              value={completion.specialNotes}
              onChange={(e) => onCompletionUpdate("specialNotes", e.target.value)}
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
                <th className="border border-gray-300 p-3 text-center font-semibold whitespace-nowrap">조치결과</th>
                <th className="border border-gray-300 p-3 text-center font-semibold whitespace-nowrap">확인시간</th>
                <th className="border border-gray-300 p-3 text-center font-semibold whitespace-nowrap">이름</th>
                <th className="border border-gray-300 p-3 text-center font-semibold whitespace-nowrap">서명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className="border border-gray-300 p-3 font-medium bg-gray-50 text-center align-middle whitespace-nowrap"
                  rowSpan={3}
                >
                  작업 완료
                </td>
                <td className="border border-gray-300 p-3 text-center align-middle whitespace-nowrap">담당자</td>
                <td className="border border-gray-300 p-3 text-center align-middle">
                  <div className="flex gap-3 justify-center">
                    <label className="flex items-center whitespace-nowrap">
                      <input
                        type="radio"
                        name="worker-completion-check"
                        value="양호"
                        checked={completion.workerCheck === "양호"}
                        onChange={(e) => onCompletionUpdate("workerCheck", e.target.value)}
                        className="mr-1"
                      />
                      양호
                    </label>
                    <label className="flex items-center whitespace-nowrap">
                      <input
                        type="radio"
                        name="worker-completion-check"
                        value="미비"
                        checked={completion.workerCheck === "미비"}
                        onChange={(e) => onCompletionUpdate("workerCheck", e.target.value)}
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
                  <Input
                    type="text"
                    value={completion.workerTime}
                    placeholder=""
                    className="border-0 p-2 h-8 text-center"
                    readOnly
                  />
                </td>
                <td className="border border-gray-300 p-1 align-middle">
                  <Input
                    value={completion.workerName}
                    onChange={(e) => onCompletionUpdate("workerName", e.target.value)}
                    className="border-0 p-2 h-8 text-center"
                    placeholder=""
                  />
                </td>
                <td className="border border-gray-300 p-1 align-middle">
                  <Input
                    value={completion.workerSignature}
                    onChange={(e) => onCompletionUpdate("workerSignature", e.target.value)}
                    className="border-0 p-2 h-8 text-center"
                    placeholder=""
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 text-center align-middle whitespace-nowrap">담당팀장</td>
                <td className="border border-gray-300 p-3 text-center align-middle">
                  <div className="flex gap-3 justify-center">
                    <label className="flex items-center whitespace-nowrap">
                      <input
                        type="radio"
                        name="team-leader-completion-check"
                        value="양호"
                        checked={completion.teamLeaderCheck === "양호"}
                        onChange={(e) => onCompletionUpdate("teamLeaderCheck", e.target.value)}
                        className="mr-1"
                      />
                      양호
                    </label>
                    <label className="flex items-center whitespace-nowrap">
                      <input
                        type="radio"
                        name="team-leader-completion-check"
                        value="미비"
                        checked={completion.teamLeaderCheck === "미비"}
                        onChange={(e) => onCompletionUpdate("teamLeaderCheck", e.target.value)}
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
                  <Input
                    type="text"
                    value={completion.teamLeaderTime}
                    placeholder=""
                    className="border-0 p-2 h-8 text-center"
                    readOnly
                  />
                </td>
                <td className="border border-gray-300 p-1 align-middle">
                  <Input
                    value={completion.teamLeaderName}
                    onChange={(e) => onCompletionUpdate("teamLeaderName", e.target.value)}
                    className="border-0 p-2 h-8 text-center"
                    placeholder=""
                  />
                </td>
                <td className="border border-gray-300 p-1 align-middle">
                  <Input
                    value={completion.teamLeaderSignature}
                    onChange={(e) => onCompletionUpdate("teamLeaderSignature", e.target.value)}
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
                        name="supervisor-completion-check"
                        value="양호"
                        checked={completion.supervisorCheck === "양호"}
                        onChange={(e) => onCompletionUpdate("supervisorCheck", e.target.value)}
                        className="mr-1"
                      />
                      양호
                    </label>
                    <label className="flex items-center whitespace-nowrap">
                      <input
                        type="radio"
                        name="supervisor-completion-check"
                        value="미비"
                        checked={completion.supervisorCheck === "미비"}
                        onChange={(e) => onCompletionUpdate("supervisorCheck", e.target.value)}
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
                  <Input
                    type="text"
                    value={completion.supervisorTime}
                    placeholder=""
                    className="border-0 p-2 h-8 text-center"
                    readOnly
                  />
                </td>
                <td className="border border-gray-300 p-1 align-middle">
                  <Input
                    value={completion.supervisorName}
                    onChange={(e) => onCompletionUpdate("supervisorName", e.target.value)}
                    className="border-0 p-2 h-8 text-center"
                    placeholder=""
                  />
                </td>
                <td className="border border-gray-300 p-1 align-middle">
                  <Input
                    value={completion.supervisorSignature}
                    onChange={(e) => onCompletionUpdate("supervisorSignature", e.target.value)}
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
