'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface VerifyResult {
  membre: {
    nom: string
    prenom: string
    email: string
    photoUrl?: string
  }
  abonnementActif: boolean
  dateFin?: string
  derniereVisite?: string
}

export default function VerifyPublicPage() {
  const params = useParams()
  const qrCodeId = params.qrCodeId as string
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyQRCode = async () => {
      try {
        const response = await fetch(`/api/verify/${qrCodeId}`)
        
        if (!response.ok) {
          throw new Error('QR Code invalide ou membre non trouvé')
        }

        const data = await response.json()
        setResult(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la vérification')
      } finally {
        setLoading(false)
      }
    }

    if (qrCodeId) {
      verifyQRCode()
    }
  }, [qrCodeId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
        <Card className="max-w-md w-full glass border-purple-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-purple-300">Vérification en cours...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
        <Card className="max-w-md w-full glass border-red-500/30">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-400">❌ Erreur</CardTitle>
            <CardDescription className="text-purple-300">Une erreur s'est produite</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-red-950/50 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg">
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!result) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <Card className="max-w-md w-full glass border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Vérification QR Code</CardTitle>
          <CardDescription className="text-purple-300">Statut de l'abonnement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`border-2 rounded-lg p-6 backdrop-blur-sm ${result.abonnementActif ? 'border-green-500/50 bg-green-950/30' : 'border-red-500/50 bg-red-950/30'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                {result.membre.photoUrl ? (
                  <img
                    src={result.membre.photoUrl}
                    alt={`${result.membre.prenom} ${result.membre.nom}`}
                    className="w-20 h-20 rounded-full object-cover border-4 border-purple-500/50 shadow-lg shadow-purple-500/50"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center border-4 border-purple-500/50 shadow-lg shadow-purple-500/50">
                    <span className="text-white font-bold text-2xl">
                      {result.membre.prenom[0]}{result.membre.nom[0]}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold gradient-text">
                    {result.membre.prenom} {result.membre.nom}
                  </h3>
                  <p className="text-sm text-purple-300">{result.membre.email}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Badge 
                className={`text-lg px-4 py-2 ${result.abonnementActif ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {result.abonnementActif ? '✅ Abonnement Actif' : '❌ Abonnement Inactif'}
              </Badge>
            </div>

            {result.abonnementActif && result.dateFin && (
              <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border-2 border-green-500/30">
                <p className="text-sm font-semibold text-green-300">Valide jusqu'au :</p>
                <p className="text-xl font-bold text-green-400">
                  {format(new Date(result.dateFin), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            )}

            {!result.abonnementActif && (
              <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border-2 border-red-500/30">
                <p className="text-sm font-semibold text-red-300">
                  ⚠️ Abonnement expiré ou inexistant
                </p>
                <p className="text-sm text-purple-300 mt-2">
                  Veuillez renouveler votre abonnement pour accéder aux installations.
                </p>
              </div>
            )}

            {result.derniereVisite && (
              <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-purple-500/30">
                <p className="text-sm font-semibold text-purple-200">Dernière visite :</p>
                <p className="text-sm text-purple-300">
                  {format(new Date(result.derniereVisite), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-sm text-purple-400">
            <p>Code QR vérifié le {format(new Date(), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
