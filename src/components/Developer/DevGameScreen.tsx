'use client'

import { useState } from 'react'
import { X, Gamepad2 } from 'lucide-react'
import { MINI_GAMES } from '@/lib/miniGameLogic'
import MemoryCardGame from '@/components/MiniGames/MemoryCardGame'
import EmojiMemoryGame from '@/components/MiniGames/EmojiMemoryGame'
import SpeedMathGame from '@/components/MiniGames/SpeedMathGame'
import OsuRhythmGame from '@/components/MiniGames/OsuRhythmGame'
import DragonbornGame from '@/components/MiniGames/DragonbornGame'

interface DevGameScreenProps {
  onClose: () => void
  onGameComplete: (gameId: string, result: any) => void
}

export default function DevGameScreen({ onClose, onGameComplete }: DevGameScreenProps) {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [showGame, setShowGame] = useState(false)

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId)
    setShowGame(true)
  }

  const handleGameComplete = (result: any) => {
    if (selectedGame) {
      onGameComplete(selectedGame, result)
    }
    setShowGame(false)
    setSelectedGame(null)
  }

  const handleGameClose = () => {
    setShowGame(false)
    setSelectedGame(null)
  }

  // Render specific game
  if (showGame && selectedGame) {
    switch (selectedGame) {
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
                This game is still in development.
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
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header with X button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Gamepad2 className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold">🎮 Developer Game Center</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600">
            🔓 Developer mode activated! Play any game without restrictions.
          </p>
        </div>

        {/* All Games Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {MINI_GAMES.map(game => (
            <div
              key={game.id}
              onClick={() => handleGameSelect(game.id)}
              className="p-6 rounded-lg border-2 border-gray-200 hover:border-purple-300 cursor-pointer transition-all hover:bg-purple-50 hover:scale-105"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{game.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{game.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{game.description}</p>
                
                <div className="flex items-center justify-center space-x-4 text-xs">
                  <span className={`font-medium uppercase ${
                    game.difficulty === 'easy' ? 'text-green-500' :
                    game.difficulty === 'medium' ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {game.difficulty}
                  </span>
                  <span className="text-primary-600">+{game.baseReward.xp} XP</span>
                  <span className="text-game-gold">+{game.baseReward.coins} 💰</span>
                </div>

                <div className="mt-4">
                  <button className="btn-game w-full">
                    Play Now
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add some extra developer games */}
          <div className="p-6 rounded-lg border-2 border-dashed border-gray-300 opacity-60">
            <div className="text-center">
              <div className="text-4xl mb-3">🚧</div>
              <h3 className="font-bold text-gray-600 mb-2">More Games Coming</h3>
              <p className="text-sm text-gray-500">
                Additional games in development...
              </p>
            </div>
          </div>
        </div>

        {/* Developer Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-xs text-gray-500">
            🛠️ Developer Mode | All games unlocked | No level restrictions
          </p>
        </div>
      </div>
    </div>
  )
}