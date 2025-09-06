export interface ProductivityStreak {
  currentStreak: number
  longestStreak: number
  lastActiveDate: Date
  streakHistory: StreakEntry[]
}

export interface StreakEntry {
  date: Date
  tasksCompleted: number
  focusTime: number
  xpEarned: number
}

export interface Goal {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
  category: 'tasks' | 'focus_time' | 'xp' | 'games' | 'streak'
  target: number
  current: number
  unit: string
  startDate: Date
  endDate: Date
  isCompleted: boolean
  completedAt?: Date
  priority: 'low' | 'medium' | 'high'
  rewards: {
    xp: number
    coins: number
    items?: string[]
  }
}

export interface HabitMetric {
  id: string
  name: string
  description: string
  category: string
  targetFrequency: number // times per week
  currentWeekCount: number
  totalCount: number
  streak: number
  lastCompleted?: Date
  history: HabitEntry[]
  isActive: boolean
}

export interface HabitEntry {
  date: Date
  completed: boolean
  notes?: string
}

export interface FocusSession {
  id: string
  taskId?: string
  startTime: Date
  endTime: Date
  duration: number // minutes
  quality: 'poor' | 'fair' | 'good' | 'excellent'
  interruptions: number
  notes?: string
  category: string
}

export interface ProductivityReport {
  period: 'daily' | 'weekly' | 'monthly'
  startDate: Date
  endDate: Date
  metrics: {
    tasksCompleted: number
    totalFocusTime: number
    averageFocusTime: number
    xpEarned: number
    gamesPlayed: number
    streakDays: number
    productivityScore: number
  }
  categoryBreakdown: Record<string, {
    tasksCompleted: number
    focusTime: number
    xpEarned: number
  }>
  dailyBreakdown: {
    date: Date
    tasksCompleted: number
    focusTime: number
    xpEarned: number
    productivityScore: number
  }[]
  insights: string[]
  recommendations: string[]
}

export interface FocusHeatmapData {
  date: Date
  focusTime: number
  intensity: 'none' | 'low' | 'medium' | 'high' | 'very-high'
}

export const DEFAULT_GOALS: Omit<Goal, 'id' | 'current' | 'isCompleted' | 'completedAt'>[] = [
  {
    title: 'Daily Task Master',
    description: 'Complete 5 tasks every day',
    type: 'daily',
    category: 'tasks',
    target: 5,
    unit: 'tasks',
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    priority: 'medium',
    rewards: { xp: 100, coins: 50 }
  },
  {
    title: 'Focus Champion',
    description: 'Maintain 2 hours of focus time daily',
    type: 'daily',
    category: 'focus_time',
    target: 120,
    unit: 'minutes',
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    priority: 'high',
    rewards: { xp: 150, coins: 75 }
  },
  {
    title: 'Weekly Warrior',
    description: 'Complete 30 tasks this week',
    type: 'weekly',
    category: 'tasks',
    target: 30,
    unit: 'tasks',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    rewards: { xp: 500, coins: 250, items: ['productivity_crown'] }
  },
  {
    title: 'Monthly XP Legend',
    description: 'Earn 5000 XP this month',
    type: 'monthly',
    category: 'xp',
    target: 5000,
    unit: 'XP',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    priority: 'high',
    rewards: { xp: 1000, coins: 500, items: ['time_crystal'] }
  }
]

export const DEFAULT_HABITS: Omit<HabitMetric, 'id' | 'currentWeekCount' | 'totalCount' | 'streak' | 'lastCompleted' | 'history'>[] = [
  {
    name: 'Morning Planning',
    description: 'Plan your day every morning',
    category: 'productivity',
    targetFrequency: 7,
    isActive: true
  },
  {
    name: 'Exercise',
    description: 'Get physical activity',
    category: 'health',
    targetFrequency: 4,
    isActive: true
  },
  {
    name: 'Learning',
    description: 'Spend time learning something new',
    category: 'learning',
    targetFrequency: 5,
    isActive: true
  },
  {
    name: 'Deep Work',
    description: 'Focus on important tasks without distractions',
    category: 'productivity',
    targetFrequency: 5,
    isActive: true
  },
  {
    name: 'Reflection',
    description: 'Reflect on your day and progress',
    category: 'productivity',
    targetFrequency: 7,
    isActive: true
  }
]

export function updateStreak(streak: ProductivityStreak, tasksCompleted: number, focusTime: number, xpEarned: number): ProductivityStreak {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const lastActive = new Date(streak.lastActiveDate)
  lastActive.setHours(0, 0, 0, 0)
  
  const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
  
  let newCurrentStreak = streak.currentStreak
  
  if (daysDiff === 0) {
    // Same day, update existing entry
    const todayEntry = streak.streakHistory.find(entry => {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)
      return entryDate.getTime() === today.getTime()
    })
    
    if (todayEntry) {
      todayEntry.tasksCompleted = tasksCompleted
      todayEntry.focusTime = focusTime
      todayEntry.xpEarned = xpEarned
    }
  } else if (daysDiff === 1) {
    // Next day, continue streak if productive
    if (tasksCompleted > 0 || focusTime > 0) {
      newCurrentStreak++
    } else {
      newCurrentStreak = 0
    }
  } else {
    // Gap in days, reset streak
    newCurrentStreak = (tasksCompleted > 0 || focusTime > 0) ? 1 : 0
  }
  
  const newEntry: StreakEntry = {
    date: today,
    tasksCompleted,
    focusTime,
    xpEarned
  }
  
  const updatedHistory = [...streak.streakHistory.filter(entry => {
    const entryDate = new Date(entry.date)
    entryDate.setHours(0, 0, 0, 0)
    return entryDate.getTime() !== today.getTime()
  }), newEntry]
  
  return {
    currentStreak: newCurrentStreak,
    longestStreak: Math.max(streak.longestStreak, newCurrentStreak),
    lastActiveDate: today,
    streakHistory: updatedHistory.slice(-365) // Keep last year
  }
}

export function updateGoalProgress(goal: Goal, progress: number): Goal {
  const newCurrent = Math.min(goal.target, goal.current + progress)
  const isCompleted = newCurrent >= goal.target
  
  return {
    ...goal,
    current: newCurrent,
    isCompleted,
    completedAt: isCompleted && !goal.isCompleted ? new Date() : goal.completedAt
  }
}

export function updateHabitProgress(habit: HabitMetric, completed: boolean, notes?: string): HabitMetric {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Check if already logged today
  const existingEntry = habit.history.find(entry => {
    const entryDate = new Date(entry.date)
    entryDate.setHours(0, 0, 0, 0)
    return entryDate.getTime() === today.getTime()
  })
  
  let updatedHistory = [...habit.history]
  let newCurrentWeekCount = habit.currentWeekCount
  let newTotalCount = habit.totalCount
  let newStreak = habit.streak
  
  if (existingEntry) {
    // Update existing entry
    existingEntry.completed = completed
    existingEntry.notes = notes
  } else {
    // Add new entry
    updatedHistory.push({ date: today, completed, notes })
    
    if (completed) {
      newCurrentWeekCount++
      newTotalCount++
      
      // Update streak
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      const yesterdayEntry = habit.history.find(entry => {
        const entryDate = new Date(entry.date)
        entryDate.setHours(0, 0, 0, 0)
        return entryDate.getTime() === yesterday.getTime()
      })
      
      if (yesterdayEntry?.completed || habit.streak === 0) {
        newStreak++
      } else {
        newStreak = 1
      }
    } else {
      newStreak = 0
    }
  }
  
  return {
    ...habit,
    currentWeekCount: newCurrentWeekCount,
    totalCount: newTotalCount,
    streak: newStreak,
    lastCompleted: completed ? today : habit.lastCompleted,
    history: updatedHistory.slice(-365) // Keep last year
  }
}

export function generateProductivityReport(
  tasks: any[],
  focusSessions: FocusSession[],
  period: 'daily' | 'weekly' | 'monthly',
  startDate: Date,
  endDate: Date
): ProductivityReport {
  // Optimize filtering with early returns and memoization
  const startTime = startDate.getTime()
  const endTime = endDate.getTime()
  
  const filteredTasks = tasks.filter(task => {
    if (!task.completedAt) return false
    const completedTime = task.completedAt.getTime()
    return completedTime >= startTime && completedTime <= endTime
  })
  
  const filteredSessions = focusSessions.filter(session => {
    const sessionTime = session.startTime.getTime()
    return sessionTime >= startTime && sessionTime <= endTime
  })
  
  const totalFocusTime = filteredSessions.reduce((sum, session) => sum + session.duration, 0)
  const totalXP = filteredTasks.reduce((sum, task) => sum + (task.xpReward || 0), 0)
  
  // Category breakdown
  const categoryBreakdown: Record<string, any> = {}
  filteredTasks.forEach(task => {
    if (!categoryBreakdown[task.category]) {
      categoryBreakdown[task.category] = {
        tasksCompleted: 0,
        focusTime: 0,
        xpEarned: 0
      }
    }
    categoryBreakdown[task.category].tasksCompleted++
    categoryBreakdown[task.category].xpEarned += task.xpReward || 0
  })
  
  filteredSessions.forEach(session => {
    if (!categoryBreakdown[session.category]) {
      categoryBreakdown[session.category] = {
        tasksCompleted: 0,
        focusTime: 0,
        xpEarned: 0
      }
    }
    categoryBreakdown[session.category].focusTime += session.duration
  })
  
  // Daily breakdown - optimized with Map for O(1) lookups
  const dailyBreakdown: any[] = []
  const tasksByDay = new Map<string, any[]>()
  const sessionsByDay = new Map<string, FocusSession[]>()
  
  // Pre-group tasks and sessions by day for efficient lookup
  filteredTasks.forEach(task => {
    const dayKey = new Date(task.completedAt).toDateString()
    if (!tasksByDay.has(dayKey)) tasksByDay.set(dayKey, [])
    tasksByDay.get(dayKey)!.push(task)
  })
  
  filteredSessions.forEach(session => {
    const dayKey = new Date(session.startTime).toDateString()
    if (!sessionsByDay.has(dayKey)) sessionsByDay.set(dayKey, [])
    sessionsByDay.get(dayKey)!.push(session)
  })
  
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    const dayKey = currentDate.toDateString()
    const dayTasks = tasksByDay.get(dayKey) || []
    const daySessions = sessionsByDay.get(dayKey) || []
    
    const dayFocusTime = daySessions.reduce((sum, session) => sum + session.duration, 0)
    const dayXP = dayTasks.reduce((sum, task) => sum + (task.xpReward || 0), 0)
    const productivityScore = calculateProductivityScore(dayTasks.length, dayFocusTime, dayXP)
    
    dailyBreakdown.push({
      date: new Date(currentDate),
      tasksCompleted: dayTasks.length,
      focusTime: dayFocusTime,
      xpEarned: dayXP,
      productivityScore
    })
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  // Generate insights and recommendations
  const insights = generateInsights(filteredTasks, filteredSessions, dailyBreakdown)
  const recommendations = generateRecommendations(filteredTasks, filteredSessions, categoryBreakdown)
  
  return {
    period,
    startDate,
    endDate,
    metrics: {
      tasksCompleted: filteredTasks.length,
      totalFocusTime,
      averageFocusTime: filteredSessions.length > 0 ? totalFocusTime / filteredSessions.length : 0,
      xpEarned: totalXP,
      gamesPlayed: 0, // TODO: Add game tracking
      streakDays: calculateStreakDays(dailyBreakdown),
      productivityScore: calculateProductivityScore(filteredTasks.length, totalFocusTime, totalXP)
    },
    categoryBreakdown,
    dailyBreakdown,
    insights,
    recommendations
  }
}

export function generateFocusHeatmap(focusSessions: FocusSession[], days: number = 365): FocusHeatmapData[] {
  const heatmapData: FocusHeatmapData[] = []
  const endDate = new Date()
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)
  
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    const dayFocusTime = focusSessions
      .filter(session => {
        const sessionDate = new Date(session.startTime)
        return sessionDate.toDateString() === currentDate.toDateString()
      })
      .reduce((sum, session) => sum + session.duration, 0)
    
    let intensity: FocusHeatmapData['intensity'] = 'none'
    if (dayFocusTime > 0) intensity = 'low'
    if (dayFocusTime >= 60) intensity = 'medium'
    if (dayFocusTime >= 120) intensity = 'high'
    if (dayFocusTime >= 240) intensity = 'very-high'
    
    heatmapData.push({
      date: new Date(currentDate),
      focusTime: dayFocusTime,
      intensity
    })
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return heatmapData
}

function calculateProductivityScore(tasks: number, focusTime: number, xp: number): number {
  // Weighted score: tasks (40%), focus time (40%), XP (20%)
  const taskScore = Math.min(100, tasks * 10)
  const focusScore = Math.min(100, focusTime / 2)
  const xpScore = Math.min(100, xp / 5)
  
  return Math.round(taskScore * 0.4 + focusScore * 0.4 + xpScore * 0.2)
}

function calculateStreakDays(dailyBreakdown: any[]): number {
  let streak = 0
  for (let i = dailyBreakdown.length - 1; i >= 0; i--) {
    if (dailyBreakdown[i].tasksCompleted > 0 || dailyBreakdown[i].focusTime > 0) {
      streak++
    } else {
      break
    }
  }
  return streak
}

function generateInsights(tasks: any[], sessions: FocusSession[], dailyBreakdown: any[]): string[] {
  const insights: string[] = []
  
  // Most productive day
  const mostProductiveDay = dailyBreakdown.reduce((max, day) => 
    day.productivityScore > max.productivityScore ? day : max
  )
  insights.push(`Your most productive day was ${mostProductiveDay.date.toLocaleDateString()} with a score of ${mostProductiveDay.productivityScore}`)
  
  // Average focus session length
  const avgSessionLength = sessions.length > 0 
    ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length 
    : 0
  insights.push(`Your average focus session is ${Math.round(avgSessionLength)} minutes`)
  
  // Most common task category
  const categoryCount: Record<string, number> = {}
  tasks.forEach(task => {
    categoryCount[task.category] = (categoryCount[task.category] || 0) + 1
  })
  const topCategory = Object.entries(categoryCount).reduce((max, [cat, count]) => 
    count > max[1] ? [cat, count] : max, ['', 0]
  )
  if (topCategory[0]) {
    insights.push(`You completed the most tasks in ${topCategory[0]} category (${topCategory[1]} tasks)`)
  }
  
  return insights
}

function generateRecommendations(tasks: any[], sessions: FocusSession[], categoryBreakdown: Record<string, any>): string[] {
  const recommendations: string[] = []
  
  // Focus time recommendations
  const totalFocusTime = sessions.reduce((sum, s) => sum + s.duration, 0)
  if (totalFocusTime < 60) {
    recommendations.push('Try to increase your daily focus time to at least 1 hour for better productivity')
  }
  
  // Task completion recommendations
  if (tasks.length < 3) {
    recommendations.push('Aim to complete at least 3 tasks per day to maintain momentum')
  }
  
  // Category balance recommendations
  const categories = Object.keys(categoryBreakdown)
  if (categories.length < 3) {
    recommendations.push('Consider diversifying your tasks across different categories for better work-life balance')
  }
  
  return recommendations
}