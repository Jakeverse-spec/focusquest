'use client'

import { memo } from 'react'
import { Target, Trophy, Users, Settings, ShoppingBag, Gamepad2, Calendar as CalendarIcon, BarChart3, Zap, Star } from 'lucide-react'

interface DashboardSidebarProps {
  activeSection: string
  activeTab: string
  showMobileMenu: boolean
  onSectionChange: (section: string, tab?: string) => void
  onCloseMobileMenu: () => void
}

const DashboardSidebar = memo(function DashboardSidebar({
  activeSection,
  activeTab,
  showMobileMenu,
  onSectionChange,
  onCloseMobileMenu
}: DashboardSidebarProps) {
  const handleSectionClick = (section: string, tab: string = 'overview') => {
    onSectionChange(section, tab)
    onCloseMobileMenu()
  }

  return (
    <>
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onCloseMobileMenu} />
      )}

      {/* Sidebar Navigation */}
      <div className={`mobile-sidebar ${showMobileMenu ? 'open' : ''} lg:w-64 lg:flex-shrink-0`}>
        <div className="bg-white rounded-none lg:rounded-xl shadow-sm p-4 h-full lg:sticky lg:top-6">
          <nav className="space-y-2">
            {/* Home Section */}
            <div>
              <button
                onClick={() => handleSectionClick('home', 'overview')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'home' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                }`}
              >
                <Target className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </button>
            </div>

            {/* Study Section */}
            <div>
              <button
                onClick={() => handleSectionClick('study', 'tasks')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'study' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                }`}
              >
                <Target className="w-5 h-5" />
                <span className="font-medium">Study</span>
              </button>
              
              {activeSection === 'study' && (
                <div className="ml-8 mt-2 space-y-1">
                  <button
                    onClick={() => handleSectionClick('study', 'tasks')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'tasks' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Tasks
                  </button>
                  <button
                    onClick={() => handleSectionClick('study', 'calendar')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'calendar' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Calendar
                  </button>
                  <button
                    onClick={() => handleSectionClick('study', 'advanced-tasks')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'advanced-tasks' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Advanced Tasks
                  </button>
                </div>
              )}
            </div>

            {/* Quests Section */}
            <div>
              <button
                onClick={() => handleSectionClick('quests')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'quests' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                }`}
              >
                <Star className="w-5 h-5" />
                <span className="font-medium">Quests</span>
              </button>
            </div>

            {/* Social Section */}
            <div>
              <button
                onClick={() => handleSectionClick('social', 'leaderboard')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'social' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Social</span>
              </button>
              
              {activeSection === 'social' && (
                <div className="ml-8 mt-2 space-y-1">
                  <button
                    onClick={() => handleSectionClick('social', 'leaderboard')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'leaderboard' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Leaderboard
                  </button>
                  <button
                    onClick={() => handleSectionClick('social', 'friends')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'friends' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Friends
                  </button>
                  <button
                    onClick={() => handleSectionClick('social', 'multiplayer')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'multiplayer' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Multiplayer
                  </button>
                </div>
              )}
            </div>

            {/* Character Section */}
            <div>
              <button
                onClick={() => handleSectionClick('character', 'customization')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'character' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                }`}
              >
                <Trophy className="w-5 h-5" />
                <span className="font-medium">Character</span>
              </button>
              
              {activeSection === 'character' && (
                <div className="ml-8 mt-2 space-y-1">
                  <button
                    onClick={() => handleSectionClick('character', 'customization')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'customization' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Customization
                  </button>
                  <button
                    onClick={() => handleSectionClick('character', 'achievements')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'achievements' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Achievements
                  </button>
                  <button
                    onClick={() => handleSectionClick('character', 'shop')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'shop' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Shop
                  </button>
                </div>
              )}
            </div>

            {/* Analytics Section */}
            <div>
              <button
                onClick={() => handleSectionClick('analytics')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'analytics' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Analytics</span>
              </button>
            </div>

            {/* Settings Section */}
            <div>
              <button
                onClick={() => handleSectionClick('settings', 'theme')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === 'settings' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </button>
              
              {activeSection === 'settings' && (
                <div className="ml-8 mt-2 space-y-1">
                  <button
                    onClick={() => handleSectionClick('settings', 'theme')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'theme' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Theme
                  </button>
                  <button
                    onClick={() => handleSectionClick('settings', 'notifications')}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === 'notifications' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Notifications
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  )
})

export default DashboardSidebar