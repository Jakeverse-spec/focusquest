'use client'

import { useEffect, useState } from 'react'
import { X, Trophy, Star, Zap } from 'lucide-react'

interface NotificationProps {
  type: 'achievement' | 'levelUp' | 'sessionComplete' | 'taskComplete' | 'miniGame'
  title: string
  message: string
  icon?: string
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

export default function AnimatedNotification({
  type,
  title,
  message,
  icon,
  onClose,
  autoClose = true,
  duration = 4000
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100)

    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'achievement':
        return {
          bg: 'bg-gradient-to-r from-yellow-400 to-orange-500',
          icon: <Trophy className="w-6 h-6 text-white" />,
          border: 'border-yellow-300'
        }
      case 'levelUp':
        return {
          bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
          icon: <Star className="w-6 h-6 text-white" />,
          border: 'border-purple-300'
        }
      case 'sessionComplete':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          icon: <Zap className="w-6 h-6 text-white" />,
          border: 'border-green-300'
        }
      case 'taskComplete':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          icon: <Trophy className="w-6 h-6 text-white" />,
          border: 'border-blue-300'
        }
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
          icon: <Star className="w-6 h-6 text-white" />,
          border: 'border-gray-300'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100 scale-100'
          : isLeaving
          ? 'translate-x-full opacity-0 scale-95'
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <div className={`${styles.bg} rounded-lg shadow-lg border-2 ${styles.border} p-4 max-w-sm`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {icon ? <span className="text-2xl">{icon}</span> : styles.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-sm mb-1">{title}</h3>
              <p className="text-white/90 text-xs leading-relaxed">{message}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Notification Manager Component
interface NotificationManagerProps {
  notifications: Array<{
    id: string
    type: 'achievement' | 'levelUp' | 'sessionComplete' | 'taskComplete' | 'miniGame'
    title: string
    message: string
    icon?: string
  }>
  onRemoveNotification: (id: string) => void
}

export function NotificationManager({ notifications, onRemoveNotification }: NotificationManagerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{ 
            transform: `translateY(${index * 10}px)`,
            zIndex: 50 - index
          }}
        >
          <AnimatedNotification
            {...notification}
            onClose={() => onRemoveNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  )
}