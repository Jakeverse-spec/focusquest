export interface PlayerData {
  level: number
  xp: number
  coins: number
  energy: number
  maxEnergy: number
  completedSessions: number
  streak: number
  theme: string
}

export const INITIAL_PLAYER_DATA: PlayerData = {
  level: 1,
  xp: 0,
  coins: 0,
  energy: 100,
  maxEnergy: 100,
  completedSessions: 0,
  streak: 0,
  theme: 'fantasy'
}

export const XP_PER_LEVEL = 200
export const XP_PER_SESSION = 50
export const COINS_PER_SESSION = 10
export const ENERGY_COST_PER_SESSION = 20

export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function getXPForNextLevel(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP)
  return currentLevel * XP_PER_LEVEL
}

export function completeSession(playerData: PlayerData, durationMinutes: number = 25): PlayerData {
  // Calculate XP based on duration - longer sessions give more XP
  const baseXP = XP_PER_SESSION
  const multiplier = Math.min(5.0, 0.4 + (durationMinutes * 0.04)) // 15min = 1.0x, 25min = 1.4x, 60min = 2.8x, 120min = 5.0x
  const earnedXP = Math.floor(baseXP * multiplier)
  const earnedCoins = Math.floor(earnedXP / 5)
  
  const newXP = playerData.xp + earnedXP
  const newLevel = calculateLevel(newXP)
  const leveledUp = newLevel > playerData.level

  return {
    ...playerData,
    xp: newXP,
    level: newLevel,
    coins: playerData.coins + earnedCoins + (leveledUp ? 50 : 0), // Bonus coins for leveling up
    energy: Math.min(playerData.maxEnergy, playerData.energy + Math.floor(durationMinutes / 5)), // More energy for longer sessions
    completedSessions: playerData.completedSessions + 1,
    streak: playerData.streak + 1
  }
}

export function calculateSessionRewards(durationMinutes: number): { xp: number; coins: number; multiplier: number } {
  const baseXP = XP_PER_SESSION
  const multiplier = Math.min(5.0, 0.4 + (durationMinutes * 0.04))
  const xp = Math.floor(baseXP * multiplier)
  const coins = Math.floor(xp / 5)
  
  return { xp, coins, multiplier }
}

export function loseEnergy(playerData: PlayerData, amount: number = ENERGY_COST_PER_SESSION): PlayerData {
  return {
    ...playerData,
    energy: Math.max(0, playerData.energy - amount)
  }
}

export const ACHIEVEMENTS = [
  { id: 'first_session', name: 'First Quest', description: 'Complete your first focus session', requirement: 1 },
  { id: 'streak_3', name: 'Consistent Adventurer', description: 'Complete 3 sessions in a row', requirement: 3 },
  { id: 'level_5', name: 'Seasoned Warrior', description: 'Reach level 5', requirement: 5 },
  { id: 'sessions_50', name: 'Quest Master', description: 'Complete 50 focus sessions', requirement: 50 }
]