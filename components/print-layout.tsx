"use client"
import type { Permit } from "@/lib/permit-store"

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
      <style jsx>{`
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
      `}</style>

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
                      <table className="print-table">
                        <thead>
                          <tr>
                            <th>점검항목</th>
                            <th>기준</th>
                            <th>측정값</th>
                            <th>확인</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>산소농도</td>
                            <td>18% ~ 23.5%</td>
                            <td>{formData?.confinedSpace?.oxygenLevel || ""}</td>
                            <td>{formData?.confinedSpace?.oxygenCheck ? "✓" : ""}</td>
                          </tr>
                          <tr>
                            <td>가연성가스</td>
                            <td>&lt; 10% LEL</td>
                            <td>{formData?.confinedSpace?.gasLevel || ""}</td>
                            <td>{formData?.confinedSpace?.gasCheck ? "✓" : ""}</td>
                          </tr>
                          <tr>
                            <td>유해가스</td>
                            <td>기준치 이하</td>
                            <td>{formData?.confinedSpace?.toxicLevel || ""}</td>
                            <td>{formData?.confinedSpace?.toxicCheck ? "✓" : ""}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div style={{ marginTop: "10px" }}>
                        <strong>감시자:</strong> {formData?.confinedSpace?.watcher || ""}
                      </div>
                      <div style={{ marginTop: "5px" }}>
                        <strong>비상연락처:</strong> {formData?.confinedSpace?.emergencyContact || ""}
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
                      <table className="print-table">
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>작업높이</td>
                            <td>{formData?.highWork?.height || ""} m</td>
                            <td style={{ fontWeight: "bold" }}>작업플랫폼</td>
                            <td>{formData?.highWork?.platform || ""}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>안전대 착용</td>
                            <td>{formData?.highWork?.harness ? "✓ 착용" : "미착용"}</td>
                            <td style={{ fontWeight: "bold" }}>안전난간 설치</td>
                            <td>{formData?.highWork?.guardrail ? "✓ 설치" : "미설치"}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>날씨상태</td>
                            <td>{formData?.highWork?.weather || ""}</td>
                            <td style={{ fontWeight: "bold" }}>풍속</td>
                            <td>{formData?.highWork?.windSpeed || ""} m/s</td>
                          </tr>
                        </tbody>
                      </table>
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
                      <table className="print-table">
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>굴착깊이</td>
                            <td>{formData?.excavation?.depth || ""} m</td>
                            <td style={{ fontWeight: "bold" }}>굴착폭</td>
                            <td>{formData?.excavation?.width || ""} m</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>지하매설물 확인</td>
                            <td>{formData?.excavation?.utilityCheck ? "✓ 확인" : "미확인"}</td>
                            <td style={{ fontWeight: "bold" }}>흙막이 설치</td>
                            <td>{formData?.excavation?.shoring ? "✓ 설치" : "미설치"}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>경사면 안정성</td>
                            <td>{formData?.excavation?.slopeStability || ""}</td>
                            <td style={{ fontWeight: "bold" }}>배수조치</td>
                            <td>{formData?.excavation?.drainage ? "✓ 완료" : "미완료"}</td>
                          </tr>
                        </tbody>
                      </table>
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
                      <table className="print-table">
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>장비종류</td>
                            <td>{formData?.heavyEquipment?.equipmentType || ""}</td>
                            <td style={{ fontWeight: "bold" }}>장비번호</td>
                            <td>{formData?.heavyEquipment?.equipmentNumber || ""}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>운전자</td>
                            <td>{formData?.heavyEquipment?.operator || ""}</td>
                            <td style={{ fontWeight: "bold" }}>자격증 확인</td>
                            <td>{formData?.heavyEquipment?.licenseCheck ? "✓ 확인" : "미확인"}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>신호수 배치</td>
                            <td>{formData?.heavyEquipment?.signalPerson || ""}</td>
                            <td style={{ fontWeight: "bold" }}>작업반경 통제</td>
                            <td>{formData?.heavyEquipment?.areaControl ? "✓ 통제" : "미통제"}</td>
                          </tr>
                        </tbody>
                      </table>
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
                      <table className="print-table">
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>전압</td>
                            <td>{formData?.electrical?.voltage || ""} V</td>
                            <td style={{ fontWeight: "bold" }}>차단기 위치</td>
                            <td>{formData?.electrical?.breakerLocation || ""}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>LOTO 시행</td>
                            <td>{formData?.electrical?.loto ? "✓ 시행" : "미시행"}</td>
                            <td style={{ fontWeight: "bold" }}>검전기 확인</td>
                            <td>{formData?.electrical?.voltageTest ? "✓ 확인" : "미확인"}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>절연장갑 착용</td>
                            <td>{formData?.electrical?.insulatedGloves ? "✓ 착용" : "미착용"}</td>
                            <td style={{ fontWeight: "bold" }}>접지 설치</td>
                            <td>{formData?.electrical?.grounding ? "✓ 설치" : "미설치"}</td>
                          </tr>
                        </tbody>
                      </table>
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
                      <table className="print-table">
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>방사선원</td>
                            <td>{formData?.radiation?.source || ""}</td>
                            <td style={{ fontWeight: "bold" }}>선량률</td>
                            <td>{formData?.radiation?.doseRate || ""} mSv/h</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>개인선량계 착용</td>
                            <td>{formData?.radiation?.dosimeter ? "✓ 착용" : "미착용"}</td>
                            <td style={{ fontWeight: "bold" }}>차폐조치</td>
                            <td>{formData?.radiation?.shielding ? "✓ 설치" : "미설치"}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>관리구역 설정</td>
                            <td>{formData?.radiation?.controlledArea ? "✓ 설정" : "미설정"}</td>
                            <td style={{ fontWeight: "bold" }}>방사선관리자</td>
                            <td>{formData?.radiation?.radiationOfficer || ""}</td>
                          </tr>
                        </tbody>
                      </table>
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
