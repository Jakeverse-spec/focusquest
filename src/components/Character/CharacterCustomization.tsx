'use client'

import { useState } from 'react'
import { ShoppingBag, Star, Lock, Check } from 'lucide-react'
import { 
  CharacterItem, 
  PlayerCharacter, 
  CHARACTER_ITEMS, 
  getItemsByType, 
  getUnlockedItems,
  calculateCharacterStats,
  RARITY_STYLES,
  RARITY_TEXT
} from '@/lib/characterLogic'

interface CharacterCustomizationProps {
  character: PlayerCharacter
  playerLevel: number
  playerCoins: number
  onEquipItem: (itemId: string, type: CharacterItem['type']) => void
  onPurchaseItem: (item: CharacterItem) => void
}

export default function CharacterCustomization({
  character,
  playerLevel,
  playerCoins,
  onEquipItem,
  onPurchaseItem
}: CharacterCustomizationProps) {
  const [activeTab, setActiveTab] = useState<CharacterItem['type']>('avatar')
  
  const tabs = [
    { id: 'avatar', name: 'Avatar', icon: '👤' },
    { id: 'weapon', name: 'Weapon', icon: '⚔️' },
    { id: 'outfit', name: 'Outfit', icon: '👘' },
    { id: 'accessory', name: 'Accessory', icon: '💎' }
  ] as const

  const unlockedItems = getUnlockedItems(playerLevel)
  const itemsOfType = getItemsByType(activeTab)
  const stats = calculateCharacterStats(character)

  const getEquippedItem = (type: CharacterItem['type']) => {
    const itemId = character[type]
    return CHARACTER_ITEMS.find(item => item.id === itemId)
  }

  const isItemOwned = (itemId: string) => character.ownedItems.includes(itemId)
  const isItemEquipped = (itemId: string) => Object.values(character).includes(itemId)
  const canAfford = (item: CharacterItem) => playerCoins >= item.cost
  const isUnlocked = (item: CharacterItem) => unlockedItems.some(u => u.id === item.id)

  return (
    <div className="game-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Character Customization</h2>
        <div className="text-sm text-gray-600">
          💰 {playerCoins} coins
        </div>
      </div>

      {/* Character Preview */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6 text-center">
        <div className="text-6xl mb-4">
          {getEquippedItem('avatar')?.icon || '🧙‍♂️'}
        </div>
        <div className="flex justify-center space-x-4 text-2xl mb-4">
          <span>{getEquippedItem('weapon')?.icon}</span>
          <span>{getEquippedItem('outfit')?.icon}</span>
          <span>{getEquippedItem('accessory')?.icon}</span>
        </div>
        
        {/* Character Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-primary-600">+{stats.xpBonus}%</div>
            <div className="text-gray-600">XP Bonus</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-game-energy">+{stats.energyBonus}</div>
            <div className="text-gray-600">Energy</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-game-gold">+{stats.coinBonus}%</div>
            <div className="text-gray-600">Coin Bonus</div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
              activeTab === tab.id 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {itemsOfType.map(item => {
          const owned = isItemOwned(item.id)
          const equipped = isItemEquipped(item.id)
          const unlocked = isUnlocked(item)
          const affordable = canAfford(item)

          return (
            <div
              key={item.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                equipped 
                  ? 'border-primary-500 bg-primary-50' 
                  : unlocked 
                  ? RARITY_STYLES[item.rarity]
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">
                  {unlocked ? item.icon : <Lock className="w-8 h-8 text-gray-400" />}
                </div>
                {equipped && (
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
              <p className="text-xs text-gray-600 mb-3">{item.description}</p>

              {/* Item Stats */}
              {item.stats && Object.keys(item.stats).length > 0 && (
                <div className="text-xs text-gray-500 mb-3 space-y-1">
                  {item.stats.xpBonus && <div>+{item.stats.xpBonus}% XP</div>}
                  {item.stats.energyBonus && <div>+{item.stats.energyBonus} Energy</div>}
                  {item.stats.coinBonus && <div>+{item.stats.coinBonus}% Coins</div>}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs">
                  <span className={`font-medium uppercase ${RARITY_TEXT[item.rarity]}`}>
                    {item.rarity}
                  </span>
                  {!unlocked && (
                    <div className="text-gray-500 mt-1">
                      Level {item.unlockLevel}
                    </div>
                  )}
                </div>

                {unlocked && (
                  <div className="flex flex-col space-y-1">
                    {!owned && item.cost > 0 && (
                      <button
                        onClick={() => onPurchaseItem(item)}
                        disabled={!affordable}
                        className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                          affordable
                            ? 'bg-game-gold text-white hover:bg-yellow-500'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        💰 {item.cost}
                      </button>
                    )}
                    {owned && !equipped && (
                      <button
                        onClick={() => onEquipItem(item.id, item.type)}
                        className="text-xs px-3 py-1 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
                      >
                        Equip
                      </button>
                    )}
                    {equipped && (
                      <div className="text-xs px-3 py-1 bg-green-500 text-white rounded-full">
                        Equipped
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}