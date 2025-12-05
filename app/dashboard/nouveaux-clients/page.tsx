'use client'

import { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Camera, Upload, X } from 'lucide-react'

export default function NouveauxClientsPage() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    photoUrl: ''
  })
  const [loading, setLoading] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [qrCodeData, setQrCodeData] = useState<{ qrCodeId: string; membre: any } | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
      setShowCamera(true)
    } catch (error) {
      console.error('Erreur caméra:', error)
      alert('Impossible d\'accéder à la caméra. Vérifiez les autorisations.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8)
        setCapturedPhoto(photoDataUrl)
        setFormData({ ...formData, photoUrl: photoDataUrl })
        stopCamera()
      }
    }
  }

  const removePhoto = () => {
    setCapturedPhoto(null)
    setFormData({ ...formData, photoUrl: '' })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setCapturedPhoto(result)
        setFormData({ ...formData, photoUrl: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Erreur lors de la création')

      const data = await response.json()
      setQrCodeData(data)
      setShowQRCode(true)
      
      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        photoUrl: ''
      })
      setCapturedPhoto(null)
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la création du membre')
    } finally {
      setLoading(false)
    }
  }

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg')
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
      downloadLink.download = `QR-${qrCodeData?.membre.nom}-${qrCodeData?.membre.prenom}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
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
          <CardTitle className="text-2xl font-bold text-white">Nouveau Client</CardTitle>
          <CardDescription className="text-purple-300">Inscrivez un nouveau membre et générez son QR code</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom" className="text-purple-200">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom" className="text-purple-200">Prénom *</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-purple-200">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone" className="text-purple-200">Téléphone *</Label>
              <Input
                id="telephone"
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-purple-200">Photo du membre</Label>
              
              {capturedPhoto ? (
                <div className="relative">
                  <img 
                    src={capturedPhoto} 
                    alt="Photo du membre" 
                    className="w-full h-48 object-cover rounded-lg border-2 border-purple-500/30"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full text-white shadow-lg transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    onClick={startCamera}
                    variant="outline"
                    className="w-full bg-black/40 border-purple-500/40 text-purple-100 hover:bg-purple-500/20"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Prendre une photo
                  </Button>
                  
                  <label className="cursor-pointer">
                    <div className="flex items-center justify-center w-full px-4 py-2 border border-purple-500/40 rounded-md bg-black/40 text-purple-100 hover:bg-purple-500/20 transition text-sm font-medium">
                      <Upload className="h-4 w-4 mr-2" />
                      Télécharger
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoUrl" className="text-purple-200">Ou entrez une URL photo (optionnel)</Label>
              <Input
                id="photoUrl"
                type="url"
                value={capturedPhoto ? '' : formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                disabled={!!capturedPhoto}
                placeholder="https://exemple.com/photo.jpg"
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg shadow-purple-500/50" disabled={loading}>
              {loading ? 'Création...' : 'Créer le membre'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Dialog Caméra */}
      <Dialog open={showCamera} onOpenChange={(open) => !open && stopCamera()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Prendre une photo</DialogTitle>
            <DialogDescription>
              Positionnez le membre devant la caméra
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto"
              />
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-3">
              <Button
                onClick={capturePhoto}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Camera className="h-4 w-4 mr-2" />
                Capturer
              </Button>
              <Button
                onClick={stopCamera}
                variant="outline"
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code généré avec succès !</DialogTitle>
            <DialogDescription>
              QR Code pour {qrCodeData?.membre.prenom} {qrCodeData?.membre.nom}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            {qrCodeData && (
              <>
                <QRCodeSVG
                  id="qr-code-svg"
                  value={`${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/verify/${qrCodeData.qrCodeId}`}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
                <div className="text-center">
                  <p className="text-xs text-purple-400">URL: {process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/verify/{qrCodeData.qrCodeId}</p>
                </div>
              </>
            )}
            <Button onClick={downloadQRCode}>
              Télécharger le QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
