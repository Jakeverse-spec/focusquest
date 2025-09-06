'use client'

import { useState } from 'react'
import PomodoroTimer from '@/components/Timer/PomodoroTimer'
import PlayerStats from '@/components/Game/PlayerStats'
import PageHeader from '@/components/Navigation/PageHeader'
import { INITIAL_PLAYER_DATA, completeSession, getXPForNextLevel } from '@/lib/gameLogic'

export default function TimerPage() {
  const [playerData, setPlayerData] = useState(INITIAL_PLAYER_DATA)

  const handleSessionComplete = (durationMinutes: number) => {
    // Calculate XP based on duration
    const baseXP = 50
    const multiplier = Math.min(5.0, 0.4 + (durationMinutes * 0.04)) // Longer sessions = more XP
    const earnedXP = Math.floor(baseXP * multiplier)
    const earnedCoins = Math.floor(earnedXP / 5)
    
    setPlayerData(prev => {
      const newXP = prev.xp + earnedXP
      const newLevel = Math.floor(newXP / 200) + 1
      const leveledUp = newLevel > prev.level
      
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        coins: prev.coins + earnedCoins + (leveledUp ? 50 : 0),
        energy: Math.min(prev.maxEnergy, prev.energy + Math.floor(durationMinutes / 5)), // More energy for longer sessions
        completedSessions: prev.completedSessions + 1,
        streak: prev.streak + 1
      }
    })
    
    // Show celebration with earned rewards
    console.log(`Session complete! Earned ${earnedXP} XP and ${earnedCoins} coins for ${durationMinutes} minute session`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Focus Timer"
        subtitle="Choose your quest duration and start focusing"
        icon="⏱️"
        breadcrumbs={[
          { label: 'Focus Timer', icon: '⏱️', current: true }
        ]}
      />
      
      <div className="mobile-container py-6 lg:py-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <PomodoroTimer onComplete={handleSessionComplete} />
          </div>
          <div>
            <PlayerStats
              level={playerData.level}
              xp={playerData.xp}
              maxXP={getXPForNextLevel(playerData.xp)}
              coins={playerData.coins}
              energy={playerData.energy}
              maxEnergy={playerData.maxEnergy}
            />
          </div>
        </div>
      </div>
    </div>
  )
}