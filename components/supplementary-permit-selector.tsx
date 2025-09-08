"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Zap, Shovel, Cake as Crane, Mountain, Radiation, Plus, X } from "lucide-react"
import ConfinedSpacePermit from "./confined-space-permit"
import ElectricalWorkPermit from "./electrical-work-permit"
import ExcavationWorkPermit from "./excavation-work-permit"
import HighAltitudeWorkPermit from "./high-altitude-work-permit"
import HeavyEquipmentPermit from "./heavy-equipment-permit"
import ConstructionMachineryPermit from "./construction-machinery-permit"

interface SupplementaryPermit {
  id: string
  type: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

const supplementaryPermits: SupplementaryPermit[] = [
  {
    id: "confined-space",
    type: "밀폐공간출입",
    title: "밀폐공간 출입",
    description: "밀폐된 공간에서의 작업 시 필요한 안전 조치",
    icon: <Building2 className="w-6 h-6" />,
    color: "bg-blue-500",
  },
  {
    id: "electrical",
    type: "정전작업",
    title: "정전 작업",
    description: "전기 설비 작업 시 필요한 안전 조치",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-yellow-500",
  },
  {
    id: "excavation",
    type: "굴착작업",
    title: "굴착 작업",
    description: "땅을 파는 작업 시 필요한 안전 조치",
    icon: <Shovel className="w-6 h-6" />,
    color: "bg-orange-500",
  },
  {
    id: "heavy-equipment",
    type: "중장비사용",
    title: "중장비 사용",
    description: "크레인, 지게차 등 중장비 사용 시 안전 조치",
    icon: <Crane className="w-6 h-6" />,
    color: "bg-purple-500",
  },
  {
    id: "high-altitude",
    type: "고소작업",
    title: "고소 작업",
    description: "높은 곳에서의 작업 시 필요한 안전 조치",
    icon: <Mountain className="w-6 h-6" />,
    color: "bg-green-500",
  },
  {
    id: "construction-machinery",
    type: "차량계 건설기계 중장비 사용",
    title: "차량계 건설기계 중장비 사용",
    description: "항타기, 도로포장 건설기계 등 사용 시 안전 조치",
    icon: <Radiation className="w-6 h-6" />,
    color: "bg-red-500",
  },
]

interface SupplementaryPermitSelectorProps {
  selectedPermits: string[]
  onPermitToggle: (permitType: string) => void
  onPermitConfigure?: (permitType: string) => void
  supplementaryData: Record<string, any>
  onSupplementaryDataChange: (permitType: string, data: any) => void
}

export default function SupplementaryPermitSelector({
  selectedPermits,
  onPermitToggle,
  onPermitConfigure,
  supplementaryData,
  onSupplementaryDataChange,
}: SupplementaryPermitSelectorProps) {
  const renderSupplementaryForm = (permitType: string) => {
    const data = supplementaryData[permitType] || {}
    const onChange = (newData: any) => onSupplementaryDataChange(permitType, newData)

    switch (permitType) {
      case "밀폐공간출입":
        return <ConfinedSpacePermit data={data} onChange={onChange} />
      case "정전작업":
        return <ElectricalWorkPermit data={data} onChange={onChange} />
      case "굴착작업":
        return <ExcavationWorkPermit data={data} onChange={onChange} />
      case "고소작업":
        return <HighAltitudeWorkPermit data={data} onChange={onChange} />
      case "중장비사용":
        return <HeavyEquipmentPermit data={data} onChange={onChange} />
      case "차량계 건설기계 중장비 사용":
        return <ConstructionMachineryPermit data={data} onChange={onChange} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {supplementaryPermits.map((permit) => {
          const isSelected = selectedPermits.includes(permit.type)

          return (
            <Card
              key={permit.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => onPermitToggle(permit.type)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`${permit.color} rounded-lg p-2 text-white flex-shrink-0`}>{permit.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">{permit.title}</h3>
                      {isSelected ? (
                        <X className="w-4 h-4 text-primary" />
                      ) : (
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{permit.description}</p>
                    {isSelected && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        선택됨
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedPermits.length > 0 && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">선택된 보조작업허가서:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedPermits.map((permitType) => {
              const permit = supplementaryPermits.find((p) => p.type === permitType)
              return (
                <Badge key={permitType} variant="secondary" className="text-xs">
                  {permit?.title || permitType}
                </Badge>
              )
            })}
          </div>
        </div>
      )}

      {selectedPermits.map((permitType) => (
        <div key={permitType} className="mt-6">
          {renderSupplementaryForm(permitType)}
        </div>
      ))}
    </div>
  )
}
