'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Calendar, QrCode, Users, TrendingUp, Activity, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface Stats {
  membresActifs: number
  abonnementsActifs: number
  visitesAujourdhui: number
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [expiringCount, setExpiringCount] = useState(0)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  useEffect(() => {
    const fetchExpiringCount = async () => {
      try {
        const response = await fetch('/api/expiring-count')
        const data = await response.json()
        setExpiringCount(data.count || 0)
      } catch (error) {
        console.error('Erreur:', error)
      }
    }

    fetchExpiringCount()
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchExpiringCount, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Tableau de bord</h1>
        <p className="text-purple-300 text-lg">Bienvenue sur votre système de gestion moderne</p>
      </div>

      {/* Statistiques */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-purple-400" />
          Statistiques en temps réel
        </h2>
        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-2 custom-scroll md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
            {[1, 2, 3].map(i => (
              <div key={i} className="min-w-[220px] glass rounded-2xl p-6 animate-pulse snap-start md:min-w-0">
                <div className="h-4 bg-purple-500/20 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-purple-500/20 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 custom-scroll snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
            <div className="min-w-[220px] glass rounded-2xl p-6 glow-hover group snap-start md:min-w-0">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-purple-300">Membres actifs</p>
                <Users className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {stats?.membresActifs || 0}
              </p>
              <div className="mt-2 flex items-center text-xs text-green-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>Actifs maintenant</span>
              </div>
            </div>

            <div className="min-w-[220px] glass rounded-2xl p-6 glow-hover group snap-start md:min-w-0">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-purple-300">Abonnements actifs</p>
                <Calendar className="h-5 w-5 text-green-400 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {stats?.abonnementsActifs || 0}
              </p>
              <div className="mt-2 flex items-center text-xs text-green-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>En cours</span>
              </div>
            </div>

            <div className="min-w-[220px] glass rounded-2xl p-6 glow-hover group snap-start md:min-w-0">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-purple-300">Visites aujourd'hui</p>
                <Activity className="h-5 w-5 text-purple-400 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {stats?.visitesAujourdhui || 0}
              </p>
              <div className="mt-2 flex items-center text-xs text-purple-400">
                <Activity className="h-3 w-3 mr-1" />
                <span>Aujourd'hui</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions rapides */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/nouveaux-clients">
            <div className="glass rounded-2xl p-6 glow-hover cursor-pointer group border border-blue-500/20 hover:border-blue-500/50 transition-all">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/50">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Nouveaux Clients</h3>
                  <p className="text-sm text-purple-300">Inscrivez un membre</p>
                </div>
              </div>
              <p className="text-sm text-purple-200">
                Créez un profil et générez un QR code unique
              </p>
            </div>
          </Link>

          <Link href="/membres">
            <div className="glass rounded-2xl p-6 glow-hover cursor-pointer group border border-cyan-500/20 hover:border-cyan-500/50 transition-all">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-xl shadow-lg shadow-cyan-500/50">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Membres</h3>
                  <p className="text-sm text-purple-300">Voir tous les membres</p>
                </div>
              </div>
              <p className="text-sm text-purple-200">
                Liste complète avec QR codes et statuts
              </p>
            </div>
          </Link>

          <Link href="/abonnements">
            <div className="glass rounded-2xl p-6 glow-hover cursor-pointer group border border-green-500/20 hover:border-green-500/50 transition-all">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg shadow-green-500/50">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Abonnements</h3>
                  <p className="text-sm text-purple-300">Gérez les abonnements</p>
                </div>
              </div>
              <p className="text-sm text-purple-200">
                Consultez et gérez tous les abonnements
              </p>
            </div>
          </Link>

          <Link href="/scanner">
            <div className="glass rounded-2xl p-6 glow-hover cursor-pointer group border border-purple-500/20 hover:border-purple-500/50 transition-all md:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/50">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Scanner QR</h3>
                  <p className="text-sm text-purple-300">Vérifiez les visites</p>
                </div>
              </div>
              <p className="text-sm text-purple-200">
                Scannez les QR codes pour enregistrer
              </p>
            </div>
          </Link>

          <Link href="/statistiques">
            <div className="glass rounded-2xl p-6 glow-hover cursor-pointer group border border-pink-500/20 hover:border-pink-500/50 transition-all md:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl shadow-lg shadow-pink-500/50">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Statistiques</h3>
                  <p className="text-sm text-purple-300">Voir les revenus et abonnements</p>
                </div>
              </div>
              <p className="text-sm text-purple-200">
                Analyse détaillée des gains, périodes et types d&apos;abonnement
              </p>
            </div>
          </Link>

          <Link href="/expiration">
            <div className="glass rounded-2xl p-6 glow-hover cursor-pointer group border border-orange-500/20 hover:border-orange-500/50 transition-all md:col-span-2 lg:col-span-1 relative">
              {expiringCount > 0 && (
                <div className="absolute -top-2 -right-2 z-10">
                  <span className="relative flex h-8 w-8">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex items-center justify-center rounded-full h-8 w-8 bg-orange-500 text-xs font-bold text-white shadow-lg shadow-orange-500/50">
                      {expiringCount}
                    </span>
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl shadow-lg shadow-orange-500/50">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Bientôt Expirés</h3>
                  <p className="text-sm text-purple-300">Relancez vos clients</p>
                </div>
              </div>
              <p className="text-sm text-purple-200">
                {expiringCount > 0 ? (
                  <>
                    <span className="font-semibold text-orange-300">{expiringCount}</span> abonnement{expiringCount > 1 ? 's' : ''} à renouveler
                  </>
                ) : (
                  'Abonnements expirant dans les 5 prochains jours'
                )}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
