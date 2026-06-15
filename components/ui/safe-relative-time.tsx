"use client"

import { useEffect, useState } from "react"
import { formatRelative } from "@/lib/utils/date"

interface SafeRelativeTimeProps {
  date: string | null | undefined
  placeholder?: string
}

export function SafeRelativeTime({ date, placeholder = "..." }: SafeRelativeTimeProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <span>{placeholder}</span>

  return <span>{formatRelative(date)}</span>
}
