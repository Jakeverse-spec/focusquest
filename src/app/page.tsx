'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sword, Sparkles, Play, Github, Target, Trophy, Users, Gamepad2 } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [autoRedirect, setAutoRedirect] = useState(true)
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (!autoRedirect) return

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router, autoRedirect])

  const handleEnterApp = () => {
    router.push('/dashboard')
  }

  const handleStayOnPage = () => {
    setAutoRedirect(false)
  }

  if (!autoRedirect) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Sword className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-gray-800 mb-6">
              Welcome to <span className="text-primary-600">FocusQuest</span>
            </h1>
            <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your daily tasks into epic adventures. Level up your productivity with RPG-style progression, mini-games, and social features.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={handleEnterApp}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <Play className="w-6 h-6" />
                <span>Start Your Adventure</span>
              </button>
              <a
                href="https://github.com/yourusername/focusquest"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <Github className="w-6 h-6" />
                <span>View Source</span>
              </a>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: <Target className="w-8 h-8 text-blue-600" />,
                title: 'Task Management',
                description: 'Advanced task system with categories, tags, and time tracking'
              },
              {
                icon: <Trophy className="w-8 h-8 text-yellow-600" />,
                title: 'RPG Progression',
                description: 'Level up your character and unlock achievements'
              },
              {
                icon: <Gamepad2 className="w-8 h-8 text-purple-600" />,
                title: '8+ Mini-Games',
                description: 'From RPG battles to rhythm games and puzzles'
              },
              {
                icon: <Users className="w-8 h-8 text-green-600" />,
                title: 'Social Features',
                description: 'Compete with friends and join multiplayer challenges'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Demo */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              🎮 What You Can Do
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-semibold mb-2">Focus Sessions</h3>
                <p className="text-sm text-gray-600">Start productive work sessions and earn XP</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-semibold mb-2">Complete Quests</h3>
                <p className="text-sm text-gray-600">Daily challenges and achievements</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="font-semibold mb-2">Play Games</h3>
                <p className="text-sm text-gray-600">Take breaks with engaging mini-games</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <button
                onClick={handleEnterApp}
                className="bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white px-12 py-4 rounded-xl text-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                🚀 Try It Now - It's Free!
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-2xl">
            <Sword className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-primary-600">FocusQuest</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">Turn your productivity into an epic adventure</p>
          
          <div className="flex items-center justify-center space-x-2 text-primary-500 mb-8">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span className="text-lg font-medium">Starting in {countdown} seconds...</span>
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleEnterApp}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Enter Now</span>
            </button>
            <button
              onClick={handleStayOnPage}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Learn More First
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}