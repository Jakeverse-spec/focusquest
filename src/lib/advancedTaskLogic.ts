export interface TaskCategory {
  id: string
  name: string
  color: string
  icon: string
}

export interface TaskTag {
  id: string
  name: string
  color: string
}

export interface TaskTemplate {
  id: string
  name: string
  description: string
  estimatedTime: number
  category: string
  tags: string[]
  subtasks: string[]
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly'
  interval: number // every N days/weeks/months
  daysOfWeek?: number[] // 0-6, Sunday = 0
  endDate?: Date
  maxOccurrences?: number
}

export interface TimeEntry {
  id: string
  taskId: string
  startTime: Date
  endTime?: Date
  duration: number // minutes
  description?: string
}

export interface AdvancedTask {
  id: string
  title: string
  description?: string
  category: string
  tags: string[]
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled'
  estimatedTime: number // minutes
  actualTime: number // minutes tracked
  dueDate?: Date
  reminderTime?: Date
  createdAt: Date
  completedAt?: Date
  recurrence?: RecurrencePattern
  parentTaskId?: string // for subtasks
  subtasks: string[]
  timeEntries: TimeEntry[]
  xpReward: number
  coinReward: number
  streakContribution: boolean
}

export const DEFAULT_CATEGORIES: TaskCategory[] = [
  { id: 'work', name: 'Work', color: '#3B82F6', icon: '💼' },
  { id: 'personal', name: 'Personal', color: '#10B981', icon: '🏠' },
  { id: 'learning', name: 'Learning', color: '#8B5CF6', icon: '📚' },
  { id: 'health', name: 'Health', color: '#EF4444', icon: '❤️' },
  { id: 'creative', name: 'Creative', color: '#F59E0B', icon: '🎨' },
  { id: 'social', name: 'Social', color: '#EC4899', icon: '👥' }
]

export const DEFAULT_TAGS: TaskTag[] = [
  { id: 'urgent', name: 'Urgent', color: '#EF4444' },
  { id: 'important', name: 'Important', color: '#F59E0B' },
  { id: 'quick', name: 'Quick', color: '#10B981' },
  { id: 'deep-work', name: 'Deep Work', color: '#8B5CF6' },
  { id: 'meeting', name: 'Meeting', color: '#3B82F6' },
  { id: 'review', name: 'Review', color: '#6B7280' }
]

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: 'daily-standup',
    name: 'Daily Standup',
    description: 'Team standup meeting',
    estimatedTime: 15,
    category: 'work',
    tags: ['meeting'],
    subtasks: ['Prepare updates', 'Join meeting', 'Take notes']
  },
  {
    id: 'code-review',
    name: 'Code Review',
    description: 'Review pull requests',
    estimatedTime: 30,
    category: 'work',
    tags: ['review', 'deep-work'],
    subtasks: ['Check code quality', 'Test functionality', 'Provide feedback']
  },
  {
    id: 'workout',
    name: 'Workout Session',
    description: 'Exercise routine',
    estimatedTime: 45,
    category: 'health',
    tags: [],
    subtasks: ['Warm up', 'Main workout', 'Cool down']
  },
  {
    id: 'learning-session',
    name: 'Learning Session',
    description: 'Study new skills or concepts',
    estimatedTime: 60,
    category: 'learning',
    tags: ['deep-work'],
    subtasks: ['Review materials', 'Practice exercises', 'Take notes']
  }
]

export function calculateTaskXP(task: AdvancedTask): number {
  let baseXP = 20
  
  // Priority multiplier
  const priorityMultiplier = {
    'low': 1.0,
    'medium': 1.2,
    'high': 1.5,
    'urgent': 2.0
  }
  
  // Time multiplier (longer tasks = more XP)
  const timeMultiplier = Math.min(3.0, 1.0 + (task.estimatedTime / 60))
  
  // Category bonus
  const categoryBonus = task.category === 'learning' ? 1.3 : 1.0
  
  // Streak bonus
  const streakBonus = task.streakContribution ? 1.1 : 1.0
  
  return Math.floor(baseXP * priorityMultiplier[task.priority] * timeMultiplier * categoryBonus * streakBonus)
}

export function calculateTaskCoins(task: AdvancedTask): number {
  return Math.floor(calculateTaskXP(task) / 4)
}

export function createTaskFromTemplate(template: TaskTemplate, customizations?: Partial<AdvancedTask>): AdvancedTask {
  const now = new Date()
  const baseTask: AdvancedTask = {
    id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: template.name,
    description: template.description,
    category: template.category,
    tags: [...template.tags],
    priority: 'medium',
    status: 'todo',
    estimatedTime: template.estimatedTime,
    actualTime: 0,
    createdAt: now,
    subtasks: [],
    timeEntries: [],
    xpReward: 0,
    coinReward: 0,
    streakContribution: true
  }
  
  // Calculate rewards
  baseTask.xpReward = calculateTaskXP(baseTask)
  baseTask.coinReward = calculateTaskCoins(baseTask)
  
  // Apply customizations
  const finalTask = { ...baseTask, ...customizations }
  
  // Recalculate rewards if priority or time changed
  if (customizations?.priority || customizations?.estimatedTime) {
    finalTask.xpReward = calculateTaskXP(finalTask)
    finalTask.coinReward = calculateTaskCoins(finalTask)
  }
  
  return finalTask
}

export function generateRecurringTasks(task: AdvancedTask, fromDate: Date, toDate: Date): AdvancedTask[] {
  if (!task.recurrence) return []
  
  const tasks: AdvancedTask[] = []
  const { type, interval, daysOfWeek, maxOccurrences } = task.recurrence
  
  let currentDate = new Date(fromDate)
  let occurrenceCount = 0
  const maxIterations = 1000 // Prevent infinite loops
  let iterations = 0
  
  while (currentDate <= toDate && (!maxOccurrences || occurrenceCount < maxOccurrences) && iterations < maxIterations) {
    iterations++
    let shouldCreate = false
    let nextDate = new Date(currentDate)
    
    switch (type) {
      case 'daily':
        shouldCreate = true
        nextDate.setDate(nextDate.getDate() + Math.max(1, interval))
        break
        
      case 'weekly':
        if (daysOfWeek && daysOfWeek.includes(currentDate.getDay())) {
          shouldCreate = true
        }
        nextDate.setDate(nextDate.getDate() + 1)
        if (nextDate.getDay() === 0) { // Sunday, move to next week if needed
          nextDate.setDate(nextDate.getDate() + Math.max(0, (interval - 1) * 7))
        }
        break
        
      case 'monthly':
        shouldCreate = true
        nextDate.setMonth(nextDate.getMonth() + Math.max(1, interval))
        break
    }
    
    if (shouldCreate) {
      const recurringTask: AdvancedTask = {
        ...task,
        id: `${task.id}_recurring_${currentDate.getTime()}`,
        createdAt: new Date(currentDate),
        dueDate: task.dueDate ? new Date(currentDate.getTime() + (task.dueDate.getTime() - task.createdAt.getTime())) : undefined,
        status: 'todo',
        completedAt: undefined,
        actualTime: 0,
        timeEntries: []
      }
      
      tasks.push(recurringTask)
      occurrenceCount++
    }
    
    currentDate = nextDate
    
    // Safety check to prevent infinite loops
    if (nextDate.getTime() <= currentDate.getTime() - 24 * 60 * 60 * 1000) {
      console.warn('Potential infinite loop detected in generateRecurringTasks')
      break
    }
  }
  
  return tasks
}

export function startTimeTracking(task: AdvancedTask): TimeEntry {
  const timeEntry: TimeEntry = {
    id: `time_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    taskId: task.id,
    startTime: new Date(),
    duration: 0
  }
  
  return timeEntry
}

export function stopTimeTracking(timeEntry: TimeEntry, description?: string): TimeEntry {
  const endTime = new Date()
  const duration = Math.floor((endTime.getTime() - timeEntry.startTime.getTime()) / 1000 / 60) // minutes
  
  return {
    ...timeEntry,
    endTime,
    duration,
    description
  }
}

export function getTasksByCategory(tasks: AdvancedTask[]): Record<string, AdvancedTask[]> {
  return tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = []
    }
    acc[task.category].push(task)
    return acc
  }, {} as Record<string, AdvancedTask[]>)
}

export function getTasksByTag(tasks: AdvancedTask[], tagId: string): AdvancedTask[] {
  return tasks.filter(task => task.tags.includes(tagId))
}

export function getOverdueTasks(tasks: AdvancedTask[]): AdvancedTask[] {
  const now = new Date()
  return tasks.filter(task => 
    task.status !== 'completed' && 
    task.dueDate && 
    task.dueDate < now
  )
}

export function getUpcomingTasks(tasks: AdvancedTask[], hours: number = 24): AdvancedTask[] {
  const now = new Date()
  const futureTime = new Date(now.getTime() + hours * 60 * 60 * 1000)
  
  return tasks.filter(task => 
    task.status !== 'completed' && 
    task.dueDate && 
    task.dueDate >= now && 
    task.dueDate <= futureTime
  )
}