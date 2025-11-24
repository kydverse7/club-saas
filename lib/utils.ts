import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInDays } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSubscriptionStatus(dateFin: Date): {
  status: 'actif' | 'expire_bientot' | 'expire'
  variant: 'success' | 'warning' | 'destructive'
  label: string
} {
  const now = new Date()
  const diff = differenceInDays(dateFin, now)

  if (diff < 0) {
    return { status: 'expire', variant: 'destructive', label: 'Expiré' }
  } else if (diff <= 7) {
    return { status: 'expire_bientot', variant: 'warning', label: `Expire dans ${diff} jour${diff > 1 ? 's' : ''}` }
  } else {
    return { status: 'actif', variant: 'success', label: 'Actif' }
  }
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
