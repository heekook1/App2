"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ConstructionMachineryPermitProps {
  data: any
  onChange: (data: any) => void
}

export default function ConstructionMachineryPermit({ data, onChange }: ConstructionMachineryPermitProps) {
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
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-lg text-blue-700 font-black">
            차량계 건설기계 중장비 사용 작업 안전 점검 Check List
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* 작업 전 */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-black mb-4 text-blue-800">■ 작업 전</h4>
            <div className="space-y-4">
              <div className="space-y-3">
                <h5 className="font-black text-sm text-blue-700">공통</h5>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="route-fall-prevention"
                      checked={data.preWork?.routeFallPrevention || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "routeFallPrevention", checked as boolean)
                      }
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="route-fall-prevention" className="text-sm whitespace-nowrap">
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
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="supervisor-guide" className="text-sm whitespace-nowrap">
                      작업지휘자 및 유도자(신호수) 배치
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="head-guard"
                      checked={data.preWork?.headGuard || false}
                      onCheckedChange={(checked) => handleCheckboxChange("preWork", "headGuard", checked as boolean)}
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="head-guard" className="text-sm whitespace-nowrap">
                      헤드가드 등 낙하물 보호구조 설치
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-black text-sm text-blue-700">항타기/항발기</h5>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="body-equipment"
                      checked={data.preWork?.bodyEquipment || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "bodyEquipment", checked as boolean)
                      }
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="body-equipment" className="text-sm whitespace-nowrap">
                      본체 및 권상용 장비 부착·손상 상태
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="winch-brake"
                      checked={data.preWork?.winchBrake || false}
                      onCheckedChange={(checked) => handleCheckboxChange("preWork", "winchBrake", checked as boolean)}
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="winch-brake" className="text-sm whitespace-nowrap">
                      권상장치브레이크 및 쐐기장치 상태
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="leader-support"
                      checked={data.preWork?.leaderSupport || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "leaderSupport", checked as boolean)
                      }
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="leader-support" className="text-sm whitespace-nowrap">
                      리더 버팀방법 및 고정상태
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="wire-hammer"
                      checked={data.preWork?.wireHammer || false}
                      onCheckedChange={(checked) => handleCheckboxChange("preWork", "wireHammer", checked as boolean)}
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="wire-hammer" className="text-sm whitespace-nowrap">
                      와이어로프·해머(추)·클램프 연결 상태
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="pulley-load"
                      checked={data.preWork?.pulleyLoad || false}
                      onCheckedChange={(checked) => handleCheckboxChange("preWork", "pulleyLoad", checked as boolean)}
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="pulley-load" className="text-sm whitespace-nowrap">
                      도르래 부착 및 적정 하중 확인
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="pile-collapse"
                      checked={data.preWork?.pileCollapse || false}
                      onCheckedChange={(checked) => handleCheckboxChange("preWork", "pileCollapse", checked as boolean)}
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="pile-collapse" className="text-sm whitespace-nowrap">
                      적재 파일(Pile) 붕괴위험조치
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-black text-sm text-blue-700">도로포장 건설기계</h5>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="operator-license"
                      checked={data.preWork?.operatorLicense || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "operatorLicense", checked as boolean)
                      }
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="operator-license" className="text-sm whitespace-nowrap">
                      운전자 유자격자 확인
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="access-prohibition"
                      checked={data.preWork?.accessProhibition || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "accessProhibition", checked as boolean)
                      }
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="access-prohibition" className="text-sm whitespace-nowrap">
                      롤러기, 아스팔트 피니셔 등 작업시 출입금지조치
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-black text-sm text-blue-700">덤프트럭</h5>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="hydraulic-system"
                      checked={data.preWork?.hydraulicSystem || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "hydraulicSystem", checked as boolean)
                      }
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="hydraulic-system" className="text-sm whitespace-nowrap">
                      조정장치 및 유압계통 이상 유무
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="wheel-chock"
                      checked={data.preWork?.wheelChock || false}
                      onCheckedChange={(checked) => handleCheckboxChange("preWork", "wheelChock", checked as boolean)}
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="wheel-chock" className="text-sm whitespace-nowrap">
                      운전자 이탈 시 차량 고임목 설치
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 작업완료 확인 */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-black mb-4 text-green-800">■ 작업완료 확인</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="site-cleanup"
                  checked={data.completion?.siteCleanup || false}
                  onCheckedChange={(checked) => handleCheckboxChange("completion", "siteCleanup", checked as boolean)}
                  className="w-5 h-5 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label htmlFor="site-cleanup" className="text-sm whitespace-nowrap">
                  현장 정리정돈 상태
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="key-removal"
                  checked={data.completion?.keyRemoval || false}
                  onCheckedChange={(checked) => handleCheckboxChange("completion", "keyRemoval", checked as boolean)}
                  className="w-5 h-5 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label htmlFor="key-removal" className="text-sm whitespace-nowrap">
                  시동키 분리 및 이탈방지조치
                </Label>
              </div>
            </div>
          </div>

          {/* 작업완료시간 */}
          <div className="space-y-2">
            <Label htmlFor="completion-time" className="font-black">
              작업완료시간
            </Label>
            <Input
              id="completion-time"
              value={data.completionTime || ""}
              onChange={(e) => handleInputChange("completionTime", e.target.value)}
              placeholder="작업완료시간을 입력하세요"
            />
          </div>

          {/* 담당자 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team-name" className="font-black">
                팀명
              </Label>
              <Input
                id="team-name"
                value={data.teamName || ""}
                onChange={(e) => handleInputChange("teamName", e.target.value)}
                placeholder="팀명을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="worker-name" className="font-black">
                성명
              </Label>
              <Input
                id="worker-name"
                value={data.workerName || ""}
                onChange={(e) => handleInputChange("workerName", e.target.value)}
                placeholder="성명을 입력하세요"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
