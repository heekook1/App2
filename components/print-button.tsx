"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

interface PrintButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
}

export default function PrintButton({ className, variant = "outline" }: PrintButtonProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <Button variant={variant} onClick={handlePrint} className={`print-hide ${className}`}>
      <Printer className="w-4 h-4 mr-2" />
      인쇄
    </Button>
  )
}
