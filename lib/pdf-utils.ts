// PDF generation utilities
export const generatePermitPDF = async (permit: any, permitType: string) => {
  // This would typically use a library like jsPDF or Puppeteer
  // For now, we'll simulate PDF generation

  const pdfContent = `
    작업허가서 PDF
    
    허가서 번호: ${permit.id}
    작업명: ${permit.title}
    작성자: ${permit.requester.name}
    부서: ${permit.requester.department}
    작성일: ${new Date(permit.createdAt).toLocaleDateString("ko-KR")}
    상태: ${permit.status}
    
    결재 현황:
    ${permit.approvers
      .map((approver: any, index: number) => `${index + 1}. ${approver.name} (${approver.role}) - ${approver.status}`)
      .join("\n")}
  `

  // Create a blob with the content
  const blob = new Blob([pdfContent], { type: "text/plain" })
  const url = URL.createObjectURL(blob)

  // Create download link
  const link = document.createElement("a")
  link.href = url
  link.download = `${permit.id}_작업허가서.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const printPermit = () => {
  window.print()
}
