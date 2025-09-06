'use client'

import { useState, useEffect } from 'react'
import { Users, Play, Clock, Trophy, X, Gamepad2, Zap } from 'lucide-react'
import { GameSession, createGameSession, joinGameSession, startGameSession, Player } from '@/lib/leaderboardLogic'
import { MINI_GAMES } from '@/lib/miniGameLogic'

interface MultiplayerLobbyProps {
  currentPlayer: Player
  onGameStart: (session: GameSession) => void
  onClose: () => void
}

export default function MultiplayerLobby({ currentPlayer, onGameStart, onClose }: MultiplayerLobbyProps) {
  const [activeSessions, setActiveSessions] = useState<GameSession[]>([])
  const [selectedGame, setSelectedGame] = useState<string>('')
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [joinedSession, setJoinedSession] = useState<GameSession | null>(null)

  // Mock active sessions for demo
  useEffect(() => {
    const mockSessions: GameSession[] = [
      {
        id: 'session1',
        gameId: 'speed_math',
        players: [
          { id: 'p1', username: 'MathWizard', level: 22, xp: 4400, coins: 980, streak: 8, completedSessions: 95, avatar: '🧙‍♂️', isOnline: true, lastActive: new Date() }
        ],
        status: 'waiting',
        maxPlayers: 4,
        isRanked: true
      },
      {
        id: 'session2',
        gameId: 'osu_rhythm',
        players: [
          { id: 'p2', username: 'RhythmMaster', level: 20, xp: 4000, coins: 800, streak: 12, completedSessions: 85, avatar: '🎵', isOnline: true, lastActive: new Date() },
          { id: 'p3', username: 'BeatDropper', level: 18, xp: 3600, coins: 720, streak: 5, completedSessions: 70, avatar: '🎧', isOnline: true, lastActive: new Date() }
        ],
        status: 'waiting',
        maxPlayers: 4,
        isRanked: true
      }
    ]
    setActiveSessions(mockSessions)
  }, [])

  const handleCreateSession = () => {
    if (!selectedGame) return
    
    setIsCreatingSession(true)
    const newSession = createGameSession(selectedGame, 4, true)
    const sessionWithPlayer = joinGameSession(newSession, currentPlayer)
    
    setActiveSessions(prev => [...prev, sessionWithPlayer])
    setJoinedSession(sessionWithPlayer)
    setIsCreatingSession(false)
  }

  const handleJoinSession = (session: GameSession) => {
    const updatedSession = joinGameSession(session, currentPlayer)
    setActiveSessions(prev => prev.map(s => s.id === session.id ? updatedSession : s))
    setJoinedSession(updatedSession)
  }

  const handleStartGame = (session: GameSession) => {
    const startedSession = startGameSession(session)
    onGameStart(startedSession)
  }

  const handleLeaveSession = () => {
    if (joinedSession) {
      // Remove player from session
      const updatedSession = {
        ...joinedSession,
        players: joinedSession.players.filter(p => p.id !== currentPlayer.id)
      }
      
      if (updatedSession.players.length === 0) {
        setActiveSessions(prev => prev.filter(s => s.id !== joinedSession.id))
      } else {
        setActiveSessions(prev => prev.map(s => s.id === joinedSession.id ? updatedSession : s))
      }
      
      setJoinedSession(null)
    }
  }

  const getGameInfo = (gameId: string) => {
    return MINI_GAMES.find(g => g.id === gameId) || {
      name: 'Unknown Game',
      icon: '❓',
      difficulty: 'medium' as const
    }
  }

  if (joinedSession) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Gamepad2 className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold">Game Lobby</h2>
            </div>
            <button 
              onClick={handleLeaveSession}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Game Info */}
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">{getGameInfo(joinedSession.gameId).icon}</div>
            <h3 className="text-xl font-bold mb-2">{getGameInfo(joinedSession.gameId).name}</h3>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{joinedSession.players.length}/{joinedSession.maxPlayers} players</span>
              </span>
              <span className="flex items-center space-x-1">
                <Trophy className="w-4 h-4" />
                <span>Ranked Match</span>
              </span>
            </div>
          </div>

          {/* Players List */}
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-gray-700">Players in Lobby:</h4>
            {joinedSession.players.map((player, index) => (
              <div key={player.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{player.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{player.username}</span>
                    {player.id === currentPlayer.id && (
                      <span className="px-2 py-1 bg-primary-500 text-white text-xs rounded-full">You</span>
                    )}
                    {index === 0 && (
                      <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">Host</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">Level {player.level} • {player.xp.toLocaleString()} XP</div>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: joinedSession.maxPlayers - joinedSession.players.length }).map((_, index) => (
              <div key={`empty-${index}`} className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-2xl text-gray-400">👤</div>
                <div className="flex-1">
                  <span className="text-gray-500">Waiting for player...</span>
                </div>
              </div>
            ))}
          </div>

          {/* Game Controls */}
          <div className="flex space-x-3">
            {joinedSession.players[0]?.id === currentPlayer.id ? (
              <button
                onClick={() => handleStartGame(joinedSession)}
                disabled={joinedSession.players.length < 2}
                className="flex-1 btn-game flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                <span>Start Game</span>
              </button>
            ) : (
              <div className="flex-1 text-center py-3 text-gray-500">
                Waiting for host to start the game...
              </div>
            )}
            
            <button
              onClick={handleLeaveSession}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Leave
            </button>
          </div>

          {joinedSession.players.length < 2 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <p className="text-sm text-yellow-700">Need at least 2 players to start the game</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 max-w-4xl w-full mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
            <h2 className="text-xl sm:text-2xl font-bold">🎮 Multiplayer Lobby</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors touch-button"
            title="Back to Dashboard"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Create New Game */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span>Create New Game</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {MINI_GAMES.map(game => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedGame === game.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{game.icon}</div>
                  <div className="text-sm font-medium">{game.name}</div>
                  <div className={`text-xs mt-1 ${
                    game.difficulty === 'easy' ? 'text-green-500' :
                    game.difficulty === 'medium' ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {game.difficulty.toUpperCase()}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleCreateSession}
              disabled={!selectedGame || isCreatingSession}
              className="w-full btn-game disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingSession ? 'Creating...' : 'Create Game Session'}
            </button>
          </div>

          {/* Active Sessions */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>Join Active Games</span>
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activeSessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Gamepad2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No active games right now</p>
                  <p className="text-sm">Create one to get started!</p>
                </div>
              ) : (
                activeSessions.map(session => {
                  const gameInfo = getGameInfo(session.gameId)
                  const canJoin = session.players.length < session.maxPlayers && 
                                 !session.players.some(p => p.id === currentPlayer.id)
                  
                  return (
                    <div key={session.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{gameInfo.icon}</div>
                          <div>
                            <div className="font-semibold">{gameInfo.name}</div>
                            <div className="text-sm text-gray-500">
                              {session.players.length}/{session.maxPlayers} players
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {session.isRanked && (
                            <Trophy className="w-4 h-4 text-yellow-500" />
                          )}
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        {session.players.slice(0, 3).map(player => (
                          <div key={player.id} className="flex items-center space-x-1 text-xs bg-gray-100 rounded-full px-2 py-1">
                            <span>{player.avatar}</span>
                            <span>{player.username}</span>
                          </div>
                        ))}
                        {session.players.length > 3 && (
                          <span className="text-xs text-gray-500">+{session.players.length - 3} more</span>
                        )}
                      </div>

                      <button
                        onClick={() => handleJoinSession(session)}
                        disabled={!canJoin}
                        className="w-full btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {canJoin ? 'Join Game' : 'Game Full'}
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Quick Match */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="text-center">
            <h3 className="font-bold text-gray-800 mb-2">⚡ Quick Match</h3>
            <p className="text-sm text-gray-600 mb-4">
              Jump into a random game with players of similar skill level
            </p>
            <button className="btn-game">
              Find Quick Match
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}