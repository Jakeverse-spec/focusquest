export interface NotificationSettings {
  studyReminders: boolean
  achievementAlerts: boolean
  streakReminders: boolean
  dailyGoalReminders: boolean
  breakReminders: boolean
  soundEnabled: boolean
  reminderTimes: string[] // Array of times like ["09:00", "14:00", "19:00"]
}

export interface PushNotification {
  id: string
  title: string
  body: string
  icon: string
  timestamp: Date
  type: 'reminder' | 'achievement' | 'streak' | 'goal' | 'break'
  actionUrl?: string
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  studyReminders: true,
  achievementAlerts: true,
  streakReminders: true,
  dailyGoalReminders: true,
  breakReminders: true,
  soundEnabled: true,
  reminderTimes: ["09:00", "14:00", "19:00"]
}

// In-memory storage for demo - in real app this would be in localStorage/database
let notificationSettings: NotificationSettings = { ...DEFAULT_NOTIFICATION_SETTINGS }
let notificationHistory: PushNotification[] = []

export function getNotificationSettings(): NotificationSettings {
  // In real app, load from localStorage
  const saved = localStorage.getItem('focusquest-notifications')
  if (saved) {
    try {
      return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(saved) }
    } catch (e) {
      return DEFAULT_NOTIFICATION_SETTINGS
    }
  }
  return notificationSettings
}

export function updateNotificationSettings(settings: Partial<NotificationSettings>): void {
  notificationSettings = { ...notificationSettings, ...settings }
  // In real app, save to localStorage
  localStorage.setItem('focusquest-notifications', JSON.stringify(notificationSettings))
}

export function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return Promise.resolve(false)
  }

  if (Notification.permission === 'granted') {
    return Promise.resolve(true)
  }

  if (Notification.permission !== 'denied') {
    return Notification.requestPermission().then(permission => {
      return permission === 'granted'
    })
  }

  return Promise.resolve(false)
}

export function showNotification(notification: Omit<PushNotification, 'id' | 'timestamp'>): void {
  const settings = getNotificationSettings()
  
  // Check if this type of notification is enabled
  const typeEnabled = {
    reminder: settings.studyReminders,
    achievement: settings.achievementAlerts,
    streak: settings.streakReminders,
    goal: settings.dailyGoalReminders,
    break: settings.breakReminders
  }

  if (!typeEnabled[notification.type]) {
    return
  }

  const fullNotification: PushNotification = {
    ...notification,
    id: Date.now().toString(),
    timestamp: new Date()
  }

  // Add to history
  notificationHistory.unshift(fullNotification)
  if (notificationHistory.length > 50) {
    notificationHistory = notificationHistory.slice(0, 50)
  }

  // Show browser notification if permission granted
  if (Notification.permission === 'granted') {
    const browserNotification = new Notification(notification.title, {
      body: notification.body,
      icon: '/favicon.ico', // You can customize this
      badge: '/favicon.ico',
      tag: notification.type,
      requireInteraction: notification.type === 'achievement'
    })

    browserNotification.onclick = () => {
      window.focus()
      if (notification.actionUrl) {
        window.location.href = notification.actionUrl
      }
      browserNotification.close()
    }

    // Auto close after 5 seconds for non-achievement notifications
    if (notification.type !== 'achievement') {
      setTimeout(() => browserNotification.close(), 5000)
    }
  }

  // Play sound if enabled
  if (settings.soundEnabled) {
    playNotificationSound(notification.type)
  }
}

function playNotificationSound(type: PushNotification['type']): void {
  // Create audio context for notification sounds
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  
  // Different tones for different notification types
  const frequencies = {
    reminder: [440, 554], // A4, C#5
    achievement: [523, 659, 784], // C5, E5, G5 (major chord)
    streak: [440, 523, 659], // A4, C5, E5
    goal: [392, 494, 587], // G4, B4, D5
    break: [349, 440] // F4, A4
  }

  const freq = frequencies[type] || frequencies.reminder
  
  freq.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3 + (index * 0.1))
    
    oscillator.start(audioContext.currentTime + (index * 0.1))
    oscillator.stop(audioContext.currentTime + 0.3 + (index * 0.1))
  })
}

export function getNotificationHistory(): PushNotification[] {
  return [...notificationHistory]
}

export function clearNotificationHistory(): void {
  notificationHistory = []
}

// Predefined notification templates
export const NOTIFICATION_TEMPLATES = {
  studyReminder: {
    title: "⚔️ Time for a Focus Quest!",
    body: "Ready to level up your productivity? Start a study session now!",
    icon: "⚔️",
    type: 'reminder' as const,
    actionUrl: "/timer"
  },
  
  achievementUnlocked: (achievementName: string) => ({
    title: "🏆 Achievement Unlocked!",
    body: `Congratulations! You've earned: ${achievementName}`,
    icon: "🏆",
    type: 'achievement' as const,
    actionUrl: "/dashboard"
  }),
  
  streakMaintained: (days: number) => ({
    title: "🔥 Streak Maintained!",
    body: `Amazing! You're on a ${days}-day focus streak. Keep it up!`,
    icon: "🔥",
    type: 'streak' as const,
    actionUrl: "/dashboard"
  }),
  
  dailyGoalReached: (minutes: number) => ({
    title: "🎯 Daily Goal Achieved!",
    body: `Fantastic! You've completed ${minutes} minutes of focused study today.`,
    icon: "🎯",
    type: 'goal' as const,
    actionUrl: "/dashboard"
  }),
  
  breakReminder: {
    title: "☕ Time for a Break!",
    body: "You've been focusing hard. Take a 5-minute break to recharge!",
    icon: "☕",
    type: 'break' as const
  },
  
  levelUp: (newLevel: number) => ({
    title: "⭐ Level Up!",
    body: `Incredible! You've reached Level ${newLevel}. New rewards await!`,
    icon: "⭐",
    type: 'achievement' as const,
    actionUrl: "/dashboard"
  }),
  
  weeklyGoalReminder: {
    title: "📅 Weekly Check-in",
    body: "How's your week going? Check your progress and plan your next sessions!",
    icon: "📅",
    type: 'reminder' as const,
    actionUrl: "/dashboard"
  }
}

// Schedule daily reminders
export function scheduleDailyReminders(): void {
  const settings = getNotificationSettings()
  
  if (!settings.studyReminders) return

  settings.reminderTimes.forEach(time => {
    const [hours, minutes] = time.split(':').map(Number)
    const now = new Date()
    const reminderTime = new Date()
    reminderTime.setHours(hours, minutes, 0, 0)
    
    // If the time has passed today, schedule for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1)
    }
    
    const timeUntilReminder = reminderTime.getTime() - now.getTime()
    
    setTimeout(() => {
      showNotification(NOTIFICATION_TEMPLATES.studyReminder)
      // Reschedule for next day
      setInterval(() => {
        showNotification(NOTIFICATION_TEMPLATES.studyReminder)
      }, 24 * 60 * 60 * 1000) // 24 hours
    }, timeUntilReminder)
  })
}

// Initialize notifications when app loads
export function initializeNotifications(): void {
  requestNotificationPermission().then(granted => {
    if (granted) {
      scheduleDailyReminders()
      console.log('Notifications initialized successfully')
    } else {
      console.log('Notification permission denied')
    }
  })
}