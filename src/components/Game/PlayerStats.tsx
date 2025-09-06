'use client'

interface PlayerStatsProps {
  level: number
  xp: number
  maxXP: number
  coins: number
  energy: number
  maxEnergy: number
}

export default function PlayerStats({ level, xp, maxXP, coins, energy, maxEnergy }: PlayerStatsProps) {
  const xpProgress = (xp / maxXP) * 100
  const energyProgress = (energy / maxEnergy) * 100

  return (
    <div className="game-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Player Stats</h2>
        <div className="text-2xl">⚔️</div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Level {level}</span>
            <span>{xp}/{maxXP} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Energy</span>
            <span>{energy}/{maxEnergy}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-game-energy h-2 rounded-full transition-all duration-300"
              style={{ width: `${energyProgress}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <span className="font-medium">Coins</span>
          <span className="text-game-gold font-bold">💰 {coins}</span>
        </div>
      </div>
    </div>
  )
}