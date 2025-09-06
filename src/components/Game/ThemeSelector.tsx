'use client'

import { useState } from 'react'
import { Palette, Lock, Check } from 'lucide-react'
import { Theme, THEMES, THEME_UNLOCK_REQUIREMENTS, getUnlockedThemes } from '@/lib/themeLogic'

interface ThemeSelectorProps {
  currentTheme: string
  playerLevel: number
  onThemeChange: (themeId: string) => void
  onDevModeActivate?: () => void
  isDevModeActive?: boolean
  onDevModeExit?: () => void
  onDevGameAccess?: () => void
}

export default function ThemeSelector({ currentTheme, playerLevel, onThemeChange, onDevModeActivate, isDevModeActive, onDevModeExit, onDevGameAccess }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unlockedThemes = getUnlockedThemes(playerLevel)

  return (
    <div className="game-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Palette className="w-6 h-6 text-primary-500" />
          <h2 className="text-xl font-bold">Theme Selection</h2>
        </div>
        <div className="text-sm text-gray-600">
          {unlockedThemes.length}/{THEMES.length} unlocked
        </div>
      </div>

      <div className="grid gap-4">
        {THEMES.map(theme => {
          const isUnlocked = unlockedThemes.some(t => t.id === theme.id)
          const isSelected = currentTheme === theme.id
          const requirement = THEME_UNLOCK_REQUIREMENTS[theme.id as keyof typeof THEME_UNLOCK_REQUIREMENTS]

          return (
            <div
              key={theme.id}
              className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : isUnlocked
                  ? 'border-gray-200 hover:border-gray-300'
                  : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
              }`}
              onClick={() => isUnlocked && onThemeChange(theme.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">
                    {isUnlocked ? theme.icons.character : <Lock className="w-8 h-8 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{theme.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
                    
                    {/* Theme Preview */}
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs text-gray-500">Preview:</span>
                      <div className="flex space-x-1">
                        {Object.entries(theme.icons).slice(1, 4).map(([key, icon]) => (
                          <span key={key} className="text-lg">{icon}</span>
                        ))}
                      </div>
                    </div>

                    {!isUnlocked && (
                      <div className="text-xs text-gray-500">
                        🔒 {requirement.description}
                      </div>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Color Palette Preview */}
              {isUnlocked && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Developer Mode Section */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        {isDevModeActive ? (
          <div className="text-center">
            <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-green-600 font-bold">🛠️ Developer Mode Active</span>
              </div>
              <div className="text-xs text-green-700">
                Max Level • Unlimited Coins • All Power-ups • All Items
              </div>
            </div>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={onDevGameAccess}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
              >
                🎮 All Games
              </button>
              <button
                onClick={onDevModeExit}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Exit Dev Mode
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <input
              type="text"
              placeholder="Developer code..."
              className="w-32 px-2 py-1 text-xs border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-gray-400"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement
                  if (input.value === 'Jaked3v') {
                    onDevModeActivate?.()
                    input.value = ''
                  }
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}