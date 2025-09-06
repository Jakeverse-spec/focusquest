'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react'
import { 
  Assignment, 
  CalendarDay, 
  generateCalendarDays, 
  getAssignmentsForDate,
  getCurrentDate,
  MONTH_NAMES,
  DAY_NAMES,
  SUBJECTS
} from '@/lib/calendarLogic'

interface CalendarProps {
  assignments: Assignment[]
  onDateSelect: (date: Date) => void
  onAddAssignment: () => void
  selectedDate?: Date
}

export default function Calendar({ assignments, onDateSelect, onAddAssignment, selectedDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(getCurrentDate()) // Start with current date (August 11, 2025)
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])

  useEffect(() => {
    const days = generateCalendarDays(currentDate.getFullYear(), currentDate.getMonth())
    
    // Add assignments to each day
    const daysWithAssignments = days.map(day => ({
      ...day,
      assignments: getAssignmentsForDate(assignments, day.date)
    }))
    
    setCalendarDays(daysWithAssignments)
  }, [currentDate, assignments])

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const getSubjectInfo = (subjectId: string) => {
    return SUBJECTS.find(s => s.id === subjectId) || SUBJECTS[SUBJECTS.length - 1]
  }

  const isSelectedDate = (date: Date) => {
    if (!selectedDate) return false
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  return (
    <div className="game-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="w-6 h-6 text-primary-500" />
          <h2 className="text-xl font-bold">Quest Calendar</h2>
        </div>
        <button
          onClick={onAddAssignment}
          className="btn-game flex items-center space-x-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Quest</span>
        </button>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h3 className="text-lg font-bold">
          {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAY_NAMES.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            onClick={() => onDateSelect(day.date)}
            className={`
              min-h-[80px] p-2 border border-gray-200 rounded-lg cursor-pointer transition-all hover:bg-gray-50
              ${!day.isCurrentMonth ? 'opacity-40' : ''}
              ${day.isToday ? 'bg-primary-50 border-primary-300' : ''}
              ${isSelectedDate(day.date) ? 'bg-purple-100 border-purple-400' : ''}
            `}
          >
            <div className={`text-sm font-medium mb-1 ${day.isToday ? 'text-primary-600' : 'text-gray-700'}`}>
              {day.date.getDate()}
            </div>
            
            {/* Assignment Indicators */}
            <div className="space-y-1">
              {day.assignments.slice(0, 2).map(assignment => {
                const subject = getSubjectInfo(assignment.subject)
                return (
                  <div
                    key={assignment.id}
                    className={`text-xs px-1 py-0.5 rounded text-white truncate ${subject.color} ${
                      assignment.isCompleted ? 'opacity-60 line-through' : ''
                    }`}
                    title={assignment.title}
                  >
                    {subject.icon} {assignment.title}
                  </div>
                )
              })}
              {day.assignments.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{day.assignments.length - 2} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}