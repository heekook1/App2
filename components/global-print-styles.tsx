"use client"

import { useEffect } from "react"

export default function GlobalPrintStyles() {
  useEffect(() => {
    // Add global print styles to document head
    const style = document.createElement("style")
    style.textContent = `
      @media print {
        @page {
          size: A4;
          margin: 15mm;
        }
        
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        body {
          font-size: 11pt !important;
          line-height: 1.3 !important;
          color: #000 !important;
        }
        
        .print-hide {
          display: none !important;
        }
        
        .print-section {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        .print-page-break {
          page-break-before: always;
          break-before: page;
        }
        
        .print-no-break {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        /* Form elements */
        input, textarea, select {
          border: 1px solid #000 !important;
          background: white !important;
          color: #000 !important;
          font-size: 10pt !important;
          padding: 2px 4px !important;
        }
        
        /* Tables */
        table {
          border-collapse: collapse !important;
          width: 100% !important;
          font-size: 9pt !important;
        }
        
        th, td {
          border: 1px solid #000 !important;
          padding: 3px !important;
          text-align: left !important;
        }
        
        /* Cards and containers */
        .card, .border {
          border: 1px solid #000 !important;
          box-shadow: none !important;
        }
        
        /* Headers */
        h1, h2, h3, h4, h5, h6 {
          color: #000 !important;
          font-weight: bold !important;
        }
        
        /* Checkboxes */
        input[type="checkbox"] {
          width: 12px !important;
          height: 12px !important;
          margin-right: 4px !important;
        }
        
        /* Remove backgrounds */
        .bg-primary, .bg-secondary, .bg-muted {
          background: white !important;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null
}
