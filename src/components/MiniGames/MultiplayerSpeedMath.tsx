'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Users, Trophy, Clock, Zap } from 'lucide-react'
import { GameSession, Player } from '@/lib/leaderboardLogic'

interface MultiplayerSpeedMathProps {
  session: GameSession
  currentPlayer: Player
  onGameComplete: (results: any) => void
  onClose: () => void
}

interface MathProblem {
  question: string
  answer: number
  options: number[]
}

interface PlayerScore {
  playerId: string
  username: string
  avatar: string
  score: number
  streak: number
  isFinished: boolean
  lastAnswerTime: number
}

export default function MultiplayerSpeedMath({ session, currentPlayer, onGameComplete, onClose }: MultiplayerSpeedMathProps) {
  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'finished'>('countdown')
  const [countdown, setCountdown] = useState(3)
  const [timeLeft, setTimeLeft] = useState(60)
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null)
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>([])

  const [streak, setStreak] = useState(0)
  const [score, setScore] = useState(0)
  const [problemsSolved, setProblemsSolved] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize player scores
  useEffect(() => {
    const initialScores: PlayerScore[] = session.players.map(player => ({
      playerId: player.id,
      username: player.username,
      avatar: player.avatar,
      score: 0,
      streak: 0,
      isFinished: false,
      lastAnswerTime: 0
    }))
    setPlayerScores(initialScores)
  }, [session.players])

  // Countdown timer
  useEffect(() => {
    if (gameState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (gameState === 'countdown' && countdown === 0) {
      setGameState('playing')
      generateNewProblem()
      inputRef.current?.focus()
    }
  }, [gameState, countdown])

  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (gameState === 'playing' && timeLeft === 0) {
      finishGame()
    }
  }, [gameState, timeLeft])

  // Simulate other players' progress
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (gameState === 'playing') {
      interval = setInterval(() => {
        setPlayerScores(prev => prev.map(player => {
          if (player.playerId === currentPlayer.id) return player

          // Simulate other players solving problems
          const shouldSolve = Math.random() < 0.3 // 30% chance per second
          if (shouldSolve && !player.isFinished) {
            const newScore = player.score + (10 + Math.floor(Math.random() * 15))
            const newStreak = player.streak + 1

            return {
              ...player,
              score: newScore,
              streak: newStreak,
              lastAnswerTime: Date.now()
            }
          }
          return player
        }))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameState, currentPlayer.id])

  const generateNewProblem = () => {
    const operations = ['+', '-', '*']
    const operation = operations[Math.floor(Math.random() * operations.length)]

    let num1: number, num2: number, answer: number

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1
        num2 = Math.floor(Math.random() * 50) + 1
        answer = num1 + num2
        break
      case '-':
        num1 = Math.floor(Math.random() * 50) + 25
        num2 = Math.floor(Math.random() * 25) + 1
        answer = num1 - num2
        break
      case '*':
        num1 = Math.floor(Math.random() * 12) + 1
        num2 = Math.floor(Math.random() * 12) + 1
        answer = num1 * num2
        break
      default:
        num1 = 1
        num2 = 1
        answer = 2
    }

    // Generate wrong options
    const wrongOptions: number[] = []
    for (let i = 0; i < 3; i++) {
      let wrongAnswer
      do {
        wrongAnswer = answer + (Math.floor(Math.random() * 20) - 10)
      } while (wrongAnswer === answer || wrongAnswer < 0 || wrongOptions.includes(wrongAnswer))
      wrongOptions.push(wrongAnswer)
    }

    const options = [answer, ...wrongOptions].sort(() => Math.random() - 0.5)

    setCurrentProblem({
      question: `${num1} ${operation} ${num2} = ?`,
      answer,
      options
    })
  }

  const handleAnswer = (selectedAnswer: number) => {
    if (!currentProblem || gameState !== 'playing') return

    const isCorrect = selectedAnswer === currentProblem.answer
    const newStreak = isCorrect ? streak + 1 : 0
    const points = isCorrect ? (10 + newStreak * 2) : 0

    setStreak(newStreak)
    setScore(prev => prev + points)
    setProblemsSolved(prev => prev + 1)

    // Update current player's score in the leaderboard
    setPlayerScores(prev => prev.map(player =>
      player.playerId === currentPlayer.id
        ? {
          ...player,
          score: player.score + points,
          streak: newStreak,
          lastAnswerTime: Date.now()
        }
        : player
    ))

    if (isCorrect) {
      generateNewProblem()
    } else {
      // Brief pause on wrong answer
      setTimeout(() => generateNewProblem(), 500)
    }


    inputRef.current?.focus()
  }

  const finishGame = () => {
    setGameState('finished')
    setShowResults(true)

    // Mark current player as finished
    setPlayerScores(prev => prev.map(player =>
      player.playerId === currentPlayer.id
        ? { ...player, isFinished: true }
        : player
    ))
  }

  const handleGameComplete = () => {
    const finalResults = {
      score,
      problemsSolved,
      accuracy: problemsSolved > 0 ? (score / (problemsSolved * 10)) : 0,
      maxScore: problemsSolved * 10,
      bonusXP: Math.floor(score / 10),
      bonusCoins: Math.floor(score / 20)
    }

    onGameComplete(finalResults)
  }

  if (gameState === 'countdown') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center text-white">
          <div className="text-8xl font-bold mb-4 animate-pulse">
            {countdown || 'GO!'}
          </div>
          <div className="text-2xl mb-8">Get Ready for Math Speed Battle!</div>
          <div className="flex justify-center space-x-4">
            {session.players.map(player => (
              <div key={player.id} className="text-center">
                <div className="text-3xl mb-2">{player.avatar}</div>
                <div className="text-sm">{player.username}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (showResults) {
    const sortedScores = [...playerScores].sort((a, b) => b.score - a.score)
    const currentPlayerRank = sortedScores.findIndex(p => p.playerId === currentPlayer.id) + 1

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🏁</div>
            <h2 className="text-2xl font-bold">Game Complete!</h2>
            <p className="text-gray-600">Final Results</p>
          </div>

          {/* Final Leaderboard */}
          <div className="space-y-3 mb-6">
            {sortedScores.map((player, index) => (
              <div
                key={player.playerId}
                className={`flex items-center space-x-4 p-4 rounded-lg ${player.playerId === currentPlayer.id
                  ? 'bg-primary-50 border-2 border-primary-200'
                  : 'bg-gray-50'
                  }`}
              >
                <div className="text-2xl">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div className="text-2xl">{player.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{player.username}</span>
                    {player.playerId === currentPlayer.id && (
                      <span className="px-2 py-1 bg-primary-500 text-white text-xs rounded-full">You</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Best streak: {player.streak}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">{player.score}</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>

          {/* Your Performance */}
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-center mb-3">Your Performance</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600">#{currentPlayerRank}</div>
                <div className="text-sm text-gray-600">Rank</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{streak}</div>
                <div className="text-sm text-gray-600">Best Streak</div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleGameComplete}
              className="flex-1 btn-game"
            >
              Continue
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-purple-900 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black bg-opacity-20">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-white">
            <Users className="w-5 h-5" />
            <span className="font-semibold">Multiplayer Math Battle</span>
          </div>
          <div className="flex items-center space-x-2 text-yellow-300">
            <Clock className="w-5 h-5" />
            <span className="font-bold text-xl">{timeLeft}s</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex">
        {/* Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {currentProblem && (
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-8">
                {currentProblem.question}
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {currentProblem.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="p-6 text-2xl font-bold bg-white bg-opacity-90 hover:bg-opacity-100 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-8 text-white">
                <div className="text-2xl font-bold">Score: {score}</div>
                <div className="text-lg">Streak: {streak} 🔥</div>
              </div>
            </div>
          )}
        </div>

        {/* Live Leaderboard */}
        <div className="w-80 bg-black bg-opacity-30 p-4">
          <div className="flex items-center space-x-2 text-white mb-4">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="font-bold">Live Rankings</span>
          </div>

          <div className="space-y-2">
            {playerScores
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <div
                  key={player.playerId}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${player.playerId === currentPlayer.id
                    ? 'bg-primary-500 bg-opacity-50'
                    : 'bg-white bg-opacity-10'
                    }`}
                >
                  <div className="text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="text-xl">{player.avatar}</div>
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm">
                      {player.username}
                    </div>
                    <div className="text-gray-300 text-xs">
                      Streak: {player.streak}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{player.score}</div>
                    {player.lastAnswerTime > Date.now() - 2000 && (
                      <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                    )}
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-4 p-3 bg-white bg-opacity-10 rounded-lg text-center">
            <div className="text-white text-sm">
              Problems Solved: {problemsSolved}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}