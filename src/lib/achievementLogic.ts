export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'sessions' | 'tasks' | 'streaks' | 'levels' | 'special'
  requirement: number
  currentProgress: number
  isUnlocked: boolean
  unlockedAt?: Date
  xpReward: number
  coinReward: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export const ACHIEVEMENT_DEFINITIONS = [
  // Session Achievements
  {
    id: 'first_session',
    name: 'First Steps',
    description: 'Complete your first focus session',
    icon: '🎯',
    category: 'sessions' as const,
    requirement: 1,
    xpReward: 50,
    coinReward: 10,
    rarity: 'common' as const
  },
  {
    id: 'session_10',
    name: 'Getting Focused',
    description: 'Complete 10 focus sessions',
    icon: '🔥',
    category: 'sessions' as const,
    requirement: 10,
    xpReward: 100,
    coinReward: 25,
    rarity: 'common' as const
  },
  {
    id: 'session_50',
    name: 'Focus Master',
    description: 'Complete 50 focus sessions',
    icon: '⚡',
    category: 'sessions' as const,
    requirement: 50,
    xpReward: 250,
    coinReward: 75,
    rarity: 'rare' as const
  },
  {
    id: 'session_100',
    name: 'Concentration Legend',
    description: 'Complete 100 focus sessions',
    icon: '👑',
    category: 'sessions' as const,
    requirement: 100,
    xpReward: 500,
    coinReward: 150,
    rarity: 'epic' as const
  },

  // Task Achievements
  {
    id: 'first_task',
    name: 'Quest Beginner',
    description: 'Complete your first task',
    icon: '✅',
    category: 'tasks' as const,
    requirement: 1,
    xpReward: 75,
    coinReward: 15,
    rarity: 'common' as const
  },
  {
    id: 'task_10',
    name: 'Task Warrior',
    description: 'Complete 10 tasks',
    icon: '⚔️',
    category: 'tasks' as const,
    requirement: 10,
    xpReward: 200,
    coinReward: 50,
    rarity: 'rare' as const
  },
  {
    id: 'high_priority_5',
    name: 'Priority Hunter',
    description: 'Complete 5 high-priority tasks',
    icon: '🎖️',
    category: 'tasks' as const,
    requirement: 5,
    xpReward: 300,
    coinReward: 75,
    rarity: 'rare' as const
  },

  // Streak Achievements
  {
    id: 'streak_3',
    name: 'On a Roll',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    category: 'streaks' as const,
    requirement: 3,
    xpReward: 150,
    coinReward: 30,
    rarity: 'common' as const
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🌟',
    category: 'streaks' as const,
    requirement: 7,
    xpReward: 350,
    coinReward: 100,
    rarity: 'rare' as const
  },
  {
    id: 'streak_30',
    name: 'Consistency Champion',
    description: 'Maintain a 30-day streak',
    icon: '💎',
    category: 'streaks' as const,
    requirement: 30,
    xpReward: 1000,
    coinReward: 300,
    rarity: 'legendary' as const
  },

  // Level Achievements
  {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '⭐',
    category: 'levels' as const,
    requirement: 5,
    xpReward: 200,
    coinReward: 50,
    rarity: 'common' as const
  },
  {
    id: 'level_10',
    name: 'Experienced Adventurer',
    description: 'Reach level 10',
    icon: '🏆',
    category: 'levels' as const,
    requirement: 10,
    xpReward: 500,
    coinReward: 150,
    rarity: 'rare' as const
  },
  {
    id: 'level_25',
    name: 'Productivity Legend',
    description: 'Reach level 25',
    icon: '👑',
    category: 'levels' as const,
    requirement: 25,
    xpReward: 1500,
    coinReward: 500,
    rarity: 'legendary' as const
  }
]

export const RARITY_COLORS = {
  common: 'border-gray-300 bg-gray-50',
  rare: 'border-blue-300 bg-blue-50',
  epic: 'border-purple-300 bg-purple-50',
  legendary: 'border-yellow-300 bg-yellow-50'
}

export const RARITY_TEXT_COLORS = {
  common: 'text-gray-600',
  rare: 'text-blue-600',
  epic: 'text-purple-600',
  legendary: 'text-yellow-600'
}

export function initializeAchievements(): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map(def => ({
    ...def,
    currentProgress: 0,
    isUnlocked: false
  }))
}

export function checkAchievements(
  achievements: Achievement[],
  stats: {
    completedSessions: number
    completedTasks: number
    highPriorityTasksCompleted: number
    currentStreak: number
    level: number
  }
): { updatedAchievements: Achievement[], newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = []
  
  const updatedAchievements = achievements.map(achievement => {
    if (achievement.isUnlocked) return achievement

    let currentProgress = 0
    
    switch (achievement.category) {
      case 'sessions':
        currentProgress = stats.completedSessions
        break
      case 'tasks':
        if (achievement.id === 'high_priority_5') {
          currentProgress = stats.highPriorityTasksCompleted
        } else {
          currentProgress = stats.completedTasks
        }
        break
      case 'streaks':
        currentProgress = stats.currentStreak
        break
      case 'levels':
        currentProgress = stats.level
        break
    }

    const isUnlocked = currentProgress >= achievement.requirement
    
    if (isUnlocked && !achievement.isUnlocked) {
      const unlockedAchievement = {
        ...achievement,
        currentProgress,
        isUnlocked: true,
        unlockedAt: new Date()
      }
      newlyUnlocked.push(unlockedAchievement)
      return unlockedAchievement
    }

    return {
      ...achievement,
      currentProgress
    }
  })

  return { updatedAchievements, newlyUnlocked }
}