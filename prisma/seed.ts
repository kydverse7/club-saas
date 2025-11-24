import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seed...')

  // Créer des membres de test
  const membres = await Promise.all([
    prisma.member.create({
      data: {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@example.com',
        telephone: '0601020304',
        photoUrl: 'https://i.pravatar.cc/150?img=1',
      },
    }),
    prisma.member.create({
      data: {
        nom: 'Martin',
        prenom: 'Sophie',
        email: 'sophie.martin@example.com',
        telephone: '0602030405',
        photoUrl: 'https://i.pravatar.cc/150?img=2',
      },
    }),
    prisma.member.create({
      data: {
        nom: 'Bernard',
        prenom: 'Pierre',
        email: 'pierre.bernard@example.com',
        telephone: '0603040506',
        photoUrl: 'https://i.pravatar.cc/150?img=3',
      },
    }),
    prisma.member.create({
      data: {
        nom: 'Dubois',
        prenom: 'Marie',
        email: 'marie.dubois@example.com',
        telephone: '0604050607',
        photoUrl: 'https://i.pravatar.cc/150?img=4',
      },
    }),
    prisma.member.create({
      data: {
        nom: 'Thomas',
        prenom: 'Luc',
        email: 'luc.thomas@example.com',
        telephone: '0605060708',
        photoUrl: 'https://i.pravatar.cc/150?img=5',
      },
    }),
  ])

  console.log(`✅ ${membres.length} membres créés`)

  // Créer des abonnements pour chaque membre
  const now = new Date()
  const abonnements = []

  // Jean Dupont - Abonnement mensuel actif
  abonnements.push(
    await prisma.subscription.create({
      data: {
        memberId: membres[0].id,
        type: 'mensuel',
        dateDebut: new Date(now.getFullYear(), now.getMonth(), 1),
        dateFin: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        prix: 50,
        actif: true,
      },
    })
  )

  // Sophie Martin - Abonnement trimestriel actif
  abonnements.push(
    await prisma.subscription.create({
      data: {
        memberId: membres[1].id,
        type: 'trimestriel',
        dateDebut: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        dateFin: new Date(now.getFullYear(), now.getMonth() + 2, 1),
        prix: 135,
        actif: true,
      },
    })
  )

  // Pierre Bernard - Abonnement annuel actif
  abonnements.push(
    await prisma.subscription.create({
      data: {
        memberId: membres[2].id,
        type: 'annuel',
        dateDebut: new Date(now.getFullYear(), 0, 1),
        dateFin: new Date(now.getFullYear() + 1, 0, 1),
        prix: 500,
        actif: true,
      },
    })
  )

  // Marie Dubois - Abonnement expiré
  abonnements.push(
    await prisma.subscription.create({
      data: {
        memberId: membres[3].id,
        type: 'mensuel',
        dateDebut: new Date(now.getFullYear(), now.getMonth() - 2, 1),
        dateFin: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        prix: 50,
        actif: false,
      },
    })
  )

  // Luc Thomas - Pas d'abonnement

  console.log(`✅ ${abonnements.length} abonnements créés`)

  // Créer quelques visites pour les membres avec abonnement actif
  const visites = []

  for (let i = 0; i < 3; i++) {
    // Jean Dupont - 5 visites
    for (let j = 0; j < 5; j++) {
      visites.push(
        await prisma.visit.create({
          data: {
            memberId: membres[0].id,
            scanDate: new Date(now.getTime() - (j + i * 5) * 24 * 60 * 60 * 1000),
          },
        })
      )
    }

    // Sophie Martin - 3 visites
    if (i < 3) {
      visites.push(
        await prisma.visit.create({
          data: {
            memberId: membres[1].id,
            scanDate: new Date(now.getTime() - i * 2 * 24 * 60 * 60 * 1000),
          },
        })
      )
    }

    // Pierre Bernard - 8 visites
    if (i < 8) {
      visites.push(
        await prisma.visit.create({
          data: {
            memberId: membres[2].id,
            scanDate: new Date(now.getTime() - i * 24 * 60 * 60 * 1000),
          },
        })
      )
    }
  }

  console.log(`✅ ${visites.length} visites créées`)

  console.log('\n📊 Résumé:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  for (const membre of membres) {
    const subsCount = await prisma.subscription.count({
      where: { memberId: membre.id, actif: true },
    })
    const visitsCount = await prisma.visit.count({
      where: { memberId: membre.id },
    })
    console.log(`👤 ${membre.prenom} ${membre.nom}:`)
    console.log(`   Email: ${membre.email}`)
    console.log(`   QR Code: ${membre.qrCodeId}`)
    console.log(`   Abonnements actifs: ${subsCount}`)
    console.log(`   Visites: ${visitsCount}`)
    console.log('')
  }

  console.log('✨ Seed terminé avec succès!')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
