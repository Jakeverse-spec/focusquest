'use client'

import { Assignment, SUBJECTS, getUpcomingAssignments, getOverdueAssignments } from '@/lib/calendarLogic'
import { Clock, AlertTriangle, CheckCircle, Star } from 'lucide-react'

interface AssignmentDetailsProps {
  assignments: Assignment[]
  selectedDate?: Date
  onCompleteAssignment: (assignmentId: string) => void
  onEditAssignment?: (assignment: Assignment) => void
}

export default function AssignmentDetails({ 
  assignments, 
  selectedDate, 
  onCompleteAssignment,
  onEditAssignment 
}: AssignmentDetailsProps) {
  const upcomingAssignments = getUpcomingAssignments(assignments, 7)
  const overdueAssignments = getOverdueAssignments(assignments)
  
  const selectedDateAssignments = selectedDate 
    ? assignments.filter(assignment => {
        const assignmentDate = new Date(assignment.dueDate)
        return (
          assignmentDate.getDate() === selectedDate.getDate() &&
          assignmentDate.getMonth() === selectedDate.getMonth() &&
          assignmentDate.getFullYear() === selectedDate.getFullYear()
        )
      })
    : []

  const getSubjectInfo = (subjectId: string) => {
    return SUBJECTS.find(s => s.id === subjectId) || SUBJECTS[SUBJECTS.length - 1]
  }

  const getPriorityColor = (priority: Assignment['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const AssignmentCard = ({ assignment }: { assignment: Assignment }) => {
    const subject = getSubjectInfo(assignment.subject)
    const isOverdue = new Date(assignment.dueDate) < new Date() && !assignment.isCompleted
    
    return (
      <div className={`p-4 rounded-lg border-2 transition-all ${
        assignment.isCompleted 
          ? 'border-green-200 bg-green-50 opacity-75' 
          : isOverdue
          ? 'border-red-200 bg-red-50'
          : 'border-gray-200 hover:border-primary-300'
      }`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 ${subject.color} rounded-full flex items-center justify-center text-white text-sm`}>
              {subject.icon}
            </div>
            <div>
              <h3 className={`font-medium ${assignment.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {assignment.title}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{subject.name}</span>
                <span className={`font-medium ${getPriorityColor(assignment.priority)}`}>
                  {assignment.priority.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isOverdue && !assignment.isCompleted && (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
            {assignment.isCompleted && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
          </div>
        </div>

        {assignment.description && (
          <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(new Date(assignment.dueDate))} at {assignment.dueTime}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-sm">
              <span className="text-primary-600 font-medium">+{assignment.xpReward} XP</span>
              <span className="text-game-gold font-medium ml-2">+{assignment.coinReward} 💰</span>
            </div>
            {!assignment.isCompleted && (
              <button
                onClick={() => onCompleteAssignment(assignment.id)}
                className="btn-primary text-sm px-3 py-1"
              >
                Complete
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Selected Date Assignments */}
      {selectedDate && selectedDateAssignments.length > 0 && (
        <div className="game-card">
          <h3 className="font-bold text-gray-800 mb-4">
            📅 Quests for {formatDate(selectedDate)}
          </h3>
          <div className="space-y-3">
            {selectedDateAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </div>
      )}

      {/* Overdue Assignments */}
      {overdueAssignments.length > 0 && (
        <div className="game-card">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-red-600">Overdue Quests ({overdueAssignments.length})</h3>
          </div>
          <div className="space-y-3">
            {overdueAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Assignments */}
      {upcomingAssignments.length > 0 && (
        <div className="game-card">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-gray-800">Upcoming Quests (Next 7 Days)</h3>
          </div>
          <div className="space-y-3">
            {upcomingAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {assignments.length === 0 && (
        <div className="game-card text-center py-8">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No Quests Yet</h3>
          <p className="text-gray-600">Create your first assignment to start your academic adventure!</p>
        </div>
      )}
    </div>
  )
}