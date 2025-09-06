'use client'

import { useState, useEffect } from 'react'
import { Trophy, TrendingUp, TrendingDown, Minus, Users, Zap, Target, Gamepad2 } from 'lucide-react'
import { getLeaderboard, LeaderboardType, LeaderboardEntry } from '@/lib/leaderboardLogic'

interface LeaderboardPanelProps {
  currentPlayerId?: string
}

export default function LeaderboardPanel({ currentPlayerId }: LeaderboardPanelProps) {
  const [selectedType, setSelectedType] = useState<LeaderboardType>('overall_xp')
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const leaderboardTypes = [
    { id: 'overall_xp', name: 'Overall XP', icon: '🏆' },
    { id: 'weekly_xp', name: 'Weekly XP', icon: '📅' },
    { id: 'streak', name: 'Study Streak', icon: '🔥' },
    { id: 'sessions', name: 'Sessions', icon: '⚡' },
    { id: 'speed_math', name: 'Speed Math', icon: '🧮' },
    { id: 'osu_rhythm', name: 'Rhythm Game', icon: '⭕' },
    { id: 'emoji_memory', name: 'Memory Game', icon: '🧠' }
  ] as const

  useEffect(() => {
    loadLeaderboard()
  }, [selectedType])

  const loadLeaderboard = async () => {
    setIsLoading(true)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const data = getLeaderboard(selectedType, 20)
    setLeaderboard(data)
    setIsLoading(false)
  }

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const formatScore = (score: number, type: LeaderboardType) => {
    switch (type) {
      case 'overall_xp':
      case 'weekly_xp':
      case 'monthly_xp':
        return `${score.toLocaleString()} XP`
      case 'streak':
        return `${score} days`
      case 'sessions':
        return `${score} sessions`
      default:
        return `${score.toLocaleString()} pts`
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">🏆 Leaderboards</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Users className="w-4 h-4" />
          <span>{leaderboard.length} players</span>
        </div>
      </div>

      {/* Leaderboard Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {leaderboardTypes.map(type => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id as LeaderboardType)}
            className={`p-3 rounded-lg text-sm font-medium transition-all ${
              selectedType === type.id
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="text-lg mb-1">{type.icon}</div>
            <div className="text-xs">{type.name}</div>
          </button>
        ))}
      </div>

      {/* Live Update Indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live updates</span>
        </div>
        <button 
          onClick={loadLeaderboard}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Refresh
        </button>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading leaderboard...</p>
          </div>
        ) : (
          leaderboard.map((entry, index) => (
            <div
              key={entry.player.id}
              className={`flex items-center space-x-4 p-3 rounded-lg transition-all ${
                entry.player.id === currentPlayerId
                  ? 'bg-primary-50 border-2 border-primary-200 shadow-md'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {/* Rank */}
              <div className="flex items-center space-x-2 w-12">
                <span className={`font-bold text-lg ${
                  entry.rank === 1 ? 'text-yellow-500' :
                  entry.rank === 2 ? 'text-gray-400' :
                  entry.rank === 3 ? 'text-orange-600' :
                  'text-gray-600'
                }`}>
                  {entry.rank === 1 ? '🥇' :
                   entry.rank === 2 ? '🥈' :
                   entry.rank === 3 ? '🥉' :
                   `#${entry.rank}`}
                </span>
                {getRankChangeIcon(entry.change)}
              </div>

              {/* Player Info */}
              <div className="flex items-center space-x-3 flex-1">
                <div className="relative">
                  <div className="text-2xl">{entry.player.avatar}</div>
                  {entry.player.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-800">
                      {entry.player.username}
                    </span>
                    {entry.player.id === currentPlayerId && (
                      <span className="px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Level {entry.player.level}
                    {!entry.player.isOnline && (
                      <span className="ml-2 text-xs">
                        • Last seen {Math.floor((Date.now() - entry.player.lastActive.getTime()) / 60000)}m ago
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="font-bold text-gray-800">
                  {formatScore(entry.score, selectedType)}
                </div>
                {selectedType.includes('xp') && (
                  <div className="text-xs text-gray-500">
                    {entry.player.coins.toLocaleString()} 💰
                  </div>
                )}
              </div>

              {/* Challenge Button */}
              {entry.player.id !== currentPlayerId && entry.player.isOnline && (
                <button className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors">
                  <Gamepad2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Your Rank Summary */}
      {currentPlayerId && (
        <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg border border-primary-200">
          <div className="text-center">
            <h3 className="font-bold text-gray-800 mb-2">Your Current Rank</h3>
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  #{leaderboard.findIndex(e => e.player.id === currentPlayerId) + 1 || '?'}
                </div>
                <div className="text-xs text-gray-600">Overall</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">↗️</div>
                <div className="text-xs text-gray-600">Trending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">🎯</div>
                <div className="text-xs text-gray-600">Goal: Top 10</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}