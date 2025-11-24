import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const memberSchema = z.object({
  nom: z.string().min(1),
  prenom: z.string().min(1),
  email: z.string().email(),
  telephone: z.string().min(1),
  photoUrl: z.string().optional().nullable(),
})

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(members)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des membres' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = memberSchema.parse(body)

    // Créer le membre
    const member = await prisma.member.create({
      data: {
        nom: validatedData.nom,
        prenom: validatedData.prenom,
        email: validatedData.email,
        telephone: validatedData.telephone,
        photoUrl: validatedData.photoUrl || null,
      },
    })

    return NextResponse.json({
      membre: member,
      qrCodeId: member.qrCodeId,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Erreur création membre:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du membre' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID du membre requis' },
        { status: 400 }
      )
    }

    // Supprimer d'abord les visites du membre
    await prisma.visit.deleteMany({
      where: { memberId: id }
    })

    // Supprimer les abonnements du membre
    await prisma.subscription.deleteMany({
      where: { memberId: id }
    })

    // Supprimer le membre
    await prisma.member.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Membre supprimé avec succès' })
  } catch (error) {
    console.error('Erreur suppression membre:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du membre' },
      { status: 500 }
    )
  }
}
