import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ qrCodeId: string }> }
) {
  try {
    const { qrCodeId } = await params
    const member = await prisma.member.findUnique({
      where: { qrCodeId },
      include: {
        subscriptions: {
          where: { actif: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        visits: {
          orderBy: { scanDate: 'desc' },
          take: 10,
        },
      },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Membre introuvable' },
        { status: 404 }
      )
    }

    const activeSubscription = member.subscriptions[0]
    const lastVisit = member.visits[0]

    return NextResponse.json({
      membre: {
        nom: member.nom,
        prenom: member.prenom,
        email: member.email,
        photoUrl: member.photoUrl,
      },
      abonnementActif: !!activeSubscription,
      dateFin: activeSubscription?.dateFin,
      derniereVisite: lastVisit?.scanDate,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ qrCodeId: string }> }
) {
  try {
    const { qrCodeId } = await params
    const member = await prisma.member.findUnique({
      where: { qrCodeId },
      include: {
        subscriptions: {
          where: { actif: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        visits: {
          orderBy: { scanDate: 'desc' },
          take: 1,
        },
      },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Membre introuvable' },
        { status: 404 }
      )
    }

    // Enregistrer la visite
    await prisma.visit.create({
      data: {
        memberId: member.id,
      },
    })

    const activeSubscription = member.subscriptions[0]
    const lastVisit = member.visits[0]

    return NextResponse.json({
      membre: {
        nom: member.nom,
        prenom: member.prenom,
        email: member.email,
        photoUrl: member.photoUrl,
      },
      abonnementActif: !!activeSubscription,
      dateFin: activeSubscription?.dateFin,
      derniereVisite: lastVisit?.scanDate,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    )
  }
}
