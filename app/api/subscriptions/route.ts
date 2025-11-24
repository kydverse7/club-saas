import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const subscriptionSchema = z.object({
  memberId: z.string(),
  type: z.enum(['mensuel', 'trimestriel', 'annuel']),
  dateDebut: z.string(),
  prix: z.number(),
})

const updateSubscriptionSchema = z.object({
  type: z.enum(['mensuel', 'trimestriel', 'annuel']).optional(),
  dateDebut: z.string().optional(),
  dateFin: z.string().optional(),
  prix: z.number().optional(),
  actif: z.boolean().optional(),
})

export async function GET() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        member: true,
      },
      orderBy: { dateFin: 'desc' },
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des abonnements' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = subscriptionSchema.parse(body)

    // Calculer la date de fin selon le type d'abonnement
    const dateDebut = new Date(validatedData.dateDebut)
    const dateFin = new Date(dateDebut)
    
    switch (validatedData.type) {
      case 'mensuel':
        dateFin.setMonth(dateFin.getMonth() + 1)
        break
      case 'trimestriel':
        dateFin.setMonth(dateFin.getMonth() + 3)
        break
      case 'annuel':
        dateFin.setFullYear(dateFin.getFullYear() + 1)
        break
    }

    // Créer l'abonnement
    const subscription = await prisma.subscription.create({
      data: {
        memberId: validatedData.memberId,
        type: validatedData.type,
        dateDebut: dateDebut,
        dateFin: dateFin,
        prix: validatedData.prix,
        actif: true,
      },
      include: {
        member: true,
      },
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Erreur création abonnement:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'abonnement' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID de l\'abonnement requis' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = updateSubscriptionSchema.parse(body)

    // Si la date de fin est fournie, l'utiliser directement
    const updateData: any = { ...validatedData }
    
    if (validatedData.dateFin) {
      updateData.dateFin = new Date(validatedData.dateFin)
    }
    
    if (validatedData.dateDebut) {
      updateData.dateDebut = new Date(validatedData.dateDebut)
    }

    const subscription = await prisma.subscription.update({
      where: { id },
      data: updateData,
      include: {
        member: true,
      },
    })

    return NextResponse.json(subscription)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Erreur modification abonnement:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification de l\'abonnement' },
      { status: 500 }
    )
  }
}
