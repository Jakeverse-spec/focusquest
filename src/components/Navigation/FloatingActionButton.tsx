'use client'

import { useState } from 'react'
import { Plus, Timer, Gamepad2, Users, BarChart3 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FloatingActionButtonProps {
  className?: string
}

export default function FloatingActionButton({ className = '' }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const actions = [
    {
      icon: Timer,
      label: 'Start Timer',
      color: 'bg-primary-500 hover:bg-primary-600',
      onClick: () => router.push('/timer')
    },
    {
      icon: Gamepad2,
      label: 'Mini Games',
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => {
        // This would trigger mini-game selector
        console.log('Open mini-games')
      }
    },
    {
      icon: Users,
      label: 'Multiplayer',
      color: 'bg-pink-500 hover:bg-pink-600',
      onClick: () => {
        // This would trigger multiplayer lobby
        console.log('Open multiplayer')
      }
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => {
        // Navigate to analytics section
        router.push('/dashboard?section=analytics')
      }
    }
  ]

  return (
    <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
      {/* Action Buttons */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3">
          {actions.map((action, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 animate-slide-in-right"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="bg-white text-gray-700 px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                {action.label}
              </span>
              <button
                onClick={() => {
                  action.onClick()
                  setIsOpen(false)
                }}
                className={`w-12 h-12 ${action.color} text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center touch-button`}
              >
                <action.icon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center touch-button ${
          isOpen ? 'rotate-45' : ''
        }`}
        title="Quick Actions"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}