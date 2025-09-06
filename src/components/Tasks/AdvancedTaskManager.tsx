'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, Tag, Clock, Target, Filter, Search, MoreHorizontal } from 'lucide-react'
import { AdvancedTask, TaskCategory, TaskTag, DEFAULT_CATEGORIES, DEFAULT_TAGS, createTaskFromTemplate, TASK_TEMPLATES } from '@/lib/advancedTaskLogic'

interface AdvancedTaskManagerProps {
  tasks: AdvancedTask[]
  onTaskCreate: (task: AdvancedTask) => void
  onTaskUpdate: (task: AdvancedTask) => void
  onTaskDelete: (taskId: string) => void
  categories: TaskCategory[]
  tags: TaskTag[]
}

export default function AdvancedTaskManager({
  tasks,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  categories = DEFAULT_CATEGORIES,
  tags = DEFAULT_TAGS
}: AdvancedTaskManagerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<AdvancedTask | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'created' | 'category'>('dueDate')
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')

  const filteredTasks = tasks.filter(task => {
    if (filterCategory !== 'all' && task.category !== filterCategory) return false
    if (filterStatus !== 'all' && task.status !== filterStatus) return false
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.getTime() - b.dueDate.getTime()
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'created':
        return b.createdAt.getTime() - a.createdAt.getTime()
      case 'category':
        return a.category.localeCompare(b.category)
      default:
        return 0
    }
  })

  const getPriorityColor = (priority: AdvancedTask['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
    }
  }

  const getStatusColor = (status: AdvancedTask['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in-progress': return 'text-blue-600 bg-blue-100'
      case 'todo': return 'text-gray-600 bg-gray-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
    }
  }

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0]
  }

  const getOverdueTasks = () => {
    const now = new Date()
    return tasks.filter(task => 
      task.status !== 'completed' && 
      task.dueDate && 
      task.dueDate < now
    )
  }

  const getUpcomingTasks = () => {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    return tasks.filter(task => 
      task.status !== 'completed' && 
      task.dueDate && 
      task.dueDate >= now && 
      task.dueDate <= tomorrow
    )
  }

  if ((viewMode as string) === 'kanban') {
    const statusColumns = [
      { id: 'todo', title: 'To Do', tasks: sortedTasks.filter(t => t.status === 'todo') },
      { id: 'in-progress', title: 'In Progress', tasks: sortedTasks.filter(t => t.status === 'in-progress') },
      { id: 'completed', title: 'Completed', tasks: sortedTasks.filter(t => t.status === 'completed') }
    ]

    return (
      <div className="space-y-6">
        {/* Header and Controls */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Task Management</h2>
            <p className="text-gray-600">Organize and track your productivity</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg ${(viewMode as string) === 'list' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-2 rounded-lg ${(viewMode as string) === 'kanban' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statusColumns.map(column => (
            <div key={column.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">{column.title}</h3>
                <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                  {column.tasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {column.tasks.map(task => {
                  const category = getCategoryInfo(task.category)
                  return (
                    <div
                      key={task.id}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-800 flex-1">{task.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                        <span className="flex items-center space-x-1">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </span>
                        {task.estimatedTime > 0 && (
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{task.estimatedTime}m</span>
                          </span>
                        )}
                      </div>

                      {task.dueDate && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{task.dueDate.toLocaleDateString()}</span>
                        </div>
                      )}

                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {task.tags.slice(0, 3).map(tagId => {
                            const tag = tags.find(t => t.id === tagId)
                            return tag ? (
                              <span
                                key={tagId}
                                className="text-xs px-2 py-1 rounded-full"
                                style={{ backgroundColor: tag.color + '20', color: tag.color }}
                              >
                                {tag.name}
                              </span>
                            ) : null
                          })}
                          {task.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{task.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Task Management</h2>
          <p className="text-gray-600">Organize and track your productivity</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 rounded-lg ${(viewMode as string) === 'list' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-2 rounded-lg ${(viewMode as string) === 'kanban' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Kanban
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Tasks</p>
              <p className="text-2xl font-bold text-blue-800">{tasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-800">
                {tasks.filter(t => t.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-orange-600 font-medium">Due Today</p>
              <p className="text-2xl font-bold text-orange-800">{getUpcomingTasks().length}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 font-bold">!</span>
            </div>
            <div>
              <p className="text-sm text-red-600 font-medium">Overdue</p>
              <p className="text-2xl font-bold text-red-800">{getOverdueTasks().length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus:ring-0 p-0 text-sm"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-sm border-gray-300 rounded-lg"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border-gray-300 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="text-sm border-gray-300 rounded-lg"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border-gray-300 rounded-lg"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="created">Sort by Created</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {sortedTasks.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterCategory !== 'all' || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'Create your first task to get started'
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Task
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedTasks.map(task => {
              const category = getCategoryInfo(task.category)
              const isOverdue = task.dueDate && task.dueDate < new Date() && task.status !== 'completed'
              
              return (
                <div
                  key={task.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    isOverdue ? 'bg-red-50 border-l-4 border-red-400' : ''
                  }`}
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`font-medium ${
                          task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}>
                          {task.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ')}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </span>
                        
                        {task.estimatedTime > 0 && (
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{task.estimatedTime}m</span>
                          </span>
                        )}

                        {task.dueDate && (
                          <span className={`flex items-center space-x-1 ${
                            isOverdue ? 'text-red-600 font-medium' : ''
                          }`}>
                            <Calendar className="w-3 h-3" />
                            <span>{task.dueDate.toLocaleDateString()}</span>
                            {isOverdue && <span className="text-red-600">⚠️</span>}
                          </span>
                        )}

                        <span className="flex items-center space-x-1">
                          <span>🏆</span>
                          <span>{task.xpReward} XP</span>
                        </span>
                      </div>

                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {task.tags.map(tagId => {
                            const tag = tags.find(t => t.id === tagId)
                            return tag ? (
                              <span
                                key={tagId}
                                className="text-xs px-2 py-1 rounded-full"
                                style={{ backgroundColor: tag.color + '20', color: tag.color }}
                              >
                                {tag.name}
                              </span>
                            ) : null
                          })}
                        </div>
                      )}
                    </div>

                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Task Templates Quick Access */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-medium text-gray-800 mb-3">Quick Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {TASK_TEMPLATES.map(template => {
            const category = getCategoryInfo(template.category)
            return (
              <button
                key={template.id}
                onClick={() => {
                  const newTask = createTaskFromTemplate(template)
                  onTaskCreate(newTask)
                }}
                className="text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span>{category.icon}</span>
                  <span className="font-medium text-sm">{template.name}</span>
                </div>
                <p className="text-xs text-gray-600">{template.description}</p>
                <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{template.estimatedTime}m</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}