"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ExcavationWorkPermitProps {
  data: any
  onChange: (data: any) => void
}

export default function ExcavationWorkPermit({ data, onChange }: ExcavationWorkPermitProps) {
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
      <Card className="border-2 border-orange-200">
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-lg font-black text-orange-700">굴착 작업 안전 점검 Check List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          {/* 작업 전 */}
          <div className="border-l-4 border-orange-400 pl-4">
            <h4 className="font-black text-base mb-6 text-gray-800">■ 작업 전</h4>

            {/* 굴착현장 */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h5 className="font-black text-sm mb-4 text-gray-700">굴착현장</h5>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="buried-pipes"
                    checked={data.preWork?.buriedPipes || false}
                    onCheckedChange={(checked) => handleCheckboxChange("preWork", "buriedPipes", checked as boolean)}
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <Label htmlFor="buried-pipes" className="text-sm font-medium whitespace-nowrap">
                    가스도관, 지중전선로 등 매설관 사전 확인
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="site-condition"
                    checked={data.preWork?.siteCondition || false}
                    onCheckedChange={(checked) => handleCheckboxChange("preWork", "siteCondition", checked as boolean)}
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <Label htmlFor="site-condition" className="text-sm font-medium whitespace-nowrap">
                    작업장소 및 주변 부석, 균열, 용수 및 동결상태
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="collapse-prevention"
                    checked={data.preWork?.collapsePrevention || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("preWork", "collapsePrevention", checked as boolean)
                    }
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <Label htmlFor="collapse-prevention" className="text-sm font-medium whitespace-nowrap">
                    지반 붕괴 및 토석 낙하방지 흙막이 지보공, 방호망 설치
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="access-control"
                    checked={data.preWork?.accessControl || false}
                    onCheckedChange={(checked) => handleCheckboxChange("preWork", "accessControl", checked as boolean)}
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <Label htmlFor="access-control" className="text-sm font-medium whitespace-nowrap">
                    관계자 외 출입금지 조치
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="weather-prevention"
                    checked={data.preWork?.weatherPrevention || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("preWork", "weatherPrevention", checked as boolean)
                    }
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <Label htmlFor="weather-prevention" className="text-sm font-medium whitespace-nowrap">
                    비·눈 등으로 인한 붕괴재해 예방조치
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="buried-protection"
                    checked={data.preWork?.buriedProtection || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("preWork", "buriedProtection", checked as boolean)
                    }
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <Label htmlFor="buried-protection" className="text-sm font-medium whitespace-nowrap">
                    노출 매설물 방호 조치
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="structure-protection"
                    checked={data.preWork?.structureProtection || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("preWork", "structureProtection", checked as boolean)
                    }
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <Label htmlFor="structure-protection" className="text-sm font-medium whitespace-nowrap">
                    콘크리트벽 등의 건설물 방호조치
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="route-selection"
                    checked={data.preWork?.routeSelection || false}
                    onCheckedChange={(checked) => handleCheckboxChange("preWork", "routeSelection", checked as boolean)}
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <Label htmlFor="route-selection" className="text-sm font-medium whitespace-nowrap">
                    충돌 방지를 위한 운행경로 사전 선정
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="safety-belt"
                    checked={data.preWork?.safetyBelt || false}
                    onCheckedChange={(checked) => handleCheckboxChange("preWork", "safetyBelt", checked as boolean)}
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <Label htmlFor="safety-belt" className="text-sm font-medium whitespace-nowrap">
                    (2m 이상) 출입 근로자 안전대 지급
                  </Label>
                </div>
              </div>
            </div>

            {/* 굴착기 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-black text-sm mb-4 text-gray-700">굴착기</h5>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="operator-license"
                    checked={data.preWork?.operatorLicense || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("preWork", "operatorLicense", checked as boolean)
                    }
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <Label htmlFor="operator-license" className="text-sm font-medium whitespace-nowrap">
                    운전자 유자격자 확인
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="safety-equipment"
                    checked={data.preWork?.safetyEquipment || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("preWork", "safetyEquipment", checked as boolean)
                    }
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <Label htmlFor="safety-equipment" className="text-sm font-medium whitespace-nowrap">
                    운전자 보호구 및 좌석안전띠 착용
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="lighting-mirrors"
                    checked={data.preWork?.lightingMirrors || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("preWork", "lightingMirrors", checked as boolean)
                    }
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <Label htmlFor="lighting-mirrors" className="text-sm font-medium whitespace-nowrap">
                    전도등, 후사경 및 후방영상표시장치 설치
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="fall-prevention"
                    checked={data.preWork?.fallPrevention || false}
                    onCheckedChange={(checked) => handleCheckboxChange("preWork", "fallPrevention", checked as boolean)}
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <Label htmlFor="fall-prevention" className="text-sm font-medium whitespace-nowrap">
                    이동경로 및 작업반경 넘어짐 방지
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="supervisor-guide"
                    checked={data.preWork?.supervisorGuide || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("preWork", "supervisorGuide", checked as boolean)
                    }
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <Label htmlFor="supervisor-guide" className="text-sm font-medium whitespace-nowrap">
                    작업지휘자 및 유도자 배치
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="swing-access-control"
                    checked={data.preWork?.swingAccessControl || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("preWork", "swingAccessControl", checked as boolean)
                    }
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <Label htmlFor="swing-access-control" className="text-sm font-medium whitespace-nowrap">
                    굴착기 선회로 출입금지조치
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="safety-pin"
                    checked={data.preWork?.safetyPin || false}
                    onCheckedChange={(checked) => handleCheckboxChange("preWork", "safetyPin", checked as boolean)}
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  <Label htmlFor="safety-pin" className="text-sm font-medium whitespace-nowrap">
                    작업장치 이탈방지 안전핀 체결
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
                  id="site-cleanup-fall"
                  checked={data.completion?.siteCleanupFall || false}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("completion", "siteCleanupFall", checked as boolean)
                  }
                  className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label htmlFor="site-cleanup-fall" className="text-sm font-medium whitespace-nowrap">
                  현장 정리정돈 상태 및 추락방지조치
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="bucket-ground"
                  checked={data.completion?.bucketGround || false}
                  onCheckedChange={(checked) => handleCheckboxChange("completion", "bucketGround", checked as boolean)}
                  className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label htmlFor="bucket-ground" className="text-sm font-medium whitespace-nowrap">
                  버킷 지상 안착 및 시동키 분리
                </Label>
              </div>
            </div>
          </div>

          {/* 작업완료시간 */}
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
