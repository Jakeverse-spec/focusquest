'use client'

import { useState, useEffect } from 'react'
import { Target, Trophy, Users, Settings, ShoppingBag, Gamepad2, Calendar as CalendarIcon, BarChart3, Zap, Star } from 'lucide-react'
import PlayerStats from '@/components/Game/PlayerStats'
import TaskList from '@/components/Tasks/TaskList'
import CreateTaskModal from '@/components/Tasks/CreateTaskModal'
import AchievementPanel from '@/components/Game/AchievementPanel'
import ThemeSelector from '@/components/Game/ThemeSelector'
import CharacterCustomization from '@/components/Character/CharacterCustomization'
import PowerUpShop from '@/components/PowerUps/PowerUpShop'
import MiniGameSelector from '@/components/MiniGames/MiniGameSelector'
import DevGameScreen from '@/components/Developer/DevGameScreen'
import { NotificationManager } from '@/components/Game/AnimatedNotification'
import { INITIAL_PLAYER_DATA, completeSession, getXPForNextLevel } from '@/lib/gameLogic'
import { Task, completeTaskSession } from '@/lib/taskLogic'
import { initializeAchievements, checkAchievements } from '@/lib/achievementLogic'
import { getTheme, applyTheme } from '@/lib/themeLogic'
import { INITIAL_CHARACTER, calculateCharacterStats, CHARACTER_ITEMS } from '@/lib/characterLogic'
import { POWER_UPS, usePowerUp, applyPowerUpEffects, isActivePowerUpExpired } from '@/lib/powerUpLogic'
import { MINI_GAMES, calculateMiniGameReward } from '@/lib/miniGameLogic'
import Calendar from '@/components/Calendar/Calendar'
import CreateAssignmentModal from '@/components/Calendar/CreateAssignmentModal'
import AssignmentDetails from '@/components/Calendar/AssignmentDetails'
import { Assignment, completeAssignment } from '@/lib/calendarLogic'
import LeaderboardPanel from '@/components/Leaderboard/LeaderboardPanel'
import MultiplayerLobby from '@/components/Multiplayer/MultiplayerLobby'
import FriendsPanel from '@/components/Friends/FriendsPanel'
import MultiplayerSpeedMath from '@/components/MiniGames/MultiplayerSpeedMath'
import AnalyticsDashboard from '@/components/Analytics/AnalyticsDashboard'
import NotificationSettings from '@/components/Settings/NotificationSettings'
import FloatingActionButton from '@/components/Navigation/FloatingActionButton'
import { Player, GameSession } from '@/lib/leaderboardLogic'
import { initializeNotifications } from '@/lib/notificationLogic'

// NEW ADVANCED FEATURES
import AdvancedTaskManager from '@/components/Tasks/AdvancedTaskManager'
import QuestPanel from '@/components/Quests/QuestPanel'
import { AdvancedTask, TaskCategory, TaskTag, DEFAULT_CATEGORIES, DEFAULT_TAGS, createTaskFromTemplate, calculateTaskXP, calculateTaskCoins } from '@/lib/advancedTaskLogic'
import { Quest, Equipment, Pet, generateDailyQuests, updateQuestProgress, EQUIPMENT_CATALOG, PET_CATALOG, feedPet, gainPetXP } from '@/lib/questSystem'
import { ProductivityStreak, Goal, HabitMetric, FocusSession, updateStreak, updateGoalProgress, updateHabitProgress, generateProductivityReport, generateFocusHeatmap, DEFAULT_GOALS, DEFAULT_HABITS } from '@/lib/advancedAnalytics'

export default function Dashboard() {
  // EXISTING STATE
  const [playerData, setPlayerData] = useState(INITIAL_PLAYER_DATA)
  const [tasks, setTasks] = useState<Task[]>([])
  const [achievements, setAchievements] = useState(() => initializeAchievements())
  const [currentTheme, setCurrentTheme] = useState('fantasy')
  const [character, setCharacter] = useState(INITIAL_CHARACTER)
  const [powerUpInventory, setPowerUpInventory] = useState<{[key: string]: number}>({})
  const [powerUpCooldowns, setPowerUpCooldowns] = useState<{[key: string]: Date}>({})
  const [activePowerUps, setActivePowerUps] = useState<any[]>([])
  const [activeSection, setActiveSection] = useState<'home' | 'study' | 'social' | 'character' | 'analytics' | 'settings' | 'quests'>('home')
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [showMiniGames, setShowMiniGames] = useState(false)
  const [showDevMode, setShowDevMode] = useState(false)
  const [isDevModeActive, setIsDevModeActive] = useState(false)
  const [showMultiplayerLobby, setShowMultiplayerLobby] = useState(false)
  const [currentMultiplayerSession, setCurrentMultiplayerSession] = useState<GameSession | null>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // NEW ADVANCED STATE
  const [advancedTasks, setAdvancedTasks] = useState<AdvancedTask[]>([])
  const [taskCategories, setTaskCategories] = useState<TaskCategory[]>(DEFAULT_CATEGORIES)
  const [taskTags, setTaskTags] = useState<TaskTag[]>(DEFAULT_TAGS)
  const [quests, setQuests] = useState<Quest[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [productivityStreak, setProductivityStreak] = useState<ProductivityStreak>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: new Date(),
    streakHistory: []
  })
  const [goals, setGoals] = useState<Goal[]>([])
  const [habits, setHabits] = useState<HabitMetric[]>([])
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([])
  const [currentFocusSession, setCurrentFocusSession] = useState<FocusSession | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([
    // Sample assignments for the current week
    {
      id: 'assign1',
      title: 'Math Quiz - Algebra',
      description: 'Chapter 5 quiz on quadratic equations',
      dueDate: new Date(2025, 7, 13), // Wednesday, Aug 13
      dueTime: '10:00',
      subject: 'math',
      priority: 'high',
      isCompleted: false,
      createdAt: new Date(2025, 7, 10),
      xpReward: 100,
      coinReward: 50
    },
    {
      id: 'assign2',
      title: 'History Essay Draft',
      description: 'First draft of Civil War essay',
      dueDate: new Date(2025, 7, 15), // Friday, Aug 15
      dueTime: '23:59',
      subject: 'history',
      priority: 'medium',
      isCompleted: false,
      createdAt: new Date(2025, 7, 8),
      xpReward: 75,
      coinReward: 37
    },
    {
      id: 'assign3',
      title: 'Science Lab Report',
      description: 'Chemistry lab on acids and bases',
      dueDate: new Date(2025, 7, 12), // Tuesday, Aug 12
      dueTime: '14:30',
      subject: 'science',
      priority: 'medium',
      isCompleted: false,
      createdAt: new Date(2025, 7, 9),
      xpReward: 75,
      coinReward: 37
    },
    {
      id: 'assign4',
      title: 'English Reading',
      description: 'Read chapters 1-3 of To Kill a Mockingbird',
      dueDate: new Date(2025, 7, 14), // Thursday, Aug 14
      dueTime: '08:00',
      subject: 'english',
      priority: 'low',
      isCompleted: false,
      createdAt: new Date(2025, 7, 11),
      xpReward: 50,
      coinReward: 25
    }
  ])
  const [showCreateAssignment, setShowCreateAssignment] = useState(false)
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | undefined>()
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'achievement' | 'levelUp' | 'sessionComplete' | 'taskComplete' | 'miniGame'
    title: string
    message: string
    icon?: string
  }>>([])

  // Apply theme on mount and theme change
  useEffect(() => {
    const theme = getTheme(currentTheme)
    applyTheme(theme)
  }, [currentTheme])

  // Initialize notifications on mount
  useEffect(() => {
    initializeNotifications()
  }, [])

  // Clean up expired power-ups
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePowerUps(prev => {
        const filtered = prev.filter(powerUp => !isActivePowerUpExpired(powerUp))
        // Only update state if there are actual changes
        return filtered.length !== prev.length ? filtered : prev
      })
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  // Initialize advanced systems
  useEffect(() => {
    // Initialize daily quests
    const dailyQuests = generateDailyQuests(playerData.level, [])
    setQuests(dailyQuests)

    // Initialize goals
    const initialGoals = DEFAULT_GOALS.map((goalTemplate, index) => ({
      ...goalTemplate,
      id: `goal_${index}`,
      current: 0,
      isCompleted: false
    }))
    setGoals(initialGoals)

    // Initialize habits
    const initialHabits = DEFAULT_HABITS.map((habitTemplate, index) => ({
      ...habitTemplate,
      id: `habit_${index}`,
      currentWeekCount: 0,
      totalCount: 0,
      streak: 0,
      history: []
    }))
    setHabits(initialHabits)
  }, [playerData.level])

  // Update productivity streak daily - optimized
  useEffect(() => {
    const today = new Date()
    const todayString = today.toDateString()
    const lastUpdate = new Date(productivityStreak.lastActiveDate)
    
    // Only update if it's a new day
    if (todayString !== lastUpdate.toDateString()) {
      // Use more efficient filtering with early returns
      let completedTasksToday = 0
      let xpEarnedToday = 0
      
      for (const task of advancedTasks) {
        if (task.completedAt && task.completedAt.toDateString() === todayString) {
          completedTasksToday++
          xpEarnedToday += task.xpReward
        }
      }
      
      let focusTimeToday = 0
      for (const session of focusSessions) {
        if (session.startTime.toDateString() === todayString) {
          focusTimeToday += session.duration
        }
      }
      
      setProductivityStreak(prev => updateStreak(prev, completedTasksToday, focusTimeToday, xpEarnedToday))
    }
  }, [advancedTasks.length, focusSessions.length, productivityStreak.lastActiveDate])

  // Auto-generate new daily quests
  useEffect(() => {
    const now = new Date()
    const expiredQuests = quests.filter(quest => quest.expiresAt && quest.expiresAt < now)
    
    if (expiredQuests.length > 0) {
      // Remove expired quests and generate new ones
      const activeQuests = quests.filter(quest => !quest.expiresAt || quest.expiresAt >= now)
      const completedQuestTitles = quests.filter(q => q.isCompleted).map(q => q.title)
      const newDailyQuests = generateDailyQuests(playerData.level, completedQuestTitles)
      
      setQuests([...activeQuests, ...newDailyQuests])
    }
  }, [quests, playerData.level])

  const addNotification = (notification: Omit<typeof notifications[0], 'id'>) => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { ...notification, id }])
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // ADVANCED TASK HANDLERS
  const handleAdvancedTaskCreate = (task: AdvancedTask) => {
    setAdvancedTasks(prev => [...prev, task])
    
    // Update quest progress
    setQuests(prev => prev.map(quest => 
      updateQuestProgress(quest, 'complete_tasks', 1, task.category)
    ))
  }

  const handleAdvancedTaskUpdate = (updatedTask: AdvancedTask) => {
    setAdvancedTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))

    // If task was completed, give rewards and update systems
    if (updatedTask.status === 'completed' && updatedTask.completedAt) {
      const oldLevel = playerData.level
      
      // Give XP and coins
      setPlayerData(prev => {
        const newXP = prev.xp + updatedTask.xpReward
        const newLevel = Math.floor(newXP / 200) + 1
        
        return {
          ...prev,
          xp: newXP,
          coins: prev.coins + updatedTask.coinReward,
          level: newLevel
        }
      })

      // Update quest progress
      setQuests(prev => prev.map(quest => 
        updateQuestProgress(quest, 'complete_tasks', 1, updatedTask.category)
      ))

      // Update goals
      setGoals(prev => prev.map(goal => {
        if (goal.category === 'tasks') {
          return updateGoalProgress(goal, 1)
        } else if (goal.category === 'xp') {
          return updateGoalProgress(goal, updatedTask.xpReward)
        }
        return goal
      }))

      // Give pet XP
      setPets(prev => prev.map(pet => 
        pet.isActive ? gainPetXP(pet, Math.floor(updatedTask.xpReward / 10)) : pet
      ))

      addNotification({
        type: 'taskComplete',
        title: 'Task Completed!',
        message: `"${updatedTask.title}" completed! +${updatedTask.xpReward} XP, +${updatedTask.coinReward} coins`,
        icon: '✅'
      })
    }
  }

  const handleAdvancedTaskDelete = (taskId: string) => {
    setAdvancedTasks(prev => prev.filter(task => task.id !== taskId))
  }

  // QUEST HANDLERS
  const handleQuestComplete = (quest: Quest) => {
    // Give rewards
    setPlayerData(prev => ({
      ...prev,
      xp: prev.xp + quest.rewards.xp,
      coins: prev.coins + quest.rewards.coins
    }))

    // Mark quest as completed
    setQuests(prev => prev.map(q => 
      q.id === quest.id ? { ...q, isCompleted: true, completedAt: new Date() } : q
    ))

    // Add equipment rewards to inventory
    if (quest.rewards.items) {
      quest.rewards.items.forEach(itemId => {
        const item = EQUIPMENT_CATALOG.find(eq => eq.id === itemId)
        if (item) {
          setEquipment(prev => {
            const existing = prev.find(eq => eq.id === itemId)
            if (existing) {
              return prev.map(eq => 
                eq.id === itemId ? { ...eq, quantity: eq.quantity + 1 } : eq
              )
            } else {
              return [...prev, { ...item, quantity: 1 }]
            }
          })
        }
      })
    }

    addNotification({
      type: 'achievement',
      title: 'Quest Completed!',
      message: `"${quest.title}" completed! +${quest.rewards.xp} XP, +${quest.rewards.coins} coins`,
      icon: quest.icon
    })
  }

  // EQUIPMENT HANDLERS
  const handleEquipmentPurchase = (item: Equipment) => {
    if (playerData.coins >= item.cost) {
      setPlayerData(prev => ({
        ...prev,
        coins: prev.coins - item.cost
      }))

      setEquipment(prev => {
        const existing = prev.find(eq => eq.id === item.id)
        if (existing) {
          return prev.map(eq => 
            eq.id === item.id ? { ...eq, quantity: eq.quantity + 1 } : eq
          )
        } else {
          return [...prev, { ...item, quantity: 1 }]
        }
      })

      addNotification({
        type: 'achievement',
        title: 'Equipment Purchased!',
        message: `${item.name} added to your inventory!`,
        icon: item.icon
      })
    }
  }

  // PET HANDLERS
  const handlePetAdopt = (pet: Pet) => {
    const adoptionCost = pet.rarity === 'legendary' ? 1000 : 
                        pet.rarity === 'epic' ? 500 : 
                        pet.rarity === 'rare' ? 200 : 100

    if (playerData.coins >= adoptionCost) {
      setPlayerData(prev => ({
        ...prev,
        coins: prev.coins - adoptionCost
      }))

      const newPet: Pet = {
        ...pet,
        level: 1,
        xp: 0,
        maxXp: 100,
        happiness: 100,
        maxHappiness: 100,
        lastFed: new Date(),
        isActive: pets.length === 0 // First pet is automatically active
      }

      setPets(prev => [...prev, newPet])

      addNotification({
        type: 'achievement',
        title: 'Pet Adopted!',
        message: `${pet.name} has joined your team!`,
        icon: pet.icon
      })
    }
  }

  // FOCUS SESSION HANDLERS
  const handleStartFocusSession = (taskId?: string) => {
    const session: FocusSession = {
      id: `focus_${Date.now()}`,
      taskId,
      startTime: new Date(),
      endTime: new Date(),
      duration: 0,
      quality: 'good',
      interruptions: 0,
      category: taskId ? advancedTasks.find(t => t.id === taskId)?.category || 'general' : 'general'
    }
    
    setCurrentFocusSession(session)
  }

  const handleEndFocusSession = (quality: FocusSession['quality'], interruptions: number, notes?: string) => {
    if (currentFocusSession) {
      const endTime = new Date()
      const duration = Math.floor((endTime.getTime() - currentFocusSession.startTime.getTime()) / 1000 / 60)
      
      const completedSession: FocusSession = {
        ...currentFocusSession,
        endTime,
        duration,
        quality,
        interruptions,
        notes
      }

      setFocusSessions(prev => [...prev, completedSession])
      setCurrentFocusSession(null)

      // Update quest progress
      setQuests(prev => prev.map(quest => 
        updateQuestProgress(quest, 'focus_time', duration)
      ))

      // Update goals
      setGoals(prev => prev.map(goal => 
        goal.category === 'focus_time' ? updateGoalProgress(goal, duration) : goal
      ))

      addNotification({
        type: 'sessionComplete',
        title: 'Focus Session Complete!',
        message: `${duration} minutes of focused work completed!`,
        icon: '🎯'
      })
    }
  }

  const handleCreateTask = (task: Task) => {
    setTasks(prev => [...prev, task])
  }

  const handleTaskSelect = (task: Task) => {
    if (!task.isCompleted) {
      const updatedTask = completeTaskSession(task)
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t))
      
      if (updatedTask.isCompleted) {
        // Task completed - give rewards
        setPlayerData(prev => ({
          ...prev,
          xp: prev.xp + updatedTask.xpReward,
          coins: prev.coins + updatedTask.coinReward,
          level: Math.floor((prev.xp + updatedTask.xpReward) / 200) + 1
        }))

        addNotification({
          type: 'taskComplete',
          title: 'Quest Completed!',
          message: `"${updatedTask.title}" completed! +${updatedTask.xpReward} XP, +${updatedTask.coinReward} coins`,
          icon: '✅'
        })
      }
    }
  }

  const handleSessionComplete = () => {
    const oldLevel = playerData.level
    const characterStats = calculateCharacterStats(character)
    
    // Apply character and power-up bonuses
    let baseXP = 50
    let baseCoins = 10
    
    // Apply character bonuses
    baseXP = Math.floor(baseXP * (1 + characterStats.xpBonus / 100))
    baseCoins = Math.floor(baseCoins * (1 + characterStats.coinBonus / 100))
    
    // Apply power-up bonuses
    baseXP = applyPowerUpEffects(baseXP, activePowerUps, 'xp_multiplier')
    baseCoins = applyPowerUpEffects(baseCoins, activePowerUps, 'coin_multiplier')
    
    const newPlayerData = {
      ...completeSession(playerData),
      xp: playerData.xp + baseXP,
      coins: playerData.coins + baseCoins,
      energy: Math.min(playerData.maxEnergy, playerData.energy + characterStats.energyBonus)
    }
    newPlayerData.level = Math.floor(newPlayerData.xp / 200) + 1
    
    setPlayerData(newPlayerData)

    addNotification({
      type: 'sessionComplete',
      title: 'Focus Session Complete!',
      message: `Great work! +${baseXP} XP, +${baseCoins} coins earned`,
      icon: '⚡'
    })

    if (newPlayerData.level > oldLevel) {
      addNotification({
        type: 'levelUp',
        title: 'Level Up!',
        message: `Congratulations! You reached level ${newPlayerData.level}!`,
        icon: '⭐'
      })
    }

    // Check for new achievements
    const stats = {
      completedSessions: newPlayerData.completedSessions,
      completedTasks: tasks.filter(t => t.isCompleted).length,
      highPriorityTasksCompleted: tasks.filter(t => t.isCompleted && t.priority === 'high').length,
      currentStreak: newPlayerData.streak,
      level: newPlayerData.level
    }

    const { updatedAchievements, newlyUnlocked } = checkAchievements(achievements, stats)
    setAchievements(updatedAchievements)

    newlyUnlocked.forEach(achievement => {
      addNotification({
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: `${achievement.name}: ${achievement.description}`,
        icon: achievement.icon
      })
    })

    // Show mini-games after session completion
    setShowMiniGames(true)
  }

  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId)
  }

  const activateDevMode = () => {
    setIsDevModeActive(true)
    // Give developer benefits
    setPlayerData(prev => ({
      ...prev,
      level: 50, // Max level
      xp: 10000,
      coins: 99999,
      energy: prev.maxEnergy,
      completedSessions: 1000,
      streak: 100
    }))
    // Give all power-ups
    const allPowerUps: {[key: string]: number} = {}
    POWER_UPS.forEach(powerUp => {
      allPowerUps[powerUp.id] = 99 // 99 of each power-up
    })
    setPowerUpInventory(allPowerUps)
    // Unlock all achievements
    setAchievements(prev => prev.map(achievement => ({
      ...achievement,
      isUnlocked: true,
      currentProgress: achievement.requirement,
      unlockedAt: new Date()
    })))
    // Give all character items
    setCharacter(prev => ({
      ...prev,
      ownedItems: CHARACTER_ITEMS.map(item => item.id)
    }))
  }

  const exitDevMode = () => {
    setIsDevModeActive(false)
    // Reset to normal values
    setPlayerData(INITIAL_PLAYER_DATA)
    setPowerUpInventory({})
    setPowerUpCooldowns({})
    setActivePowerUps([])
    setAchievements(initializeAchievements())
    setCharacter(INITIAL_CHARACTER)
  }

  const handleEquipItem = (itemId: string, type: any) => {
    setCharacter(prev => ({ ...prev, [type]: itemId }))
  }

  const handlePurchaseItem = (item: any) => {
    if (playerData.coins >= item.cost) {
      setPlayerData(prev => ({ ...prev, coins: prev.coins - item.cost }))
      setCharacter(prev => ({ 
        ...prev, 
        ownedItems: [...prev.ownedItems, item.id] 
      }))
    }
  }

  const handlePurchasePowerUp = (powerUp: any) => {
    if (playerData.coins >= powerUp.cost) {
      setPlayerData(prev => ({ ...prev, coins: prev.coins - powerUp.cost }))
      setPowerUpInventory(prev => ({ 
        ...prev, 
        [powerUp.id]: (prev[powerUp.id] || 0) + 1 
      }))
    }
  }

  const handleUsePowerUp = (powerUp: any) => {
    const owned = powerUpInventory[powerUp.id] || 0
    
    if (owned === 0 && playerData.coins >= powerUp.cost) {
      // Buy and use
      setPlayerData(prev => ({ ...prev, coins: prev.coins - powerUp.cost }))
    }
    
    const result = usePowerUp(powerUp, powerUpInventory, powerUpCooldowns)
    setPowerUpInventory(result.newInventory)
    setPowerUpCooldowns(result.newCooldowns)
    
    if (result.activePowerUp) {
      setActivePowerUps(prev => [...prev, result.activePowerUp!])
      addNotification({
        type: 'sessionComplete',
        title: 'Power-Up Activated!',
        message: `${powerUp.name} is now active!`,
        icon: powerUp.icon
      })
    } else {
      // Instant effect (like energy restore)
      if (powerUp.effect.type === 'energy_restore') {
        setPlayerData(prev => ({
          ...prev,
          energy: Math.min(prev.maxEnergy, prev.energy + powerUp.effect.value)
        }))
        addNotification({
          type: 'sessionComplete',
          title: 'Energy Restored!',
          message: `+${powerUp.effect.value} energy restored!`,
          icon: powerUp.icon
        })
      }
    }
  }

  const handleMiniGameComplete = (gameId: string, result: any) => {
    const game = MINI_GAMES.find(g => g.id === gameId)
    if (!game) return

    const reward = calculateMiniGameReward(game, result)
    setPlayerData(prev => ({
      ...prev,
      xp: prev.xp + reward.xp,
      coins: prev.coins + reward.coins,
      level: Math.floor((prev.xp + reward.xp) / 200) + 1
    }))

    addNotification({
      type: 'miniGame',
      title: 'Mini-Game Complete!',
      message: `${game.name}: +${reward.xp} XP, +${reward.coins} coins!`,
      icon: game.icon
    })
  }

  const handleCreateAssignment = (assignment: Assignment) => {
    setAssignments(prev => [...prev, assignment])
    addNotification({
      type: 'taskComplete',
      title: 'New Quest Created!',
      message: `"${assignment.title}" added to your quest log`,
      icon: '📚'
    })
  }

  const handleCompleteAssignment = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId)
    if (!assignment) return

    const completedAssignment = completeAssignment(assignment)
    setAssignments(prev => prev.map(a => a.id === assignmentId ? completedAssignment : a))
    
    // Give rewards
    setPlayerData(prev => ({
      ...prev,
      xp: prev.xp + completedAssignment.xpReward,
      coins: prev.coins + completedAssignment.coinReward,
      level: Math.floor((prev.xp + completedAssignment.xpReward) / 200) + 1
    }))

    addNotification({
      type: 'taskComplete',
      title: 'Quest Completed!',
      message: `"${completedAssignment.title}" completed! +${completedAssignment.xpReward} XP, +${completedAssignment.coinReward} coins`,
      icon: '✅'
    })
  }

  const handleMultiplayerGameStart = (session: GameSession) => {
    setCurrentMultiplayerSession(session)
    setShowMultiplayerLobby(false)
  }

  const handleMultiplayerGameComplete = (results: any) => {
    // Handle multiplayer game completion
    const reward = {
      xp: results.bonusXP || 25,
      coins: results.bonusCoins || 10
    }
    
    setPlayerData(prev => ({
      ...prev,
      xp: prev.xp + reward.xp,
      coins: prev.coins + reward.coins,
      level: Math.floor((prev.xp + reward.xp) / 200) + 1
    }))

    addNotification({
      type: 'miniGame',
      title: 'Multiplayer Game Complete!',
      message: `Great battle! +${reward.xp} XP, +${reward.coins} coins!`,
      icon: '🏆'
    })

    setCurrentMultiplayerSession(null)
  }

  const handleChallengeCreate = (sessionId: string) => {
    // Handle friend challenge creation
    addNotification({
      type: 'sessionComplete',
      title: 'Challenge Sent!',
      message: 'Your friend has been challenged to a game!',
      icon: '⚔️'
    })
  }

  // Create current player object for multiplayer features
  const currentPlayer: Player = {
    id: 'current_player',
    username: 'You', // In real app, this would be the actual username
    level: playerData.level,
    xp: playerData.xp,
    coins: playerData.coins,
    streak: playerData.streak,
    completedSessions: playerData.completedSessions,
    avatar: character.avatar || '🧙‍♂️',
    isOnline: true,
    lastActive: new Date()
  }

  const theme = getTheme(currentTheme)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="mobile-container py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
                <span className="text-lg sm:text-2xl mr-1 sm:mr-2">{theme.icons.character}</span>
                <span className="text-primary-600 hidden sm:inline">FocusQuest</span>
                <span className="text-primary-600 sm:hidden">FQ</span>
                {isDevModeActive && (
                  <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                    🛠️
                  </span>
                )}
              </h1>
            </div>
            
            {/* Player Stats - Mobile Responsive */}
            <div className="flex items-center space-x-2 sm:space-x-6">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">Level</span>
                <span className="font-bold text-primary-600 text-sm sm:text-base">{playerData.level}</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">XP</span>
                <span className="font-bold text-blue-600 text-sm sm:text-base">{playerData.xp.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm sm:text-base">💰</span>
                <span className="font-bold text-yellow-600 text-sm sm:text-base">{playerData.coins.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm sm:text-base">⚡</span>
                <span className="font-bold text-green-600 text-sm sm:text-base">{playerData.energy}/{playerData.maxEnergy}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mobile-container py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Mobile Menu Overlay */}
          {showMobileMenu && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setShowMobileMenu(false)} />
          )}

          {/* Sidebar Navigation */}
          <div className={`mobile-sidebar ${showMobileMenu ? 'open' : ''} lg:w-64 lg:flex-shrink-0`}>
            <div className="bg-white rounded-none lg:rounded-xl shadow-sm p-4 h-full lg:sticky lg:top-6">
              <nav className="space-y-2">
                {/* Home Section */}
                <div>
                  <button
                    onClick={() => { setActiveSection('home'); setActiveTab('overview') }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === 'home' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Target className="w-5 h-5" />
                    <span className="font-medium">Home</span>
                  </button>
                </div>

                {/* Study Section */}
                <div>
                  <button
                    onClick={() => { setActiveSection('study'); setActiveTab('tasks') }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === 'study' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span className="font-medium">Study</span>
                  </button>
                  {activeSection === 'study' && (
                    <div className="ml-8 mt-2 space-y-1">
                      <button
                        onClick={() => setActiveTab('tasks')}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          activeTab === 'tasks' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Quest Log
                      </button>
                      <button
                        onClick={() => setActiveTab('calendar')}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          activeTab === 'calendar' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Calendar
                      </button>
                      <button
                        onClick={() => setActiveTab('achievements')}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          activeTab === 'achievements' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Achievements
                      </button>
                    </div>
                  )}
                </div>

                {/* Social Section */}
                <div>
                  <button
                    onClick={() => { setActiveSection('social'); setActiveTab('leaderboard') }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === 'social' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Trophy className="w-5 h-5" />
                    <span className="font-medium">Social</span>
                  </button>
                  {activeSection === 'social' && (
                    <div className="ml-8 mt-2 space-y-1">
                      <button
                        onClick={() => setActiveTab('leaderboard')}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          activeTab === 'leaderboard' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Leaderboards
                      </button>
                      <button
                        onClick={() => setActiveTab('friends')}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          activeTab === 'friends' ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Friends
                      </button>
                    </div>
                  )}
                </div>

                {/* Quests Section */}
                <div>
                  <button
                    onClick={() => { setActiveSection('quests'); setActiveTab('quests') }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === 'quests' ? 'bg-yellow-100 text-yellow-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Star className="w-5 h-5" />
                    <span className="font-medium">Quests</span>
                  </button>
                </div>

                {/* Character Section */}
                <div>
                  <button
                    onClick={() => { setActiveSection('character'); setActiveTab('character') }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === 'character' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{theme.icons.character}</span>
                    <span className="font-medium">Character</span>
                  </button>
                  {activeSection === 'character' && (
                    <div className="ml-8 mt-2 space-y-1">
                      <button
                        onClick={() => setActiveTab('character')}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          activeTab === 'character' ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Customize
                      </button>
                      <button
                        onClick={() => setActiveTab('powerups')}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          activeTab === 'powerups' ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Power-Ups
                      </button>
                    </div>
                  )}
                </div>

                {/* Analytics Section */}
                <div>
                  <button
                    onClick={() => { setActiveSection('analytics'); setActiveTab('analytics') }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === 'analytics' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">📊</span>
                    <span className="font-medium">Analytics</span>
                  </button>
                </div>

                {/* Settings Section */}
                <div>
                  <button
                    onClick={() => { setActiveSection('settings'); setActiveTab('theme') }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === 'settings' ? 'bg-gray-100 text-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                  </button>
                  {activeSection === 'settings' && (
                    <div className="ml-8 mt-2 space-y-1">
                      <button
                        onClick={() => setActiveTab('themes')}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          activeTab === 'themes' ? 'bg-gray-50 text-gray-600' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Themes
                      </button>
                      <button
                        onClick={() => setActiveTab('notifications')}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          activeTab === 'notifications' ? 'bg-gray-50 text-gray-600' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Notifications
                      </button>
                    </div>
                  )}
                </div>
              </nav>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <a 
                    href="/timer" 
                    className="w-full btn-game text-center block py-3"
                  >
                    🎯 Start Focus Session
                  </a>
                  <button
                    onClick={() => setShowMultiplayerLobby(true)}
                    className="w-full btn-primary text-center py-3"
                  >
                    🎮 Multiplayer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Home Overview */}
            {activeSection === 'home' && (
              <div className="space-y-6">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">Welcome back, Adventurer!</h2>
                  <p className="opacity-90">Ready to continue your productivity quest?</p>
                </div>

                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{playerData.level}</div>
                        <div className="text-sm text-gray-600">Level</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{playerData.xp.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Total XP</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <span className="text-yellow-600">💰</span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{playerData.coins.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Coins</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600">🔥</span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-800">{playerData.streak}</div>
                        <div className="text-sm text-gray-600">Day Streak</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Overview */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4">📋 Today's Quests</h3>
                    <div className="space-y-3">
                      {tasks.slice(0, 3).map(task => (
                        <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-3 h-3 rounded-full ${task.isCompleted ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          <span className="flex-1 text-sm">{task.title}</span>
                          <span className="text-xs text-gray-500">+{task.xpReward} XP</span>
                        </div>
                      ))}
                      <button 
                        onClick={() => { setActiveSection('study'); setActiveTab('tasks') }}
                        className="w-full text-center py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm"
                      >
                        View All Quests →
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4">📅 Upcoming Assignments</h3>
                    <div className="space-y-3">
                      {assignments.slice(0, 3).map(assignment => (
                        <div key={assignment.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-3 h-3 rounded-full ${assignment.isCompleted ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{assignment.title}</div>
                            <div className="text-xs text-gray-500">Due: {assignment.dueDate.toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => { setActiveSection('study'); setActiveTab('calendar') }}
                        className="w-full text-center py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-sm"
                      >
                        View Calendar →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Study Section Content */}
            {activeSection === 'study' && activeTab === 'tasks' && (
              <TaskList
                tasks={tasks}
                onTaskSelect={handleTaskSelect}
                onAddTask={() => setShowCreateTask(true)}
              />
            )}
            
            {activeSection === 'study' && activeTab === 'achievements' && (
              <AchievementPanel achievements={achievements} />
            )}

            {activeSection === 'study' && activeTab === 'calendar' && (
              <div className="grid lg:grid-cols-2 gap-6">
                <Calendar
                  assignments={assignments}
                  onDateSelect={setSelectedCalendarDate}
                  onAddAssignment={() => setShowCreateAssignment(true)}
                  selectedDate={selectedCalendarDate}
                />
                <AssignmentDetails
                  assignments={assignments}
                  selectedDate={selectedCalendarDate}
                  onCompleteAssignment={handleCompleteAssignment}
                />
              </div>
            )}

            {/* Social Section Content */}
            {activeSection === 'social' && activeTab === 'leaderboard' && (
              <LeaderboardPanel currentPlayerId={currentPlayer.id} />
            )}

            {activeSection === 'social' && activeTab === 'friends' && (
              <FriendsPanel 
                currentPlayerId={currentPlayer.id}
                onChallengeCreate={handleChallengeCreate}
              />
            )}

            {/* Character Section Content */}
            {activeSection === 'character' && activeTab === 'character' && (
              <CharacterCustomization
                character={character}
                playerLevel={playerData.level}
                playerCoins={playerData.coins}
                onEquipItem={handleEquipItem}
                onPurchaseItem={handlePurchaseItem}
              />
            )}

            {activeSection === 'character' && activeTab === 'powerups' && (
              <PowerUpShop
                playerLevel={playerData.level}
                playerCoins={playerData.coins}
                inventory={powerUpInventory}
                cooldowns={powerUpCooldowns}
                activePowerUps={activePowerUps}
                onPurchasePowerUp={handlePurchasePowerUp}
                onUsePowerUp={handleUsePowerUp}
              />
            )}

            {/* Quests Section Content */}
            {activeSection === 'quests' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">⭐</span>
                    <h2 className="mobile-heading font-bold">Quests & Challenges</h2>
                  </div>
                </div>
                <QuestPanel 
                  playerLevel={playerData.level}
                  quests={quests}
                  equipment={equipment}
                  pets={pets}
                  onQuestComplete={handleQuestComplete}
                  onEquipmentPurchase={handleEquipmentPurchase}
                  onPetAdopt={handlePetAdopt}
                />
              </div>
            )}

            {/* Analytics Section Content */}
            {activeSection === 'analytics' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📊</span>
                    <h2 className="mobile-heading font-bold">Study Analytics</h2>
                  </div>
                </div>
                <AnalyticsDashboard />
              </div>
            )}

            {/* Settings Section Content */}
            {activeSection === 'settings' && activeTab === 'themes' && (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl">🎨</span>
                  <h2 className="mobile-heading font-bold">Theme Settings</h2>
                </div>
                <ThemeSelector
                  currentTheme={currentTheme}
                  playerLevel={playerData.level}
                  onThemeChange={handleThemeChange}
                  onDevModeActivate={activateDevMode}
                  isDevModeActive={isDevModeActive}
                  onDevModeExit={exitDevMode}
                  onDevGameAccess={() => setShowDevMode(true)}
                />
              </div>
            )}

            {activeSection === 'settings' && activeTab === 'notifications' && (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl">🔔</span>
                  <h2 className="mobile-heading font-bold">Notification Settings</h2>
                </div>
                <NotificationSettings />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        onCreateTask={handleCreateTask}
      />

      <CreateAssignmentModal
        isOpen={showCreateAssignment}
        onClose={() => setShowCreateAssignment(false)}
        onCreateAssignment={handleCreateAssignment}
        selectedDate={selectedCalendarDate}
      />

      {/* Mini-Games Modal */}
      {showMiniGames && (
        <MiniGameSelector
          playerLevel={playerData.level}
          onGameComplete={handleMiniGameComplete}
          onClose={() => setShowMiniGames(false)}
        />
      )}

      {/* Developer Mode Screen */}
      {showDevMode && (
        <DevGameScreen
          onClose={() => setShowDevMode(false)}
          onGameComplete={handleMiniGameComplete}
        />
      )}

      {/* Multiplayer Lobby */}
      {showMultiplayerLobby && (
        <MultiplayerLobby
          currentPlayer={currentPlayer}
          onGameStart={handleMultiplayerGameStart}
          onClose={() => setShowMultiplayerLobby(false)}
        />
      )}

      {/* Multiplayer Game Session */}
      {currentMultiplayerSession && (
        <MultiplayerSpeedMath
          session={currentMultiplayerSession}
          currentPlayer={currentPlayer}
          onGameComplete={handleMultiplayerGameComplete}
          onClose={() => setCurrentMultiplayerSession(null)}
        />
      )}

      {/* Notifications */}
      <NotificationManager
        notifications={notifications}
        onRemoveNotification={removeNotification}
      />

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Debug Info (Development Only) */}



    </div>
  )
}