import { useState } from 'react'
import { Mic, Camera, FileText, MessageCircle, Share2, Search, Play, Pause, Upload, BookOpen, FileCheck, Calendar, Zap, X, Send } from 'lucide-react'

type TabType = 'recordings' | 'photos' | 'textbooks' | 'notes' | 'chat' | 'study' | 'assignments'

export default function ClassDetailPage() {
  const [activeTab, setActiveTab] = useState<TabType>('recordings')
  const [isRecording, setIsRecording] = useState(false)

  const classInfo = {
    name: 'Calculus I',
    teacher: 'Mr. Johnson',
    period: '1st Period',
    color: 'bg-blue-500',
    grade: 'A-',
    gradePercent: 92
  }

  const recordings = [
    { id: 1, title: 'Lecture: Derivatives Introduction', date: '10/29/25', duration: '45:23', transcript: 'complete', notes: 3 },
    { id: 2, title: 'Chapter 4 Review', date: '10/27/25', duration: '38:15', transcript: 'complete', notes: 2 },
    { id: 3, title: 'Integration Techniques', date: '10/25/25', duration: '52:40', transcript: 'processing', notes: 1 },
  ]

  const photos = [
    { id: 1, title: 'Whiteboard - Chain Rule Examples', date: '10/29/25', extracted: true, text: 'Chain rule: d/dx[f(g(x))] = ...' },
    { id: 2, title: 'Homework Problem #15', date: '10/28/25', extracted: true, text: 'Solve: lim (x→0)...' },
    { id: 3, title: 'Quiz Answer Key', date: '10/27/25', extracted: false, text: '' },
  ]

  const textbooks = [
    { id: 1, title: 'Calculus: Early Transcendentals', author: 'James Stewart', pages: 1368, status: 'complete', chapters: 16 },
    { id: 2, title: 'Calculus Workbook', author: 'Stewart et al.', pages: 542, status: 'processing', chapters: 12 },
  ]

  const notes = [
    { id: 1, title: 'Derivatives Summary', source: 'Audio + Photos', date: '10/29/25', shared: true, aiGenerated: false },
    { id: 2, title: 'Integration Methods', source: 'Textbook + Lecture', date: '10/27/25', shared: false, aiGenerated: true },
    { id: 3, title: 'Practice Problems Solutions', source: 'Manual', date: '10/26/25', shared: true, aiGenerated: false },
  ]

  const tests = [
    { id: 1, title: 'Chapter 4 Practice Test', difficulty: 'Medium', questions: 20, taken: false },
    { id: 2, title: 'Derivatives Quiz', difficulty: 'Easy', questions: 15, taken: true, score: 87 },
  ]

  const flashcardDecks = [
    { id: 1, title: 'Derivative Rules', cards: 24, studied: 18 },
    { id: 2, title: 'Integration Techniques', cards: 30, studied: 5 },
  ]

  const assignments = [
    { id: 1, title: 'Chapter 5 Quiz', due: 'Tomorrow', type: 'Quiz', status: 'pending', description: 'Covers sections 5.1-5.3' },
    { id: 2, title: 'Homework Set 12', due: 'Friday', type: 'Homework', status: 'pending', description: 'Problems 1-25 odd' },
    { id: 3, title: 'Midterm Exam', due: 'Next Week', type: 'Exam', status: 'pending', description: 'Cumulative chapters 1-5' },
  ]

  return (
    <div className="space-y-6">
      {/* Class Header */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className={`w-2 h-20 ${classInfo.color} rounded-full mr-4`}></div>
            <div>
              <h1 className="text-3xl font-bold mb-1">{classInfo.name}</h1>
              <p className="text-gray-600">{classInfo.teacher} • {classInfo.period}</p>
              <p className="text-sm text-gray-500 mt-2">Current Grade: <span className="font-semibold">{classInfo.grade}</span> ({classInfo.gradePercent}%)</p>
            </div>
          </div>
          <button className="btn-secondary">
            <Share2 className="w-4 h-4 mr-2 inline" />
            Share with Classmates
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 mb-4">
          {[
            { key: 'recordings', icon: Mic, label: 'Audio', count: recordings.length },
            { key: 'photos', icon: Camera, label: 'Photos', count: photos.length },
            { key: 'textbooks', icon: BookOpen, label: 'Textbooks', count: textbooks.length },
            { key: 'notes', icon: FileText, label: 'Notes', count: notes.length },
            { key: 'chat', icon: MessageCircle, label: 'AI Chat', count: null },
            { key: 'study', icon: Zap, label: 'Study Materials', count: null },
            { key: 'assignments', icon: Calendar, label: 'Assignments', count: assignments.length }
          ].map(({ key, icon: Icon, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as TabType)}
              className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === key
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
              {count !== null && <span className="text-sm">({count})</span>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'recordings' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Lecture Recordings</h3>
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  isRecording ? 'bg-red-600 text-white' : 'bg-primary-600 text-white'
                }`}
              >
                <Mic className="w-4 h-4" />
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
            </div>

            {isRecording && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4 animate-pulse">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-600 rounded-full mr-3"></div>
                  <span className="font-medium text-red-900">Recording in progress...</span>
                  <span className="ml-auto text-red-900 font-mono">00:04:23</span>
                </div>
              </div>
            )}

            {recordings.map((rec) => (
              <div key={rec.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Play className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-1">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{rec.date} • Duration: {rec.duration}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className={`px-2 py-1 rounded ${
                        rec.transcript === 'complete' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {rec.transcript === 'complete' ? '✓ Transcript Ready' : '⏳ Transcribing...'}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {rec.notes} AI Notes Generated
                      </span>
                    </div>
                  </div>
                  <button className="btn-secondary text-sm flex-shrink-0">View Transcript</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Captured Images</h3>
              <button className="btn-primary flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Take Photo
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center">
                    <Camera className="w-16 h-16 text-gray-400" />
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm mb-1 truncate">{photo.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{photo.date}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      photo.extracted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {photo.extracted ? '✓ Text Extracted' : '⏳ Processing'}
                    </span>
                    {photo.extracted && (
                      <p className="text-xs text-gray-500 mt-2 truncate">{photo.text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'textbooks' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Textbooks & Study Materials</h3>
              <button className="btn-primary flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Textbook PDF
              </button>
            </div>

            {textbooks.map((book) => (
              <div key={book.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-1">{book.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                    <div className="flex flex-wrap gap-2 text-xs mb-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {book.pages} pages
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {book.chapters} chapters
                      </span>
                      <span className={`px-2 py-1 rounded ${
                        book.status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {book.status === 'complete' ? '✓ Ready for AI' : '⏳ Processing chunks...'}
                      </span>
                    </div>
                  </div>
                  <button className="btn-secondary text-sm flex-shrink-0">Read</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="relative flex-1 mr-4">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button className="btn-primary flex items-center gap-2">
                <FileText className="w-4 h-4" />
                New Note
              </button>
            </div>

            {notes.map((note) => (
              <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{note.title}</h4>
                      {note.aiGenerated && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                          🤖 AI Generated
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Source: {note.source}</p>
                    <p className="text-xs text-gray-500">{note.date}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {note.shared && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        👥 Shared
                      </span>
                    )}
                    <button className="btn-secondary text-sm">Open</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900">
                <strong>🤖 AI Tutor for {classInfo.name}</strong><br/>
                I know all your lecture recordings, photos, notes, and textbook content for this class. Ask me anything!
              </p>
            </div>

            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              <div className="flex justify-end">
                <div className="bg-primary-600 text-white rounded-lg p-4 max-w-[80%]">
                  Can you explain the chain rule using the examples from today's lecture?
                  <div className="text-xs text-primary-200 mt-2">2 minutes ago</div>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                  <p className="mb-2">Based on today's lecture recording and whiteboard photos, here's the chain rule:</p>
                  <p className="font-mono text-sm bg-white p-2 rounded mb-2">d/dx[f(g(x))] = f'(g(x)) · g'(x)</p>
                  <p className="text-sm">From your whiteboard photo, Mr. Johnson showed this example: If f(x) = (3x + 1)², then using the chain rule...</p>
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="text-xs text-gray-600 mb-2">Sources:</p>
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2 p-2 bg-white rounded hover:bg-gray-50 cursor-pointer">
                        <Mic className="w-4 h-4 text-blue-600" />
                        <span>Lecture: Derivatives Introduction (18:23)</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded hover:bg-gray-50 cursor-pointer">
                        <Camera className="w-4 h-4 text-green-600" />
                        <span>Whiteboard Photo (10/29/25)</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded hover:bg-gray-50 cursor-pointer">
                        <BookOpen className="w-4 h-4 text-purple-600" />
                        <span>Textbook: Chapter 3.4, Page 156</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Just now</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 sticky bottom-0 bg-white pt-4 border-t">
              <input
                type="text"
                placeholder="Ask about this class... (Ctrl+K for quick access)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <button className="btn-primary px-6">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'study' && (
          <div className="space-y-6">
            {/* Practice Tests Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-primary-600" />
                  Practice Tests
                </h3>
                <button className="btn-primary text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Generate New Test
                </button>
              </div>
              <div className="space-y-3">
                {tests.map((test) => (
                  <div key={test.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{test.title}</h4>
                        <div className="flex gap-2 text-xs">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            {test.difficulty}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            {test.questions} questions
                          </span>
                          {test.taken && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                              Score: {test.score}%
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="btn-secondary text-sm">
                        {test.taken ? 'Review Answers' : 'Take Test'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Flashcards Section */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  Flashcard Decks
                </h3>
                <button className="btn-primary text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Generate Flashcards
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {flashcardDecks.map((deck) => (
                  <div key={deck.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                    <h4 className="font-semibold mb-2">{deck.title}</h4>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{deck.studied}/{deck.cards} cards</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all"
                          style={{ width: `${(deck.studied / deck.cards) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <button className="w-full btn-secondary text-sm">Study Deck</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Assignments & Due Dates</h3>
              <button className="btn-primary flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Add Assignment
              </button>
            </div>

            {assignments.map((assignment) => (
              <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{assignment.title}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {assignment.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-orange-600 font-medium">Due: {assignment.due}</span>
                      <span className="text-gray-500">Status: {assignment.status}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="btn-secondary text-sm">Mark Complete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
