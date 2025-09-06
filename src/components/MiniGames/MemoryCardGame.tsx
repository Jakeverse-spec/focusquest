'use client'

import { useState, useEffect } from 'react'
import { MemoryCard, generateMemoryCards, MiniGameResult } from '@/lib/miniGameLogic'

interface MemoryCardGameProps {
  onGameComplete: (result: MiniGameResult) => void
  onClose: () => void
}

export default function MemoryCardGame({ onGameComplete, onClose }: MemoryCardGameProps) {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isGameOver, setIsGameOver] = useState(false)

  const totalPairs = 6
  const maxScore = totalPairs * 100

  useEffect(() => {
    setCards(generateMemoryCards(totalPairs))
  }, [])

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !isGameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isGameOver) {
      endGame()
    }
  }, [timeLeft, gameStarted, isGameOver])

  useEffect(() => {
    if (matches === totalPairs && !isGameOver) {
      endGame()
    }
  }, [matches, isGameOver])

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards
      const firstCard = cards.find(c => c.id === first)
      const secondCard = cards.find(c => c.id === second)

      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true }
              : card
          ))
          setMatches(prev => prev + 1)
          setFlippedCards([])
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false }
              : card
          ))
          setFlippedCards([])
        }, 1000)
      }
      setMoves(prev => prev + 1)
    }
  }, [flippedCards, cards])

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) setGameStarted(true)
    if (flippedCards.length === 2 || isGameOver) return

    const card = cards.find(c => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ))
    setFlippedCards(prev => [...prev, cardId])
  }

  const endGame = () => {
    setIsGameOver(true)
    const timeBonus = Math.max(0, timeLeft * 2)
    const movesPenalty = Math.max(0, (moves - totalPairs) * 5)
    const score = Math.max(0, (matches * 100) + timeBonus - movesPenalty)
    const accuracy = matches / totalPairs

    const result: MiniGameResult = {
      score,
      maxScore,
      bonusXP: Math.floor(score / 10),
      bonusCoins: Math.floor(score / 20),
      accuracy
    }

    setTimeout(() => onGameComplete(result), 1000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">🧠 Memory Cards</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* Game Stats */}
        <div className="flex justify-between items-center mb-6 text-sm">
          <div className="flex space-x-4">
            <span>Moves: {moves}</span>
            <span>Matches: {matches}/{totalPairs}</span>
          </div>
          <div className={`font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-600'}`}>
            Time: {timeLeft}s
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {cards.map(card => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-lg border-2 flex items-center justify-center text-2xl font-bold cursor-pointer transition-all duration-300 ${
                card.isFlipped || card.isMatched
                  ? 'bg-blue-100 border-blue-300'
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
              } ${card.isMatched ? 'opacity-75' : ''}`}
            >
              {card.isFlipped || card.isMatched ? card.symbol : '?'}
            </div>
          ))}
        </div>

        {/* Instructions */}
        {!gameStarted && (
          <div className="text-center text-gray-600">
            <p className="mb-2">Click cards to flip them and find matching pairs!</p>
            <p className="text-sm">Complete all pairs before time runs out for bonus points.</p>
          </div>
        )}

        {isGameOver && (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Game Complete!</h3>
            <p className="text-gray-600">
              {matches === totalPairs ? 'Perfect! All pairs found!' : `Found ${matches} out of ${totalPairs} pairs`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}