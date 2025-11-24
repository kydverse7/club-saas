'use client'

import { useState, useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ScanResult {
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

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (scanning) {
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        false
      )

      scanner.render(onScanSuccess, onScanFailure)

      return () => {
        scanner.clear().catch(console.error)
      }
    }
  }, [scanning])

  const onScanSuccess = async (decodedText: string) => {
    setError(null)
    
    try {
      // Extraire l'ID du QR code de l'URL si nécessaire
      let qrCodeId = decodedText
      if (decodedText.includes('/verify/')) {
        // Si c'est une URL complète, extraire l'ID
        qrCodeId = decodedText.split('/verify/')[1]
      }
      
      // Enregistrer la visite
      const response = await fetch(`/api/verify/${qrCodeId}`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('QR Code invalide ou membre non trouvé')
      }

      const data = await response.json()
      setResult(data)
      setScanning(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la vérification')
      setScanning(false)
    }
  }

  const onScanFailure = (error: any) => {
    // Ne rien faire, les erreurs de scan sont normales
  }

  const startScanning = () => {
    setResult(null)
    setError(null)
    setScanning(true)
  }

  const stopScanning = () => {
    setScanning(false)
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
      <Card className="max-w-2xl mx-auto glass border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Scanner QR Code</CardTitle>
          <CardDescription className="text-purple-300">Scannez le QR code d'un membre pour enregistrer sa visite</CardDescription>
        </CardHeader>
        <CardContent>
          {!scanning && !result && !error && (
            <div className="text-center py-8">
              <button
                onClick={startScanning}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/50 transition-all"
              >
                Démarrer le scanner
              </button>
            </div>
          )}

          {scanning && (
            <div>
              <div id="qr-reader" className="w-full"></div>
              <div className="text-center mt-4">
                <button
                  onClick={stopScanning}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg shadow-red-500/50 transition-all"
                >
                  Arrêter le scanner
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <div className="bg-red-950/50 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg">
                <p className="font-semibold">❌ Erreur</p>
                <p>{error}</p>
              </div>
              <button
                onClick={startScanning}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/50 transition-all"
              >
                Réessayer
              </button>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className={`border-2 rounded-lg p-6 backdrop-blur-sm ${result.abonnementActif ? 'border-green-500/50 bg-green-950/30' : 'border-red-500/50 bg-red-950/30'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {result.membre.photoUrl ? (
                      <img
                        src={result.membre.photoUrl}
                        alt={`${result.membre.prenom} ${result.membre.nom}`}
                        className="w-16 h-16 rounded-full object-cover border-4 border-purple-500/50 shadow-lg shadow-purple-500/50"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center border-4 border-purple-500/50 shadow-lg shadow-purple-500/50">
                        <span className="text-white font-bold text-xl">
                          {result.membre.prenom[0]}{result.membre.nom[0]}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold gradient-text">
                        {result.membre.prenom} {result.membre.nom}
                      </h3>
                      <p className="text-sm text-purple-300">{result.membre.email}</p>
                    </div>
                  </div>
                  <Badge className={`${result.abonnementActif ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                    {result.abonnementActif ? '✅ Actif' : '❌ Inactif'}
                  </Badge>
                </div>

                {result.abonnementActif && result.dateFin && (
                  <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded border-2 border-green-500/30">
                    <p className="text-sm text-green-300">
                      <span className="font-semibold">Abonnement valide jusqu'au : </span>
                      <span className="text-green-400 font-bold">
                        {format(new Date(result.dateFin), 'dd MMMM yyyy', { locale: fr })}
                      </span>
                    </p>
                  </div>
                )}

                {!result.abonnementActif && (
                  <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded border border-red-500/30">
                    <p className="text-sm text-red-300 font-semibold">
                      ⚠️ Abonnement expiré ou inexistant
                    </p>
                  </div>
                )}

                {result.derniereVisite && (
                  <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded border border-purple-500/30">
                    <p className="text-sm text-purple-200">
                      <span className="font-semibold">Dernière visite : </span>
                      <span className="text-purple-300">
                        {format(new Date(result.derniereVisite), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={startScanning}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/50 transition-all"
              >
                Scanner un autre QR code
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
