'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, Volume2, VolumeX, Plus, X, Clock } from 'lucide-react'
import { 
  getNotificationSettings, 
  updateNotificationSettings, 
  requestNotificationPermission,
  getNotificationHistory,
  clearNotificationHistory,
  showNotification,
  NOTIFICATION_TEMPLATES,
  NotificationSettings,
  PushNotification
} from '@/lib/notificationLogic'

export default function NotificationSettingsPanel() {
  const [settings, setSettings] = useState<NotificationSettings>(getNotificationSettings())
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default')
  const [history, setHistory] = useState<PushNotification[]>([])
  const [newReminderTime, setNewReminderTime] = useState('')

  useEffect(() => {
    setPermissionStatus(Notification.permission)
    setHistory(getNotificationHistory())
  }, [])

  const handleSettingChange = (key: keyof NotificationSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    updateNotificationSettings({ [key]: value })
  }

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission()
    setPermissionStatus(Notification.permission)
    if (granted) {
      showNotification({
        title: "🎉 Notifications Enabled!",
        body: "You'll now receive helpful reminders and achievement alerts.",
        icon: "🎉",
        type: 'achievement'
      })
    }
  }

  const addReminderTime = () => {
    if (newReminderTime && !settings.reminderTimes.includes(newReminderTime)) {
      const newTimes = [...settings.reminderTimes, newReminderTime].sort()
      handleSettingChange('reminderTimes', newTimes)
      setNewReminderTime('')
    }
  }

  const removeReminderTime = (timeToRemove: string) => {
    const newTimes = settings.reminderTimes.filter(time => time !== timeToRemove)
    handleSettingChange('reminderTimes', newTimes)
  }

  const testNotification = (type: keyof typeof NOTIFICATION_TEMPLATES) => {
    if (type === 'achievementUnlocked') {
      showNotification(NOTIFICATION_TEMPLATES.achievementUnlocked('Test Achievement'))
    } else if (type === 'streakMaintained') {
      showNotification(NOTIFICATION_TEMPLATES.streakMaintained(7))
    } else if (type === 'dailyGoalReached') {
      showNotification(NOTIFICATION_TEMPLATES.dailyGoalReached(120))
    } else if (type === 'levelUp') {
      showNotification(NOTIFICATION_TEMPLATES.levelUp(10))
    } else {
      showNotification(NOTIFICATION_TEMPLATES[type])
    }
  }

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-6">

      {/* Permission Status */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Permission Status</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {permissionStatus === 'granted' ? (
              <>
                <Bell className="w-5 h-5 text-green-500" />
                <span className="text-green-600 font-medium">Notifications Enabled</span>
              </>
            ) : (
              <>
                <BellOff className="w-5 h-5 text-red-500" />
                <span className="text-red-600 font-medium">
                  {permissionStatus === 'denied' ? 'Notifications Blocked' : 'Notifications Disabled'}
                </span>
              </>
            )}
          </div>
          {permissionStatus !== 'granted' && (
            <button
              onClick={handleRequestPermission}
              className="btn-primary"
            >
              Enable Notifications
            </button>
          )}
        </div>
        {permissionStatus === 'denied' && (
          <p className="text-sm text-gray-600 mt-2">
            To enable notifications, please allow them in your browser settings and refresh the page.
          </p>
        )}
      </div>

      {/* Notification Types */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Notification Types</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚔️</span>
              <div>
                <div className="font-medium">Study Reminders</div>
                <div className="text-sm text-gray-600">Get reminded to start focus sessions</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => testNotification('studyReminder')}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Test
              </button>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.studyReminders}
                  onChange={(e) => handleSettingChange('studyReminders', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="font-medium">Achievement Alerts</div>
                <div className="text-sm text-gray-600">Celebrate your accomplishments</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => testNotification('achievementUnlocked')}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Test
              </button>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.achievementAlerts}
                  onChange={(e) => handleSettingChange('achievementAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="font-medium">Streak Reminders</div>
                <div className="text-sm text-gray-600">Keep your focus streak alive</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => testNotification('streakMaintained')}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Test
              </button>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.streakReminders}
                  onChange={(e) => handleSettingChange('streakReminders', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">☕</span>
              <div>
                <div className="font-medium">Break Reminders</div>
                <div className="text-sm text-gray-600">Remember to take breaks</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => testNotification('breakReminder')}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Test
              </button>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.breakReminders}
                  onChange={(e) => handleSettingChange('breakReminders', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Sound Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Sound Settings</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {settings.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-primary-500" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-400" />
            )}
            <div>
              <div className="font-medium">Notification Sounds</div>
              <div className="text-sm text-gray-600">Play audio alerts with notifications</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>

      {/* Reminder Times */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Daily Reminder Times</h3>
        <div className="space-y-3">
          {settings.reminderTimes.map((time) => (
            <div key={time} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{time}</span>
              </div>
              <button
                onClick={() => removeReminderTime(time)}
                className="p-1 text-red-500 hover:bg-red-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <div className="flex items-center space-x-3">
            <input
              type="time"
              value={newReminderTime}
              onChange={(e) => setNewReminderTime(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              onClick={addReminderTime}
              disabled={!newReminderTime}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification History */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Recent Notifications</h3>
          <button
            onClick={() => {
              clearNotificationHistory()
              setHistory([])
            }}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Clear History
          </button>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No notifications yet</p>
          ) : (
            history.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-xl">{notification.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{notification.title}</div>
                  <div className="text-sm text-gray-600">{notification.body}</div>
                  <div className="text-xs text-gray-500 mt-1">{formatTime(notification.timestamp)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}