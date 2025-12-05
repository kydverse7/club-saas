"use client"

import { Sparkles } from "lucide-react"

export function TopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-10 bg-gradient-to-r from-purple-900/90 via-blue-900/90 to-purple-900/90 backdrop-blur-md border-b border-purple-500/30">
      <div className="h-full flex items-center justify-center px-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
          <span className="text-sm font-medium bg-gradient-to-r from-purple-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent">
            Développé par YK
          </span>
          <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
