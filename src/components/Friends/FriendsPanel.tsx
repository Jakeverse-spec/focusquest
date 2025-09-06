'use client'

import { useState, useEffect } from 'react'
import { Users, UserPlus, MessageCircle, Gamepad2, Trophy, X, Search } from 'lucide-react'
import { Friend, getFriends, sendFriendRequest, acceptFriendRequest, challengeFriend } from '@/lib/leaderboardLogic'

interface FriendsPanelProps {
  currentPlayerId: string
  onChallengeCreate: (sessionId: string) => void
}

export default function FriendsPanel({ currentPlayerId, onChallengeCreate }: FriendsPanelProps) {
  const [friends, setFriends] = useState<Friend[]>([])
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [searchUsername, setSearchUsername] = useState('')
  const [selectedTab, setSelectedTab] = useState<'friends' | 'requests'>('friends')

  useEffect(() => {
    loadFriends()
  }, [currentPlayerId])

  const loadFriends = () => {
    const friendsData = getFriends(currentPlayerId)
    setFriends(friendsData)
  }

  const handleSendFriendRequest = () => {
    if (searchUsername.trim()) {
      sendFriendRequest(currentPlayerId, searchUsername)
      setSearchUsername('')
      setShowAddFriend(false)
      // In real app, would show success message
    }
  }

  const handleAcceptRequest = (friendId: string) => {
    acceptFriendRequest(currentPlayerId, friendId)
    loadFriends() // Refresh friends list
  }

  const handleChallenge = (friendId: string) => {
    const session = challengeFriend(currentPlayerId, friendId, 'speed_math')
    onChallengeCreate(session.id)
  }

  const activeFriends = friends.filter(f => f.status === 'friend')
  const pendingRequests = friends.filter(f => f.status === 'pending_received')
  const sentRequests = friends.filter(f => f.status === 'pending_sent')

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold">👥 Friends</h2>
        </div>
        <button
          onClick={() => setShowAddFriend(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Friend</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setSelectedTab('friends')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'friends'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Friends ({activeFriends.length})
        </button>
        <button
          onClick={() => setSelectedTab('requests')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors relative ${
            selectedTab === 'requests'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Requests ({pendingRequests.length})
          {pendingRequests.length > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {pendingRequests.length}
            </div>
          )}
        </button>
      </div>

      {/* Friends List */}
      {selectedTab === 'friends' && (
        <div className="space-y-3">
          {activeFriends.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No friends yet</p>
              <p className="text-sm">Add some friends to compete and chat!</p>
            </div>
          ) : (
            activeFriends.map(friend => (
              <div key={friend.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="relative">
                  <div className="text-2xl">{friend.avatar}</div>
                  {friend.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-800">{friend.username}</span>
                    {friend.isOnline ? (
                      <span className="text-xs text-green-600 font-medium">Online</span>
                    ) : (
                      <span className="text-xs text-gray-500">Offline</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">Level {friend.level}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  
                  {friend.isOnline && (
                    <button
                      onClick={() => handleChallenge(friend.id)}
                      className="p-2 text-purple-500 hover:bg-purple-100 rounded-lg transition-colors"
                    >
                      <Gamepad2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button className="p-2 text-yellow-500 hover:bg-yellow-100 rounded-lg transition-colors">
                    <Trophy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Friend Requests */}
      {selectedTab === 'requests' && (
        <div className="space-y-4">
          {/* Incoming Requests */}
          {pendingRequests.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Incoming Requests</h3>
              <div className="space-y-3">
                {pendingRequests.map(request => (
                  <div key={request.id} className="flex items-center space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-2xl">{request.avatar}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{request.username}</div>
                      <div className="text-sm text-gray-500">Level {request.level}</div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Accept
                      </button>
                      <button className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors">
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sent Requests */}
          {sentRequests.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Sent Requests</h3>
              <div className="space-y-3">
                {sentRequests.map(request => (
                  <div key={request.id} className="flex items-center space-x-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-2xl">{request.avatar}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{request.username}</div>
                      <div className="text-sm text-gray-500">Level {request.level}</div>
                    </div>
                    <div className="text-sm text-yellow-600 font-medium">Pending</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pendingRequests.length === 0 && sentRequests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <UserPlus className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No pending requests</p>
            </div>
          )}
        </div>
      )}

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Add Friend</h3>
              <button
                onClick={() => setShowAddFriend(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    placeholder="Enter username..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSendFriendRequest}
                  disabled={!searchUsername.trim()}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Request
                </button>
                <button
                  onClick={() => setShowAddFriend(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}