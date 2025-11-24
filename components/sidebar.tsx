"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, UserPlus, Calendar, QrCode, Dumbbell, Users, BarChart3, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Nouveaux Clients", href: "/nouveaux-clients", icon: UserPlus },
  { name: "Membres", href: "/membres", icon: Users },
  { name: "Abonnements", href: "/abonnements", icon: Calendar },
  { name: "Bientôt Expirés", href: "/expiration", icon: AlertTriangle },
  { name: "Statistiques", href: "/statistiques", icon: BarChart3 },
  { name: "Scanner QR", href: "/scanner", icon: QrCode },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expiringCount, setExpiringCount] = useState(0)

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
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-50">
      <div className="flex flex-col flex-grow bg-gradient-to-b from-purple-900/20 to-blue-900/20 backdrop-blur-xl border-r border-purple-500/20 pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <div className="relative">
            <Dumbbell className="h-10 w-10 text-purple-400" />
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-25"></div>
          </div>
          <div className="ml-3">
            <span className="text-2xl font-bold gradient-text">Club SAAS</span>
            <p className="text-xs text-purple-300">Gestion moderne</p>
          </div>
        </div>
        <nav className="mt-5 flex-1 flex flex-col px-2 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300",
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50"
                    : "text-purple-200 hover:bg-white/10 hover:text-white hover:shadow-lg hover:shadow-purple-500/20"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-50"></div>
                )}
                <item.icon
                  className={cn(
                    "relative mr-3 flex-shrink-0 h-5 w-5 transition-transform group-hover:scale-110",
                    isActive ? "text-white" : "text-purple-300"
                  )}
                  aria-hidden="true"
                />
                <span className="relative">{item.name}</span>
                {item.href === '/expiration' && expiringCount > 0 && (
                  <span className="ml-auto relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-orange-500 text-[10px] font-bold text-white">
                      {expiringCount}
                    </span>
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
        <div className="px-4 py-4">
          <div className="glass rounded-xl p-4">
            <p className="text-xs text-purple-300 mb-2">Version</p>
            <p className="text-sm font-semibold text-white">v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
