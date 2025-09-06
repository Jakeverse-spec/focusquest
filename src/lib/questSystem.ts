export interface Quest {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'seasonal' | 'achievement'
  category: 'productivity' | 'gaming' | 'social' | 'learning'
  requirements: QuestRequirement[]
  rewards: QuestReward
  progress: number
  maxProgress: number
  isCompleted: boolean
  expiresAt?: Date
  unlockedAt: Date
  completedAt?: Date
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary'
  icon: string
}

export interface QuestRequirement {
  type: 'complete_tasks' | 'earn_xp' | 'play_games' | 'maintain_streak' | 'focus_time' | 'win_games'
  target: number
  category?: string
  gameType?: string
}

export interface QuestReward {
  xp: number
  coins: number
  items?: string[]
  titles?: string[]
  pets?: string[]
}

export interface Equipment {
  id: string
  name: string
  description: string
  type: 'tool' | 'accessory' | 'consumable'
  category: 'productivity' | 'gaming' | 'social'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  effects: EquipmentEffect[]
  cost: number
  levelRequired: number
  icon: string
  isEquipped: boolean
  quantity: number
}

export interface EquipmentEffect {
  type: 'xp_boost' | 'coin_boost' | 'energy_boost' | 'focus_boost' | 'game_boost'
  value: number // percentage or flat bonus
  duration?: number // minutes, if temporary
}

export interface Pet {
  id: string
  name: string
  species: string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  level: number
  xp: number
  maxXp: number
  happiness: number
  maxHappiness: number
  abilities: PetAbility[]
  feedCost: number
  lastFed: Date
  icon: string
  isActive: boolean
}

export interface PetAbility {
  id: string
  name: string
  description: string
  type: 'passive' | 'active'
  effect: EquipmentEffect
  cooldown?: number // minutes
  lastUsed?: Date
}

export interface SeasonalEvent {
  id: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  theme: string
  specialQuests: string[]
  specialRewards: string[]
  isActive: boolean
}

export const DAILY_QUESTS: Omit<Quest, 'id' | 'progress' | 'isCompleted' | 'unlockedAt' | 'completedAt'>[] = [
  {
    title: 'Early Bird',
    description: 'Complete 3 tasks before noon',
    type: 'daily',
    category: 'productivity',
    requirements: [{ type: 'complete_tasks', target: 3 }],
    rewards: { xp: 50, coins: 25 },
    maxProgress: 3,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    difficulty: 'easy',
    icon: '🌅'
  },
  {
    title: 'Focus Master',
    description: 'Maintain focus for 2 hours total',
    type: 'daily',
    category: 'productivity',
    requirements: [{ type: 'focus_time', target: 120 }],
    rewards: { xp: 75, coins: 40 },
    maxProgress: 120,
    difficulty: 'medium',
    icon: '🎯'
  },
  {
    title: 'Game Champion',
    description: 'Win 5 mini-games',
    type: 'daily',
    category: 'gaming',
    requirements: [{ type: 'win_games', target: 5 }],
    rewards: { xp: 60, coins: 30 },
    maxProgress: 5,
    difficulty: 'medium',
    icon: '🏆'
  },
  {
    title: 'Streak Keeper',
    description: 'Maintain your productivity streak',
    type: 'daily',
    category: 'productivity',
    requirements: [{ type: 'maintain_streak', target: 1 }],
    rewards: { xp: 40, coins: 20 },
    maxProgress: 1,
    difficulty: 'easy',
    icon: '🔥'
  },
  {
    title: 'Learning Enthusiast',
    description: 'Complete 2 learning tasks',
    type: 'daily',
    category: 'learning',
    requirements: [{ type: 'complete_tasks', target: 2, category: 'learning' }],
    rewards: { xp: 80, coins: 35 },
    maxProgress: 2,
    difficulty: 'medium',
    icon: '📚'
  }
]

export const WEEKLY_QUESTS: Omit<Quest, 'id' | 'progress' | 'isCompleted' | 'unlockedAt' | 'completedAt'>[] = [
  {
    title: 'Productivity Powerhouse',
    description: 'Complete 25 tasks this week',
    type: 'weekly',
    category: 'productivity',
    requirements: [{ type: 'complete_tasks', target: 25 }],
    rewards: { xp: 300, coins: 150, items: ['focus_potion'] },
    maxProgress: 25,
    difficulty: 'hard',
    icon: '⚡'
  },
  {
    title: 'Gaming Legend',
    description: 'Play each mini-game at least once',
    type: 'weekly',
    category: 'gaming',
    requirements: [{ type: 'play_games', target: 8 }],
    rewards: { xp: 250, coins: 125, items: ['game_boost'] },
    maxProgress: 8,
    difficulty: 'medium',
    icon: '🎮'
  },
  {
    title: 'XP Hunter',
    description: 'Earn 1000 XP this week',
    type: 'weekly',
    category: 'productivity',
    requirements: [{ type: 'earn_xp', target: 1000 }],
    rewards: { xp: 200, coins: 100, items: ['xp_multiplier'] },
    maxProgress: 1000,
    difficulty: 'hard',
    icon: '⭐'
  }
]

export const EQUIPMENT_CATALOG: Equipment[] = [
  {
    id: 'focus_potion',
    name: 'Focus Potion',
    description: 'Increases XP gain by 25% for 1 hour',
    type: 'consumable',
    category: 'productivity',
    rarity: 'common',
    effects: [{ type: 'xp_boost', value: 25, duration: 60 }],
    cost: 50,
    levelRequired: 1,
    icon: '🧪',
    isEquipped: false,
    quantity: 0
  },
  {
    id: 'productivity_crown',
    name: 'Crown of Productivity',
    description: 'Permanent 15% XP boost for completed tasks',
    type: 'accessory',
    category: 'productivity',
    rarity: 'epic',
    effects: [{ type: 'xp_boost', value: 15 }],
    cost: 500,
    levelRequired: 10,
    icon: '👑',
    isEquipped: false,
    quantity: 0
  },
  {
    id: 'gaming_gloves',
    name: 'Gamer\'s Gloves',
    description: 'Increases mini-game performance by 20%',
    type: 'accessory',
    category: 'gaming',
    rarity: 'rare',
    effects: [{ type: 'game_boost', value: 20 }],
    cost: 200,
    levelRequired: 5,
    icon: '🧤',
    isEquipped: false,
    quantity: 0
  },
  {
    id: 'energy_drink',
    name: 'Energy Drink',
    description: 'Restores 50 energy instantly',
    type: 'consumable',
    category: 'productivity',
    rarity: 'common',
    effects: [{ type: 'energy_boost', value: 50 }],
    cost: 25,
    levelRequired: 1,
    icon: '⚡',
    isEquipped: false,
    quantity: 0
  },
  {
    id: 'time_crystal',
    name: 'Time Crystal',
    description: 'Doubles focus time effectiveness for 30 minutes',
    type: 'consumable',
    category: 'productivity',
    rarity: 'legendary',
    effects: [{ type: 'focus_boost', value: 100, duration: 30 }],
    cost: 1000,
    levelRequired: 20,
    icon: '💎',
    isEquipped: false,
    quantity: 0
  }
]

export const PET_CATALOG: Omit<Pet, 'level' | 'xp' | 'maxXp' | 'happiness' | 'maxHappiness' | 'lastFed' | 'isActive'>[] = [
  {
    id: 'focus_fox',
    name: 'Focus Fox',
    species: 'Mystical Fox',
    description: 'A clever fox that helps you stay focused',
    rarity: 'common',
    abilities: [
      {
        id: 'focus_aura',
        name: 'Focus Aura',
        description: 'Increases focus time by 10%',
        type: 'passive',
        effect: { type: 'focus_boost', value: 10 }
      }
    ],
    feedCost: 10,
    icon: '🦊'
  },
  {
    id: 'productivity_dragon',
    name: 'Productivity Dragon',
    species: 'Ancient Dragon',
    description: 'A wise dragon that boosts your productivity',
    rarity: 'legendary',
    abilities: [
      {
        id: 'dragon_blessing',
        name: 'Dragon\'s Blessing',
        description: 'Increases all XP gains by 25%',
        type: 'passive',
        effect: { type: 'xp_boost', value: 25 }
      },
      {
        id: 'motivation_roar',
        name: 'Motivation Roar',
        description: 'Instantly completes current task (once per day)',
        type: 'active',
        effect: { type: 'focus_boost', value: 100 },
        cooldown: 1440 // 24 hours
      }
    ],
    feedCost: 50,
    icon: '🐉'
  },
  {
    id: 'study_owl',
    name: 'Study Owl',
    species: 'Wise Owl',
    description: 'An owl that enhances learning tasks',
    rarity: 'rare',
    abilities: [
      {
        id: 'wisdom_boost',
        name: 'Wisdom Boost',
        description: 'Learning tasks give 30% more XP',
        type: 'passive',
        effect: { type: 'xp_boost', value: 30 }
      }
    ],
    feedCost: 25,
    icon: '🦉'
  }
]

export function generateDailyQuests(playerLevel: number, completedQuests: string[]): Quest[] {
  const availableQuests = DAILY_QUESTS.filter(quest => 
    !completedQuests.includes(quest.title)
  )
  
  // Select 3-5 random daily quests
  const selectedQuests = availableQuests
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(5, availableQuests.length))
  
  return selectedQuests.map(quest => ({
    ...quest,
    id: `daily_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    progress: 0,
    isCompleted: false,
    unlockedAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  }))
}

export function updateQuestProgress(quest: Quest, progressType: QuestRequirement['type'], amount: number, category?: string): Quest {
  // Early return for completed quests
  if (quest.isCompleted) return quest
  
  // Find matching requirement efficiently
  const requirement = quest.requirements.find(req => 
    req.type === progressType && 
    (!req.category || req.category === category)
  )
  
  // Early return if no matching requirement
  if (!requirement) return quest
  
  // Calculate new progress with bounds checking
  const newProgress = Math.min(quest.maxProgress, quest.progress + amount)
  
  // Early return if no progress change
  if (newProgress === quest.progress) return quest
  
  const isCompleted = newProgress >= quest.maxProgress
  
  return {
    ...quest,
    progress: newProgress,
    isCompleted,
    completedAt: isCompleted ? new Date() : quest.completedAt
  }
}

export function calculatePrestigeLevel(totalXP: number): number {
  // Prestige every 10,000 XP
  return Math.floor(totalXP / 10000)
}

export function getPrestigeBonus(prestigeLevel: number): number {
  // Each prestige level gives 5% bonus to all XP gains
  return prestigeLevel * 0.05
}

export function feedPet(pet: Pet, cost: number): Pet {
  const now = new Date()
  const timeSinceLastFed = now.getTime() - pet.lastFed.getTime()
  const hoursWithoutFood = timeSinceLastFed / (1000 * 60 * 60)
  
  // Happiness decreases over time without feeding
  let newHappiness = Math.max(0, pet.happiness - Math.floor(hoursWithoutFood / 6) * 10)
  
  // Feeding restores happiness
  newHappiness = Math.min(pet.maxHappiness, newHappiness + 25)
  
  return {
    ...pet,
    happiness: newHappiness,
    lastFed: now
  }
}

export function gainPetXP(pet: Pet, xp: number): Pet {
  const newXP = pet.xp + xp
  let newLevel = pet.level
  let remainingXP = newXP
  
  // Level up calculation
  while (remainingXP >= pet.maxXp && newLevel < 50) {
    remainingXP -= pet.maxXp
    newLevel++
  }
  
  const newMaxXP = newLevel * 100 // Each level requires more XP
  
  return {
    ...pet,
    level: newLevel,
    xp: remainingXP,
    maxXp: newMaxXP
  }
}