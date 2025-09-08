"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface HeavyEquipmentPermitProps {
  data: any
  onChange: (data: any) => void
}

export default function HeavyEquipmentPermit({ data, onChange }: HeavyEquipmentPermitProps) {
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
          <CardTitle className="text-lg text-blue-700 font-black">중장비사용 작업 안전 점검 Check List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* 작업 전 */}
          <div className="border-l-4 border-blue-400 pl-4">
            <h4 className="font-black mb-4 text-blue-800">■ 작업 전</h4>
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h5 className="font-black text-sm mb-3 text-gray-800">
                  차량계 하역운반기계 (지게차, 구내운반차, 화물자동차)
                </h5>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="operator-qualification"
                      checked={data.preWork?.operatorQualification || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "operatorQualification", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="operator-qualification" className="text-sm whitespace-nowrap font-medium">
                      운전자 자격 및 보호구 착용
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="signal-person"
                      checked={data.preWork?.signalPerson || false}
                      onCheckedChange={(checked) => handleCheckboxChange("preWork", "signalPerson", checked as boolean)}
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="signal-person" className="text-sm whitespace-nowrap font-medium">
                      신호수 배치 및 출입 통제
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="route-check"
                      checked={data.preWork?.routeCheck || false}
                      onCheckedChange={(checked) => handleCheckboxChange("preWork", "routeCheck", checked as boolean)}
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="route-check" className="text-sm whitespace-nowrap font-medium">
                      작업 이동경로 점검 및 확보
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="supervisor-guide"
                      checked={data.preWork?.supervisorGuide || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "supervisorGuide", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="supervisor-guide" className="text-sm whitespace-nowrap font-medium">
                      작업지휘자 및 유도자 배치
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="parking-prevention"
                      checked={data.preWork?.parkingPrevention || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "parkingPrevention", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="parking-prevention" className="text-sm whitespace-nowrap font-medium">
                      정차 시 이탈 방지 조치
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="forklift-safety"
                      checked={data.preWork?.forkliftSafety || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "forkliftSafety", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="forklift-safety" className="text-sm font-medium">
                      (지게차) 경광등/헤드가드/전조·후미등/후진경보기/백레스트 안전장치
                    </Label>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <h5 className="font-black text-sm mb-3 text-gray-800">
                  양중기 (크레인, 호이스트, 이동식크레인, 리프트, 곤돌라, 승강기, 권양기)
                </h5>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="crane-operator"
                      checked={data.preWork?.craneOperator || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "craneOperator", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="crane-operator" className="text-sm whitespace-nowrap font-medium">
                      운전자 자격 및 보호구 착용
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="rated-load"
                      checked={data.preWork?.ratedLoad || false}
                      onCheckedChange={(checked) => handleCheckboxChange("preWork", "ratedLoad", checked as boolean)}
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="rated-load" className="text-sm whitespace-nowrap font-medium">
                      정격하중 부착/적재물 중량 적정성
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="safety-devices"
                      checked={data.preWork?.safetyDevices || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "safetyDevices", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="safety-devices" className="text-sm font-medium">
                      권과방지장치, 과부하방지장치, 비상정지장치, 제동장치 등 방호장치상태
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="hook-device"
                      checked={data.preWork?.hookDevice || false}
                      onCheckedChange={(checked) => handleCheckboxChange("preWork", "hookDevice", checked as boolean)}
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="hook-device" className="text-sm whitespace-nowrap font-medium">
                      훅 해지장치 설치 상태
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="weather-condition"
                      checked={data.preWork?.weatherCondition || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "weatherCondition", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="weather-condition" className="text-sm whitespace-nowrap font-medium">
                      비, 눈등의 기상상태 작업중지 조건
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="safety-inspection"
                      checked={data.preWork?.safetyInspection || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "safetyInspection", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="safety-inspection" className="text-sm whitespace-nowrap font-medium">
                      정기안전검사 사용 유효기간
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="work-supervisor"
                      checked={data.preWork?.workSupervisor || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "workSupervisor", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="work-supervisor" className="text-sm whitespace-nowrap font-medium">
                      작업지휘자 및 신호수 배치
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="sling-equipment"
                      checked={data.preWork?.slingEquipment || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "slingEquipment", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="sling-equipment" className="text-sm font-medium">
                      슬링벨트/와이어로프/샤클 등 줄걸이장비상태
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="crane-ground"
                      checked={data.preWork?.craneGround || false}
                      onCheckedChange={(checked) => handleCheckboxChange("preWork", "craneGround", checked as boolean)}
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="crane-ground" className="text-sm font-medium">
                      (크레인) 작업지반 상태 및 아웃트리거 설치
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="crane-prohibition"
                      checked={data.preWork?.craneProhibition || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "craneProhibition", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="crane-prohibition" className="text-sm whitespace-nowrap font-medium">
                      (크레인) 출입금지 표지 설치
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="hoist-stopper"
                      checked={data.preWork?.hoistStopper || false}
                      onCheckedChange={(checked) => handleCheckboxChange("preWork", "hoistStopper", checked as boolean)}
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="hoist-stopper" className="text-sm whitespace-nowrap font-medium">
                      (호이스트) 주행로 스토퍼 설치
                    </Label>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <h5 className="font-black text-sm mb-3 text-gray-800">기타장비 (체인블록, 겐트리크레인 등)</h5>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="support-risk"
                      checked={data.preWork?.supportRisk || false}
                      onCheckedChange={(checked) => handleCheckboxChange("preWork", "supportRisk", checked as boolean)}
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="support-risk" className="text-sm whitespace-nowrap font-medium">
                      고정지지대 이탈의 위험성
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="load-appropriateness"
                      checked={data.preWork?.loadAppropriateness || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "loadAppropriateness", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="load-appropriateness" className="text-sm whitespace-nowrap font-medium">
                      정격하중 범위 내 적재물 적정성
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="chain-damage"
                      checked={data.preWork?.chainDamage || false}
                      onCheckedChange={(checked) => handleCheckboxChange("preWork", "chainDamage", checked as boolean)}
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="chain-damage" className="text-sm font-medium">
                      체인 또는 훅의 변형, 파손 등의 균열
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="gantry-stopper"
                      checked={data.preWork?.gantryStopper || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "gantryStopper", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="gantry-stopper" className="text-sm whitespace-nowrap font-medium">
                      (겐트리크레인) 주행로 스토퍼 설치
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 작업완료 확인 */}
          <div className="border-l-4 border-green-400 pl-4">
            <h4 className="font-black mb-4 text-green-800">■ 작업완료 확인</h4>
            <div className="bg-green-50 p-4 rounded-lg border space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="fall-prevention"
                  checked={data.completion?.fallPrevention || false}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("completion", "fallPrevention", checked as boolean)
                  }
                  className="w-5 h-5 border-2 border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label htmlFor="fall-prevention" className="text-sm whitespace-nowrap font-medium">
                  낙하/전도 예방 조치
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="site-cleanup"
                  checked={data.completion?.siteCleanup || false}
                  onCheckedChange={(checked) => handleCheckboxChange("completion", "siteCleanup", checked as boolean)}
                  className="w-5 h-5 border-2 border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label htmlFor="site-cleanup" className="text-sm whitespace-nowrap font-medium">
                  현장 정리정돈 상태
                </Label>
              </div>
            </div>
          </div>

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
