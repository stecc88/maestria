"use client"

import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { it } from "date-fns/locale"

export function TeacherDashboardClient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Update all dynamic dates after mount
    const lastSeenElements = document.querySelectorAll('.teacher-last-seen')
    lastSeenElements.forEach(el => {
      const dateStr = el.getAttribute('data-date')
      if (dateStr && dateStr !== "undefined") {
        el.textContent = formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: it })
      } else {
        el.textContent = 'Mai'
      }
    })

    const notificationElements = document.querySelectorAll('.notification-date')
    notificationElements.forEach(el => {
      const dateStr = el.getAttribute('data-date')
      if (dateStr) {
        el.textContent = formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: it })
      }
    })
  }, [])

  return null
}
