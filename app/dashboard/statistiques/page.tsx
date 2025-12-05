'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format, startOfDay, startOfWeek, startOfMonth, startOfYear, subDays, subWeeks, subMonths, subYears } from 'date-fns'
import { fr } from 'date-fns/locale'
import { TrendingUp, DollarSign, Users, Calendar } from 'lucide-react'

interface Subscription {
  id: string
  type: string
  dateDebut: string
  dateFin: string
  prix: number
  actif: boolean
  createdAt: string
}

interface Stats {
  totalGains: number
  gainsParType: { type: string; count: number; total: number }[]
  gainsParPeriode: { periode: string; total: number }[]
}

export default function StatistiquesPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [periode, setPeriode] = useState<'jour' | 'semaine' | 'mois' | 'annee'>('mois')
  const [selectedMonthForWeeks, setSelectedMonthForWeeks] = useState<string>(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
  const [selectedYearForMonths, setSelectedYearForMonths] = useState<number>(() => {
    const now = new Date()
    return now.getFullYear()
  })
  const [stats, setStats] = useState<Stats>({
    totalGains: 0,
    gainsParType: [],
    gainsParPeriode: []
  })

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  useEffect(() => {
    if (subscriptions.length > 0) {
      calculateStats()
    }
  }, [subscriptions, periode])

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions')
      const data = await response.json()
      setSubscriptions(data)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const calculateStats = () => {
    const now = new Date()

    // Calculer les gains totaux
    const totalGains = subscriptions.reduce((sum, sub) => sum + sub.prix, 0)

    // Calculer les gains par type
    const gainsParType = subscriptions.reduce((acc, sub) => {
      const existing = acc.find(item => item.type === sub.type)
      if (existing) {
        existing.count++
        existing.total += sub.prix
      } else {
        acc.push({ type: sub.type, count: 1, total: sub.prix })
      }
      return acc
    }, [] as { type: string; count: number; total: number }[])

    // Trier par nombre de ventes
    gainsParType.sort((a, b) => b.count - a.count)

    // Calculer les gains par période
    const gainsParPeriode: { periode: string; total: number }[] = []
    
    switch (periode) {
      case 'jour': {
        // Tous les jours du mois courant
        const monthStart = startOfMonth(now)
        const nextMonthStart = new Date(monthStart)
        nextMonthStart.setMonth(nextMonthStart.getMonth() + 1)

        for (
          let d = new Date(monthStart);
          d < nextMonthStart;
          d.setDate(d.getDate() + 1)
        ) {
          const dateStr = format(d, 'yyyy-MM-dd')
          const total = subscriptions
            .filter(sub => format(new Date(sub.createdAt), 'yyyy-MM-dd') === dateStr)
            .reduce((sum, sub) => sum + sub.prix, 0)

          gainsParPeriode.push({
            // Format : 01/05
            periode: format(d, 'dd/MM', { locale: fr }),
            total
          })
        }
        break
      }
      
      case 'semaine': {
        // Semaines du mois sélectionné, chaque barre = du lundi au dimanche
        const [yearStr, monthStr] = selectedMonthForWeeks.split('-')
        const baseDate = new Date(Number(yearStr), Number(monthStr) - 1, 1)
        const monthStart = startOfMonth(baseDate)
        const nextMonthStart = new Date(monthStart)
        nextMonthStart.setMonth(nextMonthStart.getMonth() + 1)

        // Commencer au lundi de la première semaine qui touche le mois
        let weekStart = startOfWeek(monthStart, { weekStartsOn: 1 })

        while (weekStart < nextMonthStart) {
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekEnd.getDate() + 6)

          const total = subscriptions
            .filter(sub => {
              const subDate = new Date(sub.createdAt)
              return subDate >= weekStart && subDate <= weekEnd
            })
            .reduce((sum, sub) => sum + sub.prix, 0)

          gainsParPeriode.push({
            // Format demandé : 01/05 - 08/05
            periode: `${format(weekStart, 'dd/MM')} - ${format(weekEnd, 'dd/MM')}`,
            total
          })

          // Semaine suivante
          weekStart = new Date(weekStart)
          weekStart.setDate(weekStart.getDate() + 7)
        }
        break
      }
      
      case 'mois': {
        // 12 mois de l'année sélectionnée
        for (let month = 0; month < 12; month++) {
          const monthStart = new Date(selectedYearForMonths, month, 1)
          const nextMonthStart = new Date(selectedYearForMonths, month + 1, 1)

          const total = subscriptions
            .filter(sub => {
              const subDate = new Date(sub.createdAt)
              return subDate >= monthStart && subDate < nextMonthStart
            })
            .reduce((sum, sub) => sum + sub.prix, 0)

          gainsParPeriode.push({
            periode: format(monthStart, 'MMM', { locale: fr }),
            total
          })
        }
        break
      }
      
      case 'annee':
        const years = new Set(subscriptions.map(sub => new Date(sub.createdAt).getFullYear()))
        Array.from(years).sort().forEach(year => {
          const total = subscriptions
            .filter(sub => new Date(sub.createdAt).getFullYear() === year)
            .reduce((sum, sub) => sum + sub.prix, 0)
          gainsParPeriode.push({
            periode: year.toString(),
            total
          })
        })
        break
    }

    setStats({ totalGains, gainsParType, gainsParPeriode })
  }

  const maxGain = Math.max(...stats.gainsParPeriode.map(p => p.total), 1)
  const maxCount = Math.max(...stats.gainsParType.map(t => t.count), 1)

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="mb-2 md:hidden">
        <a
          href="/"
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-white/5 border border-purple-500/40 text-purple-100 backdrop-blur hover:bg-purple-500/20 transition"
        >
          ← Retour au tableau de bord
        </a>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Statistiques</h1>
          <p className="text-purple-300 mt-1">Analyse des revenus et abonnements</p>
        </div>
        <Select value={periode} onValueChange={(value: any) => setPeriode(value)}>
          <SelectTrigger className="w-[200px] bg-black/40 border border-purple-500/40 text-purple-100 text-sm rounded-lg shadow-lg shadow-purple-500/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jour">Par jour (7j)</SelectItem>
            <SelectItem value="semaine">Par semaine (8s)</SelectItem>
            <SelectItem value="mois">Par mois (12m)</SelectItem>
            <SelectItem value="annee">Par année</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cartes de résumé */}
      <div className="flex gap-4 overflow-x-auto pb-2 custom-scroll snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 md:overflow-visible">
        <Card className="min-w-[220px] glass border-purple-500/30 snap-start md:min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-200">Gains Totaux</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalGains.toFixed(2)}€</div>
            <p className="text-xs text-purple-300 mt-1">Tous les abonnements</p>
          </CardContent>
        </Card>

        <Card className="min-w-[220px] glass border-cyan-500/30 snap-start md:min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cyan-200">Abonnements Actifs</CardTitle>
            <Users className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {subscriptions.filter(s => s.actif).length}
            </div>
            <p className="text-xs text-cyan-300 mt-1">En cours</p>
          </CardContent>
        </Card>

        <Card className="min-w-[220px] glass border-pink-500/30 snap-start md:min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-pink-200">Type Populaire</CardTitle>
            <TrendingUp className="h-4 w-4 text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white capitalize">
              {stats.gainsParType[0]?.type || '-'}
            </div>
            <p className="text-xs text-pink-300 mt-1">
              {stats.gainsParType[0]?.count || 0} ventes
            </p>
          </CardContent>
        </Card>

        <Card className="min-w-[220px] glass border-green-500/30 snap-start md:min-w-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-200">Revenu Moyen</CardTitle>
            <Calendar className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {subscriptions.length > 0 ? (stats.totalGains / subscriptions.length).toFixed(2) : '0'}€
            </div>
            <p className="text-xs text-green-300 mt-1">Par abonnement</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des revenus par période */}
        <Card className="glass border-purple-500/30">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <CardTitle className="text-white">Revenus par {periode}</CardTitle>
                <CardDescription className="text-purple-300">
                  Évolution des revenus sur la période sélectionnée
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-3 justify-start md:justify-end">
                {periode === 'semaine' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-purple-300">Mois :</span>
                    <Select
                      value={selectedMonthForWeeks}
                      onValueChange={(value) => setSelectedMonthForWeeks(value)}
                    >
                      <SelectTrigger className="w-[170px] h-8 bg-black/40 border border-purple-500/60 text-xs text-purple-100 rounded-lg shadow-md shadow-purple-500/40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
                          new Set(
                            subscriptions.map((s) => {
                              const d = new Date(s.createdAt)
                              const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
                              return ym
                            })
                          )
                        )
                          .sort()
                          .map((ym) => {
                            const [y, m] = ym.split('-')
                            const labelDate = new Date(Number(y), Number(m) - 1, 1)
                            return (
                              <SelectItem key={ym} value={ym}>
                                {format(labelDate, 'MMMM yyyy', { locale: fr })}
                              </SelectItem>
                            )
                          })}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {periode === 'mois' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-purple-300">Année :</span>
                    <Select
                      value={String(selectedYearForMonths)}
                      onValueChange={(value) => setSelectedYearForMonths(Number(value))}
                    >
                      <SelectTrigger className="w-[110px] h-8 bg-black/40 border border-purple-500/60 text-xs text-purple-100 rounded-lg shadow-md shadow-purple-500/40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
                          new Set(
                            subscriptions.map((s) => new Date(s.createdAt).getFullYear())
                          )
                        )
                          .sort()
                          .map((year) => (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto pr-2 space-y-2 custom-scroll">
              {stats.gainsParPeriode.map((item, index) => (
                <div key={index} className="space-y-1 min-w-full">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-200 font-medium">{item.periode}</span>
                    <span className="text-white font-bold">{item.total.toFixed(2)}€</span>
                  </div>
                  <div className="w-full bg-purple-950/50 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full transition-all duration-500 shadow-lg shadow-purple-500/50"
                      style={{ width: `${(item.total / maxGain) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Graphique des types d'abonnement */}
        <Card className="glass border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Abonnements par Type</CardTitle>
            <CardDescription className="text-purple-300">
              Répartition des ventes par type d'abonnement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.gainsParType.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-purple-500' : 
                        index === 1 ? 'bg-cyan-500' : 'bg-pink-500'
                      }`} />
                      <span className="text-purple-200 font-medium capitalize">{item.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{item.count} ventes</div>
                      <div className="text-sm text-purple-300">{item.total.toFixed(2)}€</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="text-xs text-purple-400">Volume</div>
                      <div className="w-full bg-purple-950/50 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            index === 0 ? 'bg-purple-500 shadow-lg shadow-purple-500/50' : 
                            index === 1 ? 'bg-cyan-500 shadow-lg shadow-cyan-500/50' : 
                            'bg-pink-500 shadow-lg shadow-pink-500/50'
                          }`}
                          style={{ width: `${(item.count / maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-purple-400">Revenus</div>
                      <div className="w-full bg-purple-950/50 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            index === 0 ? 'bg-purple-500 shadow-lg shadow-purple-500/50' : 
                            index === 1 ? 'bg-cyan-500 shadow-lg shadow-cyan-500/50' : 
                            'bg-pink-500 shadow-lg shadow-pink-500/50'
                          }`}
                          style={{ width: `${(item.total / stats.totalGains) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau détaillé */}
      <Card className="glass border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white">Détails par Type</CardTitle>
          <CardDescription className="text-purple-300">
            Vue d'ensemble complète des performances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/30">
                  <th className="text-left py-3 px-4 text-purple-200 font-semibold">Type</th>
                  <th className="text-right py-3 px-4 text-purple-200 font-semibold">Ventes</th>
                  <th className="text-right py-3 px-4 text-purple-200 font-semibold">Revenus Total</th>
                  <th className="text-right py-3 px-4 text-purple-200 font-semibold">Prix Moyen</th>
                  <th className="text-right py-3 px-4 text-purple-200 font-semibold">% du Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.gainsParType.map((item, index) => (
                  <tr key={index} className="border-b border-purple-500/20 hover:bg-purple-900/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          index === 0 ? 'bg-purple-500' : 
                          index === 1 ? 'bg-cyan-500' : 'bg-pink-500'
                        }`} />
                        <span className="text-white font-medium capitalize">{item.type}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 text-white font-semibold">{item.count}</td>
                    <td className="text-right py-3 px-4 text-white font-bold">{item.total.toFixed(2)}€</td>
                    <td className="text-right py-3 px-4 text-purple-200">{(item.total / item.count).toFixed(2)}€</td>
                    <td className="text-right py-3 px-4 text-purple-300">
                      {((item.total / stats.totalGains) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-purple-500/50">
                <tr>
                  <td className="py-3 px-4 text-purple-200 font-bold">TOTAL</td>
                  <td className="text-right py-3 px-4 text-white font-bold">
                    {stats.gainsParType.reduce((sum, item) => sum + item.count, 0)}
                  </td>
                  <td className="text-right py-3 px-4 text-white font-bold text-lg">
                    {stats.totalGains.toFixed(2)}€
                  </td>
                  <td className="text-right py-3 px-4 text-purple-200">
                    {subscriptions.length > 0 ? (stats.totalGains / subscriptions.length).toFixed(2) : '0'}€
                  </td>
                  <td className="text-right py-3 px-4 text-purple-300">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
