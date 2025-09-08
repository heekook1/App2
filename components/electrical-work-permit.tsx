"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ElectricalWorkPermitProps {
  data: any
  onChange: (data: any) => void
}

export default function ElectricalWorkPermit({ data, onChange }: ElectricalWorkPermitProps) {
  const handleCheckboxChange = (section: string, item: string, checked: boolean) => {
    onChange({
      ...data,
      [section]: {
        ...data[section],
        [item]: checked,
      },
    })
  }

  const handleInputChange = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-yellow-200">
        <CardHeader className="bg-yellow-50">
          <CardTitle className="text-lg font-black text-yellow-700">정전 작업 안전 점검 Check List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          {/* 작업 전 */}
          <div className="border-l-4 border-yellow-400 pl-4">
            <h4 className="font-black text-base mb-6 text-gray-800">■ 작업 전</h4>

            {/* 정전작업 */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h5 className="font-black text-sm mb-4 text-gray-700">정전작업</h5>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="switch-cutoff"
                    checked={data.preWork?.switchCutoff || false}
                    onCheckedChange={(checked) => handleCheckboxChange("preWork", "switchCutoff", checked as boolean)}
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
                  />
                  <Label htmlFor="switch-cutoff" className="text-sm font-medium whitespace-nowrap">
                    스위치 차단 및 LOTO 체결 완료
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="power-check"
                    checked={data.preWork?.powerCheck || false}
                    onCheckedChange={(checked) => handleCheckboxChange("preWork", "powerCheck", checked as boolean)}
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
                  />
                  <Label htmlFor="power-check" className="text-sm font-medium whitespace-nowrap">
                    테스터기를 활용한 정전상태 확인
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="residual-charge"
                    checked={data.preWork?.residualCharge || false}
                    onCheckedChange={(checked) => handleCheckboxChange("preWork", "residualCharge", checked as boolean)}
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
                  />
                  <Label htmlFor="residual-charge" className="text-sm font-medium whitespace-nowrap">
                    검전기 등을 통한 잔류전하 확인
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="discharge"
                    checked={data.preWork?.discharge || false}
                    onCheckedChange={(checked) => handleCheckboxChange("preWork", "discharge", checked as boolean)}
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
                  />
                  <Label htmlFor="discharge" className="text-sm font-medium whitespace-nowrap">
                    방전기구를 활용한 방전
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="safety-device"
                    checked={data.preWork?.safetyDevice || false}
                    onCheckedChange={(checked) => handleCheckboxChange("preWork", "safetyDevice", checked as boolean)}
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
                  />
                  <Label htmlFor="safety-device" className="text-sm font-medium whitespace-nowrap">
                    활선경보기 등 안전장치 착용
                  </Label>
                </div>
              </div>
            </div>

            {/* 활선작업 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-black text-sm mb-4 text-gray-700">활선작업</h5>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="approach-distance"
                    checked={data.preWork?.approachDistance || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("preWork", "approachDistance", checked as boolean)
                    }
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
                  />
                  <Label htmlFor="approach-distance" className="text-sm font-medium whitespace-nowrap">
                    충전부위 접근한계거리 확보
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="live-work-tools"
                    checked={data.preWork?.liveWorkTools || false}
                    onCheckedChange={(checked) => handleCheckboxChange("preWork", "liveWorkTools", checked as boolean)}
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
                  />
                  <Label htmlFor="live-work-tools" className="text-sm font-medium whitespace-nowrap">
                    활선작업용 기구 사용
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="qualified-worker"
                    checked={data.preWork?.qualifiedWorker || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("preWork", "qualifiedWorker", checked as boolean)
                    }
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
                  />
                  <Label htmlFor="qualified-worker" className="text-sm font-medium whitespace-nowrap">
                    전기작업자 유자격 확인(자격·경험 등)
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="grounding"
                    checked={data.preWork?.grounding || false}
                    onCheckedChange={(checked) => handleCheckboxChange("preWork", "grounding", checked as boolean)}
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
                  />
                  <Label htmlFor="grounding" className="text-sm font-medium whitespace-nowrap">
                    접지 여부 및 체결 상태
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="access-prohibition"
                    checked={data.preWork?.accessProhibition || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("preWork", "accessProhibition", checked as boolean)
                    }
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
                  />
                  <Label htmlFor="access-prohibition" className="text-sm font-medium whitespace-nowrap">
                    충전부 접근금지 조치
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* 작업완료 확인 */}
          <div className="border-l-4 border-green-400 pl-4">
            <h4 className="font-black text-base mb-6 text-gray-800">■ 작업완료 확인</h4>
            <div className="bg-green-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="breaker-recovery"
                  checked={data.completion?.breakerRecovery || false}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("completion", "breakerRecovery", checked as boolean)
                  }
                  className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label htmlFor="breaker-recovery" className="text-sm font-medium whitespace-nowrap">
                  차단기 복구 및 정상 작동 확인
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="site-cleanup"
                  checked={data.completion?.siteCleanup || false}
                  onCheckedChange={(checked) => handleCheckboxChange("completion", "siteCleanup", checked as boolean)}
                  className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label htmlFor="site-cleanup" className="text-sm font-medium whitespace-nowrap">
                  현장 정리정돈 상태 확인
                </Label>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-blue-400 pl-4">
            <div className="bg-blue-50 p-4 rounded-lg space-y-4">
              <div className="space-y-2">
                <Label htmlFor="completion-time" className="font-black text-sm">
                  작업완료시간
                </Label>
                <Input
                  id="completion-time"
                  value={data.completionTime || ""}
                  onChange={(e) => handleInputChange("completionTime", e.target.value)}
                  placeholder="작업완료시간을 입력하세요"
                  className="border-2"
                />
              </div>

              {/* 담당자 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name" className="font-black text-sm">
                    팀명
                  </Label>
                  <Input
                    id="team-name"
                    value={data.teamName || ""}
                    onChange={(e) => handleInputChange("teamName", e.target.value)}
                    placeholder="팀명을 입력하세요"
                    className="border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="worker-name" className="font-black text-sm">
                    성명
                  </Label>
                  <Input
                    id="worker-name"
                    value={data.workerName || ""}
                    onChange={(e) => handleInputChange("workerName", e.target.value)}
                    placeholder="성명을 입력하세요"
                    className="border-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
