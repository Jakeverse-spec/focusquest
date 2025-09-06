'use client'

import { Achievement, RARITY_COLORS, RARITY_TEXT_COLORS } from '@/lib/achievementLogic'
import { Trophy, Lock } from 'lucide-react'

interface AchievementPanelProps {
  achievements: Achievement[]
}

export default function AchievementPanel({ achievements }: AchievementPanelProps) {
  const unlockedCount = achievements.filter(a => a.isUnlocked).length
  const totalCount = achievements.length

  const categories = [
    { id: 'sessions', name: 'Focus Sessions', icon: '🎯' },
    { id: 'tasks', name: 'Quest Completion', icon: '✅' },
    { id: 'streaks', name: 'Consistency', icon: '🔥' },
    { id: 'levels', name: 'Character Growth', icon: '⭐' }
  ]

  return (
    <div className="game-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Trophy className="w-6 h-6 text-game-gold" />
          <h2 className="text-xl font-bold">Achievements</h2>
        </div>
        <div className="text-sm text-gray-600">
          {unlockedCount}/{totalCount} unlocked
        </div>
      </div>

      <div className="space-y-6">
        {categories.map(category => {
          const categoryAchievements = achievements.filter(a => a.category === category.id)
          const unlockedInCategory = categoryAchievements.filter(a => a.isUnlocked).length

          return (
            <div key={category.id}>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg">{category.icon}</span>
                <h3 className="font-medium text-gray-800">{category.name}</h3>
                <span className="text-sm text-gray-500">
                  ({unlockedInCategory}/{categoryAchievements.length})
                </span>
              </div>

              <div className="grid gap-3">
                {categoryAchievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.isUnlocked
                        ? RARITY_COLORS[achievement.rarity]
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">
                          {achievement.isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-400" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 mb-1">
                            {achievement.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {achievement.description}
                          </p>
                          
                          {!achievement.isUnlocked && (
                            <div className="mb-2">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>{Math.min(achievement.currentProgress, achievement.requirement)}/{achievement.requirement}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                                  style={{ 
                                    width: `${Math.min((achievement.currentProgress / achievement.requirement) * 100, 100)}%` 
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex items-center space-x-3 text-xs">
                            <span className={`font-medium uppercase ${RARITY_TEXT_COLORS[achievement.rarity]}`}>
                              {achievement.rarity}
                            </span>
                            {achievement.isUnlocked && achievement.unlockedAt && (
                              <span className="text-gray-500">
                                Unlocked {achievement.unlockedAt.toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm">
                        <div className="text-primary-600 font-medium">+{achievement.xpReward} XP</div>
                        <div className="text-game-gold font-medium">+{achievement.coinReward} 💰</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}