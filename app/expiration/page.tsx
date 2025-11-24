'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format, differenceInDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import { AlertTriangle, MessageCircle } from 'lucide-react'

interface Member {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
}

interface Subscription {
  id: string
  type: string
  dateDebut: string
  dateFin: string
  prix: number
  actif: boolean
  member: Member
}

export default function ExpirationPage() {
  const [expiringSubscriptions, setExpiringSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExpiringSubscriptions()
  }, [])

  const fetchExpiringSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions')
      const data: Subscription[] = await response.json()

      // Filtrer les abonnements qui expirent dans les 5 prochains jours
      const now = new Date()
      const filtered = data.filter(sub => {
        if (!sub.actif) return false
        
        const dateFin = new Date(sub.dateFin)
        const daysUntilExpiration = differenceInDays(dateFin, now)
        
        // Entre 0 et 5 jours (inclus)
        return daysUntilExpiration >= 0 && daysUntilExpiration <= 5
      })

      // Trier par date d'expiration (les plus proches en premier)
      filtered.sort((a, b) => 
        new Date(a.dateFin).getTime() - new Date(b.dateFin).getTime()
      )

      setExpiringSubscriptions(filtered)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysRemaining = (dateFin: string) => {
    const now = new Date()
    const endDate = new Date(dateFin)
    return differenceInDays(endDate, now)
  }

  const formatPhoneForWhatsApp = (phone: string) => {
    // Nettoyer le numéro de téléphone
    let cleanPhone = phone.replace(/\D/g, '')
    
    // Si le numéro commence par 0, le remplacer par 212
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '212' + cleanPhone.substring(1)
    }
    // Si le numéro ne commence pas par 212, l'ajouter
    else if (!cleanPhone.startsWith('212')) {
      cleanPhone = '212' + cleanPhone
    }
    
    return cleanPhone
  }

  const sendWhatsAppReminder = (subscription: Subscription) => {
    const { member, type, dateFin, prix } = subscription
    const daysRemaining = getDaysRemaining(dateFin)
    const whatsappPhone = formatPhoneForWhatsApp(member.telephone)
    
    // Message personnalisé
    const message = `Bonjour ${member.prenom} ${member.nom},

Votre abonnement ${type} expire ${daysRemaining === 0 ? "aujourd'hui" : `dans ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}`} (${format(new Date(dateFin), 'dd/MM/yyyy')}).

Pour renouveler votre abonnement et continuer à profiter de nos services, merci de procéder au paiement de ${prix}€.

N'hésitez pas si vous avez des questions !

Cordialement,
L'équipe`

    // URL WhatsApp avec le message pré-rempli
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`
    
    // Ouvrir WhatsApp dans un nouvel onglet
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return <div className="p-8">Chargement...</div>
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-4 md:hidden">
        <a
          href="/"
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-white/5 border border-purple-500/40 text-purple-100 backdrop-blur hover:bg-purple-500/20 transition"
        >
          ← Retour au tableau de bord
        </a>
      </div>

      <Card className="glass border-orange-500/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-orange-400" />
            <div>
              <CardTitle className="text-2xl font-bold text-white">Abonnements Bientôt Expirés</CardTitle>
              <CardDescription className="text-orange-300">
                Abonnements expirant dans les 5 prochains jours
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {expiringSubscriptions.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <p className="text-lg text-green-300 font-semibold">Aucun abonnement n'expire bientôt</p>
              <p className="text-sm text-purple-300 mt-2">Tous vos abonnements actifs sont valides pour plus de 5 jours</p>
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-orange-950/30 border border-orange-500/30 rounded-lg">
                <p className="text-sm text-orange-200">
                  <span className="font-semibold">{expiringSubscriptions.length}</span> abonnement{expiringSubscriptions.length > 1 ? 's' : ''} à renouveler prochainement
                </p>
              </div>

              <div className="rounded-md border border-orange-500/30 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-orange-500/30 bg-orange-900/20">
                      <TableHead className="text-orange-200 font-semibold">Membre</TableHead>
                      <TableHead className="text-orange-200 font-semibold">Contact</TableHead>
                      <TableHead className="text-orange-200 font-semibold">Type</TableHead>
                      <TableHead className="text-orange-200 font-semibold">Date d'expiration</TableHead>
                      <TableHead className="text-orange-200 font-semibold">Jours restants</TableHead>
                      <TableHead className="text-orange-200 font-semibold">Prix</TableHead>
                      <TableHead className="text-orange-200 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiringSubscriptions.map((subscription) => {
                      const daysRemaining = getDaysRemaining(subscription.dateFin)
                      
                      return (
                        <TableRow key={subscription.id} className="border-orange-500/20 hover:bg-orange-900/20 transition-colors">
                          <TableCell className="font-medium text-white">
                            {subscription.member.prenom} {subscription.member.nom}
                          </TableCell>
                          <TableCell className="text-purple-200">
                            <div className="text-sm">
                              <div>{subscription.member.email}</div>
                              <div className="text-xs text-purple-300">{subscription.member.telephone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize border-purple-500/50 text-purple-200">
                              {subscription.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-purple-200">
                            {format(new Date(subscription.dateFin), 'dd MMM yyyy', { locale: fr })}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={daysRemaining === 0 ? 'destructive' : 'default'}
                              className={
                                daysRemaining === 0 
                                  ? 'bg-red-600 hover:bg-red-700' 
                                  : daysRemaining <= 2 
                                  ? 'bg-orange-600 hover:bg-orange-700' 
                                  : 'bg-yellow-600 hover:bg-yellow-700'
                              }
                            >
                              {daysRemaining === 0 ? "Aujourd'hui" : `${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}`}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-white">
                            {subscription.prix}€
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => sendWhatsAppReminder(subscription)}
                              size="sm"
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-green-500/50"
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Relancer paiement
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
