"use client"

import type React from "react"
import { Home, Grid3X3, User, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

interface LayoutWithNavbarProps {
  children: React.ReactNode
}

export function LayoutWithNavbar({ children }: LayoutWithNavbarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"

  }

  return (
    <div className="flex h-screen bg-white">
      {/* Navbar - Fixed width */}
      <div className="w-64 bg-white border-r border-gray-300 flex flex-col justify-between">
        <div>
          {/* Logo/Header Section */}
          <div className="h-20 bg-gray-200 border-b border-gray-300 flex items-center justify-center">
            <div className="text-lg font-bold text-gray-700">EvolOS</div>
          </div>

          {/* Navigation Section */}
          <div className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              <Link
                href="/"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/"
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Home size={18} />
                <span>Accueil</span>
              </Link>

              <Link
                href="/availables-users"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/availables-users"
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <User size={18} />
                <span>Utilisateurs disponibles</span>
              </Link>

              <Link
                href="/modules"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/modules"
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Grid3X3 size={18} />
                <span>Modules</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Logout + Footer */}
        <div className="px-3 pb-4 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>

          <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 leading-relaxed">
            <p className="font-medium">© 2025 EvolOS</p>
            <p>All rights reserved.</p>
            <p className="mt-1">Built with Next.js, TypeScript, and Tailwind CSS.</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 overflow-auto">{children}</div>
    </div>
  )
}
