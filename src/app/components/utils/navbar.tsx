"use client"

import { Home, Grid3X3 } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-48 bg-white border-r border-gray-300 flex flex-col">
        {/* Logo/Header Section */}
        <div className="h-24 bg-gray-200 border-b border-gray-300">
          {/* Logo placeholder - you can add your logo here */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 py-6">
          <nav className="space-y-2 px-4">
            <Link
              href="/"
              className="flex items-center space-x-3 text-gray-700 hover:text-black hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
            >
              <Home size={18} />
              <span className="text-sm font-medium underline">Accueil</span>
            </Link>

            <Link
              href="/modules"
              className="flex items-center space-x-3 text-gray-700 hover:text-black hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
            >
              <Grid3X3 size={18} />
              <span className="text-sm font-medium">Modules</span>
            </Link>
          </nav>
        </div>

        {/* Footer Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-600 leading-relaxed">
            <p>© 2025 EvolOS. All rights reserved.</p>
            <p>Built with Next.js, TypeScript, and Tailwind CSS.</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50">
        {/* This is where your page content will go */}
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">Main content area</p>
        </div>
      </div>
    </div>
  )
}
