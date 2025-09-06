'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Clock, Target, Calendar, Award, Download, Upload } from 'lucide-react'
import PageHeader from '@/components/Navigation/PageHeader'
import { getDailyStats, getWeeklyStats, getProductivityInsights, exportStudyData, importStudyData, DailyStats, WeeklyStats, ProductivityInsights } from '@/lib/analyticsLogic'

export default function AnalyticsDashboard() {
  const [selectedTab, setSelectedTab] = useState<'daily' | 'weekly' | 'insights'>('daily')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null)
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null)
  const [insights, setInsights] = useState<ProductivityInsights | null>(null)

  useEffect(() => {
    loadAnalytics()
  }, [selectedDate, selectedTab])

  const loadAnalytics = () => {
    if (selectedTab === 'daily') {
      setDailyStats(getDailyStats(selectedDate))
    } else if (selectedTab === 'weekly') {
      const weekStart = new Date(selectedDate)
      weekStart.setDate(selectedDate.getDate() - selectedDate.getDay()) // Start of week
      setWeeklyStats(getWeeklyStats(weekStart))
    } else if (selectedTab === 'insights') {
      setInsights(getProductivityInsights())
    }
  }

  const handleExportData = () => {
    const data = exportStudyData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `focusquest-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        if (importStudyData(content)) {
          alert('Data imported successfully!')
          loadAnalytics()
        } else {
          alert('Failed to import data. Please check the file format.')
        }
      }
      reader.readAsText(file)
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getProductivityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    if (score >= 40) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const exportImportActions = (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleExportData}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export</span>
      </button>
      <label className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer text-sm">
        <Upload className="w-4 h-4" />
        <span className="hidden sm:inline">Import</span>
        <input
          type="file"
          accept=".json"
          onChange={handleImportData}
          className="hidden"
        />
      </label>
    </div>
  )

  return (
    <div className="space-y-6">

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setSelectedTab('daily')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'daily'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Daily Stats
        </button>
        <button
          onClick={() => setSelectedTab('weekly')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'weekly'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Weekly Overview
        </button>
        <button
          onClick={() => setSelectedTab('insights')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'insights'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Insights
        </button>
      </div>

      {/* Date Selector */}
      {selectedTab !== 'insights' && (
        <div className="flex items-center space-x-4">
          <Calendar className="w-5 h-5 text-gray-500" />
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <span className="text-sm text-gray-600">
            {selectedTab === 'weekly' ? 'Week starting' : 'Date'}
          </span>
        </div>
      )}

      {/* Daily Stats */}
      {selectedTab === 'daily' && dailyStats && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="font-semibold text-gray-800">Focus Time</h3>
                <p className="text-2xl font-bold text-blue-600">{formatTime(dailyStats.totalFocusTime)}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {dailyStats.sessionsCompleted} sessions completed
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="font-semibold text-gray-800">Productivity</h3>
                <p className={`text-2xl font-bold px-3 py-1 rounded-full ${getProductivityColor(dailyStats.productivity)}`}>
                  {Math.round(dailyStats.productivity)}%
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Longest: {formatTime(dailyStats.longestSession)}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div>
                <h3 className="font-semibold text-gray-800">XP Earned</h3>
                <p className="text-2xl font-bold text-purple-600">{dailyStats.xpEarned}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              +{dailyStats.coinsEarned} coins earned
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-8 h-8 text-orange-500" />
              <div>
                <h3 className="font-semibold text-gray-800">Avg Session</h3>
                <p className="text-2xl font-bold text-orange-600">{formatTime(Math.round(dailyStats.averageSessionLength))}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Session length
            </div>
          </div>

          {/* Subject Breakdown */}
          {Object.keys(dailyStats.subjects).length > 0 && (
            <div className="md:col-span-2 lg:col-span-4 bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">📚 Subject Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(dailyStats.subjects).map(([subject, minutes]) => (
                  <div key={subject} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-primary-600">{formatTime(minutes)}</div>
                    <div className="text-sm text-gray-600 capitalize">{subject}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Weekly Stats */}
      {selectedTab === 'weekly' && weeklyStats && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">📅 Week Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Focus:</span>
                  <span className="font-semibold">{formatTime(weeklyStats.totalFocusTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Average:</span>
                  <span className="font-semibold">{formatTime(Math.round(weeklyStats.dailyAverage))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Day:</span>
                  <span className="font-semibold">{new Date(weeklyStats.bestDay).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">🔥 Streak & Goals</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Streak:</span>
                  <span className="font-semibold text-orange-600">{weeklyStats.streak} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weekly Goal:</span>
                  <span className="font-semibold">{Math.round(weeklyStats.goals.percentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, weeklyStats.goals.percentage)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">📈 Improvement</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">+{weeklyStats.improvement}%</div>
                <div className="text-sm text-gray-600">vs last week</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insights */}
      {selectedTab === 'insights' && insights && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="w-8 h-8 text-yellow-500" />
                <div>
                  <h3 className="font-semibold text-gray-800">Rank</h3>
                  <p className="text-2xl font-bold text-yellow-600">{insights.rank}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Level {insights.level} • {formatTime(insights.totalLifetimeMinutes)} total
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">⏰ Peak Hours</h3>
              <div className="space-y-1">
                {insights.peakHours.map((hour, index) => (
                  <div key={hour} className="flex justify-between">
                    <span className="text-gray-600">#{index + 1}:</span>
                    <span className="font-semibold">{hour}:00 - {hour + 1}:00</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">📊 Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Day:</span>
                  <span className="font-semibold">{insights.bestDayOfWeek}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Session:</span>
                  <span className="font-semibold">{formatTime(Math.round(insights.averageSessionLength))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth:</span>
                  <span className="font-semibold text-green-600">+{insights.focusTimeGrowth}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Distribution */}
          {Object.keys(insights.subjectDistribution).length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">📚 Subject Focus Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(insights.subjectDistribution)
                  .sort(([,a], [,b]) => b - a)
                  .map(([subject, minutes]) => {
                    const percentage = (minutes / insights.totalLifetimeMinutes) * 100
                    return (
                      <div key={subject} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-primary-600">{Math.round(percentage)}%</div>
                        <div className="text-sm text-gray-600 capitalize">{subject}</div>
                        <div className="text-xs text-gray-500">{formatTime(minutes)}</div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}