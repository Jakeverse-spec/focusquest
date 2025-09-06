'use client'

import { useState, useEffect } from 'react'
import { Trophy, Star, Clock, Target, Gift, Zap } from 'lucide-react'
import { Quest, Equipment, Pet, generateDailyQuests, updateQuestProgress, EQUIPMENT_CATALOG, PET_CATALOG } from '@/lib/questSystem'

interface QuestPanelProps {
  playerLevel: number
  quests: Quest[]
  equipment: Equipment[]
  pets: Pet[]
  onQuestComplete: (quest: Quest) => void
  onEquipmentPurchase: (equipment: Equipment) => void
  onPetAdopt: (pet: Pet) => void
}

export default function QuestPanel({
  playerLevel,
  quests,
  equipment,
  pets,
  onQuestComplete,
  onEquipmentPurchase,
  onPetAdopt
}: QuestPanelProps) {
  const [activeTab, setActiveTab] = useState<'quests' | 'equipment' | 'pets'>('quests')
  const [questFilter, setQuestFilter] = useState<'all' | 'daily' | 'weekly' | 'seasonal'>('all')

  const filteredQuests = quests.filter(quest => {
    if (questFilter === 'all') return true
    return quest.type === questFilter
  })

  const dailyQuests = quests.filter(q => q.type === 'daily')
  const weeklyQuests = quests.filter(q => q.type === 'weekly')
  const completedQuests = quests.filter(q => q.isCompleted)

  const getDifficultyColor = (difficulty: Quest['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-orange-600 bg-orange-100'
      case 'legendary': return 'text-purple-600 bg-purple-100'
    }
  }

  const getRarityColor = (rarity: Equipment['rarity'] | Pet['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100'
      case 'rare': return 'text-blue-600 bg-blue-100'
      case 'epic': return 'text-purple-600 bg-purple-100'
      case 'legendary': return 'text-yellow-600 bg-yellow-100'
    }
  }

  const getProgressPercentage = (quest: Quest) => {
    return Math.min(100, (quest.progress / quest.maxProgress) * 100)
  }

  const isQuestExpired = (quest: Quest) => {
    return quest.expiresAt && quest.expiresAt < new Date()
  }

  if (activeTab === 'equipment') {
    const availableEquipment = EQUIPMENT_CATALOG.filter(item => 
      item.levelRequired <= playerLevel
    )

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Equipment Shop</h2>
            <p className="text-gray-600">Enhance your productivity with powerful tools</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('quests')}
              className="px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Quests
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg"
            >
              Equipment
            </button>
            <button
              onClick={() => setActiveTab('pets')}
              className="px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Pets
            </button>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableEquipment.map(item => {
            const owned = equipment.find(e => e.id === item.id)
            const canAfford = true // TODO: Check player coins
            
            return (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{item.icon}</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(item.rarity)}`}>
                    {item.rarity}
                  </span>
                </div>

                <h3 className="font-bold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>

                <div className="space-y-2 mb-4">
                  {item.effects.map((effect, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      <span className="text-gray-700">
                        {effect.type.replace('_', ' ')}: +{effect.value}%
                        {effect.duration && ` (${effect.duration}m)`}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-yellow-600">{item.cost}</span>
                    <span className="text-yellow-600">💰</span>
                  </div>
                  
                  {owned ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-600">Owned</span>
                      {owned.quantity > 1 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          x{owned.quantity}
                        </span>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => onEquipmentPurchase(item)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        canAfford
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Purchase' : 'Not enough coins'}
                    </button>
                  )}
                </div>

                {item.levelRequired > 1 && (
                  <div className="mt-2 text-xs text-gray-500">
                    Requires level {item.levelRequired}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (activeTab === 'pets') {
    const availablePets = PET_CATALOG.map(petTemplate => ({
      ...petTemplate,
      level: 1,
      xp: 0,
      maxXp: 100,
      happiness: 100,
      maxHappiness: 100,
      lastFed: new Date(),
      isActive: false
    }))

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Pet Companions</h2>
            <p className="text-gray-600">Adopt loyal companions to boost your productivity</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('quests')}
              className="px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Quests
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className="px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Equipment
            </button>
            <button
              onClick={() => setActiveTab('pets')}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg"
            >
              Pets
            </button>
          </div>
        </div>

        {/* Active Pets */}
        {pets.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-bold text-gray-800 mb-4">Your Companions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets.map(pet => (
                <div key={pet.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-3xl">{pet.icon}</div>
                    <div>
                      <h4 className="font-medium text-gray-800">{pet.name}</h4>
                      <p className="text-sm text-gray-600">Level {pet.level}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>XP</span>
                      <span>{pet.xp}/{pet.maxXp}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(pet.xp / pet.maxXp) * 100}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Happiness</span>
                      <span>{pet.happiness}/{pet.maxHappiness}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(pet.happiness / pet.maxHappiness) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1 mb-3">
                    {pet.abilities.map(ability => (
                      <div key={ability.id} className="text-xs text-gray-600">
                        <span className="font-medium">{ability.name}:</span> {ability.description}
                      </div>
                    ))}
                  </div>

                  <button className="w-full px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors">
                    Feed ({pet.feedCost} 💰)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Pets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availablePets.map(pet => {
            const owned = pets.find(p => p.id === pet.id)
            const canAfford = true // TODO: Check player coins
            
            return (
              <div key={pet.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{pet.icon}</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(pet.rarity)}`}>
                    {pet.rarity}
                  </span>
                </div>

                <h3 className="font-bold text-gray-800 mb-1">{pet.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{pet.species}</p>
                <p className="text-sm text-gray-600 mb-4">{pet.description}</p>

                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-medium text-gray-800">Abilities:</h4>
                  {pet.abilities.map(ability => (
                    <div key={ability.id} className="text-xs text-gray-600">
                      <span className="font-medium">{ability.name}:</span> {ability.description}
                    </div>
                  ))}
                </div>

                {owned ? (
                  <div className="text-center text-green-600 font-medium">
                    Already Adopted
                  </div>
                ) : (
                  <button
                    onClick={() => onPetAdopt(pet)}
                    disabled={!canAfford}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      canAfford
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Adopt Pet
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quest Center</h2>
          <p className="text-gray-600">Complete challenges to earn rewards and level up</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('quests')}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg"
          >
            Quests
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className="px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            Equipment
          </button>
          <button
            onClick={() => setActiveTab('pets')}
            className="px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            Pets
          </button>
        </div>
      </div>

      {/* Quest Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Active Quests</p>
              <p className="text-2xl font-bold text-blue-800">{quests.filter(q => !q.isCompleted).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-800">{completedQuests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Daily Quests</p>
              <p className="text-2xl font-bold text-yellow-800">{dailyQuests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Weekly Quests</p>
              <p className="text-2xl font-bold text-purple-800">{weeklyQuests.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quest Filters */}
      <div className="flex space-x-2">
        {['all', 'daily', 'weekly', 'seasonal'].map(filter => (
          <button
            key={filter}
            onClick={() => setQuestFilter(filter as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              questFilter === filter
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Quest List */}
      <div className="space-y-4">
        {filteredQuests.map(quest => {
          const progressPercentage = getProgressPercentage(quest)
          const expired = isQuestExpired(quest)
          
          return (
            <div
              key={quest.id}
              className={`bg-white rounded-lg border p-6 transition-all ${
                quest.isCompleted
                  ? 'border-green-200 bg-green-50'
                  : expired
                  ? 'border-red-200 bg-red-50'
                  : 'border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{quest.icon}</div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-bold text-gray-800">{quest.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(quest.difficulty)}`}>
                        {quest.difficulty}
                      </span>
                      {quest.type === 'daily' && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          Daily
                        </span>
                      )}
                      {quest.type === 'weekly' && (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                          Weekly
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{quest.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{quest.progress}/{quest.maxProgress}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            quest.isCompleted ? 'bg-green-500' : 'bg-purple-500'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{quest.rewards.xp} XP</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-600">💰</span>
                        <span>{quest.rewards.coins} Coins</span>
                      </div>
                      {quest.rewards.items && quest.rewards.items.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Gift className="w-4 h-4 text-purple-500" />
                          <span>{quest.rewards.items.length} Items</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {quest.isCompleted ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <Trophy className="w-5 h-5" />
                      <span className="font-medium">Completed!</span>
                    </div>
                  ) : expired ? (
                    <div className="text-red-600 font-medium">Expired</div>
                  ) : quest.expiresAt ? (
                    <div className="text-sm text-gray-500">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Expires: {quest.expiresAt.toLocaleDateString()}
                    </div>
                  ) : null}
                </div>
              </div>

              {quest.isCompleted && !quest.completedAt && (
                <button
                  onClick={() => onQuestComplete(quest)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Claim Rewards
                </button>
              )}
            </div>
          )
        })}
      </div>

      {filteredQuests.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No quests available</h3>
          <p className="text-gray-600">
            {questFilter === 'all' 
              ? 'Complete some tasks to unlock new quests!'
              : `No ${questFilter} quests available right now.`
            }
          </p>
        </div>
      )}
    </div>
  )
}