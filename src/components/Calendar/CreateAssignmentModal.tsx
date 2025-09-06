'use client'

import { useState } from 'react'
import { X, Calendar, Clock } from 'lucide-react'
import { Assignment, SUBJECTS, createAssignment } from '@/lib/calendarLogic'

interface CreateAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateAssignment: (assignment: Assignment) => void
  selectedDate?: Date
}

export default function CreateAssignmentModal({ 
  isOpen, 
  onClose, 
  onCreateAssignment, 
  selectedDate 
}: CreateAssignmentModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState(
    selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  )
  const [dueTime, setDueTime] = useState('23:59')
  const [subject, setSubject] = useState('other')
  const [priority, setPriority] = useState<Assignment['priority']>('medium')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const assignment = createAssignment(
      title,
      new Date(dueDate),
      dueTime,
      subject,
      priority,
      description || undefined
    )
    
    onCreateAssignment(assignment)
    
    // Reset form
    setTitle('')
    setDescription('')
    setDueDate(new Date().toISOString().split('T')[0])
    setDueTime('23:59')
    setSubject('other')
    setPriority('medium')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold">Create Assignment</h2>
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
              Assignment Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mobile-input"
              placeholder="e.g., Math homework chapter 5"
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
              placeholder="Optional details about this assignment..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Due Date *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mobile-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Due Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="mobile-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SUBJECTS.map(subj => (
                <button
                  key={subj.id}
                  type="button"
                  onClick={() => setSubject(subj.id)}
                  className={`p-2 sm:p-3 rounded-lg border-2 transition-colors touch-button ${
                    subject === subj.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg sm:text-xl mb-1">{subj.icon}</div>
                    <div className="text-xs font-medium">{subj.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Assignment['priority'])}
              className="mobile-input"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
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
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}