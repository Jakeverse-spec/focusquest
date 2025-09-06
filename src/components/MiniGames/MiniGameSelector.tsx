'use client'

import { useState } from 'react'
import { Gamepad2, Star, Lock, Play } from 'lucide-react'
import { MiniGame, MINI_GAMES, getUnlockedMiniGames } from '@/lib/miniGameLogic'
import MemoryCardGame from './MemoryCardGame'
import EmojiMemoryGame from './EmojiMemoryGame'
import SpeedMathGame from './SpeedMathGame'
import OsuRhythmGame from './OsuRhythmGame'
import DragonbornGame from './DragonbornGame'

interface MiniGameSelectorProps {
  playerLevel: number
  onGameComplete: (gameId: string, result: any) => void
  onClose: () => void
}

export default function MiniGameSelector({ playerLevel, onGameComplete, onClose }: MiniGameSelectorProps) {
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null)
  const [showGame, setShowGame] = useState(false)
  
  const unlockedGames = getUnlockedMiniGames(playerLevel)
  
  const getDifficultyColor = (difficulty: MiniGame['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500'
      case 'medium': return 'text-yellow-500'
      case 'hard': return 'text-red-500'
    }
  }

  const handleGameSelect = (game: MiniGame) => {
    setSelectedGame(game)
    setShowGame(true)
  }

  const handleGameComplete = (result: any) => {
    if (selectedGame) {
      onGameComplete(selectedGame.id, result)
    }
    setShowGame(false)
    setSelectedGame(null)
    onClose()
  }

  const handleGameClose = () => {
    setShowGame(false)
    setSelectedGame(null)
  }

  if (showGame && selectedGame) {
    // Render the specific mini-game
    switch (selectedGame.id) {
      case 'memory_cards':
        return (
          <MemoryCardGame
            onGameComplete={handleGameComplete}
            onClose={handleGameClose}
          />
        )
      case 'emoji_memory':
        return (
          <EmojiMemoryGame
            onGameComplete={handleGameComplete}
            onClose={handleGameClose}
          />
        )
      case 'speed_math':
        return (
          <SpeedMathGame
            onGameComplete={handleGameComplete}
            onClose={handleGameClose}
          />
        )
      case 'osu_rhythm':
        return (
          <OsuRhythmGame
            onGameComplete={handleGameComplete}
            onClose={handleGameClose}
          />
        )
      case 'dragonborn':
        return (
          <DragonbornGame
            onGameComplete={handleGameComplete}
            onClose={handleGameClose}
          />
        )
      default:
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 text-center">
              <h2 className="text-xl font-bold mb-4">Coming Soon!</h2>
              <p className="text-gray-600 mb-6">
                {selectedGame.name} is under development. Try the other games for now!
              </p>
              <button onClick={handleGameClose} className="btn-primary">
                Back to Games
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 max-w-2xl w-full mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-3">
            <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
            <h2 className="text-lg sm:text-xl font-bold">Mini-Game Rewards</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-button"
            title="Close"
          >
            <span className="text-gray-400 hover:text-gray-600 text-xl">✕</span>
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600">
            Great job completing your focus session! Choose a mini-game to earn bonus rewards.
          </p>
        </div>

        <div className="grid gap-4 max-h-96 overflow-y-auto">
          {MINI_GAMES.map(game => {
            const isUnlocked = unlockedGames.some(g => g.id === game.id)
            
            return (
              <div
                key={game.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isUnlocked
                    ? 'border-gray-200 hover:border-purple-300 cursor-pointer'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
                onClick={() => isUnlocked && handleGameSelect(game)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">
                      {isUnlocked ? game.icon : <Lock className="w-8 h-8 text-gray-400" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">{game.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{game.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs">
                        <span className={`font-medium uppercase ${getDifficultyColor(game.difficulty)}`}>
                          {game.difficulty}
                        </span>
                        <span className="text-primary-600">+{game.baseReward.xp} XP</span>
                        <span className="text-game-gold">+{game.baseReward.coins} 💰</span>
                        {!isUnlocked && (
                          <span className="text-gray-500">Level {game.unlockLevel}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {isUnlocked && (
                    <div className="flex items-center space-x-2">
                      <Play className="w-5 h-5 text-purple-500" />
                      <span className="text-sm font-medium text-purple-600">Play</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 text-center">
          <button onClick={onClose} className="btn-primary">
            Skip Mini-Games
          </button>
        </div>
      </div>
    </div>
  )
}