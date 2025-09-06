'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Task, TASK_CATEGORIES, createTask } from '@/lib/taskLogic'

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateTask: (task: Task) => void
}

export default function CreateTaskModal({ isOpen, onClose, onCreateTask }: CreateTaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Task['category']>('work')
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const [estimatedSessions, setEstimatedSessions] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newTask = createTask(title, category, priority, estimatedSessions, description || undefined)
    onCreateTask(newTask)
    
    // Reset form
    setTitle('')
    setDescription('')
    setCategory('work')
    setPriority('medium')
    setEstimatedSessions(1)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold">Create New Quest</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-button"
            title="Close"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quest Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mobile-input"
              placeholder="e.g., Complete project proposal"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mobile-input"
              placeholder="Optional details about this quest..."
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TASK_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as Task['category'])}
                  className={`p-2 sm:p-3 rounded-lg border-2 transition-colors touch-button ${
                    category === cat.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl mb-1">{cat.icon}</div>
                    <div className="text-xs sm:text-sm font-medium">{cat.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                className="mobile-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sessions Needed
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={estimatedSessions}
                onChange={(e) => setEstimatedSessions(parseInt(e.target.value) || 1)}
                className="mobile-input"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors touch-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-game touch-button"
            >
              Create Quest
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}