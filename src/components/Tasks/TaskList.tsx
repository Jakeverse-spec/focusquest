'use client'

import { useState } from 'react'
import { Plus, Clock, Target, CheckCircle } from 'lucide-react'
import { Task, TASK_CATEGORIES, PRIORITY_COLORS, getTaskProgress } from '@/lib/taskLogic'

interface TaskListProps {
  tasks: Task[]
  onTaskSelect?: (task: Task) => void
  onAddTask?: () => void
}

export default function TaskList({ tasks, onTaskSelect, onAddTask }: TaskListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active')

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.isCompleted
    if (filter === 'completed') return task.isCompleted
    return true
  })

  const getCategoryInfo = (categoryId: string) => {
    return TASK_CATEGORIES.find(cat => cat.id === categoryId) || TASK_CATEGORIES[0]
  }

  return (
    <div className="game-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Quest Log</h2>
        <button 
          onClick={onAddTask}
          className="btn-game flex items-center space-x-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Quest</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'active', label: 'Active', count: tasks.filter(t => !t.isCompleted).length },
          { key: 'completed', label: 'Completed', count: tasks.filter(t => t.isCompleted).length },
          { key: 'all', label: 'All', count: tasks.length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              filter === tab.key 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No quests found</p>
            <p className="text-sm">Create your first quest to get started!</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const category = getCategoryInfo(task.category)
            const progress = getTaskProgress(task)
            
            return (
              <div
                key={task.id}
                onClick={() => onTaskSelect?.(task)}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${category.color} rounded-full flex items-center justify-center text-white text-sm`}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                    </div>
                  </div>
                  {task.isCompleted && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className={`font-medium ${PRIORITY_COLORS[task.priority]}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{task.completedSessions}/{task.estimatedSessions} sessions</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-primary-600 font-medium">+{task.xpReward} XP</span>
                    <span className="text-game-gold font-medium">+{task.coinReward} 💰</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        task.isCompleted ? 'bg-green-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}