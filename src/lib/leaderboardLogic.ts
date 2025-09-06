export interface Player {
  id: string
  username: string
  level: number
  xp: number
  coins: number
  streak: number
  completedSessions: number
  avatar: string
  isOnline: boolean
  lastActive: Date
}

export interface LeaderboardEntry {
  rank: number
  player: Player
  score: number
  change: number // +1, -1, 0 for rank change
}

export interface GameSession {
  id: string
  gameId: string
  players: Player[]
  status: 'waiting' | 'active' | 'finished'
  startTime?: Date
  endTime?: Date
  results?: { [playerId: string]: any }
  maxPlayers: number
  isRanked: boolean
}

export type LeaderboardType = 
  | 'overall_xp' 
  | 'weekly_xp' 
  | 'monthly_xp'
  | 'streak' 
  | 'sessions'
  | 'mini_game_scores'
  | 'speed_math'
  | 'osu_rhythm'
  | 'emoji_memory'

// Mock data for development - in real app this would come from backend
const MOCK_PLAYERS: Player[] = [
  {
    id: 'player1',
    username: 'StudyNinja',
    level: 25,
    xp: 5000,
    coins: 1250,
    streak: 15,
    completedSessions: 120,
    avatar: '🥷',
    isOnline: true,
    lastActive: new Date()
  },
  {
    id: 'player2', 
    username: 'MathWizard',
    level: 22,
    xp: 4400,
    coins: 980,
    streak: 8,
    completedSessions: 95,
    avatar: '🧙‍♂️',
    isOnline: true,
    lastActive: new Date(Date.now() - 300000) // 5 min ago
  },
  {
    id: 'player3',
    username: 'FocusQueen',
    level: 28,
    xp: 5600,
    coins: 1400,
    streak: 22,
    completedSessions: 140,
    avatar: '👑',
    isOnline: false,
    lastActive: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    id: 'player4',
    username: 'RhythmMaster',
    level: 20,
    xp: 4000,
    coins: 800,
    streak: 12,
    completedSessions: 85,
    avatar: '🎵',
    isOnline: true,
    lastActive: new Date()
  },
  {
    id: 'player5',
    username: 'TaskCrusher',
    level: 24,
    xp: 4800,
    coins: 1100,
    streak: 18,
    completedSessions: 110,
    avatar: '⚡',
    isOnline: false,
    lastActive: new Date(Date.now() - 1800000) // 30 min ago
  }
]

export function getLeaderboard(type: LeaderboardType, limit: number = 10): LeaderboardEntry[] {
  let sortedPlayers = [...MOCK_PLAYERS]
  
  switch (type) {
    case 'overall_xp':
    case 'weekly_xp':
    case 'monthly_xp':
      sortedPlayers.sort((a, b) => b.xp - a.xp)
      break
    case 'streak':
      sortedPlayers.sort((a, b) => b.streak - a.streak)
      break
    case 'sessions':
      sortedPlayers.sort((a, b) => b.completedSessions - a.completedSessions)
      break
    case 'mini_game_scores':
    case 'speed_math':
    case 'osu_rhythm':
    case 'emoji_memory':
      // For game-specific scores, we'd need game history data
      sortedPlayers.sort((a, b) => b.level - a.level)
      break
  }

  return sortedPlayers.slice(0, limit).map((player, index) => ({
    rank: index + 1,
    player,
    score: getScoreForType(player, type),
    change: Math.floor(Math.random() * 3) - 1 // Random change for demo
  }))
}

function getScoreForType(player: Player, type: LeaderboardType): number {
  switch (type) {
    case 'overall_xp':
    case 'weekly_xp':
    case 'monthly_xp':
      return player.xp
    case 'streak':
      return player.streak
    case 'sessions':
      return player.completedSessions
    default:
      return player.level * 100 // Mock score for game-specific leaderboards
  }
}

export function getPlayerRank(playerId: string, type: LeaderboardType): number {
  const leaderboard = getLeaderboard(type, 100)
  const entry = leaderboard.find(e => e.player.id === playerId)
  return entry?.rank || -1
}

export function createGameSession(gameId: string, maxPlayers: number = 4, isRanked: boolean = true): GameSession {
  return {
    id: `session_${Date.now()}`,
    gameId,
    players: [],
    status: 'waiting',
    maxPlayers,
    isRanked
  }
}

export function joinGameSession(session: GameSession, player: Player): GameSession {
  if (session.players.length >= session.maxPlayers || session.status !== 'waiting') {
    return session
  }

  return {
    ...session,
    players: [...session.players, player]
  }
}

export function startGameSession(session: GameSession): GameSession {
  if (session.players.length < 2) {
    return session
  }

  return {
    ...session,
    status: 'active',
    startTime: new Date()
  }
}

export function finishGameSession(session: GameSession, results: { [playerId: string]: any }): GameSession {
  return {
    ...session,
    status: 'finished',
    endTime: new Date(),
    results
  }
}

// Friend system
export interface Friend {
  id: string
  username: string
  level: number
  avatar: string
  isOnline: boolean
  status: 'friend' | 'pending_sent' | 'pending_received'
}

export function getFriends(playerId: string): Friend[] {
  // Mock friends data
  return [
    {
      id: 'friend1',
      username: 'BestStudyBuddy',
      level: 18,
      avatar: '📚',
      isOnline: true,
      status: 'friend'
    },
    {
      id: 'friend2',
      username: 'CompetitiveAce',
      level: 21,
      avatar: '🏆',
      isOnline: false,
      status: 'friend'
    },
    {
      id: 'friend3',
      username: 'NewPlayer123',
      level: 5,
      avatar: '🌟',
      isOnline: true,
      status: 'pending_received'
    }
  ]
}

export function sendFriendRequest(fromPlayerId: string, toPlayerId: string): boolean {
  // Mock implementation
  console.log(`Friend request sent from ${fromPlayerId} to ${toPlayerId}`)
  return true
}

export function acceptFriendRequest(playerId: string, friendId: string): boolean {
  // Mock implementation
  console.log(`Friend request accepted: ${playerId} and ${friendId} are now friends`)
  return true
}

export function challengeFriend(playerId: string, friendId: string, gameId: string): GameSession {
  const session = createGameSession(gameId, 2, true)
  // In real implementation, this would send a challenge notification
  console.log(`Challenge sent from ${playerId} to ${friendId} for game ${gameId}`)
  return session
}