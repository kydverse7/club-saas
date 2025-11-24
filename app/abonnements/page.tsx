'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Member {
  id: string
  nom: string
  prenom: string
  email: string
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

export default function AbonnementsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [newSubscription, setNewSubscription] = useState({
    memberId: '',
    type: 'mensuel',
    dateDebut: new Date().toISOString().split('T')[0],
    prix: 50
  })
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editSubscription, setEditSubscription] = useState<{
    id: string
    type: string
    dateDebut: string
    dateFin: string
    prix: number
    actif: boolean
  } | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  useEffect(() => {
    fetchSubscriptions()
    fetchMembers()
  }, [])

  useEffect(() => {
    let filtered = subscriptions

    if (filterType !== 'all') {
      filtered = filtered.filter(sub => sub.type === filterType)
    }

    if (filterStatus !== 'all') {
      const isActive = filterStatus === 'actif'
      filtered = filtered.filter(sub => sub.actif === isActive)
    }

    if (searchTerm) {
      filtered = filtered.filter(sub =>
        sub.member.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.member.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.member.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredSubscriptions(filtered)
  }, [subscriptions, filterType, filterStatus, searchTerm])

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions')
      const data = await response.json()
      setSubscriptions(data)
      setFilteredSubscriptions(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members')
      const data = await response.json()
      setMembers(data)
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const handleAddSubscription = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubscription)
      })

      if (!response.ok) throw new Error('Erreur lors de la création')

      await fetchSubscriptions()
      setShowAddDialog(false)
      setNewSubscription({
        memberId: '',
        type: 'mensuel',
        dateDebut: new Date().toISOString().split('T')[0],
        prix: 50
      })
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la création de l\'abonnement')
    }
  }

  const handleEditSubscription = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editSubscription) return

    try {
      const response = await fetch(`/api/subscriptions?id=${editSubscription.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: editSubscription.type,
          dateDebut: editSubscription.dateDebut,
          dateFin: editSubscription.dateFin,
          prix: editSubscription.prix,
          actif: editSubscription.actif
        })
      })

      if (!response.ok) throw new Error('Erreur lors de la modification')

      await fetchSubscriptions()
      setShowEditDialog(false)
      setEditSubscription(null)
      alert('Abonnement modifié avec succès')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la modification de l\'abonnement')
    }
  }

  const openEditDialog = (sub: Subscription) => {
    setEditSubscription({
      id: sub.id,
      type: sub.type,
      dateDebut: new Date(sub.dateDebut).toISOString().split('T')[0],
      dateFin: new Date(sub.dateFin).toISOString().split('T')[0],
      prix: sub.prix,
      actif: sub.actif
    })
    setShowEditDialog(true)
  }

  const getPrixSuggestion = (type: string) => {
    switch (type) {
      case 'mensuel': return 50
      case 'trimestriel': return 135
      case 'annuel': return 500
      default: return 0
    }
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
      <Card className="glass border-purple-500/30">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-white">Gestion des Abonnements</CardTitle>
              <CardDescription className="text-purple-300">Gérez tous les abonnements de vos membres</CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-green-500/50">Nouvel Abonnement</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un nouvel abonnement</DialogTitle>
                  <DialogDescription>Ajoutez un abonnement pour un membre existant</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddSubscription} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="member">Membre *</Label>
                    <Select
                      value={newSubscription.memberId}
                      onValueChange={(value) => setNewSubscription({ ...newSubscription, memberId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un membre" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.prenom} {member.nom} ({member.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type d'abonnement *</Label>
                    <Select
                      value={newSubscription.type}
                      onValueChange={(value) => {
                        setNewSubscription({
                          ...newSubscription,
                          type: value,
                          prix: getPrixSuggestion(value)
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mensuel">Mensuel (50€)</SelectItem>
                        <SelectItem value="trimestriel">Trimestriel (135€)</SelectItem>
                        <SelectItem value="annuel">Annuel (500€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateDebut">Date de début *</Label>
                    <Input
                      id="dateDebut"
                      type="date"
                      value={newSubscription.dateDebut}
                      onChange={(e) => setNewSubscription({ ...newSubscription, dateDebut: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prix">Prix (€) *</Label>
                    <Input
                      id="prix"
                      type="number"
                      step="0.01"
                      value={newSubscription.prix}
                      onChange={(e) => setNewSubscription({ ...newSubscription, prix: parseFloat(e.target.value) })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">Créer l'abonnement</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-purple-200">Rechercher</Label>
              <Input
                placeholder="Nom, prénom, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-purple-200">Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="mensuel">Mensuel</SelectItem>
                  <SelectItem value="trimestriel">Trimestriel</SelectItem>
                  <SelectItem value="annuel">Annuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-purple-200">Statut</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="actif">Actifs</SelectItem>
                  <SelectItem value="inactif">Inactifs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border border-purple-500/30 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/30 bg-purple-900/20">
                  <TableHead className="text-purple-200 font-semibold">Membre</TableHead>
                  <TableHead className="text-purple-200 font-semibold">Type</TableHead>
                  <TableHead className="text-purple-200 font-semibold">Date début</TableHead>
                  <TableHead className="text-purple-200 font-semibold">Date fin</TableHead>
                  <TableHead className="text-purple-200 font-semibold">Prix</TableHead>
                  <TableHead className="text-purple-200 font-semibold">Statut</TableHead>
                  <TableHead className="text-purple-200 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.length === 0 ? (
                  <TableRow className="border-purple-500/20">
                    <TableCell colSpan={7} className="text-center text-purple-300">
                      Aucun abonnement trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscriptions.map((sub) => (
                    <TableRow key={sub.id} className="border-purple-500/20 hover:bg-purple-900/20 transition-colors">
                      <TableCell className="font-medium text-white">
                        {sub.member.prenom} {sub.member.nom}
                        <div className="text-sm text-purple-300">{sub.member.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-purple-400 text-purple-300">{sub.type}</Badge>
                      </TableCell>
                      <TableCell className="text-purple-200">
                        {format(new Date(sub.dateDebut), 'dd MMM yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell className="text-purple-200">
                        {format(new Date(sub.dateFin), 'dd MMM yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell className="text-white font-semibold">{sub.prix}€</TableCell>
                      <TableCell>
                        <Badge variant={sub.actif ? 'default' : 'secondary'}>
                          {sub.actif ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(sub)}
                        >
                          Modifier
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de modification d'abonnement */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'abonnement</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'abonnement
            </DialogDescription>
          </DialogHeader>
          {editSubscription && (
            <form onSubmit={handleEditSubscription} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type d'abonnement *</Label>
                <Select
                  value={editSubscription.type}
                  onValueChange={(value) => setEditSubscription({ ...editSubscription, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensuel">Mensuel</SelectItem>
                    <SelectItem value="trimestriel">Trimestriel</SelectItem>
                    <SelectItem value="annuel">Annuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-dateDebut">Date de début *</Label>
                <Input
                  id="edit-dateDebut"
                  type="date"
                  value={editSubscription.dateDebut}
                  onChange={(e) => setEditSubscription({ ...editSubscription, dateDebut: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-dateFin">Date de fin *</Label>
                <Input
                  id="edit-dateFin"
                  type="date"
                  value={editSubscription.dateFin}
                  onChange={(e) => setEditSubscription({ ...editSubscription, dateFin: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-prix">Prix (€) *</Label>
                <Input
                  id="edit-prix"
                  type="number"
                  step="0.01"
                  value={editSubscription.prix}
                  onChange={(e) => setEditSubscription({ ...editSubscription, prix: parseFloat(e.target.value) })}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-actif"
                  checked={editSubscription.actif}
                  onChange={(e) => setEditSubscription({ ...editSubscription, actif: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="edit-actif" className="cursor-pointer">Abonnement actif</Label>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Enregistrer les modifications
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
