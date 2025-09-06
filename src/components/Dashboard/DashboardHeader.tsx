'use client'

import { memo } from 'react'

interface DashboardHeaderProps {
  playerData: {
    level: number
    xp: number
    coins: number
    energy: number
    maxEnergy: number
  }
  theme: {
    icons: {
      character: string
    }
  }
  isDevModeActive: boolean
  showMobileMenu: boolean
  onToggleMobileMenu: () => void
}

const DashboardHeader = memo(function DashboardHeader({
  playerData,
  theme,
  isDevModeActive,
  showMobileMenu,
  onToggleMobileMenu
}: DashboardHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="mobile-container py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
              <span className="text-lg sm:text-2xl mr-1 sm:mr-2">{theme.icons.character}</span>
              <span className="text-primary-600 hidden sm:inline">FocusQuest</span>
              <span className="text-primary-600 sm:hidden">FQ</span>
              {isDevModeActive && (
                <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                  🛠️
                </span>
              )}
            </h1>
          </div>
          
          {/* Player Stats - Mobile Responsive */}
          <div className="flex items-center space-x-2 sm:space-x-6">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">Level</span>
              <span className="font-bold text-primary-600 text-sm sm:text-base">{playerData.level}</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">XP</span>
              <span className="font-bold text-blue-600 text-sm sm:text-base">{playerData.xp.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm sm:text-base">💰</span>
              <span className="font-bold text-yellow-600 text-sm sm:text-base">{playerData.coins.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm sm:text-base">⚡</span>
              <span className="font-bold text-green-600 text-sm sm:text-base">{playerData.energy}/{playerData.maxEnergy}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default DashboardHeader