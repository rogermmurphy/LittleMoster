import { TrendingUp, Clock, FileText, Award, Upload, Film, Calendar, Zap, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { classesApi } from '../api/classes.api'
import { assignmentsApi } from '../api/assignments.api'
import { notesApi } from '../api/notes.api'
import { useAuthStore } from '../stores/auth.store'

export default function HomePage() {
  const user = useAuthStore((state) => state.user)

  // Fetch all classes
  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: classesApi.getAll
  })

  // Fetch all assignments across classes
  const allAssignments = classes.flatMap(cls => {
    const { data = [] } = useQuery({
      queryKey: ['assignments', cls.id],
      queryFn: () => assignmentsApi.getByClass(cls.id)
    })
    return data
  })

  // Fetch all notes across classes
  const allNotes = classes.flatMap(cls => {
    const { data = [] } = useQuery({
      queryKey: ['notes', cls.id],
      queryFn: () => notesApi.getByClass(cls.id)
    })
    return data
  })

  // Calculate stats
  const completedAssignments = allAssignments.filter(a => a.status === 'completed').length
  const pendingAssignments = allAssignments.filter(a => a.status === 'pending').length
  const totalNotes = allNotes.length

  // Get recent activity (notes and assignments)
  const recentActivity = [
    ...allNotes.slice(0, 5).map(note => ({
      id: note.id,
      title: note.title,
      type: 'note' as const,
      icon: FileText,
      className: classes.find(c => c.id === note.classId)?.name || 'Unknown',
      date: new Date(note.createdAt).toLocaleDateString()
    })),
    ...allAssignments.slice(0, 5).map(assignment => ({
      id: assignment.id,
      title: assignment.title,
      type: 'assignment' as const,
      icon: Calendar,
      className: classes.find(c => c.id === assignment.classId)?.name || 'Unknown',
      date: new Date(assignment.createdAt).toLocaleDateString()
    }))
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName || user?.email?.split('@')[0] || 'Student'}!
        </h1>
        <p className="text-gray-600">LM's ready to make your study day sparkle ✨</p>
      </div>

      {/* Dashboard Summary & Quick Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Dashboard Summary */}
        <div className="card">
          <h2 className="font-semibold text-lg mb-4">Dashboard Summary</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-blue-50 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">Classes</span>
              <span className="font-bold text-lg">{classes.length}</span>
            </div>
            <div className="rounded-xl bg-green-50 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">Notes</span>
              <span className="font-bold text-lg">{totalNotes}</span>
            </div>
            <div className="rounded-xl bg-yellow-50 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="font-bold text-lg">{pendingAssignments}</span>
            </div>
            <div className="rounded-xl bg-purple-50 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="font-bold text-lg">{completedAssignments}</span>
            </div>
          </div>
        </div>

        {/* Personalized Feed */}
        <div className="card">
          <h2 className="font-semibold text-lg mb-4">Quick Links</h2>
          <div className="space-y-2">
            <Link to="/classes" className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <div className="font-medium text-sm">View All Classes</div>
                <div className="text-xs text-gray-600">{classes.length} classes</div>
              </div>
            </Link>
            <Link to="/planner" className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <div className="font-medium text-sm">Study Planner</div>
                <div className="text-xs text-gray-600">{pendingAssignments} pending assignments</div>
              </div>
            </Link>
            <button className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Upload className="w-5 h-5 text-purple-600" />
              <div className="flex-1">
                <div className="font-medium text-sm">Upload Content</div>
                <div className="text-xs text-gray-600">Audio, photos, or textbooks</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Work */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/classes" className="px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center gap-2 transition-colors">
              <Upload className="w-5 h-5" />
              <span className="font-medium">Upload File</span>
            </Link>
            <Link to="/classes" className="px-4 py-3 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 flex items-center gap-2 transition-colors">
              <FileText className="w-5 h-5" />
              <span className="font-medium">Create Note</span>
            </Link>
            <Link to="/chat" className="px-4 py-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center gap-2 transition-colors">
              <Film className="w-5 h-5" />
              <span className="font-medium">AI Chat</span>
            </Link>
            <Link to="/planner" className="px-4 py-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 flex items-center gap-2 transition-colors">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Open Planner</span>
            </Link>
          </div>
        </div>

        {/* Recent Work */}
        <div className="card">
          <h2 className="font-semibold text-lg mb-4">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm">No recent activity</p>
              <p className="text-xs mt-1">Start by adding classes and uploading content!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <item.icon className="w-5 h-5 text-gray-600" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{item.title}</div>
                    <div className="text-xs text-gray-600">{item.className} • {item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gaming Progress Teaser */}
      <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg mb-1 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              Monster Play Progress
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              Track your study progress and earn rewards!
            </p>
            <Link to="/play" className="text-sm text-primary-600 hover:underline font-medium">
              Play games to earn rewards →
            </Link>
          </div>
          <div className="text-6xl">🎮</div>
        </div>
      </div>
    </div>
  )
}
