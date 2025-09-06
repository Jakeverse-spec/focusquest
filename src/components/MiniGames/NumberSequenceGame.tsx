'use client'

import { useState, useEffect } from 'react'
import { generateNumberSequence, MiniGameResult } from '@/lib/miniGameLogic'

interface NumberSequenceGameProps {
  onGameComplete: (result: MiniGameResult) => void
  onClose: () => void
}

export default function NumberSequenceGame({ onGameComplete, onClose }: NumberSequenceGameProps) {
  const [sequence, setSequence] = useState<number[]>([])
  const [userInput, setUserInput] = useState<number[]>([])
  const [currentRound, setCurrentRound] = useState(1)
  const [gamePhase, setGamePhase] = useState<'showing' | 'input' | 'result'>('showing')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [showingIndex, setShowingIndex] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)

  const maxRounds = 8
  const maxScore = maxRounds * 100

  useEffect(() => {
    startNewRound()
  }, [])

  useEffect(() => {
    if (gamePhase === 'showing' && showingIndex < sequence.length) {
      const timer = setTimeout(() => {
        setShowingIndex(prev => prev + 1)
      }, 800)
      return () => clearTimeout(timer)
    } else if (gamePhase === 'showing' && showingIndex >= sequence.length) {
      setTimeout(() => {
        setGamePhase('input')
        setShowingIndex(0)
      }, 500)
    }
  }, [gamePhase, showingIndex, sequence.length])

  const startNewRound = () => {
    const newSequence = generateNumberSequence(Math.min(3 + currentRound, 8))
    setSequence(newSequence)
    setUserInput([])
    setGamePhase('showing')
    setShowingIndex(0)
  }

  const handleNumberClick = (number: number) => {
    if (gamePhase !== 'input') return

    const newInput = [...userInput, number]
    setUserInput(newInput)

    // Check if input matches sequence so far
    const isCorrect = newInput.every((num, index) => num === sequence[index])
    
    if (!isCorrect) {
      // Wrong input
      setLives(prev => prev - 1)
      if (lives <= 1) {
        endGame()
      } else {
        setGamePhase('result')
        setTimeout(() => {
          setUserInput([])
          setGamePhase('showing')
          setShowingIndex(0)
        }, 1500)
      }
    } else if (newInput.length === sequence.length) {
      // Correct sequence completed
      const roundScore = 100 + (sequence.length * 10)
      setScore(prev => prev + roundScore)
      
      if (currentRound >= maxRounds) {
        endGame()
      } else {
        setGamePhase('result')
        setTimeout(() => {
          setCurrentRound(prev => prev + 1)
          startNewRound()
        }, 1500)
      }
    }
  }

  const endGame = () => {
    setIsGameOver(true)
    const accuracy = currentRound > 1 ? (currentRound - 1) / maxRounds : 0
    
    const result: MiniGameResult = {
      score,
      maxScore,
      bonusXP: Math.floor(score / 8),
      bonusCoins: Math.floor(score / 15),
      accuracy
    }

    setTimeout(() => onGameComplete(result), 1500)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">🔢 Number Sequence</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* Game Stats */}
        <div className="flex justify-between items-center mb-6 text-sm">
          <div className="flex space-x-4">
            <span>Round: {currentRound}/{maxRounds}</span>
            <span>Score: {score}</span>
          </div>
          <div className="flex space-x-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={`text-lg ${i < lives ? 'text-red-500' : 'text-gray-300'}`}>
                ❤️
              </span>
            ))}
          </div>
        </div>

        {/* Game Area */}
        <div className="text-center mb-6">
          {gamePhase === 'showing' && (
            <div>
              <p className="text-gray-600 mb-4">Remember this sequence:</p>
              <div className="text-6xl font-bold mb-4 h-20 flex items-center justify-center">
                {showingIndex < sequence.length ? sequence[showingIndex] : ''}
              </div>
              <div className="text-sm text-gray-500">
                {showingIndex + 1} / {sequence.length}
              </div>
            </div>
          )}

          {gamePhase === 'input' && (
            <div>
              <p className="text-gray-600 mb-4">Enter the sequence:</p>
              <div className="mb-4 h-12 flex items-center justify-center">
                <div className="flex space-x-2">
                  {userInput.map((num, index) => (
                    <span key={index} className="text-2xl font-bold text-blue-600">
                      {num}
                    </span>
                  ))}
                  {userInput.length < sequence.length && (
                    <span className="text-2xl text-gray-300">_</span>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-4">
                {userInput.length} / {sequence.length}
              </div>
            </div>
          )}

          {gamePhase === 'result' && (
            <div>
              <div className="text-4xl mb-4">
                {userInput.length === sequence.length ? '✅' : '❌'}
              </div>
              <p className="text-lg font-bold">
                {userInput.length === sequence.length ? 'Correct!' : 'Wrong sequence!'}
              </p>
            </div>
          )}
        </div>

        {/* Number Pad */}
        {gamePhase === 'input' && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {Array.from({ length: 9 }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => handleNumberClick(number)}
                className="aspect-square bg-blue-100 hover:bg-blue-200 rounded-lg text-2xl font-bold text-blue-800 transition-colors"
              >
                {number}
              </button>
            ))}
          </div>
        )}

        {/* Instructions */}
        {gamePhase === 'showing' && currentRound === 1 && (
          <div className="text-center text-gray-600 text-sm">
            <p>Watch the numbers, then enter them in the same order!</p>
          </div>
        )}

        {isGameOver && (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Game Complete!</h3>
            <p className="text-gray-600">
              You completed {currentRound - 1} rounds with {score} points!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}