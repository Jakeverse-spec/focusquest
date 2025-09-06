'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Settings, Clock } from 'lucide-react'

interface PomodoroTimerProps {
  onComplete?: (duration: number) => void // Pass duration to calculate XP
  onStart?: () => void
  onPause?: () => void
}

// Preset timer options with XP multipliers
const TIMER_PRESETS = [
  { name: 'Quick Focus', minutes: 15, xpMultiplier: 0.6, icon: '⚡' },
  { name: 'Standard Pomodoro', minutes: 25, xpMultiplier: 1.0, icon: '🍅' },
  { name: 'Deep Focus', minutes: 45, xpMultiplier: 1.8, icon: '🧠' },
  { name: 'Ultra Focus', minutes: 60, xpMultiplier: 2.4, icon: '🔥' },
  { name: 'Epic Session', minutes: 90, xpMultiplier: 3.6, icon: '🏆' },
  { name: 'Legendary Quest', minutes: 120, xpMultiplier: 4.8, icon: '👑' }
]

export default function PomodoroTimer({ onComplete, onStart, onPause }: PomodoroTimerProps) {
  const [selectedPreset, setSelectedPreset] = useState(1) // Default to Standard Pomodoro
  const [timeLeft, setTimeLeft] = useState(TIMER_PRESETS[1].minutes * 60)
  const [originalDuration, setOriginalDuration] = useState(TIMER_PRESETS[1].minutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [customMinutes, setCustomMinutes] = useState(25)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
      // Pass the original duration to calculate XP
      onComplete?.(originalDuration / 60) // Convert to minutes
      // Auto-switch to break
      setIsBreak(!isBreak)
      setTimeLeft(isBreak ? originalDuration : 5 * 60)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, isBreak, onComplete, originalDuration])

  const handleStart = () => {
    setIsRunning(true)
    onStart?.()
  }

  const handlePause = () => {
    setIsRunning(false)
    onPause?.()
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(isBreak ? 5 * 60 : originalDuration)
  }

  const handlePresetSelect = (index: number) => {
    if (!isRunning) {
      setSelectedPreset(index)
      const preset = TIMER_PRESETS[index]
      const duration = preset.minutes * 60
      setTimeLeft(duration)
      setOriginalDuration(duration)
      setShowSettings(false)
    }
  }

  const handleCustomTimer = () => {
    if (!isRunning && customMinutes > 0) {
      const duration = customMinutes * 60
      setTimeLeft(duration)
      setOriginalDuration(duration)
      setSelectedPreset(-1) // Custom timer
      setShowSettings(false)
    }
  }

  const getCurrentPreset = () => {
    return selectedPreset >= 0 ? TIMER_PRESETS[selectedPreset] : null
  }

  const calculateXPReward = () => {
    const preset = getCurrentPreset()
    if (preset) {
      return Math.floor(50 * preset.xpMultiplier)
    }
    // Custom timer XP calculation
    const minutes = originalDuration / 60
    const multiplier = Math.min(5.0, 0.4 + (minutes * 0.04)) // Cap at 5x multiplier
    return Math.floor(50 * multiplier)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = isBreak 
    ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
    : ((originalDuration - timeLeft) / originalDuration) * 100

  const currentPreset = getCurrentPreset()

  return (
    <div className="space-y-6">
      {/* Timer Settings */}
      <div className="game-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">⚔️ Quest Duration</h3>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isRunning}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {showSettings && (
          <div className="space-y-4">
            {/* Preset Options */}
            <div className="grid grid-cols-2 gap-3">
              {TIMER_PRESETS.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetSelect(index)}
                  disabled={isRunning}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedPreset === index
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{preset.icon}</span>
                    <span className="font-semibold text-sm">{preset.name}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {preset.minutes} min • +{Math.floor(50 * preset.xpMultiplier)} XP
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Timer */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Custom Duration</h4>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 25)}
                  disabled={isRunning}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="text-sm text-gray-600">minutes</span>
                <button
                  onClick={handleCustomTimer}
                  disabled={isRunning || customMinutes <= 0}
                  className="btn-primary text-sm"
                >
                  Set Custom
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Estimated XP: +{Math.floor(50 * Math.min(5.0, 0.4 + (customMinutes * 0.04)))}
              </div>
            </div>
          </div>
        )}

        {/* Current Selection Display */}
        <div className="mt-4 p-3 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{currentPreset?.icon || '⏱️'}</span>
              <div>
                <div className="font-semibold">
                  {currentPreset?.name || `Custom ${originalDuration / 60} min`}
                </div>
                <div className="text-sm text-gray-600">
                  Reward: +{calculateXPReward()} XP • +{Math.floor(calculateXPReward() / 5)} coins
                </div>
              </div>
            </div>
            <Clock className="w-5 h-5 text-primary-500" />
          </div>
        </div>
      </div>

      {/* Timer Display */}
      <div className="game-card text-center">
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">
            {isBreak ? '☕ Break Time' : '⚔️ Focus Quest Active'}
          </h3>
          <div className="relative w-48 h-48 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className={isBreak ? "text-game-energy" : "text-primary-500"}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold">{formatTime(timeLeft)}</span>
              {!isBreak && (
                <span className="text-sm text-gray-500 mt-1">
                  {Math.floor(progress)}% complete
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          {!isRunning ? (
            <button onClick={handleStart} className="btn-game flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Start Quest</span>
            </button>
          ) : (
            <button onClick={handlePause} className="btn-primary flex items-center space-x-2">
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </button>
          )}
          <button onClick={handleReset} className="btn-primary flex items-center space-x-2">
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Progress Stats */}
        {isRunning && !isBreak && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">
              Time Elapsed: {formatTime(originalDuration - timeLeft)} • 
              Earning: +{calculateXPReward()} XP
            </div>
          </div>
        )}
      </div>
    </div>
  )
}