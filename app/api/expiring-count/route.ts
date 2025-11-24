import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { differenceInDays } from 'date-fns'

export async function GET() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        actif: true
      }
    })

    // Compter les abonnements qui expirent dans les 5 prochains jours
    const now = new Date()
    const expiringCount = subscriptions.filter(sub => {
      const dateFin = new Date(sub.dateFin)
      const daysUntilExpiration = differenceInDays(dateFin, now)
      return daysUntilExpiration >= 0 && daysUntilExpiration <= 5
    }).length

    return NextResponse.json({ count: expiringCount })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
