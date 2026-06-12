import { format, formatDistanceToNow } from "date-fns"
import { it } from "date-fns/locale"

export const formatDate = (date: string | null | undefined, pattern: string = "d MMMM yyyy") => {
  if (!date) return 'N/A'
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'N/A'
  try {
    return format(d, pattern || "d MMMM yyyy", { locale: it })
  } catch (e) {
    return 'N/A'
  }
}

export const formatRelative = (date: string | null | undefined) => {
  if (!date) return 'Nessuna attività'
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Nessuna attività'
  try {
    return formatDistanceToNow(d, { addSuffix: true, locale: it })
  } catch (e) {
    return 'Nessuna attività'
  }
}
