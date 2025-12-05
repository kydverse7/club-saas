"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Dumbbell, 
  Users, 
  QrCode, 
  Calendar, 
  BarChart3, 
  Shield, 
  Zap, 
  ArrowRight,
  CheckCircle,
  Smartphone,
  Bell,
  Clock
} from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Gestion des Membres",
    description: "Créez et gérez facilement les profils de vos membres avec toutes leurs informations.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: QrCode,
    title: "QR Codes Uniques",
    description: "Chaque membre reçoit un QR code unique pour un accès rapide et sécurisé.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Calendar,
    title: "Abonnements Flexibles",
    description: "Gérez les abonnements mensuels, trimestriels ou annuels en toute simplicité.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: BarChart3,
    title: "Statistiques Détaillées",
    description: "Suivez vos revenus, le nombre de visites et l'évolution de votre club.",
    color: "from-orange-500 to-yellow-500"
  },
  {
    icon: Bell,
    title: "Alertes d'Expiration",
    description: "Recevez des notifications pour les abonnements qui arrivent à expiration.",
    color: "from-red-500 to-orange-500"
  },
  {
    icon: Smartphone,
    title: "Scanner Mobile",
    description: "Scannez les QR codes directement depuis votre téléphone pour valider les entrées.",
    color: "from-cyan-500 to-blue-500"
  }
]

const benefits = [
  "Interface moderne et intuitive",
  "Accès depuis n'importe quel appareil",
  "Données sécurisées dans le cloud",
  "Mises à jour automatiques",
  "Support technique réactif",
  "Personnalisation possible"
]

export default function AccueilPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative p-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl shadow-purple-500/50">
                <Dumbbell className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Club SAAS
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-purple-200 mb-4">
            Le système de gestion moderne pour votre club de sport
          </p>
          <p className="text-lg text-purple-300/80 mb-12 max-w-2xl mx-auto">
            Gérez vos membres, abonnements et accès avec une interface futuriste et intuitive.
            Simplifiez votre quotidien grâce à notre technologie de pointe.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-lg text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                Accéder au Dashboard
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <a href="#features">
              <button className="px-8 py-4 glass rounded-xl font-semibold text-lg text-purple-200 hover:bg-white/10 hover:scale-105 transition-all duration-300 border border-purple-500/30">
                Découvrir les fonctionnalités
              </button>
            </a>
          </div>

          {/* Stats Preview */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold gradient-text">100%</p>
              <p className="text-sm text-purple-300">En ligne</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold gradient-text">24/7</p>
              <p className="text-sm text-purple-300">Accessible</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold gradient-text">∞</p>
              <p className="text-sm text-purple-300">Membres</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-purple-400/50 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Fonctionnalités</span> Puissantes
            </h2>
            <p className="text-lg text-purple-300 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour gérer votre club efficacement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-6 glow-hover cursor-pointer group border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-purple-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pourquoi choisir <span className="gradient-text">Club SAAS</span> ?
              </h2>
              <p className="text-lg text-purple-300 mb-8">
                Notre solution a été conçue pour répondre aux besoins spécifiques des clubs de sport, 
                avec une attention particulière portée à l'expérience utilisateur et à l'efficacité.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-purple-200">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-3xl blur-xl"></div>
              <div className="relative glass rounded-3xl p-8 border border-purple-500/30">
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass rounded-xl p-4 text-center">
                    <Shield className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-purple-300">Sécurisé</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm text-purple-300">Rapide</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <Clock className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                    <p className="text-sm text-purple-300">Temps réel</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <Smartphone className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-purple-300">Mobile</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 border border-purple-500/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-cyan-600 to-purple-600"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à <span className="gradient-text">transformer</span> votre club ?
            </h2>
            <p className="text-lg text-purple-300 mb-8">
              Commencez dès maintenant et découvrez une nouvelle façon de gérer votre établissement.
            </p>
            
            <Link href="/">
              <button className="group px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-xl text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto">
                Commencer maintenant
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dumbbell className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold gradient-text">Club SAAS</span>
          </div>
          <p className="text-purple-400 text-sm">
            © 2025 Club SAAS - Tous droits réservés
          </p>
          <p className="text-purple-500 text-xs mt-2">
            Développé avec ❤️ par YK
          </p>
        </div>
      </footer>
    </div>
  )
}
