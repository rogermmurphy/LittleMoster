import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Mic, Camera, FileText, MessageCircle, TrendingUp, Clock, BookOpen, Zap, Award, Calendar, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { classesApi } from '../api/classes.api'

export default function ClassDashboardPage() {
  const queryClient = useQueryClient()
  const [showAddClass, setShowAddClass] = useState(false)
  const [newClass, setNewClass] = useState({
    name: '',
    subject: '',
    teacher: '',
    color: '#3b82f6'
  })

  // Fetch classes from API
  const { data: classes = [], isLoading, error } = useQuery({
    queryKey: ['classes'],
    queryFn: classesApi.getAll
  })

  // Create class mutation
  const createClassMutation = useMutation({
    mutationFn: classesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      setShowAddClass(false)
      setNewClass({ name: '', subject: '', teacher: '', color: '#3b82f6' })
    }
  })

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClass.name) return
    
    await createClassMutation.mutateAsync(newClass)
  }

  const colors = [
    { value: '#3b82f6', label: 'Blue', class: 'bg-blue-500' },
    { value: '#10b981', label: 'Green', class: 'bg-green-500' },
    { value: '#8b5cf6', label: 'Purple', class: 'bg-purple-500' },
    { value: '#f59e0b', label: 'Yellow', class: 'bg-yellow-500' },
    { value: '#ef4444', label: 'Red', class: 'bg-red-500' },
    { value: '#ec4899', label: 'Pink', class: 'bg-pink-500' },
  ]

  const overallStats = {
    totalClasses: classes.length,
    avgGrade: 0, // TODO: Calculate from actual grades
    studyHours: 0, // TODO: Calculate from actual data
    totalNotes: 0 // TODO: Calculate from actual notes
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your classes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card bg-red-50 border-red-200">
        <h3 className="font-semibold text-red-800 mb-2">Error Loading Classes</h3>
        <p className="text-red-600">Failed to load your classes. Please try refreshing the page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Classes</h1>
          <p className="text-gray-600">Spring 2025 Semester</p>
        </div>
        <button 
          onClick={() => setShowAddClass(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Class
        </button>
      </div>

      {/* Add Class Modal */}
      {showAddClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Add New Class</h3>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Class Name *</label>
                <input
                  type="text"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Calculus I"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  value={newClass.subject}
                  onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Teacher</label>
                <input
                  type="text"
                  value={newClass.teacher}
                  onChange={(e) => setNewClass({ ...newClass, teacher: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Mr. Johnson"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="grid grid-cols-6 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setNewClass({ ...newClass, color: color.value })}
                      className={`w-10 h-10 rounded-lg ${color.class} ${
                        newClass.color === color.value ? 'ring-2 ring-offset-2 ring-primary-600' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddClass(false)}
                  className="flex-1 btn-secondary"
                  disabled={createClassMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                  disabled={createClassMutation.isPending || !newClass.name}
                >
                  {createClassMutation.isPending ? 'Creating...' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Study Streak Widget */}
      <div className="card bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-orange-600" />
              <span className="font-semibold">Study Streak</span>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-1">0 Days</div>
            <p className="text-sm text-gray-600">Start your streak by uploading content!</p>
          </div>
          <div className="text-6xl">📚</div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Classes</p>
              <p className="text-3xl font-bold mt-1">{overallStats.totalClasses}</p>
            </div>
            <BookOpen className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Grade</p>
              <p className="text-3xl font-bold mt-1">--</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Study Hours</p>
              <p className="text-3xl font-bold mt-1">--</p>
            </div>
            <Clock className="w-10 h-10 text-purple-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Notes</p>
              <p className="text-3xl font-bold mt-1">{overallStats.totalNotes}</p>
            </div>
            <FileText className="w-10 h-10 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {classes.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold mb-2">No Classes Yet</h3>
          <p className="text-gray-600 mb-6">
            Get started by adding your first class!
          </p>
          <button 
            onClick={() => setShowAddClass(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Your First Class
          </button>
        </div>
      )}

      {/* Class Cards Grid */}
      {classes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((cls) => (
            <Link 
              key={cls.id} 
              to={`/class/${cls.id}`}
              className="card hover:shadow-xl transition-all"
            >
              {/* Header with color bar */}
              <div className="flex items-start mb-4">
                <div 
                  className="w-1 h-16 rounded-full mr-4"
                  style={{ backgroundColor: cls.color || '#3b82f6' }}
                ></div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{cls.name}</h3>
                  {cls.teacher && (
                    <p className="text-sm text-gray-600">{cls.teacher}</p>
                  )}
                  {cls.subject && (
                    <p className="text-xs text-gray-500">{cls.subject}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">--</div>
                  <div className="text-sm text-gray-600">No grade</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mb-4 pt-4 border-t border-gray-200">
                <button 
                  onClick={(e) => e.preventDefault()}
                  className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors"
                >
                  <Mic className="w-4 h-4 inline mr-1" />
                  Record
                </button>
                <button 
                  onClick={(e) => e.preventDefault()}
                  className="flex-1 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium transition-colors"
                >
                  <Camera className="w-4 h-4 inline mr-1" />
                  Photo
                </button>
                <button 
                  onClick={(e) => e.preventDefault()}
                  className="flex-1 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-medium transition-colors"
                >
                  <MessageCircle className="w-4 h-4 inline mr-1" />
                  Ask AI
                </button>
              </div>

              {/* Content Stats - TODO: Get real stats from API */}
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <Mic className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-xs font-medium">0</p>
                  <p className="text-xs text-gray-500">Audio</p>
                </div>
                <div className="text-center">
                  <Camera className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-xs font-medium">0</p>
                  <p className="text-xs text-gray-500">Photos</p>
                </div>
                <div className="text-center">
                  <FileText className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-xs font-medium">0</p>
                  <p className="text-xs text-gray-500">Notes</p>
                </div>
                <div className="text-center">
                  <MessageCircle className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-xs font-medium">0</p>
                  <p className="text-xs text-gray-500">Chats</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Coming Soon Banner */}
      <div className="card bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">🎓 School Grade Integration</h3>
            <p className="text-sm text-gray-700">
              Coming Soon: Sync with your school's grading system to see live grade updates
            </p>
          </div>
          <button className="btn-secondary">Learn More</button>
        </div>
      </div>
    </div>
  )
}
