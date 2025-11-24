'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { QRCodeSVG } from 'qrcode.react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Subscription {
  id: string
  type: string
  dateDebut: string
  dateFin: string
  actif: boolean
}

interface Member {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  photoUrl: string | null
  qrCodeId: string
  createdAt: string
  subscriptions: Subscription[]
}

export default function MembresPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  useEffect(() => {
    let filtered = members

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.telephone.includes(searchTerm)
      )
    }

    setFilteredMembers(filtered)
  }, [members, searchTerm])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members')
      const data = await response.json()
      setMembers(data)
      setFilteredMembers(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const hasActiveSubscription = (member: Member) => {
    return member.subscriptions.some(sub => sub.actif && new Date(sub.dateFin) >= new Date())
  }

  const downloadQRCode = (member: Member) => {
    const svg = document.getElementById(`qr-${member.id}`)
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')

      const downloadLink = document.createElement('a')
      downloadLink.download = `QR-${member.nom}-${member.prenom}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  const deleteMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${memberName} ? Cette action est irréversible.`)) {
      return
    }

    try {
      const response = await fetch(`/api/members?id=${memberId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Erreur lors de la suppression')

      await fetchMembers()
      alert('Membre supprimé avec succès')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression du membre')
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
          <CardTitle className="text-2xl font-bold text-white">Liste des Membres</CardTitle>
          <CardDescription className="text-purple-300">Tous les membres inscrits dans le système</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label className="text-purple-200">Rechercher</Label>
            <Input
              placeholder="Nom, prénom, email, téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="rounded-md border border-purple-500/30 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/30 bg-purple-900/20">
                  <TableHead className="text-purple-200 font-semibold">Photo</TableHead>
                  <TableHead className="text-purple-200 font-semibold">Nom</TableHead>
                  <TableHead className="text-purple-200 font-semibold">Email</TableHead>
                  <TableHead className="text-purple-200 font-semibold">Téléphone</TableHead>
                  <TableHead className="text-purple-200 font-semibold">Date d'inscription</TableHead>
                  <TableHead className="text-purple-200 font-semibold">Statut</TableHead>
                  <TableHead className="text-purple-200 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Aucun membre trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id} className="border-purple-500/20 hover:bg-purple-900/20 transition-colors">
                      <TableCell>
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={`${member.prenom} ${member.nom}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-semibold">
                              {member.prenom[0]}{member.nom[0]}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        {member.prenom} {member.nom}
                      </TableCell>
                      <TableCell className="text-purple-200">{member.email}</TableCell>
                      <TableCell className="text-purple-200">{member.telephone}</TableCell>
                      <TableCell className="text-purple-200">
                        {format(new Date(member.createdAt), 'dd MMM yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell>
                        {hasActiveSubscription(member) ? (
                          <Badge variant="default">Actif</Badge>
                        ) : (
                          <Badge variant="secondary">Inactif</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedMember(member)}
                              >
                                Voir QR
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>QR Code</DialogTitle>
                                <DialogDescription>
                                  {member.prenom} {member.nom}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex flex-col items-center space-y-4 py-4">
                                <QRCodeSVG
                                  id={`qr-${member.id}`}
                                  value={`${process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/verify/${member.qrCodeId}`}
                                  size={256}
                                  level="H"
                                  includeMargin={true}
                                />
                                <div className="text-center">
                                  <p className="text-sm text-white font-mono">Code: {member.qrCodeId}</p>
                                </div>
                                <Button onClick={() => downloadQRCode(member)}>
                                  Télécharger le QR Code
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteMember(member.id, `${member.prenom} ${member.nom}`)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-purple-300">
            Total : <span className="font-semibold text-white">{filteredMembers.length}</span> membre{filteredMembers.length > 1 ? 's' : ''}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
