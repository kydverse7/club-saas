'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Dumbbell, Lock, Mail, ArrowRight, Eye, EyeOff, Sparkles, Shield } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      if (email && password) {
        localStorage.setItem('isLoggedIn', 'true')
        router.push('/dashboard')
      } else {
        setError('Veuillez remplir tous les champs')
        setLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="min-h-[calc(100vh-40px)] flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-900/0 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-[420px]">
        {/* Logo Section */}
        <div className="text-center mb-8 sm:mb-10">
          <Link href="/" className="inline-block group">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity animate-pulse"></div>
                <div className="relative p-4 sm:p-5 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 rounded-2xl shadow-2xl shadow-purple-500/40 group-hover:shadow-purple-500/60 transition-shadow">
                  <Dumbbell className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Club SAAS
                </h1>
                <p className="text-purple-300/80 text-sm sm:text-base mt-1">Espace Administrateur</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <div className="relative">
          {/* Card Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/50 via-cyan-600/50 to-purple-600/50 rounded-3xl blur-lg opacity-30"></div>
          
          <div className="relative glass rounded-3xl p-6 sm:p-8 border border-purple-500/30 backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
              <Shield className="h-5 w-5 text-purple-400" />
              <h2 className="text-lg sm:text-xl font-semibold text-white">Connexion sécurisée</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 sm:p-4 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm">
                  <p className="text-red-300 text-sm text-center font-medium">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-200 ml-1">
                  Adresse email
                </label>
                <div className={`relative group transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity ${focusedField === 'email' ? 'opacity-50' : ''}`}></div>
                  <div className="relative flex items-center">
                    <div className={`absolute left-4 transition-colors duration-300 ${focusedField === 'email' ? 'text-cyan-400' : 'text-purple-400'}`}>
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-white/5 border-2 border-purple-500/20 rounded-xl text-white text-base placeholder-purple-400/40 focus:outline-none focus:border-purple-500/60 focus:bg-white/10 transition-all duration-300"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-purple-200 ml-1">
                  Mot de passe
                </label>
                <div className={`relative group transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                  <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity ${focusedField === 'password' ? 'opacity-50' : ''}`}></div>
                  <div className="relative flex items-center">
                    <div className={`absolute left-4 transition-colors duration-300 ${focusedField === 'password' ? 'text-cyan-400' : 'text-purple-400'}`}>
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-14 py-3.5 sm:py-4 bg-white/5 border-2 border-purple-500/20 rounded-xl text-white text-base placeholder-purple-400/40 focus:outline-none focus:border-purple-500/60 focus:bg-white/10 transition-all duration-300"
                      placeholder="••••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 p-1 text-purple-400 hover:text-cyan-400 transition-colors duration-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full group mt-2"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-cyan-600 to-purple-600 rounded-xl blur opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-full py-3.5 sm:py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white text-base sm:text-lg flex items-center justify-center gap-3 group-hover:from-purple-500 group-hover:to-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Connexion...</span>
                    </div>
                  ) : (
                    <>
                      <span>Se connecter</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6 sm:my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
              <Sparkles className="h-4 w-4 text-purple-400/50" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
            </div>

            {/* Back to Home */}
            <Link 
              href="/" 
              className="flex items-center justify-center gap-2 text-purple-300/80 hover:text-purple-200 transition-colors duration-300 group"
            >
              <ArrowRight className="h-4 w-4 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm sm:text-base">Retour à l'accueil</span>
            </Link>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-6 sm:mt-8">
          <div className="glass rounded-xl p-4 border border-purple-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20 shrink-0">
                <Sparkles className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-purple-300/90 font-medium">Mode démonstration</p>
                <p className="text-xs text-purple-400/70 mt-1">
                  Entrez n'importe quel email et mot de passe pour accéder au dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
