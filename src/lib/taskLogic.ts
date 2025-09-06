export interface Task {
  id: string
  title: string
  description?: string
  category: 'work' | 'study' | 'personal' | 'health'
  priority: 'low' | 'medium' | 'high'
  estimatedSessions: number
  completedSessions: number
  isCompleted: boolean
  createdAt: Date
  completedAt?: Date
  xpReward: number
  coinReward: number
}

export interface TaskCategory {
  id: string
  name: string
  icon: string
  color: string
}

export const TASK_CATEGORIES: TaskCategory[] = [
  { id: 'work', name: 'Work', icon: '💼', color: 'bg-blue-500' },
  { id: 'study', name: 'Study', icon: '📚', color: 'bg-green-500' },
  { id: 'personal', name: 'Personal', icon: '🎯', color: 'bg-purple-500' },
  { id: 'health', name: 'Health', icon: '💪', color: 'bg-red-500' }
]

export const PRIORITY_COLORS = {
  low: 'text-gray-500',
  medium: 'text-yellow-500',
  high: 'text-red-500'
}

export const PRIORITY_XP_MULTIPLIER = {
  low: 1,
  medium: 1.2,
  high: 1.5
}

export function createTask(
  title: string,
  category: Task['category'],
  priority: Task['priority'],
  estimatedSessions: number,
  description?: string
): Task {
  const baseXP = estimatedSessions * 25
  const xpReward = Math.floor(baseXP * PRIORITY_XP_MULTIPLIER[priority])
  
  return {
    id: Date.now().toString(),
    title,
    description,
    category,
    priority,
    estimatedSessions,
    completedSessions: 0,
    isCompleted: false,
    createdAt: new Date(),
    xpReward,
    coinReward: Math.floor(xpReward / 5)
  }
}

export function completeTaskSession(task: Task): Task {
  const newCompletedSessions = task.completedSessions + 1
  const isCompleted = newCompletedSessions >= task.estimatedSessions
  
  return {
    ...task,
    completedSessions: newCompletedSessions,
    isCompleted,
    completedAt: isCompleted ? new Date() : task.completedAt
  }
}

export function getTaskProgress(task: Task): number {
  return (task.completedSessions / task.estimatedSessions) * 100
}