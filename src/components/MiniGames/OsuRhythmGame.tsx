'use client'

import { useState, useEffect, useRef } from 'react'
import { MiniGameResult } from '@/lib/miniGameLogic'

interface Song {
  id: string
  name: string
  artist: string
  bpm: number
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Insane'
  duration: number // seconds
  audioUrl: string
}

interface Circle {
  id: number
  x: number
  y: number
  appearTime: number
  hitTime: number
  isHit: boolean
  hitAccuracy?: 'perfect' | 'great' | 'good' | 'miss'
}

interface OsuRhythmGameProps {
  onGameComplete: (result: MiniGameResult) => void
  onClose: () => void
}

const SONGS: Song[] = [
  // Seven - Jung Kook (feat. Latto) - REAL INSTRUMENTAL VERSIONS
  { 
    id: 'seven_easy', 
    name: 'Seven (Easy)', 
    artist: 'Jung Kook (feat. Latto)', 
    bpm: 125, 
    difficulty: 'Easy', 
    duration: 120, // 2 minutes
    audioUrl: '/audio/seven-instrumental.webm'
  },
  { 
    id: 'seven_medium', 
    name: 'Seven (Medium)', 
    artist: 'Jung Kook (feat. Latto)', 
    bpm: 125, 
    difficulty: 'Normal', 
    duration: 120, // 2 minutes
    audioUrl: '/audio/seven-instrumental.webm'
  },
  { 
    id: 'seven_hard', 
    name: 'Seven (Hard)', 
    artist: 'Jung Kook (feat. Latto)', 
    bpm: 125, 
    difficulty: 'Hard', 
    duration: 120, // 2 minutes
    audioUrl: '/audio/seven-instrumental.webm'
  },

  // Feel It - d4vd (from Invincible) - REAL INSTRUMENTAL VERSIONS
  { 
    id: 'feelit_easy', 
    name: 'Feel It (Easy)', 
    artist: 'd4vd', 
    bpm: 110, 
    difficulty: 'Easy', 
    duration: 120, // 2 minutes
    audioUrl: '/audio/feelit-instrumental.mp3'
  },
  { 
    id: 'feelit_medium', 
    name: 'Feel It (Medium)', 
    artist: 'd4vd', 
    bpm: 110, 
    difficulty: 'Normal', 
    duration: 120, // 2 minutes
    audioUrl: '/audio/feelit-instrumental.mp3'
  },
  { 
    id: 'feelit_hard', 
    name: 'Feel It (Hard)', 
    artist: 'd4vd', 
    bpm: 110, 
    difficulty: 'Hard', 
    duration: 120, // 2 minutes
    audioUrl: '/audio/feelit-instrumental.mp3'
  },

  // Timeless - The Weeknd & Playboi Carti - REAL INSTRUMENTAL VERSIONS
  { 
    id: 'timeless_easy', 
    name: 'Timeless (Easy)', 
    artist: 'The Weeknd & Playboi Carti', 
    bpm: 95, 
    difficulty: 'Easy', 
    duration: 120, // 2 minutes
    audioUrl: '/audio/timeless-instrumental.mp3'
  },
  { 
    id: 'timeless_medium', 
    name: 'Timeless (Medium)', 
    artist: 'The Weeknd & Playboi Carti', 
    bpm: 95, 
    difficulty: 'Normal', 
    duration: 120, // 2 minutes
    audioUrl: '/audio/timeless-instrumental.mp3'
  },
  { 
    id: 'timeless_hard', 
    name: 'Timeless (Hard)', 
    artist: 'The Weeknd & Playboi Carti', 
    bpm: 95, 
    difficulty: 'Hard', 
    duration: 120, // 2 minutes
    audioUrl: '/audio/timeless-instrumental.mp3'
  },

  // See You Again - Tyler, The Creator (feat. Kali Uchis) - REAL INSTRUMENTAL VERSIONS
  { 
    id: 'seeyou_easy', 
    name: 'See You Again (Easy)', 
    artist: 'Tyler, The Creator (feat. Kali Uchis)', 
    bpm: 80, 
    difficulty: 'Easy', 
    duration: 120, // 2 minutes
    audioUrl: '/audio/seeyouagain-instrumental.mp3'
  },
  { 
    id: 'seeyou_medium', 
    name: 'See You Again (Medium)', 
    artist: 'Tyler, The Creator (feat. Kali Uchis)', 
    bpm: 80, 
    difficulty: 'Normal', 
    duration: 120, // 2 minutes
    audioUrl: '/audio/seeyouagain-instrumental.mp3'
  },
  { 
    id: 'seeyou_hard', 
    name: 'See You Again (Hard)', 
    artist: 'Tyler, The Creator (feat. Kali Uchis)', 
    bpm: 80, 
    difficulty: 'Hard', 
    duration: 120, // 2 minutes
    audioUrl: '/audio/seeyouagain-instrumental.mp3'
  }
]

export default function OsuRhythmGame({ onGameComplete, onClose }: OsuRhythmGameProps) {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [circles, setCircles] = useState<Circle[]>([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [hits, setHits] = useState({ perfect: 0, great: 0, good: 0, miss: 0 })
  const [gameTime, setGameTime] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const gameLoopRef = useRef<number>()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize and play background music
  useEffect(() => {
    if (selectedSong && gameStarted) {
      console.log('Attempting to play:', selectedSong.name, selectedSong.audioUrl)
      
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener('loadstart', () => {})
        audioRef.current.removeEventListener('canplay', () => {})
        audioRef.current.removeEventListener('playing', () => {})
        audioRef.current.removeEventListener('error', () => {})
      }
      
      audioRef.current = new Audio(selectedSong.audioUrl)
      audioRef.current.volume = 0.5 // Increased volume
      audioRef.current.loop = true // Loop the song
      audioRef.current.preload = 'auto'
      
      // Add event listeners for debugging
      audioRef.current.addEventListener('loadstart', () => console.log('🎵 Audio loading started'))
      audioRef.current.addEventListener('loadeddata', () => console.log('🎵 Audio data loaded'))
      audioRef.current.addEventListener('canplay', () => console.log('🎵 Audio can play'))
      audioRef.current.addEventListener('playing', () => console.log('🎵 Audio is playing'))
      audioRef.current.addEventListener('pause', () => console.log('🎵 Audio paused'))
      audioRef.current.addEventListener('ended', () => console.log('🎵 Audio ended'))
      audioRef.current.addEventListener('error', (e) => {
        console.error('🎵 Audio error:', e)
        console.error('🎵 Audio error details:', audioRef.current?.error)
        setSoundEnabled(false)
      })
      
      // Try to play the song with user interaction handling
      const playAudio = async () => {
        try {
          await audioRef.current?.play()
          console.log('🎵 Audio playback started successfully')
        } catch (e) {
          console.log('🎵 Audio playback failed:', e)
          console.log('🎵 This might be due to browser autoplay policy - user interaction required')
          setSoundEnabled(false)
        }
      }
      
      // Small delay to ensure audio is loaded
      setTimeout(playAudio, 100)
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [selectedSong, gameStarted])

  // Stop music when game ends
  useEffect(() => {
    if (isGameOver && audioRef.current) {
      audioRef.current.pause()
    }
  }, [isGameOver])

  useEffect(() => {
    if (gameStarted && selectedSong) {
      startGame()
      return () => {
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current)
        }
      }
    }
  }, [gameStarted, selectedSong])

  const startGame = () => {
    if (!selectedSong) return
    
    generateCircles()
    const startTime = Date.now()
    
    const gameLoop = () => {
      const currentTime = Date.now() - startTime
      setGameTime(currentTime / 1000)
      
      // Update circles
      setCircles(prev => prev.map(circle => {
        if (!circle.isHit && currentTime > circle.hitTime + 500) {
          // Miss
          if (circle.hitAccuracy === undefined) {
            setHits(h => ({ ...h, miss: h.miss + 1 }))
            setCombo(0)
            return { ...circle, isHit: true, hitAccuracy: 'miss' }
          }
        }
        return circle
      }))
      
      if (currentTime < selectedSong.duration * 1000) {
        gameLoopRef.current = requestAnimationFrame(gameLoop)
      } else {
        endGame()
      }
    }
    
    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }

  const generateCircles = () => {
    if (!selectedSong) return
    
    // Different circle counts and patterns based on difficulty
    let circleCount: number
    let appearanceTime: number // How long before hit time circles appear
    let spacing: number // Time between circles
    
    switch (selectedSong.difficulty) {
      case 'Easy':
        circleCount = Math.floor(selectedSong.duration * selectedSong.bpm / 300) // Fewer circles
        appearanceTime = 1500 // 1.5 seconds to prepare
        spacing = 1.5 // More time between circles
        break
      case 'Normal':
        circleCount = Math.floor(selectedSong.duration * selectedSong.bpm / 240) // Normal amount
        appearanceTime = 1200 // 1.2 seconds to prepare
        spacing = 1.2
        break
      case 'Hard':
        circleCount = Math.floor(selectedSong.duration * selectedSong.bpm / 180) // More circles
        appearanceTime = 800 // 0.8 seconds to prepare
        spacing = 0.8 // Less time between circles
        break
      default:
        circleCount = Math.floor(selectedSong.duration * selectedSong.bpm / 240)
        appearanceTime = 1000
        spacing = 1.0
    }
    
    const newCircles: Circle[] = []
    
    // Generate circles continuously throughout the song
    const totalGameTime = selectedSong.duration * 1000
    const circleInterval = spacing * 1000
    
    for (let time = 2000; time < totalGameTime; time += circleInterval) {
      const hitTime = time
      
      // Different positioning strategies by difficulty with more randomization
      let x: number, y: number
      const gameWidth = 400 // Game area width
      const gameHeight = 280 // Game area height
      const circleRadius = 32 // Half of circle size (64px)
      
      if (selectedSong.difficulty === 'Easy') {
        // Easy: Loose grid with random offset for variety
        const gridIndex = Math.floor((time - 2000) / circleInterval)
        const gridCols = 3
        const gridRows = 2
        const baseX = (gridIndex % gridCols) * (gameWidth / gridCols) + (gameWidth / gridCols / 2)
        const baseY = Math.floor(gridIndex / gridCols) % gridRows * (gameHeight / gridRows) + (gameHeight / gridRows / 2)
        
        // Add random offset to make it less predictable
        const offsetRange = 40
        x = Math.max(circleRadius, Math.min(gameWidth - circleRadius, baseX + (Math.random() - 0.5) * offsetRange))
        y = Math.max(circleRadius, Math.min(gameHeight - circleRadius, baseY + (Math.random() - 0.5) * offsetRange))
      } else if (selectedSong.difficulty === 'Normal') {
        // Normal: More random with some pattern avoidance
        const attempts = 10
        let bestX = 0, bestY = 0, maxDistance = 0
        
        // Try multiple positions and pick the one furthest from recent circles
        for (let attempt = 0; attempt < attempts; attempt++) {
          const testX = Math.random() * (gameWidth - circleRadius * 2) + circleRadius
          const testY = Math.random() * (gameHeight - circleRadius * 2) + circleRadius
          
          // Calculate minimum distance to recent circles
          let minDistance = Infinity
          const recentCircles = newCircles.slice(-3) // Check last 3 circles
          
          for (const recentCircle of recentCircles) {
            const distance = Math.sqrt(Math.pow(testX - recentCircle.x, 2) + Math.pow(testY - recentCircle.y, 2))
            minDistance = Math.min(minDistance, distance)
          }
          
          if (minDistance > maxDistance) {
            maxDistance = minDistance
            bestX = testX
            bestY = testY
          }
        }
        
        x = bestX
        y = bestY
      } else {
        // Hard: Completely chaotic with potential for tricky patterns
        const patternType = Math.random()
        
        if (patternType < 0.3 && newCircles.length > 0) {
          // 30% chance: Create challenging patterns
          const lastCircle = newCircles[newCircles.length - 1]
          const angle = Math.random() * Math.PI * 2
          const distance = 80 + Math.random() * 120
          
          x = lastCircle.x + Math.cos(angle) * distance
          y = lastCircle.y + Math.sin(angle) * distance
          
          // Keep within bounds
          x = Math.max(circleRadius, Math.min(gameWidth - circleRadius, x))
          y = Math.max(circleRadius, Math.min(gameHeight - circleRadius, y))
        } else if (patternType < 0.6 && newCircles.length >= 2) {
          // 30% chance: Create geometric patterns (triangles, lines)
          const circle1 = newCircles[newCircles.length - 2]
          const circle2 = newCircles[newCircles.length - 1]
          
          // Create third point of triangle or continue line
          const midX = (circle1.x + circle2.x) / 2
          const midY = (circle1.y + circle2.y) / 2
          const perpAngle = Math.atan2(circle2.y - circle1.y, circle2.x - circle1.x) + Math.PI / 2
          const distance = 60 + Math.random() * 80
          
          x = midX + Math.cos(perpAngle) * distance
          y = midY + Math.sin(perpAngle) * distance
          
          // Keep within bounds
          x = Math.max(circleRadius, Math.min(gameWidth - circleRadius, x))
          y = Math.max(circleRadius, Math.min(gameHeight - circleRadius, y))
        } else {
          // 40% chance: Pure chaos - anywhere on screen
          x = Math.random() * (gameWidth - circleRadius * 2) + circleRadius
          y = Math.random() * (gameHeight - circleRadius * 2) + circleRadius
        }
      }
      
      newCircles.push({
        id: newCircles.length,
        x,
        y,
        appearTime: hitTime - appearanceTime,
        hitTime,
        isHit: false
      })
    }
    
    setCircles(newCircles)
  }

  // Create a persistent audio context
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize audio context once
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Resume context if suspended (required by some browsers)
      const resumeContext = () => {
        if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current.resume()
        }
      }
      
      // Add click listener to resume context
      document.addEventListener('click', resumeContext, { once: true })
      document.addEventListener('touchstart', resumeContext, { once: true })
      
      return () => {
        document.removeEventListener('click', resumeContext)
        document.removeEventListener('touchstart', resumeContext)
      }
    } catch (e) {
      console.log('Audio context creation failed:', e)
    }
  }, [])

  const playNoteSound = (accuracy: Circle['hitAccuracy'], circleId: number) => {
    if (!soundEnabled || !selectedSong || !audioContextRef.current) return
    
    // Create musical note sounds that match the song's key/scale
    try {
      const audioContext = audioContextRef.current
      
      // Resume context if suspended
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }
      
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Musical notes based on the song (simplified pentatonic scale)
      const songNotes = {
        'seven_easy': [261.63, 293.66, 329.63, 392.00, 440.00], // C major pentatonic
        'seven_medium': [261.63, 293.66, 329.63, 392.00, 440.00],
        'seven_hard': [261.63, 293.66, 329.63, 392.00, 440.00],
        'feelit_easy': [220.00, 246.94, 277.18, 329.63, 369.99], // A minor pentatonic
        'feelit_medium': [220.00, 246.94, 277.18, 329.63, 369.99],
        'feelit_hard': [220.00, 246.94, 277.18, 329.63, 369.99],
        'timeless_easy': [246.94, 277.18, 311.13, 369.99, 415.30], // B minor pentatonic
        'timeless_medium': [246.94, 277.18, 311.13, 369.99, 415.30],
        'timeless_hard': [246.94, 277.18, 311.13, 369.99, 415.30],
        'seeyou_easy': [293.66, 329.63, 369.99, 440.00, 493.88], // D major pentatonic
        'seeyou_medium': [293.66, 329.63, 369.99, 440.00, 493.88],
        'seeyou_hard': [293.66, 329.63, 369.99, 440.00, 493.88]
      }
      
      const notes = songNotes[selectedSong.id as keyof typeof songNotes] || songNotes['seven_easy']
      const noteIndex = circleId % notes.length
      const baseFreq = notes[noteIndex]
      
      // Adjust frequency based on accuracy (perfect = exact note, miss = off-key)
      let frequency = baseFreq
      switch (accuracy) {
        case 'perfect':
          frequency = baseFreq // Perfect pitch
          break
        case 'great':
          frequency = baseFreq * 1.02 // Slightly sharp
          break
        case 'good':
          frequency = baseFreq * 0.98 // Slightly flat
          break
        default:
          frequency = baseFreq * 0.9 // Noticeably off-key for miss
      }
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = 'sine' // Pure musical tone
      
      // Volume based on accuracy - match background music volume (0.6)
      const volume = accuracy === 'miss' ? 0.3 : 0.6
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
      
      // Clean up oscillator after it finishes
      oscillator.addEventListener('ended', () => {
        oscillator.disconnect()
        gainNode.disconnect()
      })
      
    } catch (e) {
      console.log('Note sound failed:', e)
      // Try to recreate audio context if it failed
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (recreateError) {
        console.log('Audio context recreation failed:', recreateError)
      }
    }
  }

  const handleCircleClick = (circleId: number) => {
    const currentTime = gameTime * 1000
    setCircles(prev => prev.map(circle => {
      if (circle.id === circleId && !circle.isHit) {
        const timeDiff = Math.abs(currentTime - circle.hitTime)
        let accuracy: Circle['hitAccuracy']
        let points = 0
        
        if (timeDiff <= 50) {
          accuracy = 'perfect'
          points = 300
          setHits(h => ({ ...h, perfect: h.perfect + 1 }))
        } else if (timeDiff <= 100) {
          accuracy = 'great'
          points = 200
          setHits(h => ({ ...h, great: h.great + 1 }))
        } else if (timeDiff <= 200) {
          accuracy = 'good'
          points = 100
          setHits(h => ({ ...h, good: h.good + 1 }))
        } else {
          accuracy = 'miss'
          points = 0
          setHits(h => ({ ...h, miss: h.miss + 1 }))
        }
        
        // Play musical note sound
        playNoteSound(accuracy, circleId)
        
        if (accuracy !== 'miss') {
          const newCombo = combo + 1
          setCombo(newCombo)
          setMaxCombo(prev => Math.max(prev, newCombo))
          const comboMultiplier = Math.min(1 + (newCombo / 10), 2)
          setScore(prev => prev + Math.floor(points * comboMultiplier))
        } else {
          setCombo(0)
        }
        
        return { ...circle, isHit: true, hitAccuracy: accuracy }
      }
      return circle
    }))
  }

  const endGame = () => {
    setIsGameOver(true)
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
    }
    
    const totalHits = hits.perfect + hits.great + hits.good + hits.miss
    const accuracy = totalHits > 0 ? (hits.perfect + hits.great + hits.good) / totalHits : 0
    const maxScore = circles.length * 300 * 2 // Perfect score with max combo
    
    const result: MiniGameResult = {
      score,
      maxScore,
      bonusXP: Math.floor(score / 10),
      bonusCoins: Math.floor(score / 20),
      accuracy
    }
    
    setTimeout(() => onGameComplete(result), 2000)
  }

  const getDifficultyColor = (difficulty: Song['difficulty']) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500'
      case 'Normal': return 'text-blue-500'
      case 'Hard': return 'text-orange-500'
      case 'Insane': return 'text-red-500'
    }
  }

  const getVisibleCircles = () => {
    const currentTime = gameTime * 1000
    return circles.filter(circle => 
      currentTime >= circle.appearTime && 
      currentTime <= circle.hitTime + 500 &&
      !circle.isHit
    )
  }

  if (!selectedSong) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">⭕ Choose Your Song</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {SONGS.map(song => (
              <div
                key={song.id}
                onClick={() => setSelectedSong(song)}
                className="p-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 cursor-pointer transition-all hover:bg-purple-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800">{song.name}</h3>
                    <p className="text-sm text-gray-600">{song.artist}</p>
                  </div>
                  <div className="text-right text-sm">
                    <div className={`font-bold ${getDifficultyColor(song.difficulty)}`}>
                      {song.difficulty}
                    </div>
                    <div className="text-gray-500">{song.bpm} BPM</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">⭕ {selectedSong.name}</h2>
            <p className="text-sm text-gray-600">{selectedSong.artist} - {selectedSong.difficulty}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        {/* Game Stats */}
        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="flex space-x-4">
            <span>Score: {score.toLocaleString()}</span>
            <span className={`${combo > 10 ? 'text-orange-500 font-bold' : 'text-gray-600'}`}>
              Combo: {combo}x
            </span>
            {gameStarted && (
              <span className="text-green-500 animate-pulse">🎵 Playing: {selectedSong.name}</span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                if (audioRef.current) {
                  if (soundEnabled && !audioRef.current.paused) {
                    audioRef.current.pause()
                    console.log('🎵 Audio manually paused')
                  } else {
                    audioRef.current.play().then(() => {
                      console.log('🎵 Audio manually started')
                      setSoundEnabled(true)
                    }).catch(e => {
                      console.log('🎵 Manual audio play failed:', e)
                    })
                  }
                }
              }}
              className="text-gray-600 hover:text-gray-800 px-2 py-1 rounded border"
            >
              {soundEnabled && audioRef.current && !audioRef.current.paused ? '🔊 Pause' : '🔇 Play Music'}
            </button>
            <div className="text-gray-600">
              Time: {Math.floor(gameTime)}s / {selectedSong.duration}s
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div 
          ref={gameAreaRef}
          className="relative bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg h-80 overflow-hidden border-2 border-purple-200"
          style={{ cursor: 'crosshair' }}
        >
          {!gameStarted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setGameStarted(true)}
                className="btn-game text-xl px-8 py-4"
              >
                Start Game! 🎵
              </button>
            </div>
          )}

          {gameStarted && getVisibleCircles().map(circle => {
            const currentTime = gameTime * 1000
            const timeToHit = circle.hitTime - currentTime
            const timeFromAppear = currentTime - circle.appearTime
            const totalApproachTime = circle.hitTime - circle.appearTime
            
            // Calculate approach circle scale (starts big, shrinks to hit circle size)
            const approachProgress = Math.max(0, Math.min(1, timeFromAppear / totalApproachTime))
            const approachScale = 3 - (approachProgress * 2) // Starts at 3x, shrinks to 1x
            
            return (
              <div
                key={circle.id}
                className="absolute"
                style={{
                  left: circle.x - 32, // Center the 64px circle
                  top: circle.y - 32,
                  width: '64px',
                  height: '64px'
                }}
              >
                {/* Outer approach circle (transparent, shrinking) */}
                <div
                  className="absolute rounded-full border-4 border-purple-400 pointer-events-none"
                  style={{
                    width: '64px',
                    height: '64px',
                    transform: `scale(${approachScale})`,
                    opacity: Math.max(0.3, 1 - approachProgress),
                    transformOrigin: 'center'
                  }}
                />
                
                {/* Inner hit circle (solid, clickable) */}
                <div
                  onClick={() => handleCircleClick(circle.id)}
                  className="absolute w-16 h-16 rounded-full border-4 border-purple-600 bg-white cursor-pointer transition-all duration-100 flex items-center justify-center font-bold text-purple-600 hover:bg-purple-50 shadow-lg"
                  style={{
                    opacity: Math.max(0.8, Math.min(1, timeFromAppear / 200)), // Fade in quickly
                    transform: timeToHit < 100 && timeToHit > -100 ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  <div className="text-2xl">⭕</div>
                </div>
                
                {/* Perfect timing indicator */}
                {Math.abs(timeToHit) < 50 && (
                  <div className="absolute inset-0 rounded-full border-2 border-yellow-400 animate-pulse pointer-events-none" />
                )}
              </div>
            )
          })}
        </div>

        {/* Hit Stats */}
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <span className="text-yellow-500">Perfect: {hits.perfect}</span>
          <span className="text-green-500">Great: {hits.great}</span>
          <span className="text-blue-500">Good: {hits.good}</span>
          <span className="text-red-500">Miss: {hits.miss}</span>
        </div>

        {isGameOver && (
          <div className="text-center mt-4">
            <h3 className="text-xl font-bold mb-2">
              {maxCombo > 50 ? '🏆 Amazing!' : maxCombo > 20 ? '🎯 Great Job!' : '💪 Nice Try!'}
            </h3>
            <p className="text-gray-600">
              Max Combo: {maxCombo}x | Final Score: {score.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}