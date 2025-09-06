export interface MiniGameResult {
  score: number
  maxScore: number
  bonusXP: number
  bonusCoins: number
  accuracy: number
}

export interface MiniGame {
  id: string
  name: string
  description: string
  icon: string
  difficulty: 'easy' | 'medium' | 'hard'
  baseReward: { xp: number; coins: number }
  unlockLevel: number
}

export const MINI_GAMES: MiniGame[] = [
  {
    id: 'emoji_memory',
    name: 'Emoji Memory Blast',
    description: 'Match trending emoji pairs before time runs out!',
    icon: '🔥',
    difficulty: 'easy',
    baseReward: { xp: 25, coins: 5 },
    unlockLevel: 1
  },
  {
    id: 'speed_math',
    name: 'Math Speed Run',
    description: 'Solve equations as fast as possible - beat your friends!',
    icon: '🧮',
    difficulty: 'medium',
    baseReward: { xp: 35, coins: 8 },
    unlockLevel: 2
  },

  {
    id: 'osu_rhythm',
    name: 'Osu! Rhythm Game',
    description: 'Click circles to the beat - choose your favorite songs!',
    icon: '⭕',
    difficulty: 'hard',
    baseReward: { xp: 50, coins: 12 },
    unlockLevel: 5
  },
  {
    id: 'dragonborn',
    name: 'Dragonborn Quest',
    description: 'Epic sidescroller adventure - fulfill your destiny as the chosen knight!',
    icon: '🐉',
    difficulty: 'hard',
    baseReward: { xp: 60, coins: 15 },
    unlockLevel: 4
  }
]

export function calculateMiniGameReward(
  game: MiniGame,
  result: MiniGameResult
): { xp: number; coins: number } {
  const accuracyMultiplier = Math.max(0.5, result.accuracy)
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.3,
    hard: 1.6
  }[game.difficulty]

  const baseXP = game.baseReward.xp * accuracyMultiplier * difficultyMultiplier
  const baseCoins = game.baseReward.coins * accuracyMultiplier * difficultyMultiplier

  return {
    xp: Math.floor(baseXP),
    coins: Math.floor(baseCoins)
  }
}

export function getUnlockedMiniGames(playerLevel: number): MiniGame[] {
  return MINI_GAMES.filter(game => playerLevel >= game.unlockLevel)
}

// Memory Cards Game Logic
export interface MemoryCard {
  id: number
  symbol: string
  isFlipped: boolean
  isMatched: boolean
}

export function generateMemoryCards(pairs: number = 6): MemoryCard[] {
  const symbols = ['🎯', '⚡', '🏆', '💎', '🌟', '🔥', '💰', '🎮', '🚀', '🎨']
  const selectedSymbols = symbols.slice(0, pairs)
  const cards: MemoryCard[] = []

  selectedSymbols.forEach((symbol, index) => {
    cards.push(
      { id: index * 2, symbol, isFlipped: false, isMatched: false },
      { id: index * 2 + 1, symbol, isFlipped: false, isMatched: false }
    )
  })

  // Shuffle cards
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]]
  }

  return cards
}

// Number Sequence Game Logic
export function generateNumberSequence(length: number = 5): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * 9) + 1)
}

// Color Match Game Logic
export interface ColorChallenge {
  targetColor: string
  options: string[]
  correctIndex: number
}

export function generateColorChallenge(): ColorChallenge {
  const colors = [
    { name: 'red', hex: '#ef4444' },
    { name: 'blue', hex: '#3b82f6' },
    { name: 'green', hex: '#10b981' },
    { name: 'yellow', hex: '#f59e0b' },
    { name: 'purple', hex: '#8b5cf6' },
    { name: 'pink', hex: '#ec4899' },
    { name: 'orange', hex: '#f97316' },
    { name: 'cyan', hex: '#06b6d4' }
  ]

  const targetColor = colors[Math.floor(Math.random() * colors.length)]
  const wrongColors = colors.filter(c => c.name !== targetColor.name)
  const shuffledWrong = wrongColors.sort(() => Math.random() - 0.5).slice(0, 3)
  
  const options = [targetColor, ...shuffledWrong].sort(() => Math.random() - 0.5)
  const correctIndex = options.findIndex(c => c.name === targetColor.name)

  return {
    targetColor: targetColor.name,
    options: options.map(c => c.hex),
    correctIndex
  }
}