export interface Assignment {
  id: string
  title: string
  description?: string
  dueDate: Date
  dueTime: string
  subject: string
  priority: 'low' | 'medium' | 'high'
  isCompleted: boolean
  completedAt?: Date
  xpReward: number
  coinReward: number
  createdAt: Date
}

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  assignments: Assignment[]
}

export const SUBJECTS = [
  { id: 'math', name: 'Math', icon: '🧮', color: 'bg-blue-500' },
  { id: 'science', name: 'Science', icon: '🔬', color: 'bg-green-500' },
  { id: 'english', name: 'English', icon: '📚', color: 'bg-purple-500' },
  { id: 'history', name: 'History', icon: '🏛️', color: 'bg-yellow-500' },
  { id: 'art', name: 'Art', icon: '🎨', color: 'bg-pink-500' },
  { id: 'pe', name: 'PE', icon: '⚽', color: 'bg-orange-500' },
  { id: 'music', name: 'Music', icon: '🎵', color: 'bg-indigo-500' },
  { id: 'other', name: 'Other', icon: '📝', color: 'bg-gray-500' }
]

export function createAssignment(
  title: string,
  dueDate: Date,
  dueTime: string,
  subject: string,
  priority: Assignment['priority'],
  description?: string
): Assignment {
  const baseXP = priority === 'high' ? 100 : priority === 'medium' ? 75 : 50
  
  return {
    id: Date.now().toString(),
    title,
    description,
    dueDate,
    dueTime,
    subject,
    priority,
    isCompleted: false,
    createdAt: new Date(),
    xpReward: baseXP,
    coinReward: Math.floor(baseXP / 2)
  }
}

export function completeAssignment(assignment: Assignment): Assignment {
  return {
    ...assignment,
    isCompleted: true,
    completedAt: new Date()
  }
}

export function generateCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  const endDate = new Date(lastDay)
  
  // Start from the beginning of the week
  startDate.setDate(startDate.getDate() - startDate.getDay())
  
  // End at the end of the week
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))
  
  const days: CalendarDay[] = []
  const currentDate = new Date(startDate)
  const today = getCurrentDate()
  
  while (currentDate <= endDate) {
    days.push({
      date: new Date(currentDate),
      isCurrentMonth: currentDate.getMonth() === month,
      isToday: 
        currentDate.getDate() === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear(),
      assignments: []
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return days
}

export function getAssignmentsForDate(assignments: Assignment[], date: Date): Assignment[] {
  return assignments.filter(assignment => {
    const assignmentDate = new Date(assignment.dueDate)
    return (
      assignmentDate.getDate() === date.getDate() &&
      assignmentDate.getMonth() === date.getMonth() &&
      assignmentDate.getFullYear() === date.getFullYear()
    )
  })
}

export function getUpcomingAssignments(assignments: Assignment[], days: number = 7): Assignment[] {
  const now = getCurrentDate()
  const futureDate = getCurrentDate()
  futureDate.setDate(now.getDate() + days)
  
  return assignments
    .filter(assignment => {
      const dueDate = new Date(assignment.dueDate)
      return dueDate >= now && dueDate <= futureDate && !assignment.isCompleted
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
}

export function getOverdueAssignments(assignments: Assignment[]): Assignment[] {
  const now = getCurrentDate()
  now.setHours(0, 0, 0, 0) // Start of today
  
  return assignments
    .filter(assignment => {
      const dueDate = new Date(assignment.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      return dueDate < now && !assignment.isCompleted
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Helper function to get the current date (Monday, August 11, 2025)
export function getCurrentDate(): Date {
  return new Date(2025, 7, 11) // Month is 0-indexed, so 7 = August
}