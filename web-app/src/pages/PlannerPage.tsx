import { Plus, CheckCircle, Circle, Clock, Calendar } from 'lucide-react'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { classesApi } from '../api/classes.api'
import { assignmentsApi } from '../api/assignments.api'

export default function PlannerPage() {
  const queryClient = useQueryClient()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    classId: '',
    title: '',
    description: '',
    dueDate: '',
    type: 'Homework'
  })

  // Fetch all classes
  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: classesApi.getAll
  })

  // Fetch assignments for all classes
  const assignmentQueries = classes.map(cls => ({
    queryKey: ['assignments', cls.id],
    queryFn: () => assignmentsApi.getByClass(cls.id)
  }))

  // Combine all assignments
  const allAssignments = assignmentQueries.flatMap(query => {
    const result = useQuery(query)
    return result.data || []
  })

  // Create assignment mutation
  const createAssignmentMutation = useMutation({
    mutationFn: assignmentsApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assignments', data.classId] })
      setShowAddModal(false)
      setNewAssignment({ classId: '', title: '', description: '', dueDate: '', type: 'Homework' })
    }
  })

  // Update assignment mutation
  const updateAssignmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => assignmentsApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assignments', data.classId] })
    }
  })

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAssignment.classId || !newAssignment.title || !newAssignment.dueDate) return

    await createAssignmentMutation.mutateAsync({
      classId: newAssignment.classId,
      title: newAssignment.title,
      description: newAssignment.description || undefined,
      dueDate: new Date(newAssignment.dueDate).toISOString(),
      type: newAssignment.type
    })
  }

  const handleToggleComplete = async (assignment: any) => {
    const newStatus = assignment.status === 'completed' ? 'pending' : 'completed'
    await updateAssignmentMutation.mutateAsync({
      id: assignment.id,
      data: { status: newStatus }
    })
  }

  // Calculate stats
  const completedCount = allAssignments.filter(a => a.status === 'completed').length
  const totalCount = allAssignments.length
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1)
  const currentWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return date.getDate()
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Study Planner</h1>
          <p className="text-gray-600">{today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus className="w-5 h-5 mr-2 inline" />
          Add Assignment
        </button>
      </div>

      {/* Add Assignment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Add Assignment</h3>
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Class *</label>
                <select
                  value={newAssignment.classId}
                  onChange={(e) => setNewAssignment({ ...newAssignment, classId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Chapter 5 Quiz"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={newAssignment.type}
                  onChange={(e) => setNewAssignment({ ...newAssignment, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option>Homework</option>
                  <option>Quiz</option>
                  <option>Exam</option>
                  <option>Project</option>
                  <option>Reading</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Due Date *</label>
                <input
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Optional notes about this assignment"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                  disabled={createAssignmentMutation.isPending}
                >
                  {createAssignmentMutation.isPending ? 'Adding...' : 'Add Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mini Calendar */}
      <div className="card">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, idx) => (
            <div key={day} className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-2">{day}</div>
              <button
                className={`w-full aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${
                  currentWeek[idx] === today.getDate()
                    ? 'bg-primary-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {currentWeek[idx]}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignments List */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-bold mb-4">All Assignments</h2>
          
          {allAssignments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">No assignments yet</p>
              <button onClick={() => setShowAddModal(true)} className="btn-primary">
                Add Your First Assignment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {allAssignments
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((assignment) => {
                  const cls = classes.find(c => c.id === assignment.classId)
                  return (
                    <div
                      key={assignment.id}
                      className={`border-l-4 rounded-lg p-4 ${
                        assignment.status === 'completed'
                          ? 'border-green-500 bg-green-50'
                          : assignment.status === 'in-progress'
                          ? 'border-yellow-500 bg-yellow-50'
                          : assignment.status === 'overdue'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <button 
                              onClick={() => handleToggleComplete(assignment)}
                              className="mr-2"
                            >
                              {assignment.status === 'completed' ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : assignment.status === 'in-progress' ? (
                                <Clock className="w-5 h-5 text-yellow-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400" />
                              )}
                            </button>
                            <h3 className="font-semibold">{assignment.title}</h3>
                          </div>
                          
                          <div className="ml-7 space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="font-medium mr-2">{cls?.name}</span>
                              {assignment.type && (
                                <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">
                                  {assignment.type}
                                </span>
                              )}
                            </div>
                            
                            <div className="text-sm text-orange-600 font-medium">
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </div>
                            
                            {assignment.description && (
                              <p className="text-sm text-gray-700 mt-2">{assignment.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>

        {/* Study Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <h3 className="font-semibold mb-4">Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-bold text-green-600">{completedCount}/{totalCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all" 
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">By Class</h3>
            <div className="space-y-2 text-sm">
              {classes.map((cls) => {
                const classAssignments = allAssignments.filter(a => a.classId === cls.id)
                const classCompleted = classAssignments.filter(a => a.status === 'completed').length
                return (
                  <div key={cls.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: cls.color || '#3b82f6' }}></div>
                      <span className="text-gray-700">{cls.name}</span>
                    </div>
                    <span className="text-gray-500">{classCompleted}/{classAssignments.length}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">Upcoming</h3>
            {allAssignments
              .filter(a => a.status !== 'completed')
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .slice(0, 5)
              .map((assignment) => {
                const cls = classes.find(c => c.id === assignment.classId)
                const daysUntil = Math.ceil((new Date(assignment.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                return (
                  <div key={assignment.id} className="flex items-center text-gray-600 mb-2">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: cls?.color || '#3b82f6' }}></div>
                    <div className="flex-1 text-sm">
                      <div className="font-medium">{assignment.title}</div>
                      <div className="text-xs text-gray-500">
                        {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
