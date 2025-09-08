"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ConfinedSpacePermitProps {
  data: any
  onChange: (data: any) => void
}

export default function ConfinedSpacePermit({ data, onChange }: ConfinedSpacePermitProps) {
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

  const handleArrayChange = (field: string, index: number, key: string, value: string) => {
    const newArray = [...(data[field] || [])]
    if (!newArray[index]) {
      newArray[index] = {}
    }
    newArray[index][key] = value
    onChange({
      ...data,
      [field]: newArray,
    })
  }

  const addArrayItem = (field: string, defaultItem: any) => {
    onChange({
      ...data,
      [field]: [...(data[field] || []), defaultItem],
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-blue-600 font-bold">밀폐공간 출입 작업 안전 점검 Check List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supervisor" className="font-bold">
                감시인
              </Label>
              <Input
                id="supervisor"
                value={data.supervisor || ""}
                onChange={(e) => handleInputChange("supervisor", e.target.value)}
                placeholder="감시인 이름"
                className="border-2 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="concentrationMeasurer" className="font-bold">
                농도측정자
              </Label>
              <Input
                id="concentrationMeasurer"
                value={data.concentrationMeasurer || ""}
                onChange={(e) => handleInputChange("concentrationMeasurer", e.target.value)}
                placeholder="농도측정자 이름"
                className="border-2 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="measurerQualification" className="font-bold">
                측정자자격
              </Label>
              <Input
                id="measurerQualification"
                value={data.measurerQualification || ""}
                onChange={(e) => handleInputChange("measurerQualification", e.target.value)}
                placeholder="자격증명"
                className="border-2 focus:border-blue-500"
              />
            </div>
          </div>

          {/* 작업 전 점검 */}
          <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <h4 className="font-bold mb-4 text-blue-800">■ 작업 전</h4>
            <div className="space-y-4">
              <div className="space-y-3">
                <h5 className="font-bold text-sm text-gray-800">감시인</h5>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="supervisor-assignment"
                    checked={data.preWork?.supervisorAssignment || false}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("preWork", "supervisorAssignment", checked as boolean)
                    }
                    className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor="supervisor-assignment" className="text-sm font-medium whitespace-nowrap">
                    감시인 지정 및 배치
                  </Label>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-sm text-gray-800">작업환경</h5>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="entry-prohibition-sign"
                      checked={data.preWork?.entryProhibitionSign || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "entryProhibitionSign", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="entry-prohibition-sign" className="text-sm font-medium whitespace-nowrap">
                      밀폐공간 작업 출입금지 표지 게시
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="ventilation-system"
                      checked={data.preWork?.ventilationSystem || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "ventilationSystem", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="ventilation-system" className="text-sm font-medium whitespace-nowrap">
                      급·배기 환기장치 설치
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="explosion-proof-equipment"
                      checked={data.preWork?.explosionProofEquipment || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "explosionProofEquipment", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="explosion-proof-equipment" className="text-sm font-medium whitespace-nowrap">
                      화재·폭발위험공간 방폭기구 사용
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="gas-concentration-measurement"
                      checked={data.preWork?.gasConcentrationMeasurement || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "gasConcentrationMeasurement", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="gas-concentration-measurement" className="text-sm font-medium whitespace-nowrap">
                      출입 전 산소 및 유해가스 농도 측정
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-sm text-gray-800">보호구</h5>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="respiratory-protection"
                      checked={data.preWork?.respiratoryProtection || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "respiratoryProtection", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="respiratory-protection" className="text-sm font-medium whitespace-nowrap">
                      호흡용 보호구 착용 상태 확인
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="protection-guidance"
                      checked={data.preWork?.protectionGuidance || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "protectionGuidance", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="protection-guidance" className="text-sm font-medium whitespace-nowrap">
                      보호구 착용방법 및 비상조치 안내
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="emergency-equipment"
                      checked={data.preWork?.emergencyEquipment || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("preWork", "emergencyEquipment", checked as boolean)
                      }
                      className="w-5 h-5 border-2 border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="emergency-equipment" className="text-sm font-medium whitespace-nowrap">
                      비상시 대피용 기구 비치
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 출입자 확인 */}
          <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
            <h4 className="font-bold mb-4 text-green-800">■ 출입자 확인</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-center font-bold text-sm whitespace-nowrap">
                      출입인원
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-bold text-sm whitespace-nowrap">
                      입실시간
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-bold text-sm whitespace-nowrap">
                      퇴실시간
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-bold text-sm whitespace-nowrap">
                      감시인 서명
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 8 }, (_, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        <Input
                          placeholder=""
                          value={data.entryRecords?.[index]?.person || ""}
                          onChange={(e) => handleArrayChange("entryRecords", index, "person", e.target.value)}
                          className="border-0 text-sm text-center"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          placeholder=""
                          value={data.entryRecords?.[index]?.entryTime || ""}
                          onChange={(e) => handleArrayChange("entryRecords", index, "entryTime", e.target.value)}
                          className="border-0 text-sm text-center"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          placeholder=""
                          value={data.entryRecords?.[index]?.exitTime || ""}
                          onChange={(e) => handleArrayChange("entryRecords", index, "exitTime", e.target.value)}
                          className="border-0 text-sm text-center"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          placeholder=""
                          value={data.entryRecords?.[index]?.supervisorSignature || ""}
                          onChange={(e) =>
                            handleArrayChange("entryRecords", index, "supervisorSignature", e.target.value)
                          }
                          className="border-0 text-sm text-center"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 가스농도 측정표 */}
          <div className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50">
            <h4 className="font-bold mb-4 text-orange-800">■ 가스농도 측정표</h4>
            <p className="text-sm text-gray-600 mb-4 font-medium">
              (O₂ : 19~23.5%, CO : 30ppm미만, H₂S : 10ppm미만, 가연성가스 : 20%LEL미만) ※ 4시간 주기로 측정
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-center font-bold text-sm whitespace-nowrap">
                      측정시간
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-bold text-sm whitespace-nowrap">
                      O₂
                      <br />
                      (18~23.5%)
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-bold text-sm whitespace-nowrap">
                      CO
                      <br />
                      (30ppm미만)
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-bold text-sm whitespace-nowrap">
                      H₂S
                      <br />
                      (10ppm미만)
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-bold text-sm whitespace-nowrap">
                      가연성가스
                      <br />
                      (20%LEL미만)
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-bold text-sm whitespace-nowrap">
                      측정자
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 15 }, (_, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        <Input
                          placeholder=""
                          value={data.gasMeasurements?.[index]?.time || ""}
                          onChange={(e) => handleArrayChange("gasMeasurements", index, "time", e.target.value)}
                          className="border-0 text-sm text-center"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          placeholder=""
                          value={data.gasMeasurements?.[index]?.o2 || ""}
                          onChange={(e) => handleArrayChange("gasMeasurements", index, "o2", e.target.value)}
                          className="border-0 text-sm text-center"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          placeholder=""
                          value={data.gasMeasurements?.[index]?.co || ""}
                          onChange={(e) => handleArrayChange("gasMeasurements", index, "co", e.target.value)}
                          className="border-0 text-sm text-center"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          placeholder=""
                          value={data.gasMeasurements?.[index]?.h2s || ""}
                          onChange={(e) => handleArrayChange("gasMeasurements", index, "h2s", e.target.value)}
                          className="border-0 text-sm text-center"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          placeholder=""
                          value={data.gasMeasurements?.[index]?.combustibleGas || ""}
                          onChange={(e) =>
                            handleArrayChange("gasMeasurements", index, "combustibleGas", e.target.value)
                          }
                          className="border-0 text-sm text-center"
                        />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <Input
                          placeholder=""
                          value={data.gasMeasurements?.[index]?.measurer || ""}
                          onChange={(e) => handleArrayChange("gasMeasurements", index, "measurer", e.target.value)}
                          className="border-0 text-sm text-center"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 작업완료 확인 */}
          <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
            <h4 className="font-bold mb-4 text-purple-800">■ 작업완료 확인</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-center font-bold text-sm whitespace-nowrap">항목</th>
                    <th className="border border-gray-300 p-3 text-center font-bold text-sm whitespace-nowrap">
                      점검사항
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-bold text-sm whitespace-nowrap">
                      점검결과
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-bold text-sm whitespace-nowrap">
                      미비사항
                    </th>
                    <th className="border border-gray-300 p-3 text-center font-bold text-sm whitespace-nowrap">
                      조치결과
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-3 text-center font-bold align-middle">인원</td>
                    <td className="border border-gray-300 p-3 font-bold whitespace-nowrap">
                      밀폐공간 내 잔류인원 확인
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <div className="flex items-center justify-center space-x-4">
                        <label className="flex items-center space-x-1">
                          <input
                            type="radio"
                            name="personnel-result"
                            value="양호"
                            checked={data.completion?.personnelResult === "양호"}
                            onChange={(e) => handleInputChange("completion.personnelResult", e.target.value)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm font-medium">양호</span>
                        </label>
                        <label className="flex items-center space-x-1">
                          <input
                            type="radio"
                            name="personnel-result"
                            value="미비"
                            checked={data.completion?.personnelResult === "미비"}
                            onChange={(e) => handleInputChange("completion.personnelResult", e.target.value)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm font-medium">미비</span>
                        </label>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        placeholder=""
                        value={data.completion?.personnelDeficiency || ""}
                        onChange={(e) => handleInputChange("completion.personnelDeficiency", e.target.value)}
                        className="border-0 text-sm text-center"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <label className="flex items-center justify-center space-x-1">
                        <input
                          type="checkbox"
                          checked={data.completion?.personnelAction || false}
                          onChange={(e) => handleInputChange("completion.personnelAction", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-bold">완료</span>
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 text-center font-bold align-middle">작업장 환경</td>
                    <td className="border border-gray-300 p-3 font-bold whitespace-nowrap">현장 정리정돈 상태</td>
                    <td className="border border-gray-300 p-2 text-center">
                      <div className="flex items-center justify-center space-x-4">
                        <label className="flex items-center space-x-1">
                          <input
                            type="radio"
                            name="environment-result"
                            value="양호"
                            checked={data.completion?.environmentResult === "양호"}
                            onChange={(e) => handleInputChange("completion.environmentResult", e.target.value)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm font-medium">양호</span>
                        </label>
                        <label className="flex items-center space-x-1">
                          <input
                            type="radio"
                            name="environment-result"
                            value="미비"
                            checked={data.completion?.environmentResult === "미비"}
                            onChange={(e) => handleInputChange("completion.environmentResult", e.target.value)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm font-medium">미비</span>
                        </label>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <Input
                        placeholder=""
                        value={data.completion?.environmentDeficiency || ""}
                        onChange={(e) => handleInputChange("completion.environmentDeficiency", e.target.value)}
                        className="border-0 text-sm text-center"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <label className="flex items-center justify-center space-x-1">
                        <input
                          type="checkbox"
                          checked={data.completion?.environmentAction || false}
                          onChange={(e) => handleInputChange("completion.environmentAction", e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-bold">완료</span>
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 작업완료시간 및 담당자 정보 */}
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="completion-time" className="font-bold">
                  작업완료시간
                </Label>
                <Input
                  id="completion-time"
                  value={data.completionTime || ""}
                  onChange={(e) => handleInputChange("completionTime", e.target.value)}
                  placeholder="작업완료시간 입력"
                  className="border-2 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold">담당자</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs font-bold">팀명</Label>
                      <Input
                        value={data.teamName || ""}
                        onChange={(e) => handleInputChange("teamName", e.target.value)}
                        placeholder="팀명"
                        className="border-2 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-bold">성명</Label>
                      <Input
                        value={data.workerName || ""}
                        onChange={(e) => handleInputChange("workerName", e.target.value)}
                        placeholder="성명"
                        className="border-2 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
