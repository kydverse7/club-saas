import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Compter les membres avec au moins un abonnement actif
    const membresActifs = await prisma.member.count({
      where: {
        subscriptions: {
          some: {
            actif: true,
            dateFin: {
              gte: new Date()
            }
          }
        }
      }
    })

    // Compter tous les abonnements actifs
    const abonnementsActifs = await prisma.subscription.count({
      where: {
        actif: true,
        dateFin: {
          gte: new Date()
        }
      }
    })

    // Compter les visites d'aujourd'hui
    const aujourdHui = new Date()
    aujourdHui.setHours(0, 0, 0, 0)
    
    const visitesAujourdhui = await prisma.visit.count({
      where: {
        scanDate: {
          gte: aujourdHui
        }
      }
    })

    return NextResponse.json({
      membresActifs,
      abonnementsActifs,
      visitesAujourdhui
    })
  } catch (error) {
    console.error('Erreur stats:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}
