'use client'

import { memo, useCallback, useMemo } from 'react'
import AnimatedNotification from '@/components/Game/AnimatedNotification'
import { useThrottle } from '@/lib/performanceUtils'

interface Notification {
  id: string
  type: 'achievement' | 'levelUp' | 'sessionComplete' | 'taskComplete' | 'miniGame'
  title: string
  message: string
  icon?: string
}

interface OptimizedNotificationManagerProps {
  notifications: Notification[]
  onRemoveNotification: (id: string) => void
}

const OptimizedNotificationManager = memo(function OptimizedNotificationManager({
  notifications,
  onRemoveNotification
}: OptimizedNotificationManagerProps) {
  // Throttle notification removal to prevent excessive re-renders
  const throttledRemove = useThrottle(onRemoveNotification, 100)
  
  // Memoize notification removal handler
  const handleRemove = useCallback((id: string) => {
    throttledRemove(id)
  }, [throttledRemove])
  
  // Limit visible notifications to prevent performance issues
  const visibleNotifications = useMemo(() => {
    return notifications.slice(0, 5) // Show max 5 notifications
  }, [notifications])
  
  if (visibleNotifications.length === 0) return null
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {visibleNotifications.map((notification) => (
        <AnimatedNotification
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          icon={notification.icon}
          onClose={() => handleRemove(notification.id)}
          autoClose={true}
          duration={4000}
        />
      ))}
    </div>
  )
})

export default OptimizedNotificationManager