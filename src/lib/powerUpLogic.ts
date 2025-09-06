export interface PowerUp {
  id: string
  name: string
  description: string
  icon: string
  cost: number
  duration: number // in minutes, 0 for instant
  effect: {
    type: 'xp_multiplier' | 'coin_multiplier' | 'energy_restore' | 'time_extension' | 'streak_protection'
    value: number
  }
  rarity: 'common' | 'rare' | 'epic'
  unlockLevel: number
  cooldown?: number // in minutes
}

export interface ActivePowerUp {
  powerUpId: string
  startTime: Date
  endTime: Date
  effect: PowerUp['effect']
}

export const POWER_UPS: PowerUp[] = [
  {
    id: 'double_xp',
    name: 'Double XP',
    description: 'Earn 2x XP for the next 30 minutes',
    icon: '⚡',
    cost: 50,
    duration: 30,
    effect: { type: 'xp_multiplier', value: 2 },
    rarity: 'common',
    unlockLevel: 3
  },
  {
    id: 'triple_xp',
    name: 'Triple XP',
    description: 'Earn 3x XP for the next 20 minutes',
    icon: '🌟',
    cost: 100,
    duration: 20,
    effect: { type: 'xp_multiplier', value: 3 },
    rarity: 'rare',
    unlockLevel: 8
  },
  {
    id: 'coin_rush',
    name: 'Coin Rush',
    description: 'Earn 2.5x coins for the next 25 minutes',
    icon: '💰',
    cost: 60,
    duration: 25,
    effect: { type: 'coin_multiplier', value: 2.5 },
    rarity: 'common',
    unlockLevel: 5
  },
  {
    id: 'energy_potion',
    name: 'Energy Potion',
    description: 'Instantly restore 50 energy points',
    icon: '🧪',
    cost: 30,
    duration: 0,
    effect: { type: 'energy_restore', value: 50 },
    rarity: 'common',
    unlockLevel: 2
  },
  {
    id: 'mega_energy',
    name: 'Mega Energy Potion',
    description: 'Instantly restore full energy',
    icon: '⚗️',
    cost: 80,
    duration: 0,
    effect: { type: 'energy_restore', value: 100 },
    rarity: 'rare',
    unlockLevel: 10
  },
  {
    id: 'time_warp',
    name: 'Time Warp',
    description: 'Extend current session by 10 minutes',
    icon: '⏰',
    cost: 40,
    duration: 0,
    effect: { type: 'time_extension', value: 10 },
    rarity: 'common',
    unlockLevel: 4
  },
  {
    id: 'streak_shield',
    name: 'Streak Shield',
    description: 'Protect your streak from breaking for 24 hours',
    icon: '🛡️',
    cost: 120,
    duration: 1440, // 24 hours
    effect: { type: 'streak_protection', value: 1 },
    rarity: 'epic',
    unlockLevel: 12,
    cooldown: 2880 // 48 hours
  },
  {
    id: 'focus_surge',
    name: 'Focus Surge',
    description: 'Earn 4x XP and 3x coins for 15 minutes',
    icon: '🚀',
    cost: 200,
    duration: 15,
    effect: { type: 'xp_multiplier', value: 4 }, // Note: This would need special handling for dual effects
    rarity: 'epic',
    unlockLevel: 15
  }
]

export interface PowerUpInventory {
  [powerUpId: string]: number // quantity owned
}

export interface PowerUpCooldowns {
  [powerUpId: string]: Date // when cooldown expires
}

export function getUnlockedPowerUps(playerLevel: number): PowerUp[] {
  return POWER_UPS.filter(powerUp => playerLevel >= powerUp.unlockLevel)
}

export function getAvailablePowerUps(
  playerLevel: number, 
  cooldowns: PowerUpCooldowns
): PowerUp[] {
  const now = new Date()
  return getUnlockedPowerUps(playerLevel).filter(powerUp => {
    const cooldownExpiry = cooldowns[powerUp.id]
    return !cooldownExpiry || now >= cooldownExpiry
  })
}

export function canUsePowerUp(
  powerUp: PowerUp,
  inventory: PowerUpInventory,
  cooldowns: PowerUpCooldowns,
  playerCoins: number
): { canUse: boolean; reason?: string } {
  const now = new Date()
  
  // Check if player owns the power-up
  const owned = inventory[powerUp.id] || 0
  if (owned === 0 && playerCoins < powerUp.cost) {
    return { canUse: false, reason: 'Not enough coins' }
  }
  
  // Check cooldown
  const cooldownExpiry = cooldowns[powerUp.id]
  if (cooldownExpiry && now < cooldownExpiry) {
    const remainingMinutes = Math.ceil((cooldownExpiry.getTime() - now.getTime()) / (1000 * 60))
    return { canUse: false, reason: `Cooldown: ${remainingMinutes}m remaining` }
  }
  
  return { canUse: true }
}

export function usePowerUp(
  powerUp: PowerUp,
  inventory: PowerUpInventory,
  cooldowns: PowerUpCooldowns
): {
  newInventory: PowerUpInventory
  newCooldowns: PowerUpCooldowns
  activePowerUp?: ActivePowerUp
} {
  const now = new Date()
  const newInventory = { ...inventory }
  const newCooldowns = { ...cooldowns }
  
  // Consume from inventory if owned, otherwise it's a direct purchase
  if (newInventory[powerUp.id] > 0) {
    newInventory[powerUp.id]--
  }
  
  // Set cooldown if applicable
  if (powerUp.cooldown) {
    newCooldowns[powerUp.id] = new Date(now.getTime() + powerUp.cooldown * 60 * 1000)
  }
  
  // Create active power-up if it has duration
  let activePowerUp: ActivePowerUp | undefined
  if (powerUp.duration > 0) {
    activePowerUp = {
      powerUpId: powerUp.id,
      startTime: now,
      endTime: new Date(now.getTime() + powerUp.duration * 60 * 1000),
      effect: powerUp.effect
    }
  }
  
  return { newInventory, newCooldowns, activePowerUp }
}

export function isActivePowerUpExpired(activePowerUp: ActivePowerUp): boolean {
  return new Date() >= activePowerUp.endTime
}

export function getActivePowerUpTimeRemaining(activePowerUp: ActivePowerUp): number {
  const now = new Date()
  const remaining = activePowerUp.endTime.getTime() - now.getTime()
  return Math.max(0, Math.ceil(remaining / (1000 * 60))) // minutes
}

export function applyPowerUpEffects(
  baseValue: number,
  activePowerUps: ActivePowerUp[],
  effectType: PowerUp['effect']['type']
): number {
  const relevantPowerUps = activePowerUps.filter(
    powerUp => powerUp.effect.type === effectType && !isActivePowerUpExpired(powerUp)
  )
  
  if (relevantPowerUps.length === 0) return baseValue
  
  // For multipliers, we multiply all active effects
  if (effectType === 'xp_multiplier' || effectType === 'coin_multiplier') {
    return relevantPowerUps.reduce((value, powerUp) => value * powerUp.effect.value, baseValue)
  }
  
  // For other effects, we sum the values
  const totalBonus = relevantPowerUps.reduce((sum, powerUp) => sum + powerUp.effect.value, 0)
  return baseValue + totalBonus
}

export const RARITY_COLORS = {
  common: 'border-green-300 bg-green-50',
  rare: 'border-blue-300 bg-blue-50',
  epic: 'border-purple-300 bg-purple-50'
}

export const RARITY_TEXT_COLORS = {
  common: 'text-green-600',
  rare: 'text-blue-600',
  epic: 'text-purple-600'
}