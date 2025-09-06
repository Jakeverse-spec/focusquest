'use client'

import { useState } from 'react'
import { ShoppingBag, Clock, Zap, Lock } from 'lucide-react'
import { 
  PowerUp, 
  PowerUpInventory, 
  PowerUpCooldowns,
  ActivePowerUp,
  POWER_UPS, 
  getUnlockedPowerUps, 
  canUsePowerUp,
  getActivePowerUpTimeRemaining,
  RARITY_COLORS,
  RARITY_TEXT_COLORS
} from '@/lib/powerUpLogic'

interface PowerUpShopProps {
  playerLevel: number
  playerCoins: number
  inventory: PowerUpInventory
  cooldowns: PowerUpCooldowns
  activePowerUps: ActivePowerUp[]
  onPurchasePowerUp: (powerUp: PowerUp) => void
  onUsePowerUp: (powerUp: PowerUp) => void
}

export default function PowerUpShop({
  playerLevel,
  playerCoins,
  inventory,
  cooldowns,
  activePowerUps,
  onPurchasePowerUp,
  onUsePowerUp
}: PowerUpShopProps) {
  const [filter, setFilter] = useState<'all' | 'owned' | 'available'>('all')
  
  const unlockedPowerUps = getUnlockedPowerUps(playerLevel)
  
  const filteredPowerUps = unlockedPowerUps.filter(powerUp => {
    const owned = inventory[powerUp.id] || 0
    if (filter === 'owned') return owned > 0
    if (filter === 'available') return owned === 0
    return true
  })

  const getActivePowerUp = (powerUpId: string) => {
    return activePowerUps.find(ap => ap.powerUpId === powerUpId)
  }

  const formatDuration = (minutes: number) => {
    if (minutes === 0) return 'Instant'
    if (minutes >= 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
    return `${minutes}m`
  }

  return (
    <div className="game-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <ShoppingBag className="w-6 h-6 text-purple-500" />
          <h2 className="text-xl font-bold">Power-Up Shop</h2>
        </div>
        <div className="text-sm text-gray-600">
          💰 {playerCoins} coins
        </div>
      </div>

      {/* Active Power-Ups */}
      {activePowerUps.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-3">🔥 Active Power-Ups</h3>
          <div className="space-y-2">
            {activePowerUps.map((activePowerUp, index) => {
              const powerUp = POWER_UPS.find(p => p.id === activePowerUp.powerUpId)
              if (!powerUp) return null
              
              const timeRemaining = getActivePowerUpTimeRemaining(activePowerUp)
              
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{powerUp.icon}</span>
                    <div>
                      <div className="font-medium">{powerUp.name}</div>
                      <div className="text-sm text-gray-600">
                        {powerUp.effect.type === 'xp_multiplier' && `${powerUp.effect.value}x XP`}
                        {powerUp.effect.type === 'coin_multiplier' && `${powerUp.effect.value}x Coins`}
                        {powerUp.effect.type === 'streak_protection' && 'Streak Protected'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-purple-600">
                      {timeRemaining}m left
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'all', label: 'All', count: unlockedPowerUps.length },
          { key: 'owned', label: 'Owned', count: Object.values(inventory).reduce((sum, qty) => sum + (qty > 0 ? 1 : 0), 0) },
          { key: 'available', label: 'Shop', count: unlockedPowerUps.filter(p => !inventory[p.id]).length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              filter === tab.key 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Power-Ups Grid */}
      <div className="grid gap-4 max-h-96 overflow-y-auto">
        {filteredPowerUps.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No power-ups found</p>
            <p className="text-sm">Level up to unlock more power-ups!</p>
          </div>
        ) : (
          filteredPowerUps.map(powerUp => {
            const owned = inventory[powerUp.id] || 0
            const { canUse, reason } = canUsePowerUp(powerUp, inventory, cooldowns, playerCoins)
            const activePowerUp = getActivePowerUp(powerUp.id)
            const isActive = !!activePowerUp
            
            return (
              <div
                key={powerUp.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isActive 
                    ? 'border-purple-400 bg-purple-50 shadow-lg' 
                    : RARITY_COLORS[powerUp.rarity]
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl relative">
                      {powerUp.icon}
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">{powerUp.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{powerUp.description}</p>
                      
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className={`font-medium uppercase ${RARITY_TEXT_COLORS[powerUp.rarity]}`}>
                          {powerUp.rarity}
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDuration(powerUp.duration)}</span>
                        </span>
                        {powerUp.cooldown && (
                          <span>Cooldown: {formatDuration(powerUp.cooldown)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    {owned > 0 && (
                      <div className="text-green-600 font-medium">
                        Owned: {owned}
                      </div>
                    )}
                    {isActive && activePowerUp && (
                      <div className="text-purple-600 font-medium">
                        Active: {getActivePowerUpTimeRemaining(activePowerUp)}m left
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {owned === 0 && (
                      <button
                        onClick={() => onPurchasePowerUp(powerUp)}
                        disabled={playerCoins < powerUp.cost}
                        className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                          playerCoins >= powerUp.cost
                            ? 'bg-game-gold text-white hover:bg-yellow-500'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Buy 💰{powerUp.cost}
                      </button>
                    )}
                    
                    {(owned > 0 || playerCoins >= powerUp.cost) && (
                      <button
                        onClick={() => onUsePowerUp(powerUp)}
                        disabled={!canUse || isActive}
                        className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                          canUse && !isActive
                            ? 'bg-purple-500 text-white hover:bg-purple-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        title={!canUse ? reason : isActive ? 'Already active' : 'Use power-up'}
                      >
                        {isActive ? 'Active' : owned > 0 ? 'Use' : 'Buy & Use'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}