"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { printPermit } from "@/lib/pdf-utils"

interface GlobalPrintButtonProps {
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function GlobalPrintButton({ className = "", size = "sm", variant = "outline" }: GlobalPrintButtonProps) {
  const handlePrint = () => {
    printPermit()
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handlePrint}
      className={`border-border hover:bg-muted bg-transparent ${className}`}
    >
      <Printer className="w-4 h-4 mr-2" />
      인쇄
    </Button>
  )
}
