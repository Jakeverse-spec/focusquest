'use client'

import { useState, useEffect } from 'react'
import { MiniGameResult } from '@/lib/miniGameLogic'

interface SpeedMathGameProps {
  onGameComplete: (result: MiniGameResult) => void
  onClose: () => void
}

export default function SpeedMathGame({ onGameComplete, onClose }: SpeedMathGameProps) {
  const [currentProblem, setCurrentProblem] = useState({ question: '', answer: 0 })
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameStarted, setGameStarted] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [problemsSolved, setProblemsSolved] = useState(0)

  useEffect(() => {
    generateNewProblem()
  }, [])

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isGameOver) {
      endGame()
    }
  }, [timeLeft, gameStarted, isGameOver])

  const generateNewProblem = () => {
    const operations = ['+', '-', '×', '÷']
    const operation = operations[Math.floor(Math.random() * operations.length)]
    
    let num1, num2, answer, question

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1
        num2 = Math.floor(Math.random() * 50) + 1
        answer = num1 + num2
        question = `${num1} + ${num2}`
        break
      case '-':
        num1 = Math.floor(Math.random() * 50) + 20
        num2 = Math.floor(Math.random() * num1) + 1
        answer = num1 - num2
        question = `${num1} - ${num2}`
        break
      case '×':
        num1 = Math.floor(Math.random() * 12) + 1
        num2 = Math.floor(Math.random() * 12) + 1
        answer = num1 * num2
        question = `${num1} × ${num2}`
        break
      case '÷':
        answer = Math.floor(Math.random() * 12) + 1
        num2 = Math.floor(Math.random() * 12) + 1
        num1 = answer * num2
        question = `${num1} ÷ ${num2}`
        break
      default:
        num1 = 1
        num2 = 1
        answer = 2
        question = '1 + 1'
    }

    setCurrentProblem({ question, answer })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!gameStarted) setGameStarted(true)
    
    const userNum = parseInt(userAnswer)
    if (userNum === currentProblem.answer) {
      // Correct!
      const streakBonus = Math.floor(streak / 3) + 1
      const points = 10 * streakBonus
      setScore(prev => prev + points)
      setStreak(prev => prev + 1)
      setProblemsSolved(prev => prev + 1)
      setFeedback('correct')
      
      setTimeout(() => {
        setFeedback(null)
        generateNewProblem()
        setUserAnswer('')
      }, 500)
    } else {
      // Wrong
      setStreak(0)
      setFeedback('wrong')
      
      setTimeout(() => {
        setFeedback(null)
        generateNewProblem()
        setUserAnswer('')
      }, 800)
    }
  }

  const endGame = () => {
    setIsGameOver(true)
    const streakBonus = Math.max(streak * 5, 0)
    const speedBonus = problemsSolved > 20 ? 100 : problemsSolved > 15 ? 50 : 0
    const finalScore = score + streakBonus + speedBonus
    const accuracy = problemsSolved > 0 ? score / (problemsSolved * 10) : 0

    const result: MiniGameResult = {
      score: finalScore,
      maxScore: 1000,
      bonusXP: Math.floor(finalScore / 6),
      bonusCoins: Math.floor(finalScore / 12),
      accuracy
    }

    setTimeout(() => onGameComplete(result), 1500)
  }

  const getStreakEmoji = () => {
    if (streak >= 10) return '🔥🔥🔥'
    if (streak >= 5) return '🔥🔥'
    if (streak >= 3) return '🔥'
    return ''
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">🧮 Math Speed Run</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* Game Stats */}
        <div className="flex justify-between items-center mb-6 text-sm">
          <div className="flex space-x-4">
            <span>Score: {score}</span>
            <span>Solved: {problemsSolved}</span>
            <span className={`${streak > 2 ? 'text-orange-500 font-bold' : 'text-gray-600'}`}>
              {getStreakEmoji()} {streak}
            </span>
          </div>
          <div className={`font-bold text-lg ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-600'}`}>
            ⏰ {timeLeft}s
          </div>
        </div>

        {/* Math Problem */}
        <div className={`text-center mb-6 p-6 rounded-lg transition-all duration-300 ${
          feedback === 'correct' 
            ? 'bg-green-100 border-2 border-green-300' 
            : feedback === 'wrong'
            ? 'bg-red-100 border-2 border-red-300'
            : 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200'
        }`}>
          <div className="text-4xl font-bold mb-4 text-gray-800">
            {currentProblem.question} = ?
          </div>
          
          {feedback === 'correct' && (
            <div className="text-green-600 font-bold text-xl animate-bounce">
              ✅ Correct! +{10 * (Math.floor(streak / 3) + 1)} points
            </div>
          )}
          
          {feedback === 'wrong' && (
            <div className="text-red-600 font-bold text-xl animate-pulse">
              ❌ Wrong! Answer was {currentProblem.answer}
            </div>
          )}
        </div>

        {/* Answer Input */}
        {!isGameOver && (
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex space-x-3">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="flex-1 px-4 py-3 text-xl text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your answer"
                autoFocus
                disabled={feedback !== null}
              />
              <button
                type="submit"
                disabled={!userAnswer || feedback !== null}
                className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
              >
                Go!
              </button>
            </div>
          </form>
        )}

        {/* Instructions/Results */}
        {!gameStarted && (
          <div className="text-center text-gray-600">
            <p className="mb-2">Solve math problems as fast as you can! 🚀</p>
            <p className="text-sm">Build streaks for bonus points. Speed = more rewards!</p>
          </div>
        )}

        {isGameOver && (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">
              {problemsSolved > 20 ? '🏆 Math Genius!' : problemsSolved > 15 ? '🎯 Great Job!' : '💪 Nice Try!'}
            </h3>
            <p className="text-gray-600 mb-2">
              Solved {problemsSolved} problems with a max streak of {streak}!
            </p>
            <p className="text-lg font-bold text-blue-600">
              Final Score: {score} points
            </p>
          </div>
        )}
      </div>
    </div>
  )
}