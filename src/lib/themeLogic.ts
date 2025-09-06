export interface Theme {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
  }
  icons: {
    character: string
    energy: string
    coins: string
    timer: string
    achievement: string
  }
  sounds?: {
    sessionComplete: string
    levelUp: string
    achievement: string
  }
}

export const THEMES: Theme[] = [
  {
    id: 'fantasy',
    name: 'Fantasy Quest',
    description: 'Embark on a magical adventure with wizards and dragons',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#f59e0b',
      background: 'from-blue-50 to-indigo-100',
      surface: 'bg-white/80'
    },
    icons: {
      character: '🧙‍♂️',
      energy: '⚡',
      coins: '💰',
      timer: '⚔️',
      achievement: '🏆'
    }
  },
  {
    id: 'space',
    name: 'Space Explorer',
    description: 'Journey through the cosmos as a space adventurer',
    colors: {
      primary: '#6366f1',
      secondary: '#ec4899',
      accent: '#06b6d4',
      background: 'from-slate-900 to-purple-900',
      surface: 'bg-slate-800/80'
    },
    icons: {
      character: '🚀',
      energy: '🔋',
      coins: '🌟',
      timer: '🛸',
      achievement: '🎖️'
    }
  },
  {
    id: 'detective',
    name: 'Detective Mystery',
    description: 'Solve cases and uncover mysteries in noir style',
    colors: {
      primary: '#374151',
      secondary: '#dc2626',
      accent: '#f59e0b',
      background: 'from-gray-100 to-amber-50',
      surface: 'bg-amber-50/80'
    },
    icons: {
      character: '🕵️',
      energy: '🔍',
      coins: '💎',
      timer: '⏰',
      achievement: '🏅'
    }
  },
  {
    id: 'nature',
    name: 'Forest Guardian',
    description: 'Protect the natural world as a forest guardian',
    colors: {
      primary: '#059669',
      secondary: '#0d9488',
      accent: '#84cc16',
      background: 'from-green-50 to-emerald-100',
      surface: 'bg-green-50/80'
    },
    icons: {
      character: '🌳',
      energy: '🍃',
      coins: '🌰',
      timer: '🦋',
      achievement: '🌿'
    }
  },
  {
    id: 'cyberpunk',
    name: 'Cyber Hacker',
    description: 'Navigate the digital world as a cyber warrior',
    colors: {
      primary: '#06b6d4',
      secondary: '#8b5cf6',
      accent: '#f0abfc',
      background: 'from-slate-900 to-cyan-900',
      surface: 'bg-slate-800/90'
    },
    icons: {
      character: '🤖',
      energy: '⚡',
      coins: '💾',
      timer: '💻',
      achievement: '🎯'
    }
  }
]

export function getTheme(themeId: string): Theme {
  return THEMES.find(theme => theme.id === themeId) || THEMES[0]
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  
  // Apply CSS custom properties
  root.style.setProperty('--theme-primary', theme.colors.primary)
  root.style.setProperty('--theme-secondary', theme.colors.secondary)
  root.style.setProperty('--theme-accent', theme.colors.accent)
  
  // Apply background gradient
  const body = document.body
  body.className = body.className.replace(/bg-gradient-to-br from-\S+ to-\S+/, '')
  body.classList.add('bg-gradient-to-br', ...theme.colors.background.split(' '))
}

export const THEME_UNLOCK_REQUIREMENTS = {
  fantasy: { level: 1, description: 'Available from start' },
  space: { level: 5, description: 'Unlock at level 5' },
  detective: { level: 10, description: 'Unlock at level 10' },
  nature: { level: 15, description: 'Unlock at level 15' },
  cyberpunk: { level: 20, description: 'Unlock at level 20' }
}

export function getUnlockedThemes(playerLevel: number): Theme[] {
  return THEMES.filter(theme => {
    const requirement = THEME_UNLOCK_REQUIREMENTS[theme.id as keyof typeof THEME_UNLOCK_REQUIREMENTS]
    return playerLevel >= requirement.level
  })
}