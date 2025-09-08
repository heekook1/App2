"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface HighAltitudeWorkPermitProps {
  data: any
  onChange: (data: any) => void
}

export default function HighAltitudeWorkPermit({ data, onChange }: HighAltitudeWorkPermitProps) {
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
          <CardTitle className="text-lg text-blue-700 font-black">고소작업 안전 점검 Check List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* 작업 전 */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-black mb-4 text-blue-800">■ 작업 전</h4>
            <div className="space-y-4">
              <div className="space-y-3">
                <h5 className="font-black text-sm text-blue-700">비계 (이동식비계)</h5>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="safety-harness"
                      checked={data.preWork?.safetyHarness || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "safetyHarness", checked as boolean)
                      }
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="safety-harness" className="text-sm whitespace-nowrap">
                      안전대 착용 및 안전대 부착설비 설치
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="opening-protection"
                      checked={data.preWork?.openingProtection || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "openingProtection", checked as boolean)
                      }
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="opening-protection" className="text-sm whitespace-nowrap">
                      개구부 추락 위험 방지 조치
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="clamp-connection"
                      checked={data.preWork?.clampConnection || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "clampConnection", checked as boolean)
                      }
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="clamp-connection" className="text-sm whitespace-nowrap">
                      클램프·핀 등 연결 및 고정상태
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="work-platform"
                      checked={data.preWork?.workPlatform || false}
                      onCheckedChange={(checked) => handleCheckboxChange("preWork", "workPlatform", checked as boolean)}
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="work-platform" className="text-sm whitespace-nowrap">
                      작업발판 설치 및 고정상태
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="safety-rail"
                      checked={data.preWork?.safetyRail || false}
                      onCheckedChange={(checked) => handleCheckboxChange("preWork", "safetyRail", checked as boolean)}
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="safety-rail" className="text-sm whitespace-nowrap">
                      안전난간대 설치 및 고정상태
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="load-capacity"
                      checked={data.preWork?.loadCapacity || false}
                      onCheckedChange={(checked) => handleCheckboxChange("preWork", "loadCapacity", checked as boolean)}
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="load-capacity" className="text-sm whitespace-nowrap">
                      작업발판 최대 적재하중 표지 설치
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="wheel-outrigger"
                      checked={data.preWork?.wheelOutrigger || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "wheelOutrigger", checked as boolean)
                      }
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="wheel-outrigger" className="text-sm whitespace-nowrap">
                      (이동식) 바퀴고정 및 아웃트리거 설치
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="ladder-installation"
                      checked={data.preWork?.ladderInstallation || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "ladderInstallation", checked as boolean)
                      }
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="ladder-installation" className="text-sm whitespace-nowrap">
                      (이동식) 사다리 설치 및 고정상태
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-black text-sm text-blue-700">고소작업대 (시저형)</h5>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="safety-devices"
                      checked={data.preWork?.safetyDevices || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "safetyDevices", checked as boolean)
                      }
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="safety-devices" className="text-sm whitespace-nowrap">
                      안전방호장치 설치 및 작동상태
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="safety-certification"
                      checked={data.preWork?.safetyCertification || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "safetyCertification", checked as boolean)
                      }
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="safety-certification" className="text-sm whitespace-nowrap">
                      안전인증 및 안전검사 필증확인
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="ground-obstacles"
                      checked={data.preWork?.groundObstacles || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "groundObstacles", checked as boolean)
                      }
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="ground-obstacles" className="text-sm whitespace-nowrap">
                      작업 구획 지반·장애물 확인
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="signal-control"
                      checked={data.preWork?.signalControl || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "signalControl", checked as boolean)
                      }
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="signal-control" className="text-sm whitespace-nowrap">
                      신호수 배치 및 출입 통제
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="harness-rail"
                      checked={data.preWork?.harnessRail || false}
                      onCheckedChange={(checked) => handleCheckboxChange("preWork", "harnessRail", checked as boolean)}
                      className="w-5 h-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="harness-rail" className="text-sm whitespace-nowrap">
                      안전대 착용 및 안전난간 설치
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
                  id="equipment-storage"
                  checked={data.completion?.equipmentStorage || false}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("completion", "equipmentStorage", checked as boolean)
                  }
                  className="w-5 h-5 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label htmlFor="equipment-storage" className="text-sm whitespace-nowrap">
                  지정보관소 배치 및 고정 상태
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="fall-prevention"
                  checked={data.completion?.fallPrevention || false}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("completion", "fallPrevention", checked as boolean)
                  }
                  className="w-5 h-5 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label htmlFor="fall-prevention" className="text-sm whitespace-nowrap">
                  관계자 외 작업자 추락예방조치
                </Label>
              </div>
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
