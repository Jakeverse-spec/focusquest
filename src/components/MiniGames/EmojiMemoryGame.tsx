'use client'

import { useState, useEffect } from 'react'
import { MiniGameResult } from '@/lib/miniGameLogic'

interface EmojiMemoryGameProps {
  onGameComplete: (result: MiniGameResult) => void
  onClose: () => void
}

export default function EmojiMemoryGame({ onGameComplete, onClose }: EmojiMemoryGameProps) {
  const [cards, setCards] = useState<Array<{id: number, emoji: string, isFlipped: boolean, isMatched: boolean}>>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [timeLeft, setTimeLeft] = useState(45)
  const [gameStarted, setGameStarted] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [streak, setStreak] = useState(0)

  const trendingEmojis = ['🔥', '💀', '😭', '💯', '🤡', '👑', '🚀', '⚡', '💎', '🎯', '🌟', '🎮']
  const totalPairs = 8

  useEffect(() => {
    initializeGame()
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

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found!
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true }
              : card
          ))
          setMatches(prev => prev + 1)
          setStreak(prev => prev + 1)
          setFlippedCards([])
        }, 600)
      } else {
        // No match
        setStreak(0)
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

  const initializeGame = () => {
    const selectedEmojis = trendingEmojis.slice(0, totalPairs)
    const gameCards: typeof cards = []

    selectedEmojis.forEach((emoji, index) => {
      gameCards.push(
        { id: index * 2, emoji, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, emoji, isFlipped: false, isMatched: false }
      )
    })

    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]]
    }

    setCards(gameCards)
  }

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
    const timeBonus = Math.max(0, timeLeft * 3)
    const streakBonus = streak * 10
    const perfectBonus = matches === totalPairs ? 100 : 0
    const score = (matches * 100) + timeBonus + streakBonus + perfectBonus
    const accuracy = matches / totalPairs

    const result: MiniGameResult = {
      score,
      maxScore: (totalPairs * 100) + (45 * 3) + 100,
      bonusXP: Math.floor(score / 8),
      bonusCoins: Math.floor(score / 15),
      accuracy
    }

    setTimeout(() => onGameComplete(result), 1500)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">🔥 Emoji Memory Blast</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* Game Stats */}
        <div className="flex justify-between items-center mb-6 text-sm">
          <div className="flex space-x-4">
            <span>Moves: {moves}</span>
            <span>Matches: {matches}/{totalPairs}</span>
            <span className={`${streak > 2 ? 'text-orange-500 font-bold' : 'text-gray-600'}`}>
              🔥 Streak: {streak}
            </span>
          </div>
          <div className={`font-bold text-lg ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-600'}`}>
            ⏰ {timeLeft}s
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {cards.map(card => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-lg border-2 flex items-center justify-center text-3xl font-bold cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                card.isFlipped || card.isMatched
                  ? card.isMatched 
                    ? 'bg-green-100 border-green-300 scale-110' 
                    : 'bg-blue-100 border-blue-300'
                  : 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 hover:from-purple-200 hover:to-pink-200'
              }`}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '❓'}
            </div>
          ))}
        </div>

        {/* Instructions/Results */}
        {!gameStarted && (
          <div className="text-center text-gray-600">
            <p className="mb-2">Match the trending emoji pairs! 🔥</p>
            <p className="text-sm">Build streaks for bonus points. Quick matches = more rewards!</p>
          </div>
        )}

        {isGameOver && (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">
              {matches === totalPairs ? '🎉 Perfect Game!' : '💪 Nice Try!'}
            </h3>
            <p className="text-gray-600">
              {matches === totalPairs 
                ? `Flawless victory! All ${totalPairs} pairs matched!` 
                : `Found ${matches} out of ${totalPairs} pairs`}
            </p>
            {streak > 3 && (
              <p className="text-orange-500 font-bold mt-2">🔥 Max streak: {streak}!</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}