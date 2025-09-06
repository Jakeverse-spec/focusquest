export interface CharacterItem {
  id: string
  name: string
  type: 'avatar' | 'weapon' | 'outfit' | 'accessory'
  icon: string
  description: string
  cost: number
  unlockLevel: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  stats?: {
    xpBonus?: number
    energyBonus?: number
    coinBonus?: number
  }
}

export interface PlayerCharacter {
  avatar: string
  weapon: string
  outfit: string
  accessory: string
  ownedItems: string[]
}

export const CHARACTER_ITEMS: CharacterItem[] = [
  // Avatars
  {
    id: 'wizard',
    name: 'Wise Wizard',
    type: 'avatar',
    icon: '🧙‍♂️',
    description: 'A powerful wizard with ancient knowledge',
    cost: 0,
    unlockLevel: 1,
    rarity: 'common',
    stats: { xpBonus: 0 }
  },
  {
    id: 'knight',
    name: 'Noble Knight',
    type: 'avatar',
    icon: '🛡️',
    description: 'A brave knight ready for any quest',
    cost: 100,
    unlockLevel: 3,
    rarity: 'common',
    stats: { energyBonus: 10 }
  },
  {
    id: 'ninja',
    name: 'Shadow Ninja',
    type: 'avatar',
    icon: '🥷',
    description: 'Swift and silent, master of focus',
    cost: 250,
    unlockLevel: 7,
    rarity: 'rare',
    stats: { xpBonus: 15 }
  },
  {
    id: 'dragon',
    name: 'Ancient Dragon',
    type: 'avatar',
    icon: '🐉',
    description: 'Legendary creature of immense power',
    cost: 500,
    unlockLevel: 15,
    rarity: 'legendary',
    stats: { xpBonus: 25, coinBonus: 20 }
  },

  // Weapons
  {
    id: 'basic_sword',
    name: 'Iron Sword',
    type: 'weapon',
    icon: '⚔️',
    description: 'A reliable blade for any adventurer',
    cost: 0,
    unlockLevel: 1,
    rarity: 'common',
    stats: { xpBonus: 0 }
  },
  {
    id: 'magic_staff',
    name: 'Mystic Staff',
    type: 'weapon',
    icon: '🪄',
    description: 'Channels magical energy for bonus XP',
    cost: 75,
    unlockLevel: 2,
    rarity: 'common',
    stats: { xpBonus: 10 }
  },
  {
    id: 'lightning_bolt',
    name: 'Lightning Bolt',
    type: 'weapon',
    icon: '⚡',
    description: 'Strikes with the power of storms',
    cost: 200,
    unlockLevel: 5,
    rarity: 'rare',
    stats: { xpBonus: 20, energyBonus: 5 }
  },
  {
    id: 'excalibur',
    name: 'Excalibur',
    type: 'weapon',
    icon: '🗡️',
    description: 'The legendary sword of kings',
    cost: 400,
    unlockLevel: 12,
    rarity: 'epic',
    stats: { xpBonus: 30, coinBonus: 15 }
  },

  // Outfits
  {
    id: 'basic_robes',
    name: 'Simple Robes',
    type: 'outfit',
    icon: '👘',
    description: 'Comfortable robes for long study sessions',
    cost: 0,
    unlockLevel: 1,
    rarity: 'common',
    stats: { energyBonus: 0 }
  },
  {
    id: 'scholar_robes',
    name: 'Scholar Robes',
    type: 'outfit',
    icon: '🎓',
    description: 'Enhances learning and focus',
    cost: 120,
    unlockLevel: 4,
    rarity: 'common',
    stats: { xpBonus: 12, energyBonus: 8 }
  },
  {
    id: 'royal_armor',
    name: 'Royal Armor',
    type: 'outfit',
    icon: '👑',
    description: 'Fit for a productivity king',
    cost: 300,
    unlockLevel: 8,
    rarity: 'rare',
    stats: { xpBonus: 18, energyBonus: 15, coinBonus: 10 }
  },
  {
    id: 'cosmic_suit',
    name: 'Cosmic Suit',
    type: 'outfit',
    icon: '🚀',
    description: 'Harnesses the power of the universe',
    cost: 600,
    unlockLevel: 18,
    rarity: 'legendary',
    stats: { xpBonus: 35, energyBonus: 25, coinBonus: 25 }
  },

  // Accessories
  {
    id: 'none',
    name: 'None',
    type: 'accessory',
    icon: '',
    description: 'No accessory equipped',
    cost: 0,
    unlockLevel: 1,
    rarity: 'common',
    stats: {}
  },
  {
    id: 'focus_crystal',
    name: 'Focus Crystal',
    type: 'accessory',
    icon: '💎',
    description: 'Amplifies concentration and mental clarity',
    cost: 150,
    unlockLevel: 6,
    rarity: 'rare',
    stats: { xpBonus: 15 }
  },
  {
    id: 'energy_amulet',
    name: 'Energy Amulet',
    type: 'accessory',
    icon: '🔮',
    description: 'Provides sustained energy throughout the day',
    cost: 180,
    unlockLevel: 9,
    rarity: 'rare',
    stats: { energyBonus: 20 }
  },
  {
    id: 'golden_hourglass',
    name: 'Golden Hourglass',
    type: 'accessory',
    icon: '⏳',
    description: 'Time flows more favorably for the wearer',
    cost: 350,
    unlockLevel: 14,
    rarity: 'epic',
    stats: { xpBonus: 20, coinBonus: 20 }
  }
]

export const INITIAL_CHARACTER: PlayerCharacter = {
  avatar: 'wizard',
  weapon: 'basic_sword',
  outfit: 'basic_robes',
  accessory: 'none',
  ownedItems: ['wizard', 'basic_sword', 'basic_robes', 'none']
}

export function getItemsByType(type: CharacterItem['type']): CharacterItem[] {
  return CHARACTER_ITEMS.filter(item => item.type === type)
}

export function getUnlockedItems(playerLevel: number): CharacterItem[] {
  return CHARACTER_ITEMS.filter(item => playerLevel >= item.unlockLevel)
}

export function getAvailableItems(playerLevel: number, ownedItems: string[]): CharacterItem[] {
  return CHARACTER_ITEMS.filter(item => 
    playerLevel >= item.unlockLevel && !ownedItems.includes(item.id)
  )
}

export function calculateCharacterStats(character: PlayerCharacter): {
  xpBonus: number
  energyBonus: number
  coinBonus: number
} {
  const equippedItems = [
    CHARACTER_ITEMS.find(item => item.id === character.avatar),
    CHARACTER_ITEMS.find(item => item.id === character.weapon),
    CHARACTER_ITEMS.find(item => item.id === character.outfit),
    CHARACTER_ITEMS.find(item => item.id === character.accessory)
  ].filter(Boolean) as CharacterItem[]

  return equippedItems.reduce(
    (total, item) => ({
      xpBonus: total.xpBonus + (item.stats?.xpBonus || 0),
      energyBonus: total.energyBonus + (item.stats?.energyBonus || 0),
      coinBonus: total.coinBonus + (item.stats?.coinBonus || 0)
    }),
    { xpBonus: 0, energyBonus: 0, coinBonus: 0 }
  )
}

export const RARITY_STYLES = {
  common: 'border-gray-300 bg-gray-50',
  rare: 'border-blue-300 bg-blue-50',
  epic: 'border-purple-300 bg-purple-50',
  legendary: 'border-yellow-300 bg-yellow-50 shadow-lg'
}

export const RARITY_TEXT = {
  common: 'text-gray-600',
  rare: 'text-blue-600',
  epic: 'text-purple-600',
  legendary: 'text-yellow-600'
}