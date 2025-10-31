import { Mic, Camera, FileText, MessageCircle, TrendingUp, Clock, BookOpen, Zap, Award, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ClassDashboardPage() {
  const myClasses = [
    {
      id: 'calc-1',
      name: 'Calculus I',
      teacher: 'Mr. Johnson',
      period: '1st Period',
      color: 'bg-blue-500',
      currentGrade: 'A-',
      gradePercent: 92,
      nextAssignment: 'Chapter 5 Quiz',
      dueDate: 'Tomorrow',
      stats: {
        recordings: 12,
        notes: 24,
        transcripts: 8,
        images: 15
      }
    },
    {
      id: 'chem-1',
      name: 'Chemistry I',
      teacher: 'Ms. Davis',
      period: '2nd Period',
      color: 'bg-green-500',
      currentGrade: 'B+',
      gradePercent: 88,
      nextAssignment: 'Lab Report #3',
      dueDate: 'Friday',
      stats: {
        recordings: 10,
        notes: 18,
        transcripts: 6,
        images: 22
      }
    },
    {
      id: 'eng-lit',
      name: 'English Literature',
      teacher: 'Mrs. Brown',
      period: '3rd Period',
      color: 'bg-purple-500',
      currentGrade: 'A',
      gradePercent: 95,
      nextAssignment: 'Essay Draft',
      dueDate: 'Next Week',
      stats: {
        recordings: 8,
        notes: 31,
        transcripts: 5,
        images: 7
      }
    },
    {
      id: 'us-hist',
      name: 'US History',
      teacher: 'Mr. Wilson',
      period: '4th Period',
      color: 'bg-yellow-500',
      currentGrade: 'B',
      gradePercent: 85,
      nextAssignment: 'Unit 3 Test',
      dueDate: 'Next Monday',
      stats: {
        recordings: 11,
        notes: 20,
        transcripts: 7,
        images: 18
      }
    },
  ]

  const overallStats = {
    totalClasses: myClasses.length,
    avgGrade: 90,
    studyHours: 24.5,
    totalNotes: 93
  }

  const upcomingAssignments = [
    { class: 'Calculus I', title: 'Chapter 5 Quiz', due: 'Tomorrow', color: 'bg-blue-500' },
    { class: 'Chemistry I', title: 'Lab Report #3', due: 'Friday', color: 'bg-green-500' },
    { class: 'US History', title: 'Unit 3 Test', due: 'Next Monday', color: 'bg-yellow-500' },
  ]

  const processingStatus = [
    { type: 'Transcription', count: 2, icon: Mic, color: 'text-blue-600' },
    { type: 'OCR Processing', count: 3, icon: Camera, color: 'text-green-600' },
    { type: 'Textbook Chunking', count: 1, icon: BookOpen, color: 'text-purple-600' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">My Classes</h1>
        <p className="text-gray-600">Spring 2025 Semester</p>
      </div>

      {/* Study Streak Widget */}
      <div className="card bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-orange-600" />
              <span className="font-semibold">Study Streak</span>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-1">7 Days 🔥</div>
            <p className="text-sm text-gray-600">Keep it up! You're on a roll!</p>
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
              <p className="text-3xl font-bold mt-1">{overallStats.avgGrade}%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Study Hours</p>
              <p className="text-3xl font-bold mt-1">{overallStats.studyHours}</p>
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

      {/* Processing Status */}
      {processingStatus.some(s => s.count > 0) && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">⚙️ Processing Status</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {processingStatus.map((status) => (
              <div key={status.type} className="flex items-center gap-3">
                <status.icon className={`w-5 h-5 ${status.color}`} />
                <div>
                  <div className="text-sm font-medium">{status.count} {status.type}</div>
                  <div className="text-xs text-gray-500">In progress...</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Assignments Widget */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            Upcoming Assignments
          </h3>
          <Link to="/planner" className="text-sm text-primary-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {upcomingAssignments.map((assignment, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`w-1 h-12 ${assignment.color} rounded-full`}></div>
              <div className="flex-1">
                <div className="font-medium text-sm">{assignment.title}</div>
                <div className="text-xs text-gray-600">{assignment.class}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-orange-600">{assignment.due}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myClasses.map((cls) => (
          <div key={cls.id} className="card hover:shadow-xl transition-all cursor-pointer">
            {/* Header with color bar */}
            <div className="flex items-start mb-4">
              <div className={`w-1 h-16 ${cls.color} rounded-full mr-4`}></div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{cls.name}</h3>
                <p className="text-sm text-gray-600">{cls.teacher}</p>
                <p className="text-xs text-gray-500">{cls.period}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{cls.currentGrade}</div>
                <div className="text-sm text-gray-600">{cls.gradePercent}%</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${cls.color} h-2 rounded-full transition-all`}
                  style={{ width: `${cls.gradePercent}%` }}
                ></div>
              </div>
            </div>

            {/* Next Assignment */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-600 mb-1">Next Assignment:</p>
              <p className="font-medium text-sm">{cls.nextAssignment}</p>
              <p className="text-xs text-gray-500 mt-1">Due: {cls.dueDate}</p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mb-4 pt-4 border-t border-gray-200">
              <button className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors">
                <Mic className="w-4 h-4 inline mr-1" />
                Record
              </button>
              <button className="flex-1 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-medium transition-colors">
                <Camera className="w-4 h-4 inline mr-1" />
                Photo
              </button>
              <button className="flex-1 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-medium transition-colors">
                <MessageCircle className="w-4 h-4 inline mr-1" />
                Ask AI
              </button>
            </div>

            {/* Content Stats */}
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <Mic className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                <p className="text-xs font-medium">{cls.stats.recordings}</p>
                <p className="text-xs text-gray-500">Audio</p>
              </div>
              <div className="text-center">
                <Camera className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                <p className="text-xs font-medium">{cls.stats.images}</p>
                <p className="text-xs text-gray-500">Photos</p>
              </div>
              <div className="text-center">
                <FileText className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                <p className="text-xs font-medium">{cls.stats.notes}</p>
                <p className="text-xs text-gray-500">Notes</p>
              </div>
              <div className="text-center">
                <MessageCircle className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                <p className="text-xs font-medium">{cls.stats.transcripts}</p>
                <p className="text-xs text-gray-500">Chats</p>
              </div>
            </div>
          </div>
        ))}
      </div>

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
