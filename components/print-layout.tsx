"use client"
import type { Permit } from "@/lib/permit-store-supabase"

interface PrintLayoutProps {
  permit: Permit
}

export function PrintLayout({ permit }: PrintLayoutProps) {
  // Use data field instead of formData
  const formData = permit.data || formData || {}
  const getStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return "임시저장"
      case "pending":
        return "결재대기"
      case "in-progress":
        return "결재진행중"
      case "approved":
        return "승인완료"
      case "rejected":
        return "반려"
      default:
        return status
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "general":
        return "일반위험 안전작업허가서"
      case "fire":
        return "화기작업 안전작업허가서"
      case "supplementary":
        return "보조작업 허가서"
      default:
        return type
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="print-layout hidden print:block">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .print-layout {
            display: block !important;
            font-size: 12px;
            line-height: 1.4;
            color: black;
            background: white;
          }
          
          .print-header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            page-break-inside: avoid;
          }
          
          .print-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .print-subtitle {
            font-size: 14px;
            margin-bottom: 10px;
          }
          
          .print-section {
            margin-bottom: 20px;
            border: 1px solid #000;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          .print-section-header {
            background-color: #f0f0f0;
            padding: 8px;
            font-weight: bold;
            border-bottom: 1px solid #000;
            page-break-after: avoid;
          }
          
          .print-section-content {
            padding: 10px;
            page-break-inside: avoid;
          }
          
          .print-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 10px;
          }
          
          .print-field {
            margin-bottom: 8px;
          }
          
          .print-field-label {
            font-weight: bold;
            margin-bottom: 2px;
          }
          
          .print-field-value {
            border-bottom: 1px solid #ccc;
            padding-bottom: 2px;
            min-height: 16px;
          }
          
          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
            page-break-inside: avoid;
          }
          
          .print-table th,
          .print-table td {
            border: 1px solid #000;
            padding: 4px;
            text-align: left;
            font-size: 10px;
          }
          
          .print-table th {
            background-color: #f0f0f0;
            font-weight: bold;
            page-break-after: avoid;
          }
          
          .print-table tr {
            page-break-inside: avoid;
          }
          
          .print-checkbox {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 1px solid #000;
            margin-right: 5px;
            text-align: center;
            line-height: 10px;
          }
          
          .print-checkbox.checked::after {
            content: "✓";
          }
          
          .print-footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            page-break-inside: avoid;
          }
          
          /* 연장작업허가와 작업완료 확인 섹션의 개별 항목들도 페이지 브레이크 방지 */
          .extension-item {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            padding: 8px;
          }
        }
      `}} />

      <div className="print-header">
        <div className="print-title">{getTypeLabel(permit.type)}</div>
        <div className="print-subtitle">Work Safety Permit</div>
        <div>허가서 번호: {permit.id}</div>
        <div>상태: {getStatusText(permit.status)}</div>
      </div>

      <div className="print-section">
        <div className="print-section-header">1. 기본정보</div>
        <div className="print-section-content">
          <table className="print-table">
            <tbody>
              <tr>
                <td style={{ fontWeight: "bold" }}>담당자</td>
                <td>{formData?.manager || ""}</td>
                <td style={{ fontWeight: "bold" }}>담당부서</td>
                <td>{formData?.department || permit.requester.department}</td>
                <td style={{ fontWeight: "bold" }}>작업책임자</td>
                <td>{formData?.workSupervisor || ""}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold" }}>허가번호</td>
                <td>{permit.id}</td>
                <td style={{ fontWeight: "bold", gridColumn: "span 2" }}>작업승인 유효일시</td>
                <td>{formData?.validStartTime ? formatDate(formData.validStartTime) : ""}</td>
                <td>{formData?.validEndTime ? formatDate(formData.validEndTime) : ""}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold" }}>작업명</td>
                <td style={{ gridColumn: "span 5" }}>{permit.title}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="print-section">
        <div className="print-section-header">2. 위치정보</div>
        <div className="print-section-content">
          <table className="print-table">
            <tbody>
              <tr>
                <td style={{ fontWeight: "bold" }}>TM 번호</td>
                <td>{formData?.tmNumber || ""}</td>
                <td style={{ fontWeight: "bold" }}>작업 장소</td>
                <td>{formData?.workLocation || ""}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold" }}>장치 번호</td>
                <td>{formData?.deviceNumber || ""}</td>
                <td style={{ fontWeight: "bold" }}>장치명</td>
                <td>{formData?.deviceName || ""}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold" }}>작업개요</td>
                <td style={{ gridColumn: "span 3" }}>{formData?.workOverview || ""}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="print-section">
        <div className="print-section-header">3. 작업정보</div>
        <div className="print-section-content">
          <div style={{ marginBottom: "10px" }}>
            <strong>구분:</strong>
            {formData?.workType?.map((type: string) => (
              <span key={type} style={{ marginLeft: "10px" }}>
                <span className="print-checkbox checked"></span>
                {type}
              </span>
            ))}
          </div>
          <div>
            <strong>보충허가 종류:</strong>
            {formData?.supplementaryPermitType?.map((type: string) => (
              <span key={type} style={{ marginLeft: "10px" }}>
                <span className="print-checkbox checked"></span>
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="print-section">
        <div className="print-section-header">4. 안전조치</div>
        <div className="print-section-content">
          <div style={{ marginBottom: "10px" }}>
            {formData?.safetyMeasures?.map((measure: string) => (
              <span key={measure} style={{ display: "inline-block", marginRight: "15px", marginBottom: "5px" }}>
                <span className="print-checkbox checked"></span>
                {measure}
              </span>
            ))}
          </div>
          <div style={{ marginTop: "10px" }}>
            <strong>개인 보호구:</strong>
            {formData?.personalProtectiveEquipment?.map((ppe: string) => (
              <span key={ppe} style={{ marginLeft: "10px" }}>
                <span className="print-checkbox checked"></span>
                {ppe}
              </span>
            ))}
          </div>
          <div style={{ marginTop: "10px" }}>
            <strong>첨부 서류:</strong>
            {formData?.attachedDocuments?.map((doc: string) => (
              <span key={doc} style={{ marginLeft: "10px" }}>
                <span className="print-checkbox checked"></span>
                {doc}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="print-section">
        <div className="print-section-header">5. 안전작업 승인</div>
        <div className="print-section-content">
          <table className="print-table">
            <thead>
              <tr>
                <th>구분</th>
                <th>이름</th>
                <th>상태</th>
                <th>승인일시</th>
                <th>의견</th>
              </tr>
            </thead>
            <tbody>
              {permit.approvers && permit.approvers.length > 0 ? (
                permit.approvers.map((approver, index) => (
                <tr key={index}>
                  <td>{approver.role}</td>
                  <td>{approver.name}</td>
                  <td>
                    {approver.status === "approved"
                      ? "승인"
                      : approver.status === "rejected"
                        ? "반려"
                        : index === permit.currentApproverIndex
                          ? "대기중"
                          : "미처리"}
                  </td>
                  <td>{approver.approvedAt ? formatDate(approver.approvedAt) : ""}</td>
                  <td>{approver.comments || ""}</td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>결재자 정보 없음</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="print-section">
        <div className="print-section-header">6. 연장작업허가</div>
        <div className="print-section-content">
          {formData?.extensions && formData.extensions.length > 0 ? (
            formData.extensions.map((extension: any, index: number) => (
              <div key={index} className="extension-item">
                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>연장 #{index + 1}</div>
                <div style={{ marginBottom: "5px" }}>
                  <strong>연장 요청시간:</strong> {extension.requestTime ? formatDate(extension.requestTime) : ""}
                </div>
                <div style={{ marginBottom: "5px" }}>
                  <strong>특이사항:</strong> {extension.specialNotes || ""}
                </div>
                <table className="print-table">
                  <thead>
                    <tr>
                      <th>구분</th>
                      <th>확인결과</th>
                      <th>미비조치</th>
                      <th>확인시간</th>
                      <th>이름</th>
                      <th>서명</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>담당자</td>
                      <td>{extension.workerCheck || ""}</td>
                      <td>{extension.workerAction || ""}</td>
                      <td>{extension.workerTime || ""}</td>
                      <td>{extension.workerName || ""}</td>
                      <td>{extension.workerSignature || ""}</td>
                    </tr>
                    <tr>
                      <td>교대그룹장</td>
                      <td>{extension.supervisorCheck || ""}</td>
                      <td>{extension.supervisorAction || ""}</td>
                      <td>{extension.supervisorTime || ""}</td>
                      <td>{extension.supervisorName || ""}</td>
                      <td>{extension.supervisorSignature || ""}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <table className="print-table">
              <thead>
                <tr>
                  <th>구분</th>
                  <th>확인결과</th>
                  <th>미비조치</th>
                  <th>확인시간</th>
                  <th>이름</th>
                  <th>서명</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>담당자</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>교대그룹장</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="print-section">
        <div className="print-section-header">7. 작업완료 확인</div>
        <div className="print-section-content">
          {formData?.completion ? (
            <>
              <div style={{ marginBottom: "10px" }}>
                <strong>작업완료시간:</strong>{" "}
                {formData.completion.completionTime ? formatDate(formData.completion.completionTime) : ""}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>특이사항:</strong> {formData.completion.specialNotes || ""}
              </div>
              <table className="print-table">
                <thead>
                  <tr>
                    <th>구분</th>
                    <th>확인결과</th>
                    <th>조치결과</th>
                    <th>확인시간</th>
                    <th>이름</th>
                    <th>서명</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>담당자</td>
                    <td>{formData.completion.workerCheck || ""}</td>
                    <td>{formData.completion.workerAction || ""}</td>
                    <td>{formData.completion.workerTime || ""}</td>
                    <td>{formData.completion.workerName || ""}</td>
                    <td>{formData.completion.workerSignature || ""}</td>
                  </tr>
                  <tr>
                    <td>담당팀장</td>
                    <td>{formData.completion.teamLeaderCheck || ""}</td>
                    <td>{formData.completion.teamLeaderAction || ""}</td>
                    <td>{formData.completion.teamLeaderTime || ""}</td>
                    <td>{formData.completion.teamLeaderName || ""}</td>
                    <td>{formData.completion.teamLeaderSignature || ""}</td>
                  </tr>
                  <tr>
                    <td>교대그룹장</td>
                    <td>{formData.completion.supervisorCheck || ""}</td>
                    <td>{formData.completion.supervisorAction || ""}</td>
                    <td>{formData.completion.supervisorTime || ""}</td>
                    <td>{formData.completion.supervisorName || ""}</td>
                    <td>{formData.completion.supervisorSignature || ""}</td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            <>
              <div style={{ marginBottom: "10px" }}>
                <strong>작업완료시간:</strong> _______________
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>특이사항:</strong> _______________
              </div>
              <table className="print-table">
                <thead>
                  <tr>
                    <th>구분</th>
                    <th>확인결과</th>
                    <th>조치결과</th>
                    <th>확인시간</th>
                    <th>이름</th>
                    <th>서명</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>담당자</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>담당팀장</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>교대그룹장</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      <div className="print-footer">
        <div>작업허가서 시스템 - 안전한 작업을 위한 전산화 결재시스템</div>
        <div>출력일시: {new Date().toLocaleString("ko-KR")}</div>
      </div>

      {/* 보충작업허가서가 있는 경우 페이지 구분 후 출력 */}
      {formData?.supplementaryPermitType && formData.supplementaryPermitType.length > 0 && (
        <>
          <div style={{ pageBreakBefore: "always" }}></div>
          {formData.supplementaryPermitType.map((permitType: string) => (
            <div key={permitType} style={{ pageBreakBefore: permitType !== formData.supplementaryPermitType[0] ? "always" : "auto" }}>
              <div className="print-header">
                <div className="print-title">보충작업허가서 - {getSupplementaryPermitTitle(permitType)}</div>
                <div className="print-subtitle">Supplementary Work Permit</div>
                <div>허가서 번호: {permit.id}-SUP</div>
                <div>상태: {getStatusText(permit.status)}</div>
              </div>

              <div className="print-section">
                <div className="print-section-header">1. 기본정보</div>
                <div className="print-section-content">
                  <table className="print-table">
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>일반허가서 번호</td>
                        <td>{permit.id}</td>
                        <td style={{ fontWeight: "bold" }}>작업명</td>
                        <td>{permit.title}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>보충허가 유형</td>
                        <td>{getSupplementaryPermitTitle(permitType)}</td>
                        <td style={{ fontWeight: "bold" }}>작업책임자</td>
                        <td>{formData?.workSupervisor || ""}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 밀폐공간 작업 */}
              {permitType === "confined-space" && (
                <>
                  <div className="print-section">
                    <div className="print-section-header">2. 밀폐공간 안전점검</div>
                    <div className="print-section-content">
                      <div style={{ marginBottom: "15px" }}>
                        <strong>작업 전 점검사항:</strong>
                        <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                          {formData?.preWork?.oxygenLevel && <div>• 산소농도 측정 완료</div>}
                          {formData?.preWork?.gasCheck && <div>• 가연성가스 측정 완료</div>}
                          {formData?.preWork?.ventilation && <div>• 환기장치 설치 완료</div>}
                          {formData?.preWork?.rescueEquipment && <div>• 구조장비 준비 완료</div>}
                          {formData?.preWork?.communicationDevice && <div>• 통신장비 확인 완료</div>}
                          {formData?.preWork?.accessControl && <div>• 출입통제 조치 완료</div>}
                          {formData?.preWork?.watcher && <div>• 감시자 배치 완료</div>}
                          {formData?.preWork?.emergencyPlan && <div>• 비상계획 수립 완료</div>}
                        </div>
                      </div>
                      <table className="print-table">
                        <thead>
                          <tr>
                            <th>측정항목</th>
                            <th>측정값</th>
                            <th>측정시간</th>
                            <th>측정자</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData?.measurements?.map((m: any, idx: number) => (
                            <tr key={idx}>
                              <td>{m.item || ""}</td>
                              <td>{m.value || ""}</td>
                              <td>{m.time || ""}</td>
                              <td>{m.measurer || ""}</td>
                            </tr>
                          )) || (
                            <>
                              <tr>
                                <td>산소농도</td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>가연성가스</td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>유해가스</td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                      <div style={{ marginTop: "10px" }}>
                        <strong>감시자:</strong> {formData?.watcherName || ""}
                      </div>
                      <div style={{ marginTop: "5px" }}>
                        <strong>비상연락처:</strong> {formData?.emergencyContact || ""}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* 고소작업 */}
              {permitType === "high-work" && (
                <>
                  <div className="print-section">
                    <div className="print-section-header">2. 고소작업 안전점검</div>
                    <div className="print-section-content">
                      <div style={{ marginBottom: "15px" }}>
                        <strong>작업 전 점검사항:</strong>
                        <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                          {formData?.preWork?.safetyHarness && <div>• 안전대(안전그네) 착용</div>}
                          {formData?.preWork?.openingProtection && <div>• 개구부 방호조치 (덮개, 안전난간 설치)</div>}
                          {formData?.preWork?.clampConnection && <div>• 승강설비 클램프 연결상태 확인</div>}
                          {formData?.preWork?.workPlatform && <div>• 작업발판 설치상태 확인</div>}
                          {formData?.preWork?.safetyRail && <div>• 안전난간 (상부, 중간) 설치</div>}
                          {formData?.preWork?.loadCapacity && <div>• 작업발판 및 통로 적재하중 확인</div>}
                          {formData?.preWork?.wheelOutrigger && <div>• 이동식비계 바퀴고정 또는 아웃트리거 설치</div>}
                          {formData?.preWork?.ladderInstallation && <div>• 사다리 설치상태 확인</div>}
                          {formData?.preWork?.safetyDevices && <div>• 고소작업대/차 안전장치 작동확인</div>}
                          {formData?.preWork?.safetyCertification && <div>• 안전인증품(비계, 안전대) 사용</div>}
                          {formData?.preWork?.groundObstacles && <div>• 지상 장애물 제거</div>}
                          {formData?.preWork?.signalControl && <div>• 신호 및 통제수 배치</div>}
                          {formData?.preWork?.harnessRail && <div>• 안전대, 안전난간 부착설비 설치</div>}
                        </div>
                      </div>
                      <table className="print-table">
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>작업높이</td>
                            <td>{formData?.workHeight || ""} m</td>
                            <td style={{ fontWeight: "bold" }}>작업플랫폼</td>
                            <td>{formData?.platform || ""}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>날씨상태</td>
                            <td>{formData?.weather || ""}</td>
                            <td style={{ fontWeight: "bold" }}>풍속</td>
                            <td>{formData?.windSpeed || ""} m/s</td>
                          </tr>
                        </tbody>
                      </table>
                      <div style={{ marginTop: "15px" }}>
                        <strong>작업 완료 후 점검사항:</strong>
                        <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                          {formData?.completion?.equipmentStorage && <div>• 공구, 자재 등 정리정돈</div>}
                          {formData?.completion?.fallPrevention && <div>• 상부에서 물건 낙하방지 조치</div>}
                          {formData?.completion?.siteCleanup && <div>• 작업장 주변 정리</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* 굴착작업 */}
              {permitType === "excavation" && (
                <>
                  <div className="print-section">
                    <div className="print-section-header">2. 굴착작업 안전점검</div>
                    <div className="print-section-content">
                      <div style={{ marginBottom: "15px" }}>
                        <strong>작업 전 점검사항:</strong>
                        <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                          {formData?.preWork?.buriedPipes && <div>• 매설배관 위치 파악 완료</div>}
                          {formData?.preWork?.siteCondition && <div>• 작업장 지반상태 확인 완료</div>}
                          {formData?.preWork?.collapsePrevention && <div>• 붕괴방지 개천판 설치</div>}
                          {formData?.preWork?.accessControl && <div>• 작업장 근처 통행제한 조치</div>}
                          {formData?.preWork?.weatherPrevention && <div>• 기후조건(비, 눈)에 따른 붕괴방지 조치</div>}
                          {formData?.preWork?.buriedProtection && <div>• 매설배관 보호조치</div>}
                          {formData?.preWork?.structureProtection && <div>• 건물, 구조물 근처 보호조치</div>}
                          {formData?.preWork?.slopeProtection && <div>• 굴착면 경사면 및 사면 붕괴방지 조치</div>}
                          {formData?.preWork?.passageInstallation && <div>• 굴착장소 통로설치</div>}
                          {formData?.preWork?.materialStorage && <div>• 굴착토사, 자재 적치장소 확보</div>}
                          {formData?.preWork?.perimeter && <div>• 굴착장소 주변 가설펜스</div>}
                        </div>
                      </div>
                      <table className="print-table">
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>굴착깊이</td>
                            <td>{formData?.excavationDepth || ""} m</td>
                            <td style={{ fontWeight: "bold" }}>굴착폭</td>
                            <td>{formData?.excavationWidth || ""} m</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>굴착방법</td>
                            <td colSpan={3}>{formData?.excavationMethod || ""}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>지하매설물</td>
                            <td colSpan={3}>{formData?.undergroundUtilities || ""}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div style={{ marginTop: "15px" }}>
                        <strong>작업 완료 후 점검사항:</strong>
                        <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                          {formData?.completion?.backfill && <div>• 되메우기 완료</div>}
                          {formData?.completion?.cleanup && <div>• 주변 정리정돈</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* 중장비 작업 */}
              {permitType === "heavy-equipment" && (
                <>
                  <div className="print-section">
                    <div className="print-section-header">2. 중장비 작업 안전점검</div>
                    <div className="print-section-content">
                      <div style={{ marginBottom: "15px" }}>
                        <strong>공통 안전조치:</strong>
                        <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                          {formData?.preWork?.operatorQualification && <div>• 운전자격 확인</div>}
                          {formData?.preWork?.signalPerson && <div>• 신호수 배치</div>}
                          {formData?.preWork?.routeCheck && <div>• 이동경로 확인</div>}
                          {formData?.preWork?.supervisorGuide && <div>• 작업지휘자(감독자) 유도</div>}
                          {formData?.preWork?.parkingPrevention && <div>• 야간 또는 작업종료 시 사면 주차방지 조치</div>}
                        </div>
                      </div>
                      
                      {formData?.preWork?.forkliftSafety && (
                        <div style={{ marginBottom: "15px" }}>
                          <strong>지게차:</strong>
                          <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                            <div>• 류트 및 포크 착탈방지 장치 설치</div>
                          </div>
                        </div>
                      )}
                      
                      <div style={{ marginBottom: "15px" }}>
                        <strong>크레인 안전조치:</strong>
                        <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                          {formData?.preWork?.craneOperator && <div>• 크레인 조종사 자격증 확인</div>}
                          {formData?.preWork?.ratedLoad && <div>• 정격하중 표시</div>}
                          {formData?.preWork?.safetyDevices && <div>• 안전장치 이상 유무 확인</div>}
                          {formData?.preWork?.hookDevice && <div>• 후크 해지장치 확인</div>}
                          {formData?.preWork?.weatherCondition && <div>• 기상조건(풍속, 비, 눈, 안개) 확인</div>}
                          {formData?.preWork?.safetyInspection && <div>• 크레인 안전검사 여부</div>}
                          {formData?.preWork?.workSupervisor && <div>• 작업지휘자(감독자) 배치</div>}
                          {formData?.preWork?.slingEquipment && <div>• 슬링기구의 안전계수 확인</div>}
                          {formData?.preWork?.craneGround && <div>• 크레인의 설치면 및 지반 상태확인</div>}
                          {formData?.preWork?.craneProhibition && <div>• 크레인 작업반경 내 다른 작업금지</div>}
                          {formData?.preWork?.hoistStopper && <div>• 호이스트크레인의 레일스토퍼 및 차량계 확인</div>}
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: "15px" }}>
                        <strong>간트리크레인 안전조치:</strong>
                        <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                          {formData?.preWork?.supportRisk && <div>• 지지대 위험성 유무</div>}
                          {formData?.preWork?.loadAppropriateness && <div>• 하중물 미끌림 및 적정하중 여부</div>}
                          {formData?.preWork?.chainDamage && <div>• 체인, 와이어로프 손상 여부</div>}
                          {formData?.preWork?.gantryStopper && <div>• 간트리크레인 과부하방지장치</div>}
                        </div>
                      </div>
                      
                      <table className="print-table">
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>장비종류</td>
                            <td>{formData?.equipmentType || ""}</td>
                            <td style={{ fontWeight: "bold" }}>장비번호</td>
                            <td>{formData?.equipmentNumber || ""}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>운전자</td>
                            <td>{formData?.operatorName || ""}</td>
                            <td style={{ fontWeight: "bold" }}>신호수</td>
                            <td>{formData?.signalPersonName || ""}</td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <div style={{ marginTop: "15px" }}>
                        <strong>작업 완료 후 점검사항:</strong>
                        <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                          {formData?.completion?.fallPrevention && <div>• 공구, 자재 등 낝하방지 조치</div>}
                          {formData?.completion?.siteCleanup && <div>• 작업장 주변 정리</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* 전기작업 */}
              {permitType === "electrical" && (
                <>
                  <div className="print-section">
                    <div className="print-section-header">2. 전기작업 안전점검</div>
                    <div className="print-section-content">
                      <div style={{ marginBottom: "15px" }}>
                        <strong>작업 전 - 정전작업:</strong>
                        <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                          {formData?.preWork?.switchCutoff && <div>• 스위치 차단 및 LOTO 체결 완료</div>}
                          {formData?.preWork?.powerCheck && <div>• 테스터기를 활용한 정전상태 확인</div>}
                          {formData?.preWork?.residualCharge && <div>• 검전기 등을 통한 잔류전하 확인</div>}
                          {formData?.preWork?.discharge && <div>• 방전기구를 활용한 방전</div>}
                          {formData?.preWork?.safetyDevice && <div>• 활선경보기 등 안전장치 착용</div>}
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: "15px" }}>
                        <strong>작업 중 - 활선작업:</strong>
                        <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                          {formData?.preWork?.approachDistance && <div>• 충전부 접근금지 거리 준수</div>}
                          {formData?.preWork?.liveWorkTools && <div>• 활선작업용 기구 사용</div>}
                          {formData?.preWork?.qualifiedWorker && <div>• 자격보유자 작업 시행</div>}
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: "15px" }}>
                        <strong>기타 안전조치:</strong>
                        <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                          {formData?.preWork?.grounding && <div>• 충분한 접지 실시</div>}
                          {formData?.preWork?.accessProhibition && <div>• 비관계자 출입금지</div>}
                        </div>
                      </div>
                      
                      <table className="print-table">
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>전압</td>
                            <td>{formData?.voltage || ""} V</td>
                            <td style={{ fontWeight: "bold" }}>차단기 위치</td>
                            <td>{formData?.breakerLocation || ""}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>작업장비</td>
                            <td colSpan={3}>{formData?.equipment || ""}</td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <div style={{ marginTop: "15px" }}>
                        <strong>작업 완료 후:</strong>
                        <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                          {formData?.completion?.breakerRecovery && <div>• 누전차단기 투입 획복 조치</div>}
                          {formData?.completion?.siteCleanup && <div>• 주변 정리정돈</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* 방사선 작업 */}
              {permitType === "radiation" && (
                <>
                  <div className="print-section">
                    <div className="print-section-header">2. 방사선 작업 안전점검</div>
                    <div className="print-section-content">
                      <div style={{ marginBottom: "15px" }}>
                        <strong>작업 전 점검사항:</strong>
                        <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                          {formData?.preWork?.radiationSafety && <div>• 방사선 안전관리 측정 완료</div>}
                          {formData?.preWork?.dosimeter && <div>• 개인선량계 착용</div>}
                          {formData?.preWork?.shielding && <div>• 차폐조치 설치</div>}
                          {formData?.preWork?.controlledArea && <div>• 관리구역 설정</div>}
                          {formData?.preWork?.warningSign && <div>• 경고표지 부착</div>}
                        </div>
                      </div>
                      
                      <table className="print-table">
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>방사선원</td>
                            <td>{formData?.radiationSource || ""}</td>
                            <td style={{ fontWeight: "bold" }}>선량률</td>
                            <td>{formData?.doseRate || ""} mSv/h</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>방사선관리자</td>
                            <td>{formData?.radiationOfficer || ""}</td>
                            <td style={{ fontWeight: "bold" }}>작업시간</td>
                            <td>{formData?.workDuration || ""}</td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <div style={{ marginTop: "15px" }}>
                        <strong>작업 완료 후 점검사항:</strong>
                        <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                          {formData?.completion?.radiationCheck && <div>• 방사선 선량 측정 완료</div>}
                          {formData?.completion?.cleanup && <div>• 작업장 정리 완료</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="print-section">
                <div className="print-section-header">3. 보충작업 승인</div>
                <div className="print-section-content">
                  <table className="print-table">
                    <thead>
                      <tr>
                        <th>구분</th>
                        <th>이름</th>
                        <th>서명</th>
                        <th>일시</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>작업책임자</td>
                        <td>{formData?.workSupervisor || ""}</td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>안전관리자</td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// 보충작업허가서 유형별 제목 가져오기
function getSupplementaryPermitTitle(type: string) {
  switch (type) {
    case "confined-space":
      return "밀폐공간 작업"
    case "high-work":
      return "고소작업"
    case "excavation":
      return "굴착작업"
    case "heavy-equipment":
      return "중장비 작업"
    case "electrical":
      return "전기작업"
    case "radiation":
      return "방사선 작업"
    default:
      return type
  }
}
