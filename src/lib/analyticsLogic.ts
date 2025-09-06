export interface StudySession {
  id: string
  startTime: Date
  endTime: Date
  duration: number // in minutes
  type: 'focus' | 'break' | 'assignment' | 'minigame'
  xpEarned: number
  coinsEarned: number
  subject?: string
  completed: boolean
  interruptions: number
}

export interface DailyStats {
  date: string
  totalFocusTime: number
  sessionsCompleted: number
  xpEarned: number
  coinsEarned: number
  averageSessionLength: number
  longestSession: number
  productivity: number // 0-100 score
  subjects: { [key: string]: number } // subject -> minutes
}

export interface WeeklyStats {
  weekStart: string
  totalFocusTime: number
  dailyAverage: number
  bestDay: string
  streak: number
  improvement: number // percentage change from previous week
  goals: {
    target: number
    achieved: number
    percentage: number
  }
}

export interface ProductivityInsights {
  peakHours: number[] // hours of day when most productive
  bestDayOfWeek: string
  averageSessionLength: number
  focusTimeGrowth: number // percentage growth over time
  subjectDistribution: { [key: string]: number }
  streakRecord: number
  totalLifetimeMinutes: number
  level: number
  rank: string // Novice, Apprentice, Expert, Master, Legend
}

// Mock data for development - in real app this would come from database
let studySessions: StudySession[] = [
  {
    id: '1',
    startTime: new Date(2025, 7, 11, 9, 0),
    endTime: new Date(2025, 7, 11, 9, 25),
    duration: 25,
    type: 'focus',
    xpEarned: 50,
    coinsEarned: 10,
    subject: 'math',
    completed: true,
    interruptions: 0
  },
  {
    id: '2',
    startTime: new Date(2025, 7, 11, 14, 30),
    endTime: new Date(2025, 7, 11, 15, 15),
    duration: 45,
    type: 'focus',
    xpEarned: 90,
    coinsEarned: 18,
    subject: 'science',
    completed: true,
    interruptions: 1
  },
  {
    id: '3',
    startTime: new Date(2025, 7, 10, 16, 0),
    endTime: new Date(2025, 7, 10, 16, 60),
    duration: 60,
    type: 'focus',
    xpEarned: 120,
    coinsEarned: 24,
    subject: 'english',
    completed: true,
    interruptions: 0
  }
]

export function addStudySession(session: Omit<StudySession, 'id'>): void {
  const newSession: StudySession = {
    ...session,
    id: Date.now().toString()
  }
  studySessions.push(newSession)
}

export function getDailyStats(date: Date): DailyStats {
  const dateStr = date.toISOString().split('T')[0]
  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(date)
  dayEnd.setHours(23, 59, 59, 999)

  const daySessions = studySessions.filter(session => 
    session.startTime >= dayStart && session.startTime <= dayEnd && session.completed
  )

  const totalFocusTime = daySessions.reduce((sum, session) => sum + session.duration, 0)
  const xpEarned = daySessions.reduce((sum, session) => sum + session.xpEarned, 0)
  const coinsEarned = daySessions.reduce((sum, session) => sum + session.coinsEarned, 0)
  const longestSession = Math.max(...daySessions.map(s => s.duration), 0)
  const averageSessionLength = daySessions.length > 0 ? totalFocusTime / daySessions.length : 0

  // Calculate productivity score based on focus time, session completion, and interruptions
  const targetFocusTime = 120 // 2 hours target
  const focusScore = Math.min(100, (totalFocusTime / targetFocusTime) * 100)
  const interruptionPenalty = daySessions.reduce((sum, s) => sum + s.interruptions, 0) * 5
  const productivity = Math.max(0, focusScore - interruptionPenalty)

  // Subject breakdown
  const subjects: { [key: string]: number } = {}
  daySessions.forEach(session => {
    if (session.subject) {
      subjects[session.subject] = (subjects[session.subject] || 0) + session.duration
    }
  })

  return {
    date: dateStr,
    totalFocusTime,
    sessionsCompleted: daySessions.length,
    xpEarned,
    coinsEarned,
    averageSessionLength,
    longestSession,
    productivity,
    subjects
  }
}

export function getWeeklyStats(weekStart: Date): WeeklyStats {
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  
  const weekSessions = studySessions.filter(session => 
    session.startTime >= weekStart && session.startTime <= weekEnd && session.completed
  )

  const totalFocusTime = weekSessions.reduce((sum, session) => sum + session.duration, 0)
  const dailyAverage = totalFocusTime / 7

  // Find best day
  const dailyTotals: { [key: string]: number } = {}
  weekSessions.forEach(session => {
    const day = session.startTime.toISOString().split('T')[0]
    dailyTotals[day] = (dailyTotals[day] || 0) + session.duration
  })
  
  const bestDay = Object.keys(dailyTotals).reduce((a, b) => 
    dailyTotals[a] > dailyTotals[b] ? a : b, Object.keys(dailyTotals)[0] || ''
  )

  // Calculate streak (consecutive days with at least 25 minutes)
  let streak = 0
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(weekStart)
    checkDate.setDate(weekStart.getDate() + i)
    const dayStats = getDailyStats(checkDate)
    if (dayStats.totalFocusTime >= 25) {
      streak++
    } else {
      break
    }
  }

  return {
    weekStart: weekStart.toISOString().split('T')[0],
    totalFocusTime,
    dailyAverage,
    bestDay,
    streak,
    improvement: 15, // Mock improvement percentage
    goals: {
      target: 840, // 2 hours per day * 7 days
      achieved: totalFocusTime,
      percentage: (totalFocusTime / 840) * 100
    }
  }
}

export function getProductivityInsights(): ProductivityInsights {
  const allSessions = studySessions.filter(s => s.completed)
  
  // Peak hours analysis
  const hourCounts: { [hour: number]: number } = {}
  allSessions.forEach(session => {
    const hour = session.startTime.getHours()
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
  })
  
  const peakHours = Object.keys(hourCounts)
    .sort((a, b) => hourCounts[parseInt(b)] - hourCounts[parseInt(a)])
    .slice(0, 3)
    .map(h => parseInt(h))

  // Best day of week
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayCounts: { [day: string]: number } = {}
  allSessions.forEach(session => {
    const day = dayNames[session.startTime.getDay()]
    dayCounts[day] = (dayCounts[day] || 0) + session.duration
  })
  
  const bestDayOfWeek = Object.keys(dayCounts).reduce((a, b) => 
    dayCounts[a] > dayCounts[b] ? a : b, 'Monday'
  )

  // Subject distribution
  const subjectDistribution: { [key: string]: number } = {}
  allSessions.forEach(session => {
    if (session.subject) {
      subjectDistribution[session.subject] = (subjectDistribution[session.subject] || 0) + session.duration
    }
  })

  const totalLifetimeMinutes = allSessions.reduce((sum, s) => sum + s.duration, 0)
  const averageSessionLength = allSessions.length > 0 ? totalLifetimeMinutes / allSessions.length : 0

  // Determine rank based on total focus time
  let rank = 'Novice'
  if (totalLifetimeMinutes > 6000) rank = 'Legend'        // 100+ hours
  else if (totalLifetimeMinutes > 3000) rank = 'Master'   // 50+ hours  
  else if (totalLifetimeMinutes > 1500) rank = 'Expert'   // 25+ hours
  else if (totalLifetimeMinutes > 600) rank = 'Apprentice' // 10+ hours

  return {
    peakHours,
    bestDayOfWeek,
    averageSessionLength,
    focusTimeGrowth: 23, // Mock growth percentage
    subjectDistribution,
    streakRecord: 12, // Mock streak record
    totalLifetimeMinutes,
    level: Math.floor(totalLifetimeMinutes / 120) + 1, // Level up every 2 hours
    rank
  }
}

export function exportStudyData(): string {
  const data = {
    sessions: studySessions,
    exportDate: new Date().toISOString(),
    version: '1.0'
  }
  return JSON.stringify(data, null, 2)
}

export function importStudyData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData)
    if (data.sessions && Array.isArray(data.sessions)) {
      studySessions = data.sessions.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: new Date(session.endTime)
      }))
      return true
    }
    return false
  } catch (error) {
    console.error('Failed to import study data:', error)
    return false
  }
}